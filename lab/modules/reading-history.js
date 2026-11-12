/* REM reading history: independent view for saved chapter progress. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
function render({books,readingStats,openBook}){
 const started=books.filter(book=>readingStats(book).read>0).length;
 $('historySummary').textContent=started?started+' '+(started===1?'libro iniziato':'libri iniziati')+' su '+books.length:'Nessuna lettura iniziata.';
 $('resetReading').disabled=started===0;
 $('historyBooks').replaceChildren();
 for(const book of books){
  const stats=readingStats(book);
  if(!stats.read)continue;
  const button=document.createElement('button');
  button.type='button';
  button.className='history-resume';
  button.textContent='Riprendi '+book.title+' · capitolo '+stats.read+' di '+stats.total;
  button.onclick=()=>openBook(book.id);
  $('historyBooks').append(button);
 }
}
window.REMReadingHistory={render};
})();
