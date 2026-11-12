# Confronto con REM 5.6 — inventario iniziale (12 novembre 2026)

## Obiettivo approvato
Modularizzare fedelmente la REM 5.6 esistente, senza introdurre Must-Have, Should-Have o nuove scelte di prodotto. Sviluppi successivi solo dopo confronto con la proprietaria del progetto.

## Fonte ufficiale, in sola lettura
Repository: `9ty4w4zkwy-commits/REM.`
- `index.html`: reindirizza a `rem-recupero-due-libri-focus.html`.
- `rem-recupero-due-libri-focus.html`: wrapper 5.6 (titolo “REM – Test Iterazione 5.6”), carica con `fetch` `REM_Iterazione3_Focus_Mode.html`, applica modifiche a HTML/CSS/JS e quindi lo presenta.
- `REM_Iterazione3_Focus_Mode.html`: **recuperato integralmente** tramite blob GitHub (`4852bf0725a9f6cda3fbb601ba1a5b3d4345ecfd`); circa 26 MB di HTML incorporato, 96 ID distinti, 10 tag script e 11 tag style. Contiene CSS con marcatori `css/01-base.css`, `css/02-home.css`, `css/03-reader.css`, `css/04-responsive.css`.

## Anteprima
Repository: `9ty4w4zkwy-commits/REM-anteprima`
- L'anteprima usa un'app autonoma, con moduli separati per navigazione, aspetto, catalogo, lettore, cronologia e Focus Mode.
- Non è ancora dimostrato che replichi integralmente le schermate, le regole e i dati della 5.6. L'originale contiene tra l'altro elementi per lettura cartacea, sincronizzazione tra formati, ricerca per pagina, book trailer e libreria: confrontarli uno a uno prima di dichiarare parità.
- Le funzionalità di mensola personale non approvate sono state escluse; il modulo inutilizzato `personal-shelf.js` è stato eliminato dal repository.

## Prossimi controlli
1. **Completato:** recuperato il contenuto reale della pagina base ufficiale via GitHub blob.
2. Inventariare pagine, flussi, azioni, stili e persistenza effettivi della 5.6.
3. Redigere una matrice di corrispondenza ufficiale ↔ moduli anteprima.
4. Correggere le differenze senza nuove funzioni e testare browser; Safari/iPhone richiede verifica specifica.

## Nota di fedeltà
Il recupero della base non significa ancora parità: l'anteprima ha una struttura autonoma, mentre la 5.6 finale deriva dalla pagina base più il wrapper. Le funzionalità vanno inventariate prima di essere considerate equivalenti.

**La repository ufficiale è solo fonte di confronto e non deve essere modificata.**

## Verifica diretta del 12 novembre 2026

- Il repository ufficiale corretto è `9ty4w4zkwy-commits/REM.` (con punto finale). Il blob `4852bf0725a9f6cda3fbb601ba1a5b3d4345ecfd` è stato recuperato: 26.084.578 caratteri. Recupero non significa analisi integrale.
- Il wrapper originale è stato letto: modifica copertine, apertura libro dall'inizio, valutazione con pulsante Invia e Focus Mode. Focus offre 5 o 10 minuti oppure durata personalizzata 1–240, pausa/riprendi/termina, dialogo e indicatore fisso.
- Lo script originale `rem-episodi-v5-6.js` è stato letto: selezione libro completo / episodi per Montecristo e La casa oltre il bosco; episodi dichiarati dimostrativi, senza segmenti integrali di testo o audio.
- **Rettifica:** l'anteprima attuale offre Focus 5/10/personalizzato (1–240 minuti); la precedente osservazione 5/10/25 è superata. La parità visiva e comportamentale resta da verificare.
- `lab/styles/rem56-alignment.css` riprende parte della palette della base, ma non dimostra parità con gli override del wrapper.
- Rimangono da verificare integralmente base, catalogo, persistenza, valutazioni, percorsi, episodi e layout responsive. Chromium non sostituisce Safari su iPhone.

### Prossimi interventi
1. Inventariare completamente codice e trasformazioni della 5.6.
2. Correggere i moduli su Focus, valutazioni, apertura e scelta episodi in base alla baseline, senza nuove funzioni.
3. Eseguire test di regressione e confronto visivo, poi collaudo Safari iPhone.

**Questa verifica ha aggiornato la documentazione, non i moduli applicativi. La fedeltà non è certificata.**

## Stato di chiusura — 12 novembre 2026 (aggiornamento)

### Lettura episodica
- Recuperati i dati esatti delle quattro schede dimostrative dal file ufficiale `rem-episodi-v5-6.js` in `lab/modules/episodes.js`.
- Aggiunto `lab/modules/episode-choice.js` e collegato al flusso `openBook` di `app-core.js` per i titoli presenti nel catalogo originale.
- Aggiunti stili, test unitari (`tests/rem-episodes.test.cjs`) e percorsi Chromium (`tests/browser-smoke.cjs`).
- **Non dichiarare questa parte collaudata** fino all'esito effettivo dei nuovi test. L'API degli stati GitHub per il commit `7f3c542a7b1a54864875054205a8d39820654bdb` non ha restituito status; ciò non prova né successo né fallimento dei workflow.

### Differenze e rischi ancora aperti
1. **Focus Mode:** la baseline originale offre 5/10 minuti e durata personalizzata 1–240; il modulo anteprima mostra anche 25 minuti. Allineamento non ancora completato.
2. **Catalogo (aggiornato):** il catalogo candidate include entrambi i titoli; `La casa oltre il bosco` contiene 278 segmenti originali distribuiti su due capitoli. Rimangono da verificare asset, formati e resa.
3. **Interfaccia:** la base ufficiale di circa 26 milioni di caratteri non è stata ancora confrontata integralmente, schermata per schermata, con l'anteprima. Nessuna parità visiva certificata.
4. **Test:** esecuzione e risultati delle nuove verifiche episodiche e Chromium non ancora confermati; Safari/iPhone reale non collaudato.
5. **Altri flussi originali:** valutazioni, formati, lettura cartacea, sincronizzazione, navigazione, contenuti e persistenza richiedono matrice di corrispondenza e verifica.

### Criterio per chiudere la fase
Non dichiarare la modularizzazione fedele e conclusa prima di: (a) verificare tutti i flussi 5.6; (b) correggere le differenze sostanziali; (c) ottenere test automatici verdi; (d) effettuare controllo visivo/responsive e documentare le limitazioni Safari/iPhone. La sola separazione in file JS non soddisfa il criterio.

### Rettifica Focus Mode — verifica diretta successiva
La precedente indicazione secondo cui il Focus dell'anteprima avrebbe ancora il preset da 25 minuti **è superata**. Il controllo diretto dei file attuali `index.html` e `lab/modules/focus-timer.js` mostra preset **5 / 10 / Personalizza (1–240)**, pulsanti avvio/pausa/termina, indicatore persistente e dialogo di fine sessione, coerenti nei controlli principali con il wrapper ufficiale. È stato aggiunto un test di regressione in `tests/rem-episodes.test.cjs`. Rimangono da verificare esecuzione, grafica e comportamenti su browser: questa rettifica non certifica parità completa.

## Stato aggiornato del blocco 3
- Entrambi i libri sono presenti nel catalogo candidate e il test Chromium ora controlla anche **il testo effettivamente renderizzato** dei due capitoli di `La casa oltre il bosco`, non soltanto i titoli.
- Restano aperte le differenze funzionali e visive rispetto alla base 5.6, in particolare asset audio/cartacei, valutazioni e sincronizzazione. Non sono state aggiunte funzionalità speculative.
- **Non è disponibile un esito confermato dei workflow GitHub Actions:** le modifiche e i test aggiunti non equivalgono a una validazione browser completata.
