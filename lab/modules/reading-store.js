/* REM reading position store: preserves the existing localStorage schema. */
(function(){
'use strict';
const key='rem-modular-demo-v1';
let progress={};
try{
 const stored=JSON.parse(localStorage.getItem(key)||'{}');
 if(stored&&typeof stored==='object'&&!Array.isArray(stored))progress=stored;
}catch{}
function save(){try{localStorage.setItem(key,JSON.stringify(progress))}catch{}}
function get(bookId){
 const position=Object.prototype.hasOwnProperty.call(progress,bookId)?progress[bookId]:null;
 return position&&typeof position==='object'&&!Array.isArray(position)?position:{};
}
function set(bookId,position){
 if(!bookId||!position||typeof position!=='object'||Array.isArray(position))return;
 progress[bookId]={...position};save();
}
function clear(){progress={};save()}
function stats(book,chapters){
 const previous=get(book.id);
 const index=chapters.findIndex(ch=>ch.id===previous.chapter);
 return {chapters,read:index<0?0:index+1,total:chapters.length};
}
window.REMReadingStore={get,set,clear,stats};
})();
