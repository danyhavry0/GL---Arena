# Email Verification Setup Guide

## ✅ Implementazione Completata

Il sistema di conferma email è stato implementato nel codice. Ora devi abilitarlo in Supabase.

## 🔧 Configurazione Supabase

### 1. Abilita Email Confirmation

1. Vai al [Supabase Dashboard](https://app.supabase.com)
2. Seleziona il tuo progetto
3. Vai a **Authentication** → **Providers** → **Email**
4. Abilita **"Confirm email"** (Enable email confirmations)
5. Salva le modifiche

### 2. Configura Email Templates (Opzionale)

1. Vai a **Authentication** → **Email Templates**
2. Personalizza il template **"Confirm signup"** se necessario
3. Il link di conferma sarà: `{SITE_URL}/auth/callback?token_hash={TOKEN}&type=signup`

### 3. Configura Site URL

1. Vai a **Authentication** → **URL Configuration**
2. Imposta **Site URL**: `http://localhost:3000` (per sviluppo) o il tuo dominio di produzione
3. Aggiungi **Redirect URLs**: 
   - `http://localhost:3000/auth/callback` (sviluppo)
   - `https://yourdomain.com/auth/callback` (produzione)

### 4. Variabili d'Ambiente

Assicurati di avere nel tuo `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# o per produzione:
# NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 📋 Funzionalità Implementate

### 1. Registrazione
- ✅ Invio automatico email di conferma dopo registrazione
- ✅ Messaggio all'utente che deve confermare l'email
- ✅ Creazione utente in `public.users` anche se email non confermata

### 2. Login
- ✅ Controllo se email è confermata
- ✅ Messaggio di errore chiaro se email non confermata
- ✅ Bottone "Resend confirmation email" quando necessario

### 3. Ri-invio Email
- ✅ Endpoint `/api/resend-confirmation` per ri-inviare email
- ✅ UI integrata nel form di login

### 4. Callback Route
- ✅ Route `/auth/callback` per gestire il click sul link di conferma
- ✅ Redirect automatico alla dashboard dopo conferma

## 🧪 Test

### Test Registrazione
1. Vai a `/login`
2. Crea un nuovo account
3. Dovresti vedere: "Registration successful! Please check your email..."
4. Controlla la tua email (anche spam)
5. Clicca sul link di conferma
6. Dovresti essere reindirizzato alla dashboard

### Test Login con Email Non Confermata
1. Prova a fare login con un account non confermato
2. Dovresti vedere: "Please verify your email address..."
3. Clicca su "Resend confirmation email"
4. Controlla la tua email per il nuovo link

### Test Login con Email Confermata
1. Dopo aver confermato l'email, prova a fare login
2. Dovresti essere reindirizzato alla dashboard senza errori

## ⚠️ Note Importanti

1. **In sviluppo**: Supabase invia email reali anche in modalità sviluppo. Controlla anche la cartella spam.

2. **Rate Limiting**: Supabase limita il numero di email inviate. Non abusare del ri-invio.

3. **Email Provider**: Per produzione, considera di configurare un provider email personalizzato (SendGrid, AWS SES, etc.) in Supabase.

4. **Testing**: Per test rapidi, puoi temporaneamente disabilitare la conferma email in Supabase, ma ricorda di riabilitarla prima della produzione.

## 🔍 Troubleshooting

### Email non arriva
- Controlla la cartella spam
- Verifica che l'email sia valida
- Controlla i log di Supabase per errori
- Verifica che "Confirm email" sia abilitato in Supabase

### Link di conferma non funziona
- Verifica che `NEXT_PUBLIC_SITE_URL` sia configurato correttamente
- Verifica che la redirect URL sia aggiunta in Supabase
- Controlla i log del server per errori

### Utente creato ma non può fare login
- Verifica che l'email sia stata confermata
- Controlla lo stato dell'utente in Supabase Auth
- Usa il bottone "Resend confirmation email"

---

*Documento creato: 2026-01-29*
