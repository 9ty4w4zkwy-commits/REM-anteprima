/* REM 5.6 episode choice: isolated UI, activated by app-core in a later integration step. */
(function(){
'use strict';
const storageKey=title=>'rem-reading-mode-53-'+title.toLowerCase().replace(/[^a-z0-9]/g,'');
function choose(title,openFull){
 const episodes=window.REMEpisodes?.episodesFor(title)||[];
 if(!episodes.length){openFull();return;}
 let stage='choice',index=0;
 const overlay=document.createElement('div');overlay.className='rem-episode-overlay';overlay.setAttribute('role','presentation');
 const panel=document.createElement('section');panel.className='rem-episode-panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label',title);
 overlay.append(panel);document.body.append(overlay);
 const close=()=>overlay.remove();
 const button=(label,action)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=action;return b;};
 const line=(tag,value)=>{const el=document.createElement(tag);el.textContent=value;panel.append(el);};
 const full=()=>{close();openFull();};
 const save=(suffix,value)=>{try{localStorage.setItem(storageKey(title)+suffix,value)}catch{}};
 function render(){
  panel.replaceChildren();line('h2',title);
  if(stage==='choice'){
   line('p','Come vuoi vivere questa storia?');
   panel.append(button('Libro completo',()=>{save('','full');full()}),button('A episodi',()=>{save('','episodes');stage='episodes';render()}));
   line('p','Potrai cambiare modalità in seguito senza perdere la tua lettura.');
  }else if(stage==='episodes'){
   line('h3','STAGIONE 1');line('p',episodes.length+' '+(episodes.length===1?'episodio':'episodi')+' disponibili in questa anteprima');
   line('p',/montecristo/i.test(title)?'Il capitolo iniziale di Alexandre Dumas, presentato in brevi tappe narrative.':'Un primo episodio dimostrativo per esplorare la lettura a puntate.');
   episodes.forEach((ep,i)=>{line('h3',ep.title);line('p',ep.intro);['ebook','audio','cartaceo'].forEach(format=>panel.append(button(({ebook:'Ebook',audio:'Audiolibro',cartaceo:'Cartaceo'})[format],()=>{index=i;save('-episode',String(i));save('-format',format);stage='reader';render()})))});
   line('p','Anteprime editoriali: la suddivisione precisa del testo e dell’audio sarà completata in una prossima iterazione.');
  }else{
   const ep=episodes[index];line('p','EPISODIO '+(index+1)+' DI '+episodes.length);line('h3',ep.title);line('p',ep.intro);
   line('p','Questa è una scheda episodio dimostrativa. Il testo e l’audio del libro completo non sono ancora suddivisi in intervalli verificati: non vengono presentati come se fossero l’episodio selezionato.');
   panel.append(button('Tutti gli episodi',()=>{stage='episodes';render()}),button('Apri libro completo',full));
  }
  if(stage!=='choice')panel.append(button('Indietro',()=>{stage=stage==='reader'?'episodes':'choice';render()}));
  panel.append(button('Chiudi',close));
 }
 render();
}
window.REMEpisodeChoice={choose};
})();
