/* REM Focus timer: independent module, no catalog or reader dependencies. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const notify=message=>{const status=$('status');if(status)status.textContent=message};
const state={timer:null,remaining:0,deadline:0};
function tick(){if(state.timer)state.remaining=Math.max(0,Math.ceil((state.deadline-Date.now())/1000));$('clock').textContent=String(Math.floor(state.remaining/60)).padStart(2,'0')+':'+String(state.remaining%60).padStart(2,'0');if(state.timer&&state.remaining===0){clearInterval(state.timer);state.timer=null;notify('Sessione Focus conclusa')}}
function runTimer(){clearInterval(state.timer);if(state.remaining<=0)return;state.deadline=Date.now()+state.remaining*1000;state.timer=setInterval(tick,250);tick()}
$('timerStart').onclick=()=>{if(!state.remaining){const minutes=Number($('minutes').value);if(!Number.isFinite(minutes)||minutes<=0)return notify('Durata Focus non valida');state.remaining=Math.round(minutes*60)}runTimer();notify('Sessione Focus avviata')};
$('timerPause').onclick=()=>{if(state.timer){tick();clearInterval(state.timer);state.timer=null;notify('Timer in pausa')}}; 
$('timerReset').onclick=()=>{clearInterval(state.timer);state.timer=null;state.remaining=0;tick();notify('Timer azzerato')};

window.REMFocus={pause:()=>{if(state.timer){tick();clearInterval(state.timer);state.timer=null}},reset:()=>{clearInterval(state.timer);state.timer=null;state.remaining=0;tick()}};
})();
