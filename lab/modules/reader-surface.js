/* REM reader surface: render only assets available for the selected chapter. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
function stopAudio(){
 const player=$('audio')?.querySelector('audio');
 if(player&&!player.paused)player.pause();
}
function render({chapter,format,bookId,updateProgress}){
 const isEbook=format==='ebook';
 $('readingNotePanel').classList.toggle('hidden',!isEbook);
 if(isEbook)window.REMReaderNotes?.load(bookId,chapter.id);
 $('chapterTitle').textContent=chapter.title;
 const hasAudio=typeof chapter.audioUrl==='string'&&chapter.audioUrl.trim().length>0;
 const hasPaper=Array.isArray(chapter.pageMap)&&chapter.pageMap.length>0;
 $('chapterText').textContent=isEbook?chapter.text||'Testo non disponibile per questo capitolo.':
  format==='audio'?(hasAudio?'Ascolta il capitolo utilizzando il lettore audio.':'Traccia audio non disponibile per questo capitolo.'):
  hasPaper?'Riferimenti alle pagine cartacee disponibili per questo capitolo.':'Mappatura delle pagine cartacee non disponibile per questo capitolo.';
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
  $('audio').append(audio);
 }
}
window.REMReaderSurface={render,stopAudio};
})();
