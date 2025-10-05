# 🐳 Guide de Conteneurisation K.Kits - Étapes Complètes

## ✅ Fichiers Créés

Voici tous les fichiers créés pour la conteneurisation :

1. **Dockerfile** - Image Docker multi-stage optimisée
2. **docker-compose.yml** - Orchestration complète (app + PostgreSQL + Redis)
3. **docker-compose.dev.yml** - Services de développement (DB + Redis uniquement)
4. **docker-entrypoint.sh** - Script d'initialisation avec migrations Prisma
5. **.dockerignore** - Exclusion des fichiers inutiles
6. **.env.docker** - Template de configuration Docker
7. **DOCKER.md** - Documentation complète Docker
8. **next.config.ts** - Modifié pour activer le mode `standalone`

## 🚀 Étapes de Démarrage

### Option 1 : Déploiement Complet (Production-like)

```bash
# 1. Copier la configuration
copy .env.docker .env

# 2. Éditer .env avec vos vraies configurations (Twilio, SMTP)
notepad .env

# 3. Lancer tous les services
docker-compose up -d

# 4. Vérifier que tout fonctionne
docker-compose ps
docker-compose logs -f app

# 5. Accéder à l'application
# http://localhost:3000
```

### Option 2 : Développement Local avec Docker

```bash
# 1. Lancer uniquement PostgreSQL et Redis
docker-compose -f docker-compose.dev.yml up -d

# 2. Configurer .env pour pointer vers les services Docker
# DATABASE_URL=postgresql://k_kits_user:k_kits_password@localhost:5432/k_kits_db
# REDIS_URL=redis://localhost:6379

# 3. Installer les dépendances
pnpm install

# 4. Générer Prisma Client
pnpm prisma generate

# 5. Appliquer les migrations
pnpm prisma migrate deploy

# 6. Lancer l'app en mode dev
pnpm dev
```

## 📦 Architecture Docker

```
┌─────────────────────────────────────────┐
│         K.Kits Application              │
│         (Port 3000)                     │
│  - Next.js 15                           │
│  - Prisma Client                        │
│  - API Routes                           │
└─────────────┬───────────────────────────┘
              │
              ├──────────────┐
              │              │
    ┌─────────▼────────┐   ┌─▼──────────┐
    │   PostgreSQL     │   │   Redis    │
    │   (Port 5432)    │   │ (Port 6379)│
    │  - Base données  │   │  - Cache   │
    │  - Persistance   │   │  - Sessions│
    └──────────────────┘   └────────────┘
```

## 🔧 Commandes Essentielles

### Gestion des conteneurs

```bash
# Démarrer
docker-compose up -d

# Arrêter
docker-compose down

# Redémarrer
docker-compose restart

# Voir les logs
docker-compose logs -f

# Voir l'état
docker-compose ps
```

### Base de données

```bash
# Migrations Prisma
docker-compose exec app npx prisma migrate deploy

# Prisma Studio
docker-compose exec app npx prisma studio

# Accéder à PostgreSQL
docker-compose exec postgres psql -U k_kits_user -d k_kits_db

# Backup
docker-compose exec postgres pg_dump -U k_kits_user k_kits_db > backup.sql
```

### Rebuild

```bash
# Rebuild l'image
docker-compose build --no-cache app

# Rebuild et redémarrer
docker-compose up -d --build
```

## 🔍 Vérifications

### 1. Vérifier que les services sont actifs

```bash
docker-compose ps
```

Vous devriez voir :
- ✅ k-kits-app (healthy)
- ✅ k-kits-postgres (healthy)
- ✅ k-kits-redis (healthy)

### 2. Vérifier les logs

```bash
# Logs de l'application
docker-compose logs app

# Rechercher des erreurs
docker-compose logs app | findstr "error"
```

### 3. Tester la connexion

```bash
# Tester PostgreSQL
docker-compose exec postgres pg_isready -U k_kits_user

# Tester Redis
docker-compose exec redis redis-cli ping
```

### 4. Accéder à l'application

Ouvrir le navigateur : http://localhost:3000

## ⚠️ Problèmes Courants

### Erreur : Port déjà utilisé

```bash
# Vérifier les ports utilisés
netstat -ano | findstr :3000
netstat -ano | findstr :5432
netstat -ano | findstr :6379

# Changer les ports dans docker-compose.yml
ports:
  - "8080:3000"  # Au lieu de 3000:3000
```

### Erreur : Migrations Prisma

```bash
# Forcer les migrations
docker-compose exec app npx prisma migrate deploy

# Reset complet (⚠️ supprime les données)
docker-compose exec app npx prisma migrate reset
```

### Erreur : Permissions

```bash
# Sur Windows, exécuter PowerShell en admin
# Puis relancer Docker Desktop
```

### Nettoyer complètement

```bash
# Tout supprimer (conteneurs + volumes + images)
docker-compose down -v --rmi all
docker system prune -a --volumes
```

## 📊 Monitoring

### Ressources utilisées

```bash
# Statistiques en temps réel
docker stats

# Espace disque
docker system df
```

### Logs en continu

```bash
# Tous les services
docker-compose logs -f

# Service spécifique
docker-compose logs -f app
```

## 🚢 Déploiement en Production

### 1. Préparer l'environnement

```bash
# Créer .env.production avec les vraies valeurs
JWT_SECRET=<générer-un-secret-fort>
NEXTAUTH_SECRET=<générer-un-secret-fort>
DATABASE_URL=<url-base-production>
REDIS_URL=<url-redis-production>
```

### 2. Build de l'image

```bash
# Build
docker build -t k-kits:v1.0.0 .

# Tag pour registry
docker tag k-kits:v1.0.0 your-registry.com/k-kits:v1.0.0

# Push
docker push your-registry.com/k-kits:v1.0.0
```

### 3. Déployer

```bash
# Sur le serveur de production
docker pull your-registry.com/k-kits:v1.0.0
docker-compose -f docker-compose.prod.yml up -d
```

## 📚 Ressources

- **Documentation complète** : [DOCKER.md](DOCKER.md)
- **README principal** : [README.md](README.md)
- **Docker Docs** : https://docs.docker.com/
- **Prisma + Docker** : https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-docker

## ✅ Checklist de Déploiement

- [ ] Fichiers Docker créés
- [ ] Configuration .env complétée
- [ ] Services Docker démarrés
- [ ] Migrations Prisma appliquées
- [ ] Application accessible sur http://localhost:3000
- [ ] Tests de connexion DB et Redis réussis
- [ ] Logs vérifiés (pas d'erreurs)

---

**Besoin d'aide ?** Consultez [DOCKER.md](DOCKER.md) ou ouvrez une issue sur GitHub.
