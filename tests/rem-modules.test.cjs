/* REM modular smoke tests. Run: node --test tests/rem-modules.test.cjs */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');

function load(name,extras={}){
 const store=new Map();
 const elements={};
 const context={
  window:{},
  localStorage:{
   getItem:key=>store.get(key)||null,
   setItem:(key,value)=>store.set(key,value)
  },
  document:{getElementById:id=>elements[id]||null},
  ...extras
 };
 context.window.window=context.window;
 vm.createContext(context);
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../lab/modules/',name+'.js'),'utf8'),context,{filename:name+'.js'});
 return {api:context.window,store,elements,context};
}
test('reading store saves and restores positions using existing key',()=>{
 const {api,store}=load('reading-store');
 api.REMReadingStore.set('book-1',{chapter:'chapter-2',format:'ebook'});
 assert.deepEqual(JSON.parse(store.get('rem-modular-demo-v1')),{'book-1':{chapter:'chapter-2',format:'ebook'}});
 assert.equal(api.REMReadingStore.get('book-1').chapter,'chapter-2');
 const stats=api.REMReadingStore.stats({id:'book-1'},[{id:'chapter-1'},{id:'chapter-2'}]);
 assert.equal(stats.read,2);
 assert.equal(stats.total,2);
 api.REMReadingStore.clear();
 assert.equal(api.REMReadingStore.get('book-1').chapter,undefined);
});
test('formats are available only for assets on selected chapter',()=>{
 const {api}=load('formats');
 const ebook={text:'Testo',audioUrl:null};
 const audio={text:'',audioUrl:'audio/chapter.mp3'};
 assert.equal(api.REMFormats.availability([ebook]).ebook,true);
 assert.equal(api.REMFormats.availability([ebook]).audio,false);
 assert.equal(api.REMFormats.availability([audio]).audio,true);
 assert.equal(api.REMFormats.availability([audio]).ebook,false);
 assert.equal(api.REMFormats.preferred(api.REMFormats.availability([ebook]),'audio'),'ebook');
 assert.equal(api.REMFormats.availability([{text:'',pageMap:[{page:1}]}]).paper,true);
});
test('navigation shows only requested screen',()=>{
 const elements={};
 for(const id of ['welcome','home','library','bookDetail','reader','settings']){
  const hidden=new Set();
  elements[id]={classList:{toggle:(name,on)=>on?hidden.add(name):hidden.delete(name),contains:name=>hidden.has(name)}};
 }
 const {api}=load('navigation',{document:{getElementById:id=>elements[id]}});
 api.REMNavigation.show('reader');
 assert.equal(elements.reader.classList.contains('hidden'),false);
 assert.equal(elements.library.classList.contains('hidden'),true);
 assert.throws(()=>api.REMNavigation.show('invalid'),/sconosciuta/);
});
