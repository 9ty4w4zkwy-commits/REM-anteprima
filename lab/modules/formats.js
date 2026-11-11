/* REM format availability: derives capabilities from actual chapter assets. */
(function(){
'use strict';
const labels={ebook:'Ebook',audio:'Audiolibro',paper:'Cartaceo'};
function availability(chapters){
 const items=Array.isArray(chapters)?chapters:[];
 return {ebook:items.some(ch=>typeof ch.text==='string'&&ch.text.trim().length>0),audio:items.some(ch=>typeof ch.audioUrl==='string'&&ch.audioUrl.trim().length>0),paper:items.some(ch=>Array.isArray(ch.pageMap)&&ch.pageMap.length>0)};
}
function configure(chapters){
 const available=availability(chapters);
 const select=document.getElementById('format');
 if(!select)return available;
 for(const option of select.options){
  const enabled=Boolean(available[option.value]);
  option.disabled=!enabled;
  option.textContent=labels[option.value]+(enabled?'':' · non disponibile');
 }
 if(!available[select.value])select.value=available.ebook?'ebook':available.audio?'audio':available.paper?'paper':'ebook';
 return available;
}
window.REMFormats={availability,configure};
})();
