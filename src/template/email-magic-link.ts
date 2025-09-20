export function emailMagicLinkTemplate(magicLink: string) {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion sécurisée K.Kits</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%); padding: 20px; }
        .container { max-width: 550px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.15); }
        .header { background: linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%); padding: 45px 35px; text-align: center; color: white; }
        .logo { width: 70px; height: 70px; margin: 0 auto 25px; }
        .logo img { width: 100%; height: 100%; object-fit: contain; }
        .header h1 { font-size: 28px; font-weight: 800; margin-bottom: 12px; }
        .header p { font-size: 16px; opacity: 0.95; }
        .content { padding: 45px 35px; }
        .message { font-size: 18px; color: #374151; line-height: 1.7; margin-bottom: 35px; text-align: center; }
        .link-container { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; padding: 35px; text-align: center; margin: 35px 0; border: 2px solid #e2e8f0; }
        .btn { display: inline-block; background: linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%); color: white; padding: 18px 40px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 18px; transition: all 0.3s ease; box-shadow: 0 10px 25px rgba(168, 85, 247, 0.3); }
        .btn:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(168, 85, 247, 0.4); }
        .btn::before { content: '🔐 '; }
        .security-features { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin: 35px 0; }
        .security-feature { background: #f0f9ff; border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #bae6fd; }
        .security-feature-icon { font-size: 24px; margin-bottom: 10px; }
        .security-feature h3 { color: #0369a1; font-size: 14px; font-weight: 600; margin-bottom: 5px; }
        .security-feature p { color: #0c4a6e; font-size: 12px; }
        .expiry-notice { background: #fef3c7; border: 1px solid #fbbf24; border-radius: 12px; padding: 20px; margin: 30px 0; text-align: center; }
        .expiry-notice h3 { color: #92400e; font-size: 16px; margin-bottom: 8px; }
        .expiry-notice p { color: #92400e; font-size: 14px; }
        .footer { background: #f9fafb; padding: 30px 35px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer p { color: #6b7280; font-size: 13px; line-height: 1.6; margin-bottom: 8px; }
        .brand { color: #a855f7; font-weight: 700; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <img src="https://res.cloudinary.com/dro8zox5w/image/upload/v1758298431/logo_qteksg.png" alt="K.Kits Logo">
            </div>
            <h1>Connexion Magic Link</h1>
            <p>Accès sécurisé à votre compte</p>
        </div>
        
        <div class="content">
            <div class="message">
                <p>Cliquez sur le bouton ci-dessous pour vous connecter instantanément à votre compte K.Kits de manière sécurisée, sans mot de passe.</p>
            </div>
            
            <div class="link-container">
                <a href="${magicLink}" class="btn">Se connecter maintenant</a>
                <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
                    Connexion sécurisée en un clic
                </p>
            </div>
            
            <div class="security-features">
                <div class="security-feature">
                    <div class="security-feature-icon">🔒</div>
                    <h3>Sécurisé</h3>
                    <p>Chiffrement de bout en bout</p>
                </div>
                <div class="security-feature">
                    <div class="security-feature-icon">⚡</div>
                    <h3>Instantané</h3>
                    <p>Connexion en un clic</p>
                </div>
                <div class="security-feature">
                    <div class="security-feature-icon">🛡️</div>
                    <h3>Protégé</h3>
                    <p>Lien à usage unique</p>
                </div>
            </div>
            
            <div class="expiry-notice">
                <h3>⏰ Lien temporaire</h3>
                <p>Ce lien de connexion est valide pendant <strong>1 heure</strong> pour votre sécurité. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
            </div>
        </div>
        
        <div class="footer">
            <p>Cet email a été envoyé par <span class="brand">K.Kits</span></p>
            <p>© 2025 K.Kits. Plateforme SaaS de Gestion d'Inventaire</p>
        </div>
    </div>
</body>
</html>
  `;
}