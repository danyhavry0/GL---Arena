# TODO

## Autenticazione
- [ ] Reintrodurre la conferma email (email verification) in Supabase e aggiornare il flusso di registrazione/login per gestire:
  - invio email di conferma
  - messaggio all'utente che deve confermare la mail prima del login
  - gestione di utenti non confermati

## Database Schema
- [ ] Creare schema database completo in Supabase:
  - [ ] Tabella `tournaments`
  - [ ] Tabella `tournament_teams`
  - [ ] Tabella `team_members`
  - [ ] Tabella `matches`
  - [ ] Tabella `match_results`
  - [ ] Tabella `match_logs`
  - [ ] Tabella `user_reputation`
  - [ ] Tabella `riot_api_keys`
  - [ ] Aggiornare `users` con campi: `reputation_score`, `is_certified_referee`, `riot_summoner_name`, `riot_puuid`

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
