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
- Le funzionalità di mensola personale e filtri introdotte dopo la 5.6 sono state rimosse dall'interfaccia e dai collegamenti; il modulo inutilizzato `personal-shelf.js` resta da eliminare in una successiva pulizia controllata.

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
- Nell'anteprima `index.html` e `lab/modules/focus-timer.js` il Focus è integrato nella pagina, offre 5/10/25 minuti e pulsanti Avvia/Pausa/Azzera: differenza funzionale e visiva confermata.
- `lab/styles/rem56-alignment.css` riprende parte della palette della base, ma non dimostra parità con gli override del wrapper.
- Rimangono da verificare integralmente base, catalogo, persistenza, valutazioni, percorsi, episodi e layout responsive. Chromium non sostituisce Safari su iPhone.

### Prossimi interventi
1. Inventariare completamente codice e trasformazioni della 5.6.
2. Correggere i moduli su Focus, valutazioni, apertura e scelta episodi in base alla baseline, senza nuove funzioni.
3. Eseguire test di regressione e confronto visivo, poi collaudo Safari iPhone.

**Questa verifica ha aggiornato la documentazione, non i moduli applicativi. La fedeltà non è certificata.**
