/* Original REM 5.6 completion and rating flow; isolated from navigation and reading state. */
(function(){
'use strict';
const KEY='rem-reading-feedback-v1';
const originalId=id=>id==='casa-oltre-bosco'?'casa':id==='montecristo'?'montecristo':null;
function read(){try{const data=JSON.parse(localStorage.getItem(KEY)||'{}');return data&&typeof data==='object'?data:{}}catch{return {}}}
function save(data){try{localStorage.setItem(KEY,JSON.stringify(data))}catch{}}
function complete(book){
 const id=originalId(book?.id);if(!id)return;
 const data=read();if(!data.books||typeof data.books!=='object')data.books={};
 const record=data.books[id]||{opened:0,completed:false,rating:0};
 record.completed=true;data.books[id]=record;save(data);
 const backdrop=document.createElement('div');backdrop.className='rem-rate-backdrop';backdrop.setAttribute('role','presentation');
 const dialog=document.createElement('section');dialog.className='rem-rate-dialog';dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-label','Valuta il libro');
 const heading=document.createElement('h2');heading.textContent='Quanto ti è piaciuto «'+book.title+'»?';
 const explanation=document.createElement('p');explanation.textContent='La tua valutazione ci aiuta a scegliere meglio le prossime storie.';
 const stars=document.createElement('div');stars.className='rem-rate-stars';stars.setAttribute('role','group');stars.setAttribute('aria-label','Valutazione da 1 a 5 stelle');
 let selected=Number(record.rating)||0;
 const buttons=[];
 const paint=()=>buttons.forEach((b,i)=>{const active=i<selected;b.textContent=active?'★':'☆';b.setAttribute('aria-pressed',String(active))});
 for(let n=1;n<=5;n++){const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',n+' stelle su 5');b.onclick=()=>{selected=selected===n?n-1:n;paint()};buttons.push(b);stars.append(b)}
 const submit=document.createElement('button');submit.type='button';submit.className='rem-rating-submit';submit.textContent='Invia';
 const later=document.createElement('button');later.type='button';later.textContent='Non ora';
 const previous=document.activeElement;
 const close=()=>{backdrop.remove();if(previous?.isConnected)previous.focus()};
 submit.onclick=()=>{if(selected<1)return;record.rating=selected;save(data);close()};
 later.onclick=close;
 backdrop.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();close()}if(event.key!=='Tab')return;const first=buttons[0],last=later;if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}});
 dialog.append(heading,explanation,stars,submit,later);backdrop.append(dialog);document.body.append(backdrop);paint();buttons[0].focus();
}
window.REMBookRating={complete};
})();
