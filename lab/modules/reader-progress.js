/* REM reader position: independent UI module; reads only reader DOM. */
(function(){
'use strict';
function update(){
 const reader=document.getElementById('reader');
 const format=document.getElementById('format');
 const el=document.getElementById('chapterText');
 const progress=document.getElementById('chapterProgress');
 const label=document.getElementById('chapterProgressLabel');
 if(!reader||reader.classList.contains('hidden')||format?.value!=='ebook'||!el||!progress||!label)return;
 const rect=el.getBoundingClientRect();
 const readable=Math.max(1,rect.height-window.innerHeight*0.5);
 const percent=Math.max(0,Math.min(100,Math.round(-rect.top/readable*100)));
 progress.value=percent;
 label.textContent=percent+'%';
}
window.addEventListener('scroll',update,{passive:true});
window.addEventListener('resize',update);
window.REMReaderProgress={update};
})();
