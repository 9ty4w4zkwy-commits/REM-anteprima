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
 const episodeBook=books.find(item=>{
  if(!window.REMEpisodes?.episodesFor(item.title).length)return false;
  try{return localStorage.getItem('rem-reading-mode-53-'+item.title.toLowerCase().replace(/[^a-z0-9]/g,''))==='episodes'}catch{return false}
 });
 const resume=episodeBook||started;
 if(episodeBook){
  const episodes=window.REMEpisodes.episodesFor(episodeBook.title);
  const key='rem-reading-mode-53-'+episodeBook.title.toLowerCase().replace(/[^a-z0-9]/g,'');
  let index=0;try{index=Math.max(0,Math.min(episodes.length-1,Number(localStorage.getItem(key+'-episode')||0)||0))}catch{}
  $('homeResumeStatus').textContent='Lettura a episodi · '+(index+1)+' / '+episodes.length+' · '+episodeBook.title;
  $('homeResume').textContent='Riprendi episodio';
 }else{
  $('homeResumeStatus').textContent=started?'Riprendi '+started.title+' dal capitolo salvato.':'Non hai ancora iniziato una lettura.';
  $('homeResume').textContent='Riprendi lettura';
 }
 $('homeResume').classList.toggle('hidden',!resume);
 $('homeResume').onclick=()=>{if(resume)openBook(resume.id)};
}
window.REMHomeView={render};
})();
