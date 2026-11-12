/* Standalone data-driven REM proof of architecture; not the approved REM 5.6. */
(async function(){
'use strict';
const $=id=>document.getElementById(id),state={books:[],chapters:[],selected:null,format:'ebook',timer:null,remaining:0,deadline:0,focusDuration:0,settingsReturn:'library'};
const key='rem-modular-demo-v1';let progress={};try{progress=JSON.parse(localStorage.getItem(key)||'{}')}catch{}
const save=()=>{try{localStorage.setItem(key,JSON.stringify(progress))}catch{}};
const notify=s=>{$('status').textContent=s};
const show=window.REMNavigation.show;
const welcomeKey='rem-modular-welcome-v1';
$('welcomeStart').onclick=()=>{appearance.readingTheme=$('welcomeTheme').value;applyAppearance();try{localStorage.setItem(welcomeKey,'seen')}catch{}if(document.documentElement.dataset.catalog==='candidate')home();else library()};
const bookChapters=id=>state.chapters.filter(c=>c.bookId===id);
function readingStats(book){
 const chapters=bookChapters(book.id);
 const previous=progress[book.id]||{};
 const index=chapters.findIndex(c=>c.id===previous.chapter);
 return {chapters,read:index<0?0:index+1,total:chapters.length};
}
function updateHistory(){
 const started=state.books.filter(book=>readingStats(book).read>0).length;
 $('historySummary').textContent=started?started+' '+(started===1?'libro iniziato':'libri iniziati')+' su '+state.books.length:'Nessuna lettura iniziata.';
 $('resetReading').disabled=started===0;
 $('historyBooks').replaceChildren();
 for(const book of state.books){
  const stats=readingStats(book);if(!stats.read)continue;
  const button=document.createElement('button');
  button.type='button';button.className='history-resume';
  button.textContent='Riprendi '+book.title+' · capitolo '+stats.read+' di '+stats.total;
  button.onclick=()=>openBook(book.id);
  $('historyBooks').append(button);
 }
}
$('resetReading').onclick=()=>{
 if(!window.confirm('Cancellare tutti i progressi di lettura salvati su questo dispositivo?'))return;
 progress={};save();library();notify('Progressi di lettura cancellati');
};
function home(){
 if(document.documentElement.dataset.catalog!=='candidate')return library();
 setImmersive(false);
 const book=state.books[0];
 if(book){
  $('homeBookTitle').textContent=book.title;
  $('homeBookAuthor').textContent=book.author||'';
  for(const id of ['homeFreeCoverTitle','homeFreeTitle'])if($(id))$(id).textContent=book.title;
  for(const id of ['homeFreeCoverAuthor','homeFreeAuthor'])if($(id))$(id).textContent=book.author||'';
  $('homeExplore').onclick=()=>openDetail(book.id);
 }
 const started=state.books.find(item=>readingStats(item).read>0);
 $('homeResume').classList.toggle('hidden',!started);
 $('homeResumeStatus').textContent=started?'Riprendi '+started.title+' dal capitolo salvato.':'Non hai ancora iniziato una lettura.';
 $('homeResume').onclick=()=>{if(started)openBook(started.id)};
 show('home');
}
if($('homeLibrary'))$('homeLibrary').onclick=library;
if($('homeShelfLibrary'))$('homeShelfLibrary').onclick=library;
if($('homeFreeExplore'))$('homeFreeExplore').onclick=()=>{const book=state.books[0];if(book)openDetail(book.id)};
if($('libraryHome'))$('libraryHome').onclick=home;
function library(){setImmersive(false);show('library');updateHistory();window.REMLibrary.render({books:state.books,bookChapters,readingStats,openDetail,openBook});}
$('bookSearch').addEventListener('input',library);
function openDetail(id){
 const book=state.books.find(item=>item.id===id);
 if(!book||!$('bookDetail'))return;
 state.selected=book;
 $('detailTitle').textContent=book.title;
 $('detailAuthor').textContent=book.author||'Autore non indicato';
 $('detailChapters').textContent=bookChapters(id).length+' capitoli disponibili';
 $('detailRead').textContent=readingStats(book).read?'Riprendi la lettura':'Inizia a leggere';
 $('detailRead').onclick=()=>openBook(id);
 show('bookDetail');
}
if($('detailBack'))$('detailBack').onclick=library;
function openBook(id){setImmersive(false);state.selected=state.books.find(b=>b.id===id);if(!state.selected)return;show('reader');$('bookTitle').textContent=state.selected.title;const chapters=bookChapters(id);$('chapter').replaceChildren();chapters.forEach(c=>{const o=document.createElement('option');o.value=c.id;o.textContent=c.title;$('chapter').append(o)});const previous=progress[id]||{};if(chapters.some(c=>c.id===previous.chapter))$('chapter').value=previous.chapter;state.format=previous.format||'ebook';$('format').value=state.format;if($('format').value!==state.format){state.format='ebook';$('format').value='ebook'}window.REMFormats.configure(chapters);renderChapter()}
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
function renderChapter(){setImmersive(false);const id=state.selected?.id,c=state.chapters.find(ch=>ch.id===$('chapter').value);if(!id||!c){$('chapterTitle').textContent='Contenuto non disponibile';$('chapterText').textContent='Questo libro non ha ancora capitoli migrati.';return;}$('previousChapter').disabled=$('chapter').selectedIndex<=0;$('nextChapter').disabled=$('chapter').selectedIndex>=$('chapter').options.length-1;state.format=$('format').value;progress[id]={chapter:c.id,format:state.format};save();window.REMReaderSurface.render({chapter:c,format:state.format,bookId:id,updateProgress:updateChapterProgress});}
$('chapter').onchange=renderChapter;$('format').onchange=renderChapter;$('goLibrary').onclick=library;$('goSettings').onclick=()=>{state.settingsReturn=$('reader').classList.contains('hidden')?'library':'reader';show('settings')};$('goBack').onclick=()=>{if(state.settingsReturn==='reader'&&state.selected)show('reader');else library()};
const appearanceKey='rem-modular-reader-appearance-v1';
const defaultAppearance={fontSize:'medium',readingTheme:'paper',accent:'#64dfa9'};
let appearance={...defaultAppearance};
try{const stored=JSON.parse(localStorage.getItem(appearanceKey)||'{}');if(stored&&typeof stored==='object')appearance={...appearance,...stored}}catch{}
function applyAppearance(){
 const fontSizes={small:'1.05rem',medium:'1.18rem',large:'1.4rem',xlarge:'1.65rem'};
 const themes=['paper','night','sepia'];
 if(!Object.prototype.hasOwnProperty.call(fontSizes,appearance.fontSize))appearance.fontSize='medium';
 if(!themes.includes(appearance.readingTheme))appearance.readingTheme='paper';
 if(!['#64dfa9','#f2bb62','#b6a5ff'].includes(appearance.accent))appearance.accent='#64dfa9';
 document.documentElement.style.setProperty('--reader-font-size',fontSizes[appearance.fontSize]);
 document.documentElement.style.setProperty('--accent',appearance.accent);
 document.documentElement.dataset.readingTheme=appearance.readingTheme;
 $('fontSize').value=appearance.fontSize;
 $('readingTheme').value=appearance.readingTheme;
 $('welcomeTheme').value=appearance.readingTheme;
 $('theme').value=appearance.accent;
 try{localStorage.setItem(appearanceKey,JSON.stringify(appearance))}catch{}
}
$('readerAppearance').onclick=()=>{state.settingsReturn='reader';show('settings')};
$('fontSize').onchange=()=>{appearance.fontSize=$('fontSize').value;applyAppearance()};
$('readingTheme').onchange=()=>{appearance.readingTheme=$('readingTheme').value;applyAppearance()};
$('theme').onchange=()=>{appearance.accent=$('theme').value;applyAppearance()};
applyAppearance();
try{const [b,c]=await Promise.all([fetch(document.documentElement.dataset.catalog==='candidate'?'./lab/catalog/books-candidate.json':'./lab/catalog/books.json'),fetch('./lab/catalog/chapters.json')]);if(!b.ok||!c.ok)throw Error('Dati non disponibili');const bd=await b.json(),cd=await c.json();if(bd.schemaVersion!==1||cd.schemaVersion!==1||!Array.isArray(bd.books)||!Array.isArray(cd.chapters))throw Error('Schema dati non valido');const ids=new Set();for(const book of bd.books){if(!book||typeof book.id!=='string'||!book.id||typeof book.title!=='string'||!book.title||ids.has(book.id))throw Error('Catalogo: ID o titolo non valido');ids.add(book.id)}const chapterIds=new Set();for(const ch of cd.chapters){if(!ch||typeof ch.id!=='string'||!ch.id||chapterIds.has(ch.id)||typeof ch.text!=='string')throw Error('Capitoli: riferimento o contenuto non valido');chapterIds.add(ch.id)}state.books=bd.books;state.chapters=cd.chapters.filter(ch=>ids.has(ch.bookId));const failedBooks=[];
for(const book of state.books){
 if(book.contentStatus!=='integrated'||!book.chaptersSource?.startsWith('lab/content/'))continue;
 try{
  const response=await fetch('./'+book.chaptersSource,{cache:'no-store'});
  if(!response.ok)throw Error('HTTP '+response.status);
  const extracted=await response.json();
  if(extracted.id!==(book.legacyContentId||book.id)||!Array.isArray(extracted.segmenti)||!extracted.segmenti.length)throw Error('Contenuto estratto non valido');
  if(!extracted.segmenti.every(segment=>typeof segment.text==='string'&&segment.text.trim()&&Number.isInteger(segment.chapter)))throw Error('Segmenti del libro incompleti');
  const grouped=new Map();
  for(const segment of extracted.segmenti){
   const chapter=String(segment.chapter??'1');
   if(!grouped.has(chapter))grouped.set(chapter,[]);
   grouped.get(chapter).push(segment);
  }
  state.chapters=state.chapters.filter(ch=>ch.bookId!==book.id);
  for(const [number,segments] of grouped){
   state.chapters.push({id:book.id+'-legacy-'+number,bookId:book.id,title:segments[0].chapterTitle||'Capitolo '+number,text:segments.map(segment=>segment.text||segment.testo||'').join('\n\n'),source:'Testo estratto dalla versione REM originale'});
  }
 }catch(error){state.chapters=state.chapters.filter(ch=>ch.bookId!==book.id);failedBooks.push(book.title);console.error('Contenuto estratto non caricato:',book.id,error)}
}
let seenWelcome=false;try{seenWelcome=localStorage.getItem(welcomeKey)==='seen'}catch{}
if(document.documentElement.dataset.catalog==='candidate'){
 home();
 if(window.REMProfile&&!window.REMProfile.hasFinished())window.REMProfile.open(()=>home());
}else if(seenWelcome)library();else show('welcome');
notify(failedBooks.length?'Contenuti non disponibili: '+failedBooks.join(', '):'')}catch(e){notify('Errore: '+e.message)}
})();