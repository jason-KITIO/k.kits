# 📦 K.Kits - Plateforme SaaS de Gestion d'Inventaire

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/Jason-Kitio/k.kits)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.14.0-2D3748.svg)](https://www.prisma.io/)

> **K.Kits** est une plateforme SaaS complète de gestion d'inventaire et de stock, conçue pour les PME et grandes organisations. Elle offre une solution multi-tenant avec gestion avancée des rôles, suivi en temps réel des stocks, et analytics détaillés.

## 🌟 Fonctionnalités Principales

### 🏢 **Multi-Tenant & Organisation**
- **Architecture multi-tenant** : Isolation complète des données par organisation
- **Gestion des membres** : Invitations, rôles et permissions granulaires
- **Multi-sites** : Support des boutiques multiples et entrepôts
- **Tableau de bord personnalisé** par organisation

### 🔐 **Authentification & Sécurité**
- **Authentification double** : Email et téléphone (SMS via Twilio)
- **2FA (Two-Factor Authentication)** : Sécurité renforcée
- **Gestion des sessions** : Tokens sécurisés avec refresh
- **Audit trail complet** : Traçabilité de toutes les actions
- **Permissions granulaires** : 25+ permissions spécialisées

### 📦 **Gestion de Stock Avancée**
- **Suivi temps réel** : Stocks par localisation (boutiques/entrepôts)
- **Alertes intelligentes** : Notifications automatiques de stock bas
- **Transferts de stock** : Mouvements entre localisations avec traçabilité
- **Inventaires** : Ajustements et comptages physiques
- **Historique complet** : Tous les mouvements avec métadonnées

### 🛍️ **Ventes & Achats**
- **Point de vente** : Système de vente multi-boutiques
- **Gestion clients** : Base clients avec historique d'achats
- **Commandes fournisseurs** : Approvisionnement automatisé
- **Rapports de vente** : Analytics détaillés par période/boutique

### 📊 **Analytics & Rapports**
- **Dashboard en temps réel** : Métriques clés et KPIs
- **Rapports personnalisés** : Ventes, stocks, mouvements
- **Alertes prédictives** : Prévisions de rupture de stock
- **Export de données** : CSV, PDF, Excel

## 🛠️ Stack Technique

### **Frontend**
- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique strict
- **Tailwind CSS 4** - Styling moderne et responsive
- **Radix UI** - Composants accessibles et personnalisables
- **TanStack Query** - Gestion d'état et cache côté client
- **React Hook Form** - Gestion des formulaires avec validation Zod

### **Backend**
- **Next.js API Routes** - API REST complète
- **Prisma ORM** - Accès base de données type-safe
- **PostgreSQL** - Base de données relationnelle
- **Redis (Upstash)** - Cache et sessions
- **JWT** - Authentification stateless

### **Services Externes**
- **Twilio** - SMS et vérification téléphone
- **Nodemailer** - Envoi d'emails transactionnels
- **OpenAPI/Swagger** - Documentation API automatique

### **DevOps & Qualité**
- **Jest** - Tests unitaires
- **ESLint** - Linting et qualité de code
- **Prettier** - Formatage automatique
- **TypeScript strict** - Sécurité de type maximale

## 📁 Architecture du Projet

```
k.kits/
├── 📁 app/                          # Frontend Next.js (App Router)
│   ├── 📁 (auth)/                   # Routes d'authentification
│   │   ├── login/                   # Connexion email/téléphone
│   │   └── register/                # Inscription avec invitations
│   ├── 📁 api/                      # API REST Backend
│   │   ├── auth/                    # Endpoints authentification
│   │   │   ├── email/               # Auth par email + magic links
│   │   │   ├── phone/               # Auth par SMS + OTP
│   │   │   └── session/             # Gestion des sessions
│   │   ├── invitations/             # Système d'invitations
│   │   └── organization/            # API métier par organisation
│   │       └── [organizationId]/    # Routes isolées par tenant
│   │           ├── dashboard/       # Métriques et KPIs
│   │           ├── products/        # Catalogue produits
│   │           ├── stock-transfers/ # Transferts de stock
│   │           ├── sales/           # Gestion des ventes
│   │           ├── warehouses/      # Entrepôts et stocks
│   │           ├── stores/          # Boutiques et points de vente
│   │           ├── users/           # Gestion des membres
│   │           ├── roles/           # Rôles et permissions
│   │           ├── notifications/   # Système de notifications
│   │           └── reports/         # Rapports et analytics
│   ├── 📁 dashboard/                # Dashboard principal
│   ├── 📁 preferences/              # Interface de gestion
│   │   └── organizations/           # Gestion des organisations
│   │       └── [id]/                # Pages par organisation
│   │           ├── dashboard/       # Tableau de bord org
│   │           ├── stores/          # Gestion des boutiques
│   │           ├── users/           # Gestion des membres
│   │           ├── sales/           # Interface de vente
│   │           ├── stock-alerts/    # Alertes de stock
│   │           └── reports/         # Rapports détaillés
│   ├── 📁 api-docs/                 # Documentation Swagger
│   ├── 📁 support/                  # Pages de support
│   ├── 📁 legal/                    # Mentions légales
│   └── 📁 feedback/                 # Système de feedback
├── 📁 src/                          # Code source partagé
│   ├── 📁 components/               # Composants React réutilisables
│   │   ├── ui/                      # Composants UI de base (Radix)
│   │   ├── auth/                    # Composants d'authentification
│   │   ├── landing/                 # Page d'accueil marketing
│   │   ├── preferences/             # Interfaces de gestion
│   │   ├── roles/                   # Gestion des rôles
│   │   └── invitations/             # Système d'invitations
│   ├── 📁 hooks/                    # Hooks React personnalisés
│   │   ├── useAuth.ts               # Authentification
│   │   ├── useOrganization.ts       # Gestion des organisations
│   │   └── usePermissions.ts        # Vérification des permissions
│   ├── 📁 services/                 # Couche d'accès aux données
│   │   ├── auth-service.ts          # Service d'authentification
│   │   ├── organization-service.ts  # API organisation
│   │   ├── user-service.ts          # Gestion des utilisateurs
│   │   └── storeService.ts          # Gestion des boutiques
│   ├── 📁 schema/                   # Schémas de validation Zod
│   │   ├── auth-schema.ts           # Validation auth
│   │   ├── organization-schema.ts   # Validation organisations
│   │   ├── product.schema.ts        # Validation produits
│   │   ├── stock-transfer.schema.ts # Validation transferts
│   │   └── [15+ autres schémas]     # Validation métier
│   ├── 📁 lib/                      # Utilitaires et configuration
│   │   ├── db.ts                    # Configuration Prisma
│   │   ├── redis.ts                 # Configuration Redis
│   │   ├── email.ts                 # Service email
│   │   ├── sms.ts                   # Service SMS (Twilio)
│   │   ├── permissions.ts           # Système de permissions
│   │   └── swagger.ts               # Configuration OpenAPI
│   ├── 📁 types/                    # Types TypeScript
│   ├── 📁 providers/                # Providers React (Query, Theme)
│   ├── 📁 helper/                   # Fonctions utilitaires
│   ├── 📁 template/                 # Templates email/SMS
│   └── 📁 styles/                   # Styles et animations CSS
├── 📁 prisma/                       # Base de données
│   ├── schema.prisma                # Schéma de base de données (20+ modèles)
│   └── migrations/                  # Migrations versionnées
├── 📁 public/                       # Assets statiques
├── 📁 __tests__/                    # Tests unitaires Jest
├── 📄 middleware.ts                 # Middleware Next.js (auth, routing)
├── 📄 openapi.json                  # Documentation API OpenAPI
└── 📄 package.json                  # Dépendances et scripts
```

## 🗄️ Modèle de Données

### **Entités Principales**

#### **👤 Utilisateurs & Authentification**
- `User` - Utilisateurs du système avec auth complète
- `UserSession` - Sessions actives avec métadonnées
- `TwoFactorAuth` - Configuration 2FA par utilisateur
- `LoginAttempt` - Historique des tentatives de connexion

#### **🏢 Multi-Tenant & Organisations**
- `Organization` - Entreprises clientes (tenants)
- `OrganizationMember` - Appartenance utilisateur ↔ organisation
- `Invitation` - Invitations d'équipe avec tokens sécurisés

#### **🔑 Rôles & Permissions**
- `Role` - Rôles métier (Propriétaire, Gestionnaire, Vendeur, Magasinier)
- `Permission` - Permissions granulaires (25+ permissions)
- `UserRole` - Attribution rôles par organisation/boutique
- `RolePermission` - Permissions accordées par rôle

#### **📦 Catalogue & Inventaire**
- `Product` - Catalogue produits avec SKU unique
- `Category` - Catégories hiérarchiques (arbre)
- `Supplier` - Fournisseurs et partenaires
- `Stock` - État des stocks par localisation
- `StockMovement` - Historique complet des mouvements

#### **🏪 Infrastructure**
- `Store` - Boutiques/points de vente
- `Warehouse` - Entrepôts de stockage
- `Customer` - Base clients

#### **💰 Transactions**
- `Sale` - Ventes par boutique
- `SaleItem` - Lignes de détail des ventes
- `PurchaseOrder` - Commandes fournisseurs
- `PurchaseOrderItem` - Lignes de commandes

#### **🔔 Système**
- `Notification` - Alertes et notifications
- `AuditLog` - Journal d'audit complet

## 🚀 Installation & Démarrage

### **Prérequis**
- Node.js 18+ 
- PostgreSQL 14+
- Redis (optionnel, Upstash recommandé)
- Compte Twilio (pour SMS)

### **Installation**

```bash
# Cloner le repository
git clone https://github.com/Jason-Kitio/k.kits.git
cd k.kits

# Installer les dépendances
pnpm install

# Configuration de l'environnement
cp .env.example .env
# Éditer .env avec vos configurations
```

### **Configuration (.env)**

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/k_kits"

# Redis (Cache & Sessions)
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Email (Nodemailer)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# SMS (Twilio)
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
TWILIO_PHONE_NUMBER="+1234567890"

# App
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

### **Base de données**

```bash
# Générer le client Prisma
pnpm prisma generate

# Appliquer les migrations
pnpm prisma migrate deploy

# (Optionnel) Seed des données de test
pnpm prisma db seed
```

### **Démarrage**

```bash
# Mode développement
pnpm dev

# Build production
pnpm build
pnpm start

# Tests
pnpm test

# Linting
pnpm lint
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📋 Scripts Disponibles

```bash
pnpm dev          # Serveur de développement (Turbopack)
pnpm build        # Build de production
pnpm start        # Serveur de production
pnpm lint         # Vérification ESLint
pnpm test         # Tests Jest
pnpm prisma:studio # Interface Prisma Studio
pnpm prisma:reset  # Reset complet de la DB
```

## 🔐 Système de Permissions

### **Rôles Prédéfinis**

| Rôle | Description | Permissions Clés |
|------|-------------|------------------|
| **Propriétaire** | Accès complet à l'organisation | Toutes les permissions |
| **Gestionnaire** | Gestion opérationnelle | Produits, stocks, rapports, équipe |
| **Vendeur** | Point de vente | Ventes, clients, consultation stocks |
| **Magasinier** | Gestion des stocks | Stocks, transferts, inventaires |

### **Permissions Granulaires**

```typescript
// Exemples de permissions
PRODUCT_CREATE, PRODUCT_READ, PRODUCT_UPDATE, PRODUCT_DELETE
STOCK_READ, STOCK_ADJUST, STOCK_TRANSFER, STOCK_INVENTORY
SALE_CREATE, SALE_READ, SALE_UPDATE, SALE_REFUND
USER_INVITE, USER_MANAGE, USER_ROLES
DASHBOARD_READ, REPORT_READ, ORG_SETTINGS
```

## 📊 API Documentation

### **OpenAPI/Swagger**
- Documentation complète : `/api-docs`
- Schéma OpenAPI : `/openapi.json`
- Tests interactifs disponibles

### **Endpoints Principaux**

```
POST /api/auth/email/login          # Connexion par email
POST /api/auth/phone/verify         # Vérification SMS
GET  /api/organization/{id}/dashboard # Métriques organisation
POST /api/organization/{id}/products  # Créer un produit
GET  /api/organization/{id}/stocks    # État des stocks
POST /api/organization/{id}/stock-transfers # Transfert de stock
GET  /api/organization/{id}/sales     # Historique des ventes
POST /api/organization/{id}/invitations/send # Inviter un membre
```

## 🧪 Tests

```bash
# Lancer tous les tests
pnpm test

# Tests en mode watch
pnpm test:watch

# Coverage
pnpm test:coverage
```

## 🚀 Déploiement

### **Docker (Recommandé)**

#### Démarrage rapide avec Docker Compose
```bash
# Copier la configuration
copy .env.docker .env

# Lancer tous les services (app + PostgreSQL + Redis)
docker-compose up -d

# Voir les logs
docker-compose logs -f app
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

#### Développement local avec Docker
```bash
# Lancer uniquement PostgreSQL et Redis
docker-compose -f docker-compose.dev.yml up -d

# Puis lancer l'app en local
pnpm dev
```

#### Build manuel de l'image
```bash
# Build de l'image
docker build -t k-kits:latest .

# Lancement du conteneur
docker run -p 3000:3000 --env-file .env k-kits:latest
```

📚 **Documentation complète** : Voir [docs/docker/](docs/docker/) pour plus de détails

### **Vercel**
```bash
# Déploiement automatique via Git
vercel --prod
```

### **Variables d'environnement de production**
- Configurer toutes les variables `.env` sur votre plateforme
- Utiliser des services managés (Supabase, PlanetScale, Upstash)
- Configurer les domaines personnalisés

## 🤝 Contribution

1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/amazing-feature`)
3. **Commit** vos changements (`git commit -m 'Add amazing feature'`)
4. **Push** vers la branche (`git push origin feature/amazing-feature`)
5. **Ouvrir** une Pull Request

### **Standards de Code**
- TypeScript strict activé
- ESLint + Prettier configurés
- Tests requis pour les nouvelles fonctionnalités
- Documentation des API avec OpenAPI

## 📈 Roadmap

### **Version 0.2.0**
- [ ] Module de facturation intégré
- [ ] Intégrations e-commerce (Shopify, WooCommerce)
- [ ] Application mobile (React Native)
- [ ] Analytics avancés avec graphiques

### **Version 0.3.0**
- [ ] IA pour prédictions de stock
- [ ] Intégrations comptables (Sage, QuickBooks)
- [ ] Multi-devises et multi-langues
- [ ] API webhooks

## 📚 Documentation

- **[Documentation Complète](docs/)** - Tous les guides et documentations
- **[Docker](docs/docker/)** - Conteneurisation et déploiement
- **[Guides](docs/guides/)** - Guides d'utilisation
- **[Features](docs/features/)** - Implémentations techniques

## 📞 Support & Contact

- **Issues** : [GitHub Issues](https://github.com/Jason-Kitio/k.kits/issues)
- **Discussions** : [GitHub Discussions](https://github.com/Jason-Kitio/k.kits/discussions)
- **Email** : support@k-kits.com

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

<div align="center">

**Fait avec ❤️ par [Jason Kitio](https://github.com/Jason-Kitio)**

⭐ **N'hésitez pas à donner une étoile si ce projet vous plaît !**

</div>