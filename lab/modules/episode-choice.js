/* REM 5.6 episode choice: isolated UI used by app-core. */
(function(){
'use strict';
const storageKey=title=>'rem-reading-mode-53-'+title.toLowerCase().replace(/[^a-z0-9]/g,'');
function choose(title,openFull,resumeEpisodes=false){
 const episodes=window.REMEpisodes?.episodesFor(title)||[];
 if(!episodes.length){openFull();return;}
 let stage=resumeEpisodes?'episodes':'choice',index=0;
 if(resumeEpisodes){try{index=Math.max(0,Math.min(episodes.length-1,Number(localStorage.getItem(storageKey(title)+'-episode')||0)||0))}catch{}}
 const overlay=document.createElement('div');overlay.className='rem-episode-overlay';overlay.setAttribute('role','presentation');
 const panel=document.createElement('section');panel.className='rem-episode-panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label',title);
 overlay.append(panel);document.body.append(overlay);
 const previouslyFocused=document.activeElement;
 const close=()=>{overlay.remove();if(previouslyFocused?.isConnected)previouslyFocused.focus();};
 overlay.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();close();}
  if(event.key!=='Tab')return;
  const buttons=[...panel.querySelectorAll('button')];
  if(!buttons.length)return;
  const first=buttons[0],last=buttons[buttons.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 });
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
   episodes.forEach((ep,i)=>{
    const card=document.createElement('div');card.className='rem-episode-card';
    const number=document.createElement('span');number.className='rem-episode-number';number.textContent=String(i+1);number.setAttribute('aria-label','Episodio '+(i+1));card.append(number);
    const heading=document.createElement('h3');heading.textContent=ep.title;card.append(heading);
    const intro=document.createElement('p');intro.textContent=ep.intro;card.append(intro);
    ['ebook','audio','cartaceo'].forEach(format=>card.append(button(({ebook:'Ebook',audio:'Audiolibro',cartaceo:'Cartaceo'})[format],()=>{index=i;save('-episode',String(i));save('-format',format);stage='reader';render()})));
    panel.append(card);
   });
   line('p','Anteprime editoriali: la suddivisione precisa del testo e dell’audio sarà completata in una prossima iterazione.');
  }else{
   const ep=episodes[index];line('p','EPISODIO '+(index+1)+' DI '+episodes.length);line('h3',ep.title);line('p',ep.intro);
   line('p','Questa è una scheda episodio dimostrativa. Il testo e l’audio del libro completo non sono ancora suddivisi in intervalli verificati: non vengono presentati come se fossero l’episodio selezionato.');
   panel.append(button('Tutti gli episodi',()=>{stage='episodes';render()}),button('Apri libro completo',full));
  }
  if(stage!=='choice')panel.append(button('Indietro',()=>{stage=stage==='reader'?'episodes':'choice';render()}));
  panel.append(button('Chiudi',close));
  panel.querySelector('button')?.focus();
 }
 render();
}
window.REMEpisodeChoice={choose,resume:(title,openFull)=>choose(title,openFull,true)};
})();
