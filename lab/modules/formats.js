/* REM format availability: chapter-specific capabilities, never simulated. */
(function(){
'use strict';
const labels={ebook:'Ebook',audio:'Audiolibro',paper:'Cartaceo'};
function availability(chapters){
 const items=Array.isArray(chapters)?chapters:[];
 return {
  ebook:items.some(ch=>typeof ch?.text==='string'&&ch.text.trim().length>0),
  audio:items.some(ch=>typeof ch?.audioUrl==='string'&&ch.audioUrl.trim().length>0),
  paper:items.some(ch=>Array.isArray(ch?.pageMap)&&ch.pageMap.length>0)
 };
}
function preferred(available,current){
 if(available[current])return current;
 return ['ebook','audio','paper'].find(format=>available[format])||'ebook';
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
  button.setAttribute('aria-pressed',String(select.value===value&&available[value]));
  button.setAttribute('aria-label',label+(available[value]?'':' non disponibile per questo capitolo'));
  const title=document.createElement('strong');title.textContent=label;
  const hint=document.createElement('span');hint.textContent=available[value]?'Disponibile':'Non disponibile';
  button.append(title,hint);
  button.onclick=()=>{if(button.disabled)return;select.value=value;select.dispatchEvent(new Event('change',{bubbles:true}))};
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
  option.textContent=(labels[option.value]||option.value)+(enabled?'':' · non disponibile');
 }
 select.value=preferred(available,select.value);
 renderSwitch(available);
 return available;
}
window.REMFormats={availability,preferred,configure,renderSwitch};
})();
