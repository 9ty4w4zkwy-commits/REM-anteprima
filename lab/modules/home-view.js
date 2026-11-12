/* REM home presentation: screen content without navigation ownership. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
function render({books,readingStats,openDetail,openBook}){
 const book=books[0];
 if(book){
  $('homeBookTitle').textContent=book.title;
  $('homeBookAuthor').textContent=book.author||'';
  for(const id of ['homeFreeCoverTitle','homeFreeTitle'])if($(id))$(id).textContent=book.title;
  for(const id of ['homeFreeCoverAuthor','homeFreeAuthor'])if($(id))$(id).textContent=book.author||'';
  $('homeExplore').disabled=false;
  $('homeFreeExplore').disabled=false;
  $('homeExplore').onclick=()=>openDetail(book.id);
  $('homeFreeExplore').onclick=()=>openDetail(book.id);
 }else{
  $('homeBookTitle').textContent='Nessun libro disponibile';
  $('homeBookAuthor').textContent='';
  for(const id of ['homeFreeCoverTitle','homeFreeTitle'])if($(id))$(id).textContent='';
  $('homeFreeCoverAuthor').textContent='';
  $('homeFreeAuthor').textContent='';
  $('homeExplore').disabled=true;
  $('homeFreeExplore').disabled=true;
 }
 const started=books.find(item=>readingStats(item).read>0);
 $('homeResume').classList.toggle('hidden',!started);
 $('homeResumeStatus').textContent=started?'Riprendi '+started.title+' dal capitolo salvato.':'Non hai ancora iniziato una lettura.';
 $('homeResume').onclick=()=>{if(started)openBook(started.id)};
}
window.REMHomeView={render};
})();
