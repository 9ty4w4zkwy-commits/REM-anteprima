# REM-anteprima — verifica architettura (12 novembre 2026)

## Ambito
Solo repository REM-anteprima. La versione ufficiale REM 5.6 non va modificata.

## Risultati verificati nel codice
- `index.html` carica 16 moduli prima di `app-core.js`, inclusi `episodes.js` e `episode-choice.js`, tutti con `defer`.
- `navigation.js`: visibilità delle schermate.
- `appearance.js`: preferenze grafiche e persistenza.
- `reading-store.js`: posizione e formato salvati in localStorage.
- `reading-history.js`: cronologia nella biblioteca.
- `home-view.js`, `book-detail-view.js`, `library-view.js`: viste separate.
- `catalog-loader.js`: caricamento, validazione e import dei capitoli legacy.
- `reader-surface.js`, `formats.js`: lettore e disponibilità dei formati.
- Altri moduli: onboarding, focus timer, avanzamento e note del lettore.
- `personal-shelf.js`, residuo di una funzione non approvata, è stato eliminato; nessun collegamento nell'interfaccia o nel core è stato trovato.

## Verifiche ancora necessarie
1. Avvio reale su browser mobile e iPhone, con controllo della console.
2. Navigazione Home → Biblioteca → Scheda libro → Lettore → Impostazioni e ritorno.
3. Ripristino di capitolo, formato e preferenze dopo ricaricamento.
4. Contenuti dei libri e gestione degli errori durante il caricamento.
5. Coerenza della disponibilità audio/cartaceo per singolo capitolo; presenza di asset reali e sincronizzazione.
6. Confronto visuale e funzionale con la REM 5.6 ufficiale.
7. Test dei controlli touch, Focus Mode, note e progressi su iPhone.

## Limiti della verifica
L'ordine degli script e i collegamenti sono stati controllati tramite il contenuto GitHub. Questa verifica statica **non** dimostra che l'app sia priva di errori in esecuzione. La percentuale di completamento resta una stima, non una misura automatizzata.

## Blocco di fedeltà del catalogo (verifica statica)
Il catalogo `lab/catalog/books-candidate.json` contiene attualmente solo `Il conte di Montecristo`. Il catalogo degli episodi ufficiali REM 5.6 contiene anche `La casa oltre il bosco`, ma non basta aggiungere un titolo fittizio: prima di dichiarare la parità occorre recuperare dal file base ufficiale i metadati, le risorse e il percorso di lettura effettivamente disponibili per il secondo libro. **Non dichiarare completata la migrazione del catalogo.**

Il collegamento Home → `openBook(...,false,true)` → `REMEpisodeChoice.resume()` è stato verificato staticamente su GitHub; l'esecuzione Chromium/iPhone rimane da confermare.

## Blocco 1 — recupero del secondo libro (completato nel codice)
Dal file base ufficiale `REM_Iterazione3_Focus_Mode.html` è stato estratto il JSON originale `switch-libro-casa`: 278 segmenti, 2 capitoli (`La casa delle ortensie` e il secondo titolo definito dalla sorgente). `lab/content/book_casa_oltre_bosco.json` preserva i dati originali. Il catalogo candidato ora contiene entrambi i libri ufficiali e il loader esistente importa i capitoli estratti. I test browser sono stati adattati a selezionare Montecristo per titolo, non per posizione. Rimangono da verificare parità di asset audio/copertine e interfaccia, oltre all'esecuzione effettiva dei test. La precedente nota sul catalogo a un solo libro è storica e non più attuale.
