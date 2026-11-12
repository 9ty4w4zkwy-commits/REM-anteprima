/* REM reader surface: render only assets available for the selected chapter. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
function stopAudio(){
 const player=$('audio')?.querySelector('audio');
 if(player&&!player.paused)player.pause();
}
function paperPages(pageMap){
 return pageMap.map(item=>{
  const page=typeof item==='number'||typeof item==='string'?item:item&&typeof item==='object'?(item.page??item.startPage??item.from):null;
  return page===null||page===undefined?'':String(page);
 }).filter(Boolean).join(', ');
}
function render({chapter,format,bookId,updateProgress}){
 stopAudio();
 const isEbook=format==='ebook';
 $('readingNotePanel').classList.toggle('hidden',!isEbook);
 if(isEbook)window.REMReaderNotes?.load(bookId,chapter.id);
 $('chapterTitle').textContent=chapter.title;
 const hasAudio=typeof chapter.audioUrl==='string'&&chapter.audioUrl.trim().length>0;
 const hasPaper=Array.isArray(chapter.pageMap)&&chapter.pageMap.length>0;
 $('chapterText').textContent=isEbook?chapter.text||'Testo non disponibile per questo capitolo.':
  format==='audio'?(hasAudio?'Ascolta il capitolo utilizzando il lettore audio.':'Traccia audio non disponibile per questo capitolo.'):
  hasPaper?(paperPages(chapter.pageMap)?'Pagine cartacee: '+paperPages(chapter.pageMap)+'.':'Riferimenti cartacei presenti, ma numeri di pagina non disponibili.'):'Mappatura delle pagine cartacee non disponibile per questo capitolo.';
 $('chapterText').classList.toggle('reader',isEbook);
 $('chapterProgress').value=0;
 $('chapterProgressLabel').textContent='0%';
 requestAnimationFrame(updateProgress);
 $('source').textContent=chapter.source||'';
 $('audio').classList.toggle('hidden',format!=='audio');
 $('audio').replaceChildren();
 if(format==='audio'&&hasAudio){
  const audio=document.createElement('audio');
  audio.controls=true;
  audio.preload='metadata';
  audio.src=chapter.audioUrl;
  const updateAudioProgress=()=>{
   const duration=audio.duration;
   const percent=Number.isFinite(duration)&&duration>0?Math.max(0,Math.min(100,Math.round(audio.currentTime/duration*100))):0;
   $('chapterProgress').value=percent;
   $('chapterProgressLabel').textContent=percent+'%';
  };
  audio.addEventListener('timeupdate',updateAudioProgress);
  audio.addEventListener('loadedmetadata',updateAudioProgress);
  audio.addEventListener('ended',updateAudioProgress);
  $('audio').append(audio);
 }
}
document.addEventListener?.('visibilitychange',()=>{if(document.hidden)stopAudio()});
window.REMReaderSurface={render,stopAudio,paperPages};
})();
