const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 try{
  await page.goto('http://127.0.0.1:8765/',{waitUntil:'networkidle'});
  await page.locator('#profileSkip').click();
  await page.locator('#home').waitFor({state:'visible'});
  await page.locator('#homeLibrary').click();
  await page.locator('#library').waitFor({state:'visible'});
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
  if(errors.length)throw Error('Browser JavaScript errors: '+errors.join(' | '));
  console.log('PASS mobile browser: onboarding → home → library → reader');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
