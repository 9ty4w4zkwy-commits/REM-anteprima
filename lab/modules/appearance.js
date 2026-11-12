/* REM reader appearance: independent settings and persistence. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const key='rem-modular-reader-appearance-v1';
const defaults={fontSize:'medium',readingTheme:'paper',accent:'#64dfa9'};
let appearance={...defaults};
try{const stored=JSON.parse(localStorage.getItem(key)||'{}');if(stored&&typeof stored==='object'&&!Array.isArray(stored))appearance={...appearance,...stored}}catch{}
function apply(){
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
 try{localStorage.setItem(key,JSON.stringify(appearance))}catch{}
}
function set(property,value){if(!Object.prototype.hasOwnProperty.call(defaults,property))throw Error('Impostazione sconosciuta');appearance[property]=value;apply()}
window.REMAppearance={apply,set,get:()=>({...appearance})};
})();
