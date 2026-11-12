/* REM book detail: independent book information presentation. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
function render({book,chapterCount,hasProgress,openBook}){
 $('detailTitle').textContent=book.title;
 $('detailAuthor').textContent=book.author||'Autore non indicato';
 $('detailChapters').textContent=chapterCount+' capitoli disponibili';
 $('detailRead').textContent=hasProgress?'Riprendi la lettura':'Inizia a leggere';
 $('detailRead').disabled=chapterCount===0;
 $('detailRead').onclick=()=>openBook(book.id);
}
window.REMBookDetailView={render};
})();
