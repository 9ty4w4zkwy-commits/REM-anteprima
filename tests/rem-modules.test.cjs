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

test('format selector falls back to available format and updates buttons',()=>{
 const select={
  value:'audio',
  options:[{value:'ebook'},{value:'audio'},{value:'paper'}]
 };
 const target={
  buttons:[],
  replaceChildren(){this.buttons=[]},
  append(button){this.buttons.push(button)}
 };
 const document={
  getElementById:id=>id==='format'?select:id==='formatSwitch'?target:null,
  createElement:tag=>({
   tag,
   disabled:false,
   children:[],
   setAttribute(name,value){this[name]=value},
   append(...nodes){this.children.push(...nodes)},
   dispatchEvent(){},
   onclick:null
  })
 };
 const {api}=load('formats',{document});
 api.REMFormats.configure([{text:'Capitolo disponibile',audioUrl:null}]);
 assert.equal(select.value,'ebook');
 assert.equal(select.options[1].disabled,true);
 assert.equal(target.buttons.length,3);
 assert.equal(target.buttons[1].disabled,true);
 assert.equal(target.buttons[0]['aria-pressed'],'true');
});
test('reading store survives a module reload from persisted data',()=>{
 const saved=new Map();
 const localStorage={
  getItem:key=>saved.get(key)||null,
  setItem:(key,value)=>saved.set(key,value)
 };
 const first=load('reading-store',{localStorage});
 first.api.REMReadingStore.set('book-2',{chapter:'chapter-3',format:'audio'});
 const second=load('reading-store',{localStorage});
 assert.equal(second.api.REMReadingStore.get('book-2').chapter,'chapter-3');
 assert.equal(second.api.REMReadingStore.get('book-2').format,'audio');
});

test('HTML includes all scripts exactly once and initializes core last',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
 const scripts=[...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/g)].map(match=>match[1]);
 assert.ok(scripts.length>0,'No scripts found');
 assert.equal(new Set(scripts).size,scripts.length,'Duplicate script includes');
 assert.equal(scripts.at(-1),'./lab/modules/app-core.js');
 for(const src of scripts){
  assert.ok(fs.existsSync(path.join(__dirname,'..',src)),'Missing module: '+src);
 }
});
test('HTML contains every statically referenced module element',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
 const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]));
 for(const name of ['app-core','appearance','home-view','book-detail-view','reading-history','reader-surface','reader-progress','reader-notes','focus-timer','onboarding','formats','library-view']){
  const source=fs.readFileSync(path.join(__dirname,'../lab/modules/',name+'.js'),'utf8');
  for(const match of source.matchAll(/(?:\$|document\.getElementById)\('([^']+)'\)/g)){
   assert.ok(ids.has(match[1]),name+' refers to missing DOM ID: '+match[1]);
  }
 }
});
