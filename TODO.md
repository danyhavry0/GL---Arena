# TODO

## Autenticazione
- [x] Reintrodurre la conferma email (email verification) in Supabase e aggiornare il flusso di registrazione/login per gestire:
  - [x] invio email di conferma
  - [x] messaggio all'utente che deve confermare la mail prima del login
  - [x] gestione di utenti non confermati
  - [x] funzionalità di ri-invio email di conferma
  - [x] callback route per gestire la conferma email

## Database Schema
- [x] Creare schema database completo in Supabase (vedi cartella `tables/`):
  - [x] Tabella `tournaments`
  - [x] Tabella `tournament_teams`
  - [x] Tabella `team_members`
  - [x] Tabella `matches`
  - [x] Tabella `match_results`
  - [x] Tabella `match_logs`
  - [x] Tabella `user_reputation`
  - [x] Tabella `riot_api_keys`
  - [x] Aggiornare `users` con campi: `reputation_score`, `is_certified_referee`, `riot_summoner_name`, `riot_puuid`
  - Eseguire i file SQL in ordine nel Supabase SQL Editor (vedi `tables/README.md`).

## UI/UX Base
- [ ] Creare dashboard utente dopo login
- [ ] Layout principale con navigazione
- [ ] Pagina profilo utente
- [ ] Sistema di routing protetto (autenticazione richiesta)

## Core Features - Fase 2
- [ ] CRUD Tornei (creazione, visualizzazione, modifica)
- [ ] Sistema di iscrizioni ai tornei
- [ ] Gestione team per torneo
- [ ] Bracket generator (single elimination)

## Riot API Integration
- [ ] Setup gestione Riot API keys
- [ ] Integrazione Match-v5 API
- [ ] Recupero risultati partite
- [ ] Validazione match automatica

Vedi `ARCHITECTURE.md` per la roadmap completa e dettagli tecnici.
