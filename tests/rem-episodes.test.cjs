/* REM 5.6 episode parity checks. Run: node --test tests/rem-episodes.test.cjs */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
test('original REM 5.6 episode catalogue is preserved',()=>{
 const context={window:{}};vm.createContext(context);
 vm.runInContext(read('lab/modules/episodes.js'),context);
 const get=context.window.REMEpisodes.episodesFor;
 assert.deepEqual(Array.from(get('Il conte di Montecristo'),e=>e.title),['L’arrivo del Faraone','Il giovane Edmond Dantès','Le prime ombre']);
 assert.deepEqual(Array.from(get('La casa oltre il bosco'),e=>e.title),['L’inizio del viaggio']);
 assert.equal(get('Libro senza episodi').length,0);
 const first=get('Il conte di Montecristo');first[0].title='Modificato';
 assert.equal(get('Il conte di Montecristo')[0].title,'L’arrivo del Faraone');
});
test('episode choice is loaded before app core and is used only for matching books',()=>{
 const html=read('index.html');
 const scripts=[...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1]);
 const names=['episodes.js','episode-choice.js','app-core.js'].map(n=>scripts.findIndex(s=>s.endsWith('/'+n)));
 assert.ok(names.every(n=>n>=0));assert.ok(names[0]<names[1]&&names[1]<names[2]);
 const core=read('lab/modules/app-core.js');
 assert.match(core,/if\(!skipEpisodeChoice&&window\.REMEpisodes\?\.episodesFor\(book\.title\)\.length&&window\.REMEpisodeChoice\)/);
 assert.match(core,/window\.REMEpisodeChoice\.choose\(book\.title,\(\)=>openBook\(id,true\)\)/);
});
test('choice preserves original modes, formats, and demo disclaimer',()=>{
 const ui=read('lab/modules/episode-choice.js');
 for(const label of ['Libro completo','A episodi','Ebook','Audiolibro','Cartaceo','Tutti gli episodi','Apri libro completo','scheda episodio dimostrativa'])assert.ok(ui.includes(label),label);
 for(const suffix of ["save('','full')","save('','episodes')","save('-episode',String(i))","save('-format',format)"])assert.ok(ui.includes(suffix),suffix);
});

test('Focus Mode matches REM 5.6 duration presets and custom range',()=>{
 const html=read('index.html');
 const choice=html.match(/<div id="remSessionChoices">([\s\S]*?)<\/div>/);
 assert.ok(choice,'Focus choices missing');
 assert.deepEqual([...choice[1].matchAll(/data-min="([^"]+)"/g)].map(m=>m[1]),['5','10','custom']);
 assert.match(html,/id="remCustomMinutes"[^>]*min="1"[^>]*max="240"/);
 const focus=read('lab/modules/focus-timer.js');
 assert.match(focus,/mins<1\|\|mins>240/);
 for(const control of ['remSessionStart','remSessionPause','remSessionStop','remSessionClose'])assert.ok(focus.includes("$('"+control+"')"),control);
 assert.match(focus,/setInterval\(/);
 assert.match(focus,/window\.REMFocus=/);
});

test('candidate catalog uses the original extracted Montecristo text, not the demonstration placeholder',()=>{
 const candidate=JSON.parse(read('lab/catalog/books-candidate.json'));
 const book=candidate.books.find(b=>b.title==='Il conte di Montecristo');
 assert.ok(book,'Montecristo missing from candidate catalog');
 assert.equal(book.contentStatus,'integrated');
 assert.equal(book.chaptersSource,'lab/content/book_montecristo.json');
 const source=JSON.parse(read(book.chaptersSource));
 assert.equal(source.id,book.id);
 assert.ok(source.segmenti.length>1,'Extracted source must contain multiple original segments');
 assert.ok(source.segmenti.every(s=>typeof s.text==='string'&&s.text.trim()),'Extracted segments must contain text');
 const loader=read('lab/modules/catalog-loader.js');
 assert.match(loader,/chapters=chapters\.filter\(ch=>ch\.bookId!==book\.id\)/);
 assert.match(loader,/segments\.map\(segment=>segment\.text\|\|segment\.testo\|\|''\)/);
});

test('preview excludes the unapproved personal shelf feature',()=>{
 assert.equal(fs.existsSync(path.join(root,'lab/modules/personal-shelf.js')),false);
 const html=read('index.html');
 assert.doesNotMatch(html,/personal-shelf\.js|REM(?:Shelf|PersonalShelf)/);
 const core=read('lab/modules/app-core.js');
 assert.doesNotMatch(core,/REM(?:Shelf|PersonalShelf)|rem-modular-shelf-v1/);
});

test('home resume preserves the original episode progress label',()=>{
 const home=read('lab/modules/home-view.js');
 assert.match(home,/Lettura a episodi · /);
 assert.match(home,/Riprendi episodio/);
 assert.match(home,/rem-reading-mode-53-/);
 assert.match(home,/window\.REMEpisodes\.episodesFor/);
 assert.match(home,/Math\.min\(episodes\.length-1/);
});

test('Home episode resume skips the initial choice and opens the saved episode list',()=>{
 const home=read('lab/modules/home-view.js');
 const core=read('lab/modules/app-core.js');
 const choice=read('lab/modules/episode-choice.js');
 assert.match(home,/openBook\(resume\.id,false,Boolean\(episodeBook\)\)/);
 assert.match(core,/if\(resumeEpisodes\)window\.REMEpisodeChoice\.resume\(book\.title,\(\)=>openBook\(id,true\)\)/);
 assert.match(choice,/let stage=resumeEpisodes\?'episodes':'choice'/);
 assert.match(choice,/storageKey\(title\)\+'-episode'/);
 assert.match(choice,/resume:\(title,openFull\)=>choose\(title,openFull,true\)/);
});

test('candidate catalog includes both original REM 5.6 books with extracted chapters',()=>{
 const catalog=JSON.parse(read('lab/catalog/books-candidate.json'));
 for(const [id,title,expectedChapters] of [['casa-oltre-bosco','La casa oltre il bosco',2],['montecristo','Il conte di Montecristo',1]]){
  const book=catalog.books.find(b=>b.id===id);
  assert.ok(book&&book.title===title,title);
  assert.equal(book.contentStatus,'integrated');
  const source=JSON.parse(read(book.chaptersSource));
  assert.equal(source.id,id);
  assert.ok(source.segmenti.length>0);
  assert.equal(new Set(source.segmenti.map(s=>s.chapter)).size,expectedChapters);
  assert.ok(source.segmenti.every(s=>typeof s.text==='string'&&s.text.trim()));
 }
});

test('candidate catalog preserves both official 5.6 books and recovered Casa chapters',()=>{
 const candidate=JSON.parse(read('lab/catalog/books-candidate.json'));
 assert.deepEqual(candidate.books.map(book=>book.title),['La casa oltre il bosco','Il conte di Montecristo']);
 const casa=candidate.books[0];
 assert.equal(casa.contentStatus,'integrated');
 const source=JSON.parse(read(casa.chaptersSource));
 assert.equal(source.id,casa.id);
 assert.equal(source.segmenti.length,278);
 assert.deepEqual([...new Set(source.segmenti.map(s=>s.chapterTitle))],['La casa delle ortensie','Il sentiero della pioggia']);
 assert.ok(source.segmenti.every(s=>typeof s.text==='string'&&s.text.trim()&&Number.isInteger(s.chapter)));
});

test('original 5.6 book completion and submitted rating are modularized',()=>{
 const html=read('index.html');
 assert.match(html,/id="finishBook"/);
 const scripts=[...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1]);
 const rating=scripts.findIndex(s=>s.endsWith('/book-rating.js'));
 const core=scripts.findIndex(s=>s.endsWith('/app-core.js'));
 assert.ok(rating>=0&&rating<core);
 const code=read('lab/modules/book-rating.js');
 for(const text of ['rem-reading-feedback-v1','completed=true','rating=selected','Invia','Non ora','rem-rate-dialog'])assert.ok(code.includes(text),text);
 assert.match(read('lab/modules/app-core.js'),/REMBookRating\?\.complete\(state\.selected\)/);
});
