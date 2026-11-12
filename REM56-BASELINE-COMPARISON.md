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

**La repository ufficiale è solo fonte di confronto e non deve essere modificata.**
