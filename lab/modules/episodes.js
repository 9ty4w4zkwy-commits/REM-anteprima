/* REM 5.6 episode demo catalogue: data only, no new product behavior. */
(function(){
'use strict';
const catalogue={
 'Il conte di Montecristo':[
  {title:'L’arrivo del Faraone',intro:'Una nave rientra a Marsiglia. A bordo, un giovane marinaio attira subito l’attenzione.'},
  {title:'Il giovane Edmond Dantès',intro:'Tra notizie dal viaggio e nuove responsabilità, Edmond guarda al proprio futuro.'},
  {title:'Le prime ombre',intro:'Sotto l’apparente serenità del ritorno affiorano rivalità e tensioni.'}
 ],
 'La casa oltre il bosco':[
  {title:'L’inizio del viaggio',intro:'La storia comincia: scopri le prime pagine e lasciati guidare nel racconto.'}
 ]
};
function episodesFor(title){return (catalogue[title]||[]).map(episode=>({...episode}));}
window.REMEpisodes={episodesFor};
})();
