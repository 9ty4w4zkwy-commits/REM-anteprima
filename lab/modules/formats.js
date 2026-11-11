/* REM format availability: derives capabilities from actual chapter assets. */
(function(){
'use strict';
const labels={ebook:'Ebook',audio:'Audiolibro',paper:'Cartaceo'};
function availability(chapters){
 const items=Array.isArray(chapters)?chapters:[];
 return {ebook:items.some(ch=>typeof ch.text==='string'&&ch.text.trim().length>0),audio:items.some(ch=>typeof ch.audioUrl==='string'&&ch.audioUrl.trim().length>0),paper:items.some(ch=>Array.isArray(ch.pageMap)&&ch.pageMap.length>0)};
}
function renderSwitch(available){
 const select=document.getElementById('format');
 const target=document.getElementById('formatSwitch');
 if(!select||!target)return;
 target.replaceChildren();
 for(const [value,label] of Object.entries(labels)){
  const button=document.createElement('button');
  button.type='button';button.className='format-choice';
  button.disabled=!available[value];
  button.setAttribute('aria-pressed',String(select.value===value));
  button.setAttribute('aria-label',label+(available[value]?'':' non ancora disponibile'));
  const title=document.createElement('strong');title.textContent=label;
  const hint=document.createElement('span');hint.textContent=available[value]?'Disponibile':'In arrivo';
  button.append(title,hint);
  button.onclick=()=>{if(button.disabled)return;select.value=value;select.dispatchEvent(new Event('change',{bubbles:true}));renderSwitch(available)};
  target.append(button);
 }
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
 renderSwitch(available);
 return available;
}
window.REMFormats={availability,configure,renderSwitch};
})();
