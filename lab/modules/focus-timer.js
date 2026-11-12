/* REM 5.6 Focus dialog and persistent session indicator. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const overlay=$('remSessionOverlay'),pill=$('remSessionPill');
if(!overlay||!pill)return;
let chosen='5',end=0,remaining=0,paused=false,active=false,completed=false;
function clock(){const ms=paused?remaining:Math.max(0,end-Date.now());const sec=Math.ceil(ms/1000);return String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0')}
function draw(){pill.hidden=!active;pill.textContent='◷ Focus '+clock();$('remSessionStart').hidden=active||completed;$('remSessionPause').hidden=!active;$('remSessionStop').hidden=!active;$('remSessionChoices').hidden=active||completed;$('remCustomWrap').hidden=active||completed||chosen!=='custom';$('remSessionPause').textContent=paused?'Riprendi':'Pausa';if(!completed)$('remSessionHint').textContent=active?'Tempo rimanente: '+clock():'Quanto tempo vuoi dedicare alla lettura?'}
function finish(){active=false;paused=false;completed=true;$('remSessionTitle').textContent='Sessione completata';$('remSessionHint').textContent='Il tempo è terminato. Puoi continuare a leggere o ascoltare.';$('remSessionDnd').textContent='Se hai attivato Non disturbare, ora puoi disattivarlo dal telefono.';overlay.hidden=false;draw()}
function open(){completed=false;$('remSessionTitle').textContent=active?'Focus attivo':'Focus';$('remSessionDnd').textContent='Per silenziare le notifiche, attiva Non disturbare dal Centro di Controllo del telefono. Alla fine, disattivalo manualmente.';overlay.hidden=false;draw()}
$('focusOpen').onclick=open;pill.onclick=open;
$('remSessionChoices').onclick=e=>{const b=e.target.closest('[data-min]');if(!b)return;chosen=b.dataset.min;overlay.querySelectorAll('[data-min]').forEach(x=>x.classList.toggle('active',x===b));draw()};
$('remSessionStart').onclick=()=>{const mins=chosen==='custom'?Number($('remCustomMinutes').value):Number(chosen);if(!Number.isFinite(mins)||mins<1||mins>240){alert('Scegli una durata tra 1 e 240 minuti');return}remaining=mins*60000;end=Date.now()+remaining;active=true;paused=false;completed=false;overlay.hidden=true;draw()};
$('remSessionPause').onclick=()=>{if(paused){end=Date.now()+remaining;paused=false}else{remaining=Math.max(0,end-Date.now());paused=true}draw()};
$('remSessionStop').onclick=()=>{active=false;paused=false;completed=false;overlay.hidden=true;draw()};
$('remSessionClose').onclick=()=>overlay.hidden=true;
setInterval(()=>{if(!active)return;if(!paused&&Date.now()>=end){finish();return}draw()},1000);
window.REMFocus={pause:()=>{if(active&&!paused){remaining=Math.max(0,end-Date.now());paused=true;draw()}},reset:()=>{active=false;paused=false;completed=false;overlay.hidden=true;draw()},open};
draw();
})();