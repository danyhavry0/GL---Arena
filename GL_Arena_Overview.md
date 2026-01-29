# GL-Arena

## Cos'è GL-Arena

GL-Arena è una piattaforma competitiva dedicata all'organizzazione di
tornei esports strutturati, con particolare attenzione al fair play,
alla trasparenza e alla gestione professionale degli eventi con e senza
montepremi.

La piattaforma nasce per offrire un ambiente competitivo affidabile
dove: - i giocatori possono competere in tornei regolamentati - i team
vengono creati specificamente per ogni torneo - i risultati sono
validati automaticamente e manualmente - i premi vengono distribuiti
solo dopo verifica completa

GL-Arena si posiziona come una piattaforma **organizzativa e di
validazione**, non come un client di gioco.

------------------------------------------------------------------------

## Gioco di partenza: League of Legends

Il primo gioco che verrà integrato su GL-Arena è **League of Legends
(LoL)**.

La scelta di League of Legends è motivata da: - ampia base di giocatori
attivi - forte ecosistema competitivo - disponibilità di API ufficiali
Riot per la raccolta dei dati - supporto nativo a partite custom e
tornei

Tutti i tornei iniziali saranno basati su: - modalità **Custom Game** -
mappa **Summoner's Rift** - formato **Tournament Draft** - partite 5v5

------------------------------------------------------------------------

## Gestione delle Lobby

A causa delle limitazioni delle API ufficiali Riot, GL-Arena **non crea
lobby automaticamente dal server**.

La gestione varia in base al tipo di evento: - **Tornei ufficiali con
montepremi**: la lobby viene creata da un **Arbitro Certificato
GL-Arena** - **Eventi non ufficiali / sfide**: la lobby viene creata dal
capitano del team host

In entrambi i casi, la piattaforma genera i parametri obbligatori della
lobby e ne verifica la correttezza.

------------------------------------------------------------------------

## Necessità delle API di League of Legends

Le **API ufficiali Riot (Match-v5)** sono fondamentali per: - recuperare
i risultati delle partite - verificare i partecipanti al match -
validare modalità e durata - determinare il team vincitore

Le API vengono utilizzate esclusivamente per: - lettura dati -
validazione post-match - statistiche di base

Non viene effettuato alcun controllo diretto sul client di gioco.

------------------------------------------------------------------------

## Ruolo dell'Intelligenza Artificiale

L'intelligenza artificiale è un componente chiave di GL-Arena e viene
utilizzata per:

-   rilevamento di comportamenti anomali (anti-smurfing)
-   verifica automatica degli screenshot in caso di fallback
-   supporto alle decisioni arbitrali
-   analisi della reputazione degli utenti

L'AI non interviene nel gameplay ma supporta i processi decisionali e di
validazione.

------------------------------------------------------------------------

## Direttive Tecniche Principali

-   Architettura server-side scalabile e modulare
-   Separazione netta tra gestione torneo e client di gioco
-   Sistema di reputazione persistente
-   Log completo di ogni match e decisione arbitrale
-   Conformità ai Termini di Servizio Riot Games
-   Possibilità di estendere l'integrazione ad altri giochi in futuro

------------------------------------------------------------------------

## Visione Tecnica

GL-Arena è progettata per evolversi in una piattaforma multi-gioco,
mantenendo: - regole chiare - controllo umano dove necessario -
automazione intelligente - affidabilità nei tornei con premi


