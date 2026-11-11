/* REM 5.6 onboarding questions and answer choices, migrated without legacy UI dependencies. */
(function(){
'use strict';
const KEY='rem-candidate-profile-v1';
const questions=[
 {q:'Quali cose ti fanno perdere la cognizione del tempo?',help:'Puoi scegliere fino a due risposte.',multi:true,options:['Viaggiare e scoprire luoghi','Capire come funziona la mente','Arte, musica e creatività','Storie e relazioni umane','Misteri ed enigmi','Natura e avventura']},
 {q:'Quale di queste frasi ti rappresenta di più?',help:'Scegli quella che senti più tua.',options:['Amo scoprire cose nuove','Mi piace capire tutto a fondo','Sono una persona sognatrice','Amo le sfide','Sono una persona sensibile']},
 {q:'Quando hai del tempo libero, cosa scegli più volentieri?',help:'Scegli la risposta più spontanea.',options:['Esplorare posti nuovi','Stare con le persone che amo','Creare qualcosa','Imparare qualcosa di nuovo','Stare nella natura']},
 {q:'Cosa cerchi in un libro, adesso?',help:'Potrai cambiare questa risposta quando vuoi.',options:['Evadere','Sorridere','Emozionarmi','Scoprire']}
];
const $=id=>document.getElementById(id);
let stored={};try{stored=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{}
let answers=Array.isArray(stored.answers)?stored.answers.map(a=>Array.isArray(a)?a:[]):questions.map(()=>[]);
let page=-1,onDone=()=>{};
function persist(status){try{localStorage.setItem(KEY,JSON.stringify({status,answers,updatedAt:new Date().toISOString()}))}catch{}}
function close(status){document.body.classList.remove('profile-open');persist(status);$('profileOnboarding').classList.add('hidden');$('profileEdit').classList.remove('hidden');onDone();window.dispatchEvent(new Event('rem-profile-updated'))}
function button(text,cls,callback){const b=document.createElement('button');b.type='button';b.textContent=text;b.className=cls;b.onclick=callback;return b}
function draw(){
 const area=$('profileQuestion');area.replaceChildren();
 $('profileStep').textContent=page<0?'':'Domanda '+(page+1)+' di 4';
 $('profileOnboarding').style.setProperty('--profile-progress',String(page<0?0:(page+1)*25)+'%');
 if(page<0){
  const title=document.createElement('h2');title.textContent='Ogni storia inizia da chi la legge.';
  const intro=document.createElement('p');intro.textContent='Raccontaci qualcosa di te. Ti aiuteremo a scoprire storie che forse non avresti mai cercato.';
  area.append(title,intro,button('Iniziamo','primary',()=>{page=0;draw()}));return;
 }
 const q=questions[page],selected=answers[page]||[];
 const title=document.createElement('h2');title.textContent=q.q;
 const help=document.createElement('p');help.className='muted';help.textContent=q.help;
 const choices=document.createElement('div');choices.className='profile-choices';
 q.options.forEach(option=>{
  const active=selected.includes(option);
  const b=button(option,'profile-choice'+(active?' selected':''),()=>{
   let next=answers[page]||[];
   next=next.includes(option)?next.filter(v=>v!==option):q.multi?[...next.slice(-1),option]:[option];
   answers[page]=next;draw();
  });b.setAttribute('aria-pressed',String(active));choices.append(b);
 });
 const actions=document.createElement('div');actions.className='profile-actions';
 actions.append(button('← Indietro','',()=>{page--;draw()}));
 const next=button(page===3?'Entra in REM':'Avanti →','primary',()=>{if(page===3)close('completed');else{page++;draw()}});
 next.disabled=!selected.length;actions.append(next);
 const note=document.createElement('p');note.className='muted';note.textContent='Le risposte restano su questo dispositivo. Puoi modificarle o saltare il percorso.';
 area.append(title,help,choices,actions,note);
}
function open(done){document.body.classList.add('profile-open');onDone=typeof done==='function'?done:()=>{};page=-1;$('profileOnboarding').classList.remove('hidden');draw()}
$('profileSkip').onclick=()=>close('skipped');
$('profileEdit').onclick=()=>open(()=>{});
const hasFinished=()=>{let x={};try{x=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{}return x.status==='completed'||x.status==='skipped'};
if(hasFinished())$('profileEdit').classList.remove('hidden');
window.REMProfile={open,hasFinished,answers:()=>answers};
})();