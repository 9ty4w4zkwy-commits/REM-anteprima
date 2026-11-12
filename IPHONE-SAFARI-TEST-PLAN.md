# REM-anteprima — collaudo manuale Safari su iPhone

**Ambito:** esclusivamente REM-anteprima. Non modificare REM 5.6 ufficiale.  
**Stato:** checklist preparata, **non eseguita su iPhone reale**.  
**Data:** 12 novembre 2026.

## Preparazione

- [ ] Aprire la versione pubblicata di REM-anteprima in Safari su iPhone (non usare l'URL GitHub del repository come se fosse l'app).
- [ ] Annotare modello iPhone, versione iOS, URL dell'app, data e ora.
- [ ] Ripetere i casi principali con connessione Wi-Fi e, se possibile, rete cellulare.
- [ ] Prima prova con dati Safari già presenti; seconda prova in navigazione privata o dopo aver azzerato **solo i dati di REM-anteprima**.
- [ ] Registrare per ogni problema: passaggio, risultato atteso, risultato effettivo, screenshot/video e possibilità di riprodurlo.

## Percorso essenziale

| ID | Azione su iPhone | Risultato atteso | Esito |
|---|---|---|---|
| IP-01 | Aprire l'app in Safari | Schermata iniziale leggibile, senza errori visibili | ☐ |
| IP-02 | Completare o saltare onboarding | Arrivo alla Home senza blocchi | ☐ |
| IP-03 | Aprire Biblioteca dalla Home | Elenco libri e pulsanti utilizzabili al tocco | ☐ |
| IP-04 | Aprire un libro e avviare lettura | Titolo e capitolo corretti nel Lettore | ☐ |
| IP-05 | Scorrere un capitolo lungo | Testo leggibile, nessun taglio laterale, scroll fluido | ☐ |
| IP-06 | Passare al capitolo successivo e tornare indietro | Titolo, testo e avanzamento coerenti | ☐ |
| IP-07 | Aprire Impostazioni dal Lettore e tornare | Ritorno al Lettore senza perdere il contesto | ☐ |
| IP-08 | Tornare alla Biblioteca | Nessun audio residuo o schermata bloccata | ☐ |

## Formati e audio

| ID | Azione su iPhone | Risultato atteso | Esito |
|---|---|---|---|
| IP-09 | Selezionare ebook, audio e cartaceo nei capitoli che li prevedono | Disponibili solo i formati con contenuto associato | ☐ |
| IP-10 | Tentare un formato non disponibile | Opzione disabilitata o messaggio chiaro, mai contenuto fittizio | ☐ |
| IP-11 | Riprodurre una traccia audio **reale** disponibile | Safari avvia il player dopo il gesto dell'utente | ☐ |
| IP-12 | Mettere Safari in background durante l'audio | Riproduzione messa in pausa | ☐ |
| IP-13 | Tornare in Safari e riprendere manualmente l'audio | Il progresso riprende ad aggiornarsi | ☐ |
| IP-14 | Cambiare capitolo o uscire dal Lettore durante l'audio | Audio precedente interrotto; nessun progresso fantasma | ☐ |
| IP-15 | Provare un audio non raggiungibile, se possibile in ambiente di test | Messaggio d'errore comprensibile | ☐ |

**Nota:** non tutti i capitoli dispongono necessariamente di audio o mappatura cartacea; segnare *N/A* se manca un asset reale, senza interpretarlo come un test superato.

## Personalizzazione e persistenza

| ID | Azione su iPhone | Risultato atteso | Esito |
|---|---|---|---|
| IP-16 | Cambiare sfondo/tipografia dalle Impostazioni | Cambiamento immediato, testo leggibile | ☐ |
| IP-17 | Ricaricare Safari dopo aver modificato l'aspetto | Preferenze conservate | ☐ |
| IP-18 | Cambiare capitolo e formato, poi ricaricare | Ripristino coerente con i dati salvati | ☐ |
| IP-19 | Attivare Focus Mode e uscirne | Interfaccia immersiva e uscita accessibile tramite tocco | ☐ |
| IP-20 | Usare il timer Focus, se disponibile nella schermata | Comandi e conteggio funzionanti | ☐ |
| IP-21 | Scrivere una nota nel Lettore ebook e tornare al capitolo | Nota recuperata correttamente | ☐ |

## Qualità visiva e accessibilità

- [ ] Nessuno scorrimento orizzontale su Home, Biblioteca, Lettore e Impostazioni.
- [ ] Nessun controllo coperto da notch, Dynamic Island o barra inferiore di Safari.
- [ ] Pulsanti e selettori facilmente toccabili, senza zoom involontario.
- [ ] Testo leggibile sia in verticale sia ruotando il dispositivo in orizzontale.
- [ ] Tastiera iOS non nasconde i campi delle note e la ricerca in Biblioteca.
- [ ] Aumentando la dimensione del testo in iOS/Safari, i controlli principali restano accessibili.
- [ ] Verificare contrasto e leggibilità delle diverse combinazioni di sfondo e carattere.

## Registro dei risultati

| ID | Esito (PASS / FAIL / N/A) | Dispositivo e iOS | Note / screenshot |
|---|---|---|---|
| IP-__ | | | |

**Criterio di uscita:** tutti i casi essenziali IP-01–IP-08 superati; nessun bug bloccante su lettura, navigazione, cambio formato o ripristino; problemi visivi documentati. I casi audio richiedono asset realmente disponibili. Un test Chromium superato **non sostituisce** questa verifica Safari/iPhone.
