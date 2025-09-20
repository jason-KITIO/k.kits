import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function loadTemplate(
  templateName: string,
  data: Record<string, string>
): Promise<string> {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "template",
    `${templateName}.html`
  );
  let template = await fs.readFile(templatePath, "utf-8");

  for (const key in data) {
    const value = data[key];
    template = template.replaceAll(`{{${key}}}`, value);
  }
  return template;
}

export async function sendMagicLinkEmail(email: string, magicLink: string) {
  const mailOptions = {
    from: `"K.Kits" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "K.Kits - Votre lien de connexion sécurisé",
    html: magicLink,
  };
  return transporter.sendMail(mailOptions);
}

export async function sendWelcomeEmail(email: string, firstName: string) {
  try {
    const html = await loadTemplate("welcome-email", { firstName });
    await transporter.sendMail({
      from: `"K.Kits" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Bienvenue sur K.Kits - Votre plateforme de gestion d'inventaire",
      html,
    });
  } catch (error) {
    console.error("Erreur envoi email de bienvenue :", error);
    throw error;
  }
}

// Nouvelle fonction pour envoyer l’OTP de vérification
export async function sendOtpVerificationEmail(email: string, otp: string) {
  try {
    // Chargez le template otp-verification.html en passant l’otp
    const html = await loadTemplate("otp-verification", { otp });

    await transporter.sendMail({
      from: `"K.Kits" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "K.Kits - Votre code de vérification OTP",
      html,
    });

    // console.log(`Email OTP envoyé à ${email} avec le code ${otp}`);
  } catch (error) {
    console.error("Erreur envoi email OTP:", error);
    throw error;
  }
}

export async function sendInvitationEmail(
  email: string,
  {
    role,
    organizationName,
    invitationLink,
  }: {
    role: string;
    organizationName: string;
    invitationLink: string;
  }
) {
  try {
    // Charger le template HTML une fois avant l'envoi
    const templatePath = path.join(
      process.cwd(),
      "src",
      "template",
      "invitation.html"
    );
    let html = await fs.readFile(templatePath, "utf-8");

    // Remplacer les variables dynamiques dans le template
    html = html
      .replace(/{{invitationLink}}/g, invitationLink)
      .replace(/{{role}}/g, role)
      .replace(/{{organizationName}}/g, organizationName);

    // Envoyer l'email
    await transporter.sendMail({
      from: `"K.Kits" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "K.Kits - Invitation à rejoindre une organisation",
      html,
    });

    // console.log(`Email d'invitation envoyé à ${email}`);
  } catch (error) {
    console.error("Erreur envoi email invitation:", error);
    throw error;
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetLink: string
) {
  try {
    const html = await loadTemplate("password-reset", { resetLink });
    await transporter.sendMail({
      from: `"K.Kits" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "K.Kits - Réinitialisation de votre mot de passe",
      html,
    });
  } catch (error) {
    console.error("Erreur envoi email réinitialisation:", error);
    throw error;
  }
}
