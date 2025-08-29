export function emailMagicLinkTemplate(magicLink: string) {
  return `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
      <h2>Connexion par Magic Link</h2>
      <p>Cliquez sur le lien ci-dessous pour vous connecter à votre compte :</p>
      <p><a href="${magicLink}" style="color: #1a73e8; text-decoration: none;">Se connecter</a></p>
      <p>Ce lien est valide pendant 1 heure. Si vous n’êtes pas à l’origine de cette demande, ignorez cet email.</p>
      <br/>
      <p>Merci,</p>
      <p>L’équipe de votre application</p>
    </div>
  `;
}
