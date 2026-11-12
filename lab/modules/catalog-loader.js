/* REM catalog loader: validation and legacy chapter import. */
(function(){
'use strict';
async function load(){
const [b,c]=await Promise.all([fetch(document.documentElement.dataset.catalog==='candidate'?'./lab/catalog/books-candidate.json':'./lab/catalog/books.json'),fetch('./lab/catalog/chapters.json')]);if(!b.ok||!c.ok)throw Error('Dati non disponibili');const bd=await b.json(),cd=await c.json();if(bd.schemaVersion!==1||cd.schemaVersion!==1||!Array.isArray(bd.books)||!Array.isArray(cd.chapters))throw Error('Schema dati non valido');const ids=new Set();for(const book of bd.books){if(!book||typeof book.id!=='string'||!book.id||typeof book.title!=='string'||!book.title||ids.has(book.id))throw Error('Catalogo: ID o titolo non valido');ids.add(book.id)}const chapterIds=new Set();for(const ch of cd.chapters){if(!ch||typeof ch.id!=='string'||!ch.id||chapterIds.has(ch.id)||typeof ch.text!=='string')throw Error('Capitoli: riferimento o contenuto non valido');chapterIds.add(ch.id)}let books=bd.books;let chapters=cd.chapters.filter(ch=>ids.has(ch.bookId));const failedBooks=[];
for(const book of books){
 if(book.contentStatus!=='integrated'||!book.chaptersSource?.startsWith('lab/content/'))continue;
 try{
  const response=await fetch('./'+book.chaptersSource,{cache:'no-store'});
  if(!response.ok)throw Error('HTTP '+response.status);
  const extracted=await response.json();
  if(extracted.id!==(book.legacyContentId||book.id)||!Array.isArray(extracted.segmenti)||!extracted.segmenti.length)throw Error('Contenuto estratto non valido');
  if(!extracted.segmenti.every(segment=>typeof segment.text==='string'&&segment.text.trim()&&Number.isInteger(segment.chapter)))throw Error('Segmenti del libro incompleti');
  const grouped=new Map();
  for(const segment of extracted.segmenti){
   const chapter=String(segment.chapter??'1');
   if(!grouped.has(chapter))grouped.set(chapter,[]);
   grouped.get(chapter).push(segment);
  }
  chapters=chapters.filter(ch=>ch.bookId!==book.id);
  for(const [number,segments] of grouped){
   chapters.push({id:book.id+'-legacy-'+number,bookId:book.id,title:segments[0].chapterTitle||'Capitolo '+number,text:segments.map(segment=>segment.text||segment.testo||'').join('\n\n'),source:'Testo estratto dalla versione REM originale'});
  }
 }catch(error){chapters=chapters.filter(ch=>ch.bookId!==book.id);failedBooks.push(book.title);console.error('Contenuto estratto non caricato:',book.id,error)}
}

return {books,chapters,failedBooks};
}
window.REMCatalogLoader={load};
})();
