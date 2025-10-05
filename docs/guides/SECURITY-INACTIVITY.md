# 🔐 Sécurité - Vérification OTP après Inactivité

## Vue d'ensemble

Le système K.Kits implémente une mesure de sécurité supplémentaire qui exige une vérification OTP (One-Time Password) lorsqu'un utilisateur tente de se connecter après une période d'inactivité de plus d'un mois.

## Fonctionnement

### Logique de Vérification

1. **Connexion normale** : L'utilisateur saisit son email/téléphone et mot de passe
2. **Vérification d'inactivité** : Le système vérifie la date de dernière connexion (`lastSignInAt`)
3. **Décision automatique** :
   - Si `lastSignInAt` est `null` (première connexion) → OTP requis
   - Si `lastSignInAt` < 30 jours → Connexion directe
   - Si `lastSignInAt` ≥ 30 jours → OTP requis

### Flux Utilisateur

#### Connexion Directe (< 30 jours)
```
Utilisateur → Email/Password → Validation → Dashboard
```

#### Connexion avec OTP (≥ 30 jours)
```
Utilisateur → Email/Password → Validation → OTP par Email → Vérification → Dashboard
```

## Implémentation Technique

### Backend - Route de Connexion

```typescript
// app/api/auth/email/login/route.ts
const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
const requiresOtp = !user.lastSignInAt || user.lastSignInAt < oneMonthAgo;

if (requiresOtp) {
  // Générer et envoyer OTP
  const otp = generateOtp();
  await sendOtpVerificationEmail(email, otp);
  return { requiresOtp: true };
} else {
  // Connexion directe
  await createSession(user);
  return { requiresOtp: false };
}
```

### Frontend - Gestion Conditionnelle

```typescript
// components/auth/login/login-form.tsx
mutateEmail(
  { email: input, password },
  {
    onSuccess: (response) => {
      if (response.requiresOtp) {
        router.push("/login/verification");
      } else {
        router.push("/dashboard");
      }
    },
  }
);
```

## Avantages Sécuritaires

### Protection Contre
- **Comptes compromis** : Limite l'accès même avec mot de passe volé
- **Attaques par force brute** : Ajoute une couche de vérification
- **Accès non autorisé** : Vérification supplémentaire pour comptes inactifs

### Expérience Utilisateur
- **Transparente** : Utilisateurs actifs ne voient pas de friction
- **Informative** : Message explicatif sur la raison de l'OTP
- **Sécurisée** : Protection renforcée sans impact sur l'usage quotidien

## Configuration

### Variables d'Environnement
```env
# Durée de validité OTP (minutes)
OTP_VALIDITY_MINUTES=10

# Configuration email pour OTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Personnalisation
```typescript
// Modifier la période d'inactivité (actuellement 30 jours)
const INACTIVITY_THRESHOLD_DAYS = 30;
const oneMonthAgo = new Date(Date.now() - INACTIVITY_THRESHOLD_DAYS * 24 * 60 * 60 * 1000);
```

## Tests

### Scénarios Couverts
1. **Utilisateur inactif > 30 jours** → OTP requis
2. **Utilisateur actif < 30 jours** → Connexion directe
3. **Première connexion** → OTP requis
4. **Vérification OTP** → Mise à jour `lastSignInAt`

### Exécution des Tests
```bash
npm test auth-inactivity.test.ts
```

## Monitoring

### Métriques à Surveiller
- Taux d'utilisation OTP vs connexion directe
- Temps de réponse des emails OTP
- Échecs de vérification OTP
- Tentatives de connexion après inactivité

### Logs d'Audit
Tous les événements sont enregistrés dans `AuditLog` :
- Connexions avec/sans OTP
- Échecs de vérification
- Mise à jour des `lastSignInAt`

## Maintenance

### Nettoyage Automatique
- Les tokens OTP expirent automatiquement après 10 minutes
- Les sessions inactives sont nettoyées périodiquement
- L'historique des tentatives de connexion est archivé

### Surveillance
- Alertes sur échecs répétés d'OTP
- Monitoring des temps de livraison email
- Suivi des patterns d'inactivité utilisateur

## Évolutions Futures

### Améliorations Possibles
- **OTP par SMS** : Alternative à l'email
- **Période configurable** : Par organisation ou utilisateur
- **Authentification biométrique** : Pour appareils compatibles
- **Notifications proactives** : Alertes avant expiration de session

### Intégrations
- **2FA obligatoire** : Pour comptes sensibles
- **SSO Enterprise** : Intégration avec systèmes d'entreprise
- **Audit avancé** : Rapports détaillés de sécurité