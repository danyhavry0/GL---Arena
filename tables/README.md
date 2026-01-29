# GL-Arena – Database tables

SQL migrations per Supabase. Eseguire **in ordine** nel **SQL Editor** di Supabase (incolla e run uno per uno):

| # | File | Descrizione |
|---|------|-------------|
| 1 | `users_alter.sql` | Aggiunge `reputation_score`, `is_certified_referee`, `riot_summoner_name`, `riot_puuid` a `users` |
| 2 | `tournaments.sql` | Tornei |
| 3 | `tournament_teams.sql` | Team per torneo |
| 4 | `team_members.sql` | Roster (5v5) |
| 5 | `matches.sql` | Partite / bracket |
| 6 | `match_results.sql` | Validazione risultati (Riot API, screenshot, manuale) |
| 7 | `match_logs.sql` | Log azioni match |
| 8 | `user_reputation.sql` | Reputazione utenti |
| 9 | `riot_api_keys.sql` | Chiavi API Riot |

**Prerequisito:** tabella `users` già esistente (creata in precedenza).
