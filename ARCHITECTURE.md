# GL-Arena - Analisi Architetturale e Roadmap

## 📋 Analisi del Documento GL_Arena_Overview.md

### Componenti Principali Identificati

#### 1. **Sistema di Autenticazione e Utenti** ✅ (Parzialmente implementato)
- ✅ Registrazione utenti con hash password
- ✅ Login con Supabase Auth
- ⏳ Sistema di reputazione utenti
- ⏳ Profili giocatori con statistiche
- ⏳ Ruoli: Giocatore, Arbitro Certificato, Admin

#### 2. **Gestione Tornei**
- ⏳ Creazione e configurazione tornei
- ⏳ Tipi: Ufficiali (con montepremi) vs Non ufficiali
- ⏳ Bracket/eliminazione diretta
- ⏳ Gestione iscrizioni
- ⏳ Date e orari

#### 3. **Gestione Team**
- ⏳ Team creati per ogni torneo (non persistenti tra tornei)
- ⏳ Capitano del team
- ⏳ Inviti e gestione membri
- ⏳ Roster 5v5 per LoL

#### 4. **Gestione Match/Partite**
- ⏳ Creazione match da bracket
- ⏳ Parametri lobby (generati dalla piattaforma)
- ⏳ Validazione risultati via API Riot
- ⏳ Fallback con screenshot (validazione manuale/AI)
- ⏳ Log completo di ogni match

#### 5. **Integrazione API Riot Games**
- ⏳ Riot API Key management
- ⏳ Match-v5 API integration
- ⏳ Recupero risultati partite
- ⏳ Validazione partecipanti
- ⏳ Verifica modalità e durata
- ⏳ Determinazione vincitore

#### 6. **Sistema di Validazione**
- ⏳ Validazione automatica (via API Riot)
- ⏳ Validazione manuale (Arbitri)
- ⏳ Sistema di dispute/appelli
- ⏳ Logging decisioni arbitrali

#### 7. **Sistema AI**
- ⏳ Anti-smurfing detection
- ⏳ Verifica screenshot automatica
- ⏳ Supporto decisioni arbitrali
- ⏳ Analisi reputazione utenti

#### 8. **Gestione Premi**
- ⏳ Sistema montepremi
- ⏳ Distribuzione premi (solo dopo verifica completa)
- ⏳ Tracking pagamenti

---

## 🗄️ Schema Database Proposto

### Tabelle Principali

#### `users` ✅ (Esistente)
```sql
- id (uuid, PK)
- email (text, unique)
- username (text)
- full_name (text)
- avatar_url (text)
- password_hash (text)
- is_admin (boolean)
- reputation_score (numeric) -- da aggiungere
- is_certified_referee (boolean) -- da aggiungere
- riot_summoner_name (text) -- da aggiungere
- riot_puuid (text) -- da aggiungere
- created_at, updated_at
```

#### `tournaments` (Da creare)
```sql
- id (uuid, PK)
- name (text)
- description (text)
- game_type (text) -- 'league_of_legends'
- format (text) -- 'single_elimination', 'double_elimination', etc.
- max_teams (integer)
- prize_pool (numeric) -- null se non ufficiale
- status (text) -- 'draft', 'open_registration', 'in_progress', 'completed'
- start_date (timestamp)
- end_date (timestamp)
- created_by (uuid, FK -> users.id)
- created_at, updated_at
```

#### `tournament_teams` (Da creare)
```sql
- id (uuid, PK)
- tournament_id (uuid, FK -> tournaments.id)
- name (text)
- captain_id (uuid, FK -> users.id)
- seed (integer) -- per bracket
- status (text) -- 'registered', 'active', 'eliminated', 'winner'
- created_at, updated_at
```

#### `team_members` (Da creare)
```sql
- id (uuid, PK)
- team_id (uuid, FK -> tournament_teams.id)
- user_id (uuid, FK -> users.id)
- role (text) -- 'captain', 'player', 'substitute'
- riot_summoner_name (text)
- created_at
```

#### `matches` (Da creare)
```sql
- id (uuid, PK)
- tournament_id (uuid, FK -> tournaments.id)
- round (integer) -- fase del torneo
- team1_id (uuid, FK -> tournament_teams.id)
- team2_id (uuid, FK -> tournament_teams.id)
- scheduled_time (timestamp)
- status (text) -- 'scheduled', 'in_progress', 'completed', 'disputed'
- winner_id (uuid, FK -> tournament_teams.id, nullable)
- riot_match_id (text, nullable) -- ID match da Riot API
- lobby_parameters (jsonb) -- parametri lobby generati
- referee_id (uuid, FK -> users.id, nullable) -- per tornei ufficiali
- created_at, updated_at
```

#### `match_results` (Da creare)
```sql
- id (uuid, PK)
- match_id (uuid, FK -> matches.id)
- validation_method (text) -- 'riot_api', 'screenshot', 'manual'
- riot_match_data (jsonb, nullable) -- dati completi da Riot API
- screenshot_urls (text[], nullable) -- array di URL screenshot
- validated_by (uuid, FK -> users.id, nullable) -- arbitro che ha validato
- validation_status (text) -- 'pending', 'approved', 'rejected', 'disputed'
- validation_notes (text, nullable)
- created_at, updated_at
```

#### `match_logs` (Da creare)
```sql
- id (uuid, PK)
- match_id (uuid, FK -> matches.id)
- action (text) -- 'created', 'started', 'result_submitted', 'validated', 'disputed'
- performed_by (uuid, FK -> users.id)
- details (jsonb) -- dettagli dell'azione
- created_at
```

#### `user_reputation` (Da creare)
```sql
- id (uuid, PK)
- user_id (uuid, FK -> users.id)
- score (numeric)
- positive_events (integer) -- match completati, comportamenti positivi
- negative_events (integer) -- dispute, comportamenti negativi
- last_updated (timestamp)
```

#### `riot_api_keys` (Da creare)
```sql
- id (uuid, PK)
- key_name (text) -- identificativo
- api_key (text, encrypted)
- region (text) -- 'euw', 'na', 'eune', etc.
- rate_limit_remaining (integer)
- last_used (timestamp)
- is_active (boolean)
- created_at, updated_at
```

---

## 🛣️ Roadmap di Sviluppo

### Fase 1: Foundation (Attuale - In Progress)
- [x] Setup Next.js + Supabase
- [x] Autenticazione base (registrazione/login)
- [x] Database users con password hash
- [ ] Dashboard utente base
- [ ] Profilo utente con informazioni base

### Fase 2: Core Tournament System
- [ ] Schema database completo (tabelle sopra)
- [ ] CRUD Tornei (creazione, modifica, visualizzazione)
- [ ] Sistema di iscrizioni
- [ ] Gestione team per torneo
- [ ] Bracket generator (single elimination)

### Fase 3: Match Management
- [ ] Creazione match da bracket
- [ ] Generazione parametri lobby
- [ ] UI per visualizzazione match
- [ ] Sistema di scheduling

### Fase 4: Riot API Integration
- [ ] Setup Riot API keys management
- [ ] Integrazione Match-v5 API
- [ ] Recupero risultati automatico
- [ ] Validazione match via API
- [ ] Error handling e retry logic

### Fase 5: Validation System
- [ ] Validazione automatica (Riot API)
- [ ] Upload screenshot (fallback)
- [ ] Sistema di validazione manuale (Arbitri)
- [ ] UI per arbitri
- [ ] Sistema dispute/appelli

### Fase 6: AI Features
- [ ] Integrazione AI per anti-smurfing
- [ ] Verifica screenshot automatica
- [ ] Analisi comportamenti anomali
- [ ] Sistema reputazione automatico

### Fase 7: Advanced Features
- [ ] Sistema premi e pagamenti
- [ ] Notifiche (email, in-app)
- [ ] Statistiche avanzate
- [ ] Leaderboard
- [ ] Multi-region support (EUW, NA, etc.)

### Fase 8: Scalability & Polish
- [ ] Performance optimization
- [ ] Caching strategy
- [ ] Rate limiting
- [ ] Monitoring e logging
- [ ] Documentazione API
- [ ] Testing completo

---

## 🏗️ Struttura Proposta per il Progetto

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── tournaments/
│   │   │   ├── [id]/
│   │   │   └── create/
│   │   ├── matches/
│   │   │   └── [id]/
│   │   ├── teams/
│   │   └── profile/
│   ├── api/
│   │   ├── tournaments/
│   │   ├── matches/
│   │   ├── teams/
│   │   ├── riot/
│   │   └── validation/
│   └── layout.tsx
├── components/
│   ├── ui/ (shadcn/ui components)
│   ├── tournament/
│   ├── match/
│   ├── team/
│   └── profile/
├── lib/
│   ├── supabase/
│   ├── riot-api/
│   ├── validation/
│   └── ai/
├── types/
│   ├── database.ts (generato da Supabase)
│   ├── tournament.ts
│   ├── match.ts
│   └── riot.ts
└── hooks/
    ├── useTournament.ts
    ├── useMatch.ts
    └── useRiotApi.ts
```

---

## 🔑 Considerazioni Tecniche

### Sicurezza
- ✅ Password hashing (bcrypt) - Implementato
- ⏳ RLS (Row Level Security) su Supabase
- ⏳ Rate limiting su API Riot
- ⏳ Validazione input lato server
- ⏳ Sanitizzazione dati utente

### Performance
- ⏳ Caching risultati API Riot
- ⏳ Paginazione per liste (tornei, match)
- ⏳ Lazy loading componenti pesanti
- ⏳ Database indexing strategico

### Compliance
- ⏳ Conformità ToS Riot Games
- ⏳ GDPR compliance (dati utenti)
- ⏳ Privacy policy
- ⏳ Terms of service

---

## 📝 Note Implementative

### Riot API
- Le API Riot hanno rate limits (100 requests ogni 2 minuti per development key)
- Necessario implementare caching aggressivo
- Considerare multiple API keys per produzione
- Match-v5 richiede `matchId` e `puuid` del giocatore

### Lobby Management
- Non possiamo creare lobby via API
- Generiamo parametri (password, nome, etc.)
- Utente/Arbitro crea lobby manualmente nel client LoL
- Verifichiamo match ID dopo la partita

### AI Integration
- Considerare servizi come OpenAI, Anthropic, o modelli open-source
- Per screenshot: vision models
- Per anti-smurfing: analisi pattern di gioco, rank, statistiche

---

## 🎯 Prossimi Passi Immediati

1. **Completare schema database** - Creare tutte le tabelle in Supabase
2. **Dashboard base** - Creare layout dashboard dopo login
3. **CRUD Tornei** - Implementare creazione/visualizzazione tornei
4. **Setup Riot API** - Configurare gestione API keys e prima chiamata di test

---

*Documento creato il: 2026-01-29*
*Ultimo aggiornamento: 2026-01-29*
