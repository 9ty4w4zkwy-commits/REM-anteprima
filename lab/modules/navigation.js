/* REM navigation: centralized screen visibility for modular UI. */
(function(){
'use strict';
const screens=['welcome','home','library','bookDetail','reader','settings'];
function show(id){
 if(!screens.includes(id))throw new Error('Schermata REM sconosciuta: '+id);
 for(const name of screens){
  const element=document.getElementById(name);
  if(element)element.classList.toggle('hidden',name!==id);
 }
}
window.REMNavigation={show,screens:Object.freeze([...screens])};
})();
