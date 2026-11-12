/* Personal shelf: device-local saved books, independent from reading progress. */
(function(){
'use strict';
const key='rem-modular-shelf-v1';
let saved=[];
try{const value=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(value))saved=value.filter(id=>typeof id==='string'&&id.length>0)}catch{}
function has(id){return saved.includes(id)}
function toggle(id){
 if(typeof id!=='string'||!id)return false;
 saved=has(id)?saved.filter(item=>item!==id):[...saved,id];
 try{localStorage.setItem(key,JSON.stringify(saved))}catch{}
 return has(id);
}
window.REMShelf={has,toggle,all:()=>[...saved]};
})();
