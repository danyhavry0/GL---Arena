import nodemailer from "nodemailer";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000";

const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;

if (!emailUser || !emailPassword) {
  // Non blocchiamo l'app se mancano le variabili,
  // ma logghiamo un warning chiaro lato server.
  console.warn(
    "[email] EMAIL_USER or EMAIL_PASSWORD not set. Riot email verification emails cannot be sent."
  );
}

const transporter =
  emailUser && emailPassword
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailUser,
          pass: emailPassword,
        },
      })
    : null;

export async function sendRiotVerificationEmail(
  email: string,
  code: string,
  summonerName: string
) {
  if (!transporter) {
    throw new Error(
      "Email transporter not configured. Set EMAIL_USER and EMAIL_PASSWORD in your environment."
    );
  }

  const mailOptions = {
    from: emailUser,
    to: email,
    subject: `Verifica il tuo account Riot su ${appUrl}`,
    html: `
      <h2>Verifica il tuo account Riot Games</h2>
      <p>Ciao ${summonerName}!</p>
      <p>Hai richiesto la verifica del tuo account Riot Games.</p>
      
      <p>Il tuo codice di verifica è:</p>
      <h1 style="background-color: #0b1120; color: #e5e7eb; padding: 12px; text-align: center; font-family: monospace; letter-spacing: 4px;">
        ${code}
      </h1>
      
      <p>Questo codice scade tra <strong>15 minuti</strong>.</p>
      
      <p>Se non hai richiesto questo codice, ignora questa email.</p>
      
      <hr />
      <p style="color: #6b7280; font-size: 12px;">
        Questo è un messaggio automatico, non rispondere a questa email.
      </p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendRiotWelcomeEmail(
  email: string,
  summonerName: string
) {
  if (!transporter) {
    throw new Error(
      "Email transporter not configured. Set EMAIL_USER and EMAIL_PASSWORD in your environment."
    );
  }

  const mailOptions = {
    from: emailUser,
    to: email,
    subject: `Benvenuto ${summonerName}! Account Riot verificato ✅`,
    html: `
      <h2>Account Riot verificato con successo! ✅</h2>
      <p>Ciao ${summonerName},</p>
      <p>La tua email associata all'account Riot Games è stata verificata con successo.</p>
      <p>Puoi ora accedere a GL-Arena e utilizzare le funzionalità collegate al tuo profilo Riot.</p>
      <a href="${appUrl}/dashboard"
         style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 12px;">
        Vai alla Dashboard
      </a>
    `,
  };

  return transporter.sendMail(mailOptions);
}

