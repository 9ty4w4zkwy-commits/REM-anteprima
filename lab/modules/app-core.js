/* Standalone data-driven REM proof of architecture; not the approved REM 5.6. */
(async function(){
'use strict';
const $=id=>document.getElementById(id),state={books:[],chapters:[],selected:null,format:'ebook',timer:null,remaining:0,deadline:0,focusDuration:0,settingsReturn:'library'};
const notify=s=>{$('status').textContent=s};
const show=id=>{if(id!=='reader')window.REMReaderSurface?.stopAudio();window.REMNavigation.show(id)};
const welcomeKey='rem-modular-welcome-v1';
$('welcomeStart').onclick=()=>{window.REMAppearance.set('readingTheme',$('welcomeTheme').value);try{localStorage.setItem(welcomeKey,'seen')}catch{}if(document.documentElement.dataset.catalog==='candidate')home();else library()};
const bookChapters=id=>state.chapters.filter(c=>c.bookId===id);
function readingStats(book){return window.REMReadingStore.stats(book,bookChapters(book.id));}
function updateHistory(){window.REMReadingHistory.render({books:state.books,readingStats,openBook});}
$('resetReading').onclick=()=>{
 if(!window.confirm('Cancellare tutti i progressi di lettura salvati su questo dispositivo?'))return;
 window.REMReadingStore.clear();library();notify('Progressi di lettura cancellati');
};
function home(){
 if(document.documentElement.dataset.catalog!=='candidate')return library();
 setImmersive(false);
 window.REMHomeView.render({books:state.books,readingStats,openDetail,openBook});
 show('home');
}
if($('homeLibrary'))$('homeLibrary').onclick=library;
if($('homeShelfLibrary'))$('homeShelfLibrary').onclick=library;
if($('libraryHome'))$('libraryHome').onclick=home;
function library(){setImmersive(false);show('library');updateHistory();window.REMLibrary.render({books:state.books,bookChapters,readingStats,openDetail,openBook});}
$('bookSearch').addEventListener('input',library);
function openDetail(id){
 const book=state.books.find(item=>item.id===id);
 if(!book||!$('bookDetail'))return;
 state.selected=book;
 window.REMBookDetailView.render({book,chapterCount:bookChapters(id).length,hasProgress:readingStats(book).read>0,openBook});
 show('bookDetail');
}
if($('detailBack'))$('detailBack').onclick=library;
function openBook(id){
 const book=state.books.find(b=>b.id===id);
 if(!book)return;
 const chapters=bookChapters(id);
 if(!chapters.length){
  notify('Nessun capitolo disponibile per '+book.title);
  openDetail(id);
  return;
 }
 setImmersive(false);
 state.selected=book;
 $('bookTitle').textContent=book.title;
 $('chapter').replaceChildren();
 for(const chapter of chapters){
  const option=document.createElement('option');
  option.value=chapter.id;
  option.textContent=chapter.title;
  $('chapter').append(option);
 }
 const previous=window.REMReadingStore.get(id);
 if(chapters.some(ch=>ch.id===previous.chapter))$('chapter').value=previous.chapter;
 $('format').value=previous.format||'ebook';
 if(!$('format').value)$('format').value='ebook';
 show('reader');
 renderChapter();
}
function changeChapter(offset){
 const select=$('chapter'),next=select.selectedIndex+offset;
 if(next<0||next>=select.options.length)return;
 select.selectedIndex=next;
 renderChapter();
 $('chapterTitle').scrollIntoView({behavior:'auto',block:'start'});
}
$('previousChapter').onclick=()=>changeChapter(-1);
$('nextChapter').onclick=()=>changeChapter(1);
function setImmersive(enabled){
 document.body.classList.toggle('immersive-reading',enabled);
 $('focusReading').setAttribute('aria-pressed',String(enabled));
 $('focusReading').textContent=enabled?'Esci dalla lettura immersiva':'Lettura immersiva';
}
$('focusReading').onclick=()=>setImmersive(!document.body.classList.contains('immersive-reading'));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&document.body.classList.contains('immersive-reading'))setImmersive(false)});
const updateChapterProgress=()=>window.REMReaderProgress?.update();
function renderChapter(){
 setImmersive(false);
 const id=state.selected?.id;
 const chapter=state.chapters.find(ch=>ch.bookId===id&&ch.id===$('chapter').value);
 if(!id||!chapter){
  $('chapterTitle').textContent='Contenuto non disponibile';
  $('chapterText').textContent='Questo libro non ha ancora capitoli migrati.';
  $('previousChapter').disabled=true;
  $('nextChapter').disabled=true;
  $('audio').replaceChildren();
  $('audio').classList.add('hidden');
  return;
 }
 $('previousChapter').disabled=$('chapter').selectedIndex<=0;
 $('nextChapter').disabled=$('chapter').selectedIndex>=$('chapter').options.length-1;
 window.REMFormats.configure([chapter]);
 state.format=$('format').value;
 window.REMReadingStore.set(id,{chapter:chapter.id,format:state.format});
 window.REMReaderSurface.render({chapter,format:state.format,bookId:id,updateProgress:updateChapterProgress});
}
$('chapter').onchange=renderChapter;$('format').onchange=renderChapter;$('goLibrary').onclick=library;$('goSettings').onclick=()=>{state.settingsReturn=$('reader').classList.contains('hidden')?'library':'reader';show('settings')};$('goBack').onclick=()=>{if(state.settingsReturn==='reader'&&state.selected)show('reader');else library()};
$('readerAppearance').onclick=()=>{state.settingsReturn='reader';show('settings')};
$('fontSize').onchange=()=>window.REMAppearance.set('fontSize',$('fontSize').value);
$('readingTheme').onchange=()=>window.REMAppearance.set('readingTheme',$('readingTheme').value);
$('theme').onchange=()=>window.REMAppearance.set('accent',$('theme').value);
window.REMAppearance.apply();
try{
 const {books,chapters,failedBooks}=await window.REMCatalogLoader.load();
 state.books=books;
 state.chapters=chapters;
let seenWelcome=false;try{seenWelcome=localStorage.getItem(welcomeKey)==='seen'}catch{}
if(document.documentElement.dataset.catalog==='candidate'){
 home();
 if(window.REMProfile&&!window.REMProfile.hasFinished())window.REMProfile.open(()=>home());
}else if(seenWelcome)library();else show('welcome');
notify(failedBooks.length?'Contenuti non disponibili: '+failedBooks.join(', '):'')}catch(e){notify('Errore: '+e.message)}
})();