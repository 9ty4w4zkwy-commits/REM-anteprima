/* REM reader surface: independently renders ebook, audio and paper states. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
function render({chapter,format,bookId,updateProgress}){
 $('readingNotePanel').classList.toggle('hidden',format!=='ebook');
 window.REMReaderNotes?.load(bookId,chapter.id);
 $('chapterTitle').textContent=chapter.title;
 $('chapterText').textContent=format==='ebook'?chapter.text:format==='audio'?'Traccia audio non disponibile per questo capitolo. Nessun audio simulato.':'Per il cartaceo, la sincronizzazione della posizione richiederà una mappatura tra pagine ed episodi.';
 $('chapterText').classList.toggle('reader',format==='ebook');
 $('chapterProgress').value=0;
 $('chapterProgressLabel').textContent='0%';
 requestAnimationFrame(updateProgress);
 $('source').textContent=chapter.source||'';
 $('audio').classList.toggle('hidden',format!=='audio');
 $('audio').replaceChildren();
 if(format==='audio'&&chapter.audioUrl){const audio=document.createElement('audio');audio.controls=true;audio.src=chapter.audioUrl;$('audio').append(audio)}
}
window.REMReaderSurface={render};
})();
