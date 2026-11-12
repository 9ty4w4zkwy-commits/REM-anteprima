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
   await page.screenshot({path:'test-artifacts/'+screen+'-'+width+'px.png',fullPage:screen!=='reader'});
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
  await page.locator('#focusReading').click();
  if(await page.locator('#focusReading').getAttribute('aria-pressed')!=='true')throw Error('Immersive reading did not activate');
  await page.keyboard.press('Escape');
  if(await page.locator('#focusReading').getAttribute('aria-pressed')!=='false')throw Error('Escape did not exit immersive reading');
  await page.locator('#readerAppearance').click();
  await page.locator('#settings').waitFor({state:'visible'});
  await checkMobileLayout('settings');
  await page.screenshot({path:'test-artifacts/settings-mobile.png',fullPage:true});
  checkScreenshot('settings');
  await page.locator('#goBack').click();
  await page.locator('#reader').waitFor({state:'visible'});
  await page.locator('#goLibrary').click();
  await page.locator('#library').waitFor({state:'visible'});

  if(errors.length)throw Error('Browser JavaScript errors: '+errors.join(' | '));
  console.log('PASS mobile browser: onboarding → home → library → reader → focus → settings → reader → library');
 }catch(error){await page.screenshot({path:'test-artifacts/failure-mobile.png',fullPage:true}).catch(()=>{});throw error}
 finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
