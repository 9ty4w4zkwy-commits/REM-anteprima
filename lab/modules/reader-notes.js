/* REM reader notes: independent persistence module; compatible with existing local notes. */
(function(){
'use strict';
const KEY='rem-modular-notes-v1';
let notes={};
try{const stored=JSON.parse(localStorage.getItem(KEY)||'{}');if(stored&&typeof stored==='object'&&!Array.isArray(stored))notes=stored}catch{}
const field=document.getElementById('readingNote');
const status=document.getElementById('noteStatus');
let current=null;
function load(bookId,chapterId){
 current=bookId&&chapterId?bookId+':'+chapterId:null;
 if(field)field.value=current?notes[current]||'':'';
 if(status)status.textContent='Le note restano su questo dispositivo.';
}
if(field)field.addEventListener('input',()=>{
 if(!current)return;
 if(field.value)notes[current]=field.value;else delete notes[current];
 try{localStorage.setItem(KEY,JSON.stringify(notes));if(status)status.textContent='Nota salvata su questo dispositivo.'}
 catch{if(status)status.textContent='Impossibile salvare la nota su questo dispositivo.'}
});
window.REMReaderNotes={load};
})();
