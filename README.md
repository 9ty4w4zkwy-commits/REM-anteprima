# REM — anteprima modulare

Questa repository contiene una **prova di architettura modulare**, non la REM 5.6 ufficiale. Tutte le modifiche e i collaudi di questa fase riguardano esclusivamente **REM-anteprima**.

## Stato verificato (12 novembre 2026)

- **24 test modulari superati** su GitHub Actions.
- Test Chromium superato: onboarding, Home, Biblioteca, Lettore, Focus Mode, Impostazioni e ritorno.
- Controlli responsive a **320, 390 e 768 px** per Home, Biblioteca, Lettore e Impostazioni.
- Screenshot PNG controllati per dimensioni e validità.
- Verificato in Chromium il ripristino di tema, dimensione carattere e capitolo dopo ricaricamento.
- Verificata con test modulare la ripresa del progresso audio dopo una pausa in background.

**Non ancora verificato:** Safari su iPhone reale, comportamento touch/iOS, qualità di tutti gli asset audio, confronto funzionale completo con REM 5.6. La percentuale di avanzamento è una stima, non una metrica di test.

## Come aprire l'anteprima in locale

È una pagina web statica: serve un server HTTP locale, non basta aprire `index.html` direttamente dal filesystem.

```sh
python3 -m http.server 8765
```

Aprire `http://localhost:8765/` nel browser del computer.

**Per il test su iPhone** occorre un URL HTTPS realmente pubblicato e raggiungibile da Safari. Il link alla repository GitHub non è il link dell'app. Prima di inviare un link di collaudo verificare che il sito sia online e che carichi `index.html`, i moduli e il catalogo.

## Test automatici

```sh
node --test tests/rem-modules.test.cjs
```

Il test browser richiede Playwright/Chromium e un server locale sulla porta 8765. GitHub Actions esegue i workflow `rem-smoke.yml` e `rem-browser.yml` sulle pull request.

## Documentazione

- [Piano collaudo iPhone / Safari](IPHONE-SAFARI-TEST-PLAN.md)
- [Audit architettura e limiti](ARCHITECTURE-AUDIT.md)

**Regola del progetto:** non modificare la repository ufficiale REM 5.6 durante il lavoro sull'anteprima.
