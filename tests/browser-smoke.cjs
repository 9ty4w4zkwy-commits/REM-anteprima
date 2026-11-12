const fs=require('node:fs');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844}});
 fs.mkdirSync('test-artifacts',{recursive:true});
 const errors=[];
 async function checkMobileLayout(screen){
  for(const width of [320,390,768]){
   await page.setViewportSize({width,height:844});
   const dimensions=await page.evaluate(()=>({viewport:window.innerWidth,document:document.documentElement.scrollWidth}));
   if(dimensions.document>dimensions.viewport+2)throw Error(screen+' horizontal overflow at '+width+'px: '+dimensions.document+'px exceeds '+dimensions.viewport+'px');
   const screenshotPath='test-artifacts/'+screen+'-'+width+'px.png';
   await page.screenshot({path:screenshotPath,fullPage:screen!=='reader'});
   const png=fs.readFileSync(screenshotPath);
   if(png.length<1000||png.toString('hex',0,8)!=='89504e470d0a1a0a')throw Error(screen+' invalid PNG screenshot at '+width+'px');
   const imageWidth=png.readUInt32BE(16);
   const imageHeight=png.readUInt32BE(20);
   if(imageWidth!==width)throw Error(screen+' screenshot width mismatch: '+imageWidth+'px instead of '+width+'px');
   if(screen==='reader'&&imageHeight!==844)throw Error('Reader screenshot height mismatch: '+imageHeight+'px instead of 844px');
  }
  await page.setViewportSize({width:390,height:844});
 }
 function checkScreenshot(name){
  const size=fs.statSync('test-artifacts/'+name+'-mobile.png').size;
  if(size<1000)throw Error(name+' screenshot is empty or unexpectedly small ('+size+' bytes)');
 }
 page.on('pageerror',error=>errors.push(error.message));
 try{
  await page.goto('http://127.0.0.1:8765/',{waitUntil:'networkidle'});
  await page.locator('#profileSkip').click();
  await page.locator('#home').waitFor({state:'visible'});
  await checkMobileLayout('home');
  await page.screenshot({path:'test-artifacts/home-mobile.png',fullPage:true});
  checkScreenshot('home');
  await page.locator('#homeLibrary').click();
  await page.locator('#library').waitFor({state:'visible'});
  await checkMobileLayout('library');
  const shelfButton=page.locator('#books .shelf-toggle').first();
  if(!await shelfButton.count())throw Error('Personal shelf action missing');
  await shelfButton.click();
  if(!/1 libro salvato/.test(await page.locator('#shelfSummary').textContent()))throw Error('Saved shelf count did not increase');
  if(await page.locator('#books .shelf-toggle[aria-pressed="true"]').count()<1)throw Error('Personal shelf did not save selected book');
  await page.locator('#shelfFilter').selectOption('saved');
  if(await page.locator('#books .book').count()<1)throw Error('Saved shelf filter returned no books');
  await page.reload({waitUntil:'networkidle'});
  await page.locator('#homeLibrary').click();
  await page.locator('#shelfFilter').selectOption('saved');
  if(await page.locator('#books .shelf-toggle[aria-pressed="true"]').count()<1)throw Error('Personal shelf was not restored after reload');
  const savedButton=page.locator('#books .shelf-toggle[aria-pressed="true"]').first();
  await savedButton.click();
  if(!/0 libri salvati/.test(await page.locator('#shelfSummary').textContent()))throw Error('Saved shelf count did not decrease');
  if(await page.locator('#books .book').count()!==0)throw Error('Removing saved book did not update saved-only shelf');
  await page.reload({waitUntil:'networkidle'});
  await page.locator('#homeLibrary').click();
  await page.locator('#shelfFilter').selectOption('saved');
  if(await page.locator('#books .book').count()!==0)throw Error('Removed book reappeared in shelf after reload');
  await page.locator('#shelfFilter').selectOption('all');
  console.log('PASS personal bookshelf saves, restores and removes books after reload');
  const open=page.locator('#books button').filter({hasText:/Apri libro/i}).first();
  if(await open.count())await open.click();
  else throw Error('No book action available in library');
  if(await page.locator('#bookDetail').isVisible()){
   const read=page.locator('#detailRead');
   if(!await read.count())throw Error('No read action in book detail');
   await read.click();
  }
  await page.locator('#reader').waitFor({state:'visible'});
  if(!await page.locator('#chapterTitle').textContent())throw Error('Reader chapter title empty');
  await checkMobileLayout('reader');
  await page.screenshot({path:'test-artifacts/reader-mobile.png',fullPage:false});
  checkScreenshot('reader');
  const readerImage=await page.screenshot({fullPage:false});
  if(readerImage.length<1000)throw Error('Reader viewport capture is unexpectedly small');
  const formatState=await page.evaluate(()=>{
   const chapterId=document.getElementById('chapter').value;
   const selected=document.getElementById('format').value;
   const buttons=[...document.querySelectorAll('#formatSwitch button')];
   return {chapterId,selected,buttons:buttons.map(b=>({disabled:b.disabled,pressed:b.getAttribute('aria-pressed'),label:b.getAttribute('aria-label')})),options:[...document.getElementById('format').options].map(o=>({value:o.value,disabled:o.disabled}))};
  });
  if(formatState.buttons.length!==3)throw Error('Expected three chapter-specific format buttons');
  if(formatState.buttons.filter(b=>b.pressed==='true').length!==1)throw Error('Exactly one reading format must be selected');
  for(let i=0;i<formatState.options.length;i++){
   const option=formatState.options[i],button=formatState.buttons[i];
   if(option.disabled!==button.disabled)throw Error('Format option and button availability differ: '+option.value);
   if(button.disabled&&button.pressed==='true')throw Error('Unavailable reading format appears selected');
  }
  console.log('PASS chapter format availability and exclusive selection');
  const availableAlternative=formatState.options.find(option=>!option.disabled&&option.value!==formatState.selected);
  if(availableAlternative){
   const choice=page.locator('#formatSwitch button').nth(formatState.options.findIndex(option=>option.value===availableAlternative.value));
   await choice.click();
   if(await page.locator('#format').inputValue()!==availableAlternative.value)throw Error('Format button did not change the active format');
   const activeButtons=await page.locator('#formatSwitch button[aria-pressed="true"]').count();
   if(activeButtons!==1)throw Error('Format switch did not preserve exclusive selection');
   console.log('PASS user-driven reading format switch');
  }else console.log('SKIP user-driven format switch: current chapter has only one available format');

  if(await page.locator('#nextChapter').isEnabled())await page.locator('#nextChapter').click();
  const savedReading=await page.evaluate(()=>{
   const entries=Object.entries(JSON.parse(localStorage.getItem('rem-modular-demo-v1')||'{}'));
   return entries.find(([,position])=>position&&typeof position.chapter==='string')||null;
  });
  if(!savedReading||savedReading[1].chapter!==await page.locator('#chapter').inputValue())throw Error('Current reading chapter was not saved');
  await page.locator('#focusReading').click();
  if(await page.locator('#focusReading').getAttribute('aria-pressed')!=='true')throw Error('Immersive reading did not activate');
  await page.keyboard.press('Escape');
  if(await page.locator('#focusReading').getAttribute('aria-pressed')!=='false')throw Error('Escape did not exit immersive reading');
  await page.locator('#readerAppearance').click();
  await page.locator('#settings').waitFor({state:'visible'});
  await checkMobileLayout('settings');
  await page.screenshot({path:'test-artifacts/settings-mobile.png',fullPage:true});
  checkScreenshot('settings');
  await page.locator('#fontSize').selectOption('large');
  await page.locator('#readingTheme').selectOption('sepia');
  const savedAppearance=await page.evaluate(()=>JSON.parse(localStorage.getItem('rem-modular-reader-appearance-v1')||'null'));
  if(savedAppearance?.fontSize!=='large'||savedAppearance?.readingTheme!=='sepia')throw Error('Reader appearance was not persisted');
  await page.locator('#goBack').click();
  await page.locator('#reader').waitFor({state:'visible'});
  await page.locator('#goLibrary').click();
  await page.locator('#library').waitFor({state:'visible'});

  await page.reload({waitUntil:'networkidle'});
  if(await page.locator('#fontSize').inputValue()!=='large')throw Error('Font size was not restored after reload');
  if(await page.locator('#readingTheme').inputValue()!=='sepia')throw Error('Reading theme was not restored after reload');
  if(await page.locator('html').getAttribute('data-reading-theme')!=='sepia')throw Error('Reading theme was not applied after reload');
  console.log('PASS reader appearance persists after reload');
  await page.locator('#homeLibrary').click();
  await page.locator('#library').waitFor({state:'visible'});
  const resume=page.locator('#books button').filter({hasText:/Apri libro/i}).first();
  if(!await resume.count())throw Error('Library book missing after reload');
  await resume.click();
  if(await page.locator('#bookDetail').isVisible())await page.locator('#detailRead').click();
  await page.locator('#reader').waitFor({state:'visible'});
  if(await page.locator('#chapter').inputValue()!==savedReading[1].chapter)throw Error('Reading chapter was not restored after reload');
  console.log('PASS reading position persists after reload');


  if(errors.length)throw Error('Browser JavaScript errors: '+errors.join(' | '));
  console.log('PASS mobile browser: onboarding → home → library → reader → focus → settings → reader → library');
 }catch(error){await page.screenshot({path:'test-artifacts/failure-mobile.png',fullPage:true}).catch(()=>{});throw error}
 finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
