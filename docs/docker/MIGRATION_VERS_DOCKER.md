# 🔄 Migration vers Docker - K.Kits

## 📋 Guide de Migration

Si vous avez déjà K.Kits installé en local et souhaitez migrer vers Docker.

---

## ⚠️ Avant de Commencer

### Sauvegarder vos Données

```bash
# 1. Backup de la base de données PostgreSQL locale
pg_dump -U votre_user k_kits > backup_avant_docker.sql

# 2. Sauvegarder votre fichier .env
copy .env .env.backup
```

---

## 🚀 Étapes de Migration

### 1. Arrêter les Services Locaux

```bash
# Arrêter PostgreSQL local (Windows)
net stop postgresql-x64-14

# Arrêter Redis local (si installé)
redis-cli shutdown

# Arrêter l'application Next.js
# Ctrl+C dans le terminal où tourne `pnpm dev`
```

### 2. Configurer Docker

```bash
# Copier le template Docker
copy .env.docker .env.docker.new

# Fusionner avec votre ancien .env
# Garder vos configurations Twilio, SMTP, etc.
```

**Exemple de fusion** :

```env
# Nouvelles URLs Docker (à utiliser)
DATABASE_URL=postgresql://k_kits_user:k_kits_password@localhost:5432/k_kits_db
REDIS_URL=redis://localhost:6379

# Garder vos anciennes configurations
TWILIO_ACCOUNT_SID=votre_ancien_sid
TWILIO_AUTH_TOKEN=votre_ancien_token
SMTP_USER=votre_ancien_email
SMTP_PASS=votre_ancien_password
```

### 3. Restaurer les Données dans Docker

```bash
# 1. Démarrer les services Docker
docker-compose up -d

# 2. Attendre que PostgreSQL soit prêt
docker-compose exec postgres pg_isready -U k_kits_user

# 3. Restaurer le backup
docker-compose exec -T postgres psql -U k_kits_user k_kits_db < backup_avant_docker.sql

# 4. Vérifier les données
docker-compose exec postgres psql -U k_kits_user k_kits_db -c "\dt"
```

### 4. Vérifier la Migration

```bash
# 1. Vérifier les services
docker-compose ps

# 2. Vérifier les logs
docker-compose logs app

# 3. Tester l'application
start http://localhost:3000

# 4. Tester la connexion
curl http://localhost:3000/api/health
```

---

## 🔄 Scénarios de Migration

### Scénario A : Migration Complète

**Vous voulez tout migrer vers Docker (recommandé)**

```bash
# 1. Backup
pg_dump -U votre_user k_kits > backup.sql

# 2. Arrêter services locaux
net stop postgresql-x64-14

# 3. Démarrer Docker
docker-compose up -d

# 4. Restaurer
docker-compose exec -T postgres psql -U k_kits_user k_kits_db < backup.sql

# 5. Tester
start http://localhost:3000
```

### Scénario B : Migration Progressive

**Vous voulez garder PostgreSQL local mais utiliser Docker pour l'app**

```bash
# 1. Modifier docker-compose.yml
# Commenter la section postgres:

# 2. Modifier .env
DATABASE_URL=postgresql://votre_user:votre_pass@host.docker.internal:5432/k_kits

# 3. Démarrer uniquement l'app
docker-compose up -d app redis
```

### Scénario C : Développement Hybride

**Vous voulez développer en local mais utiliser Docker pour DB/Redis**

```bash
# 1. Démarrer uniquement les services
docker-compose -f docker-compose.dev.yml up -d

# 2. Configurer .env pour pointer vers Docker
DATABASE_URL=postgresql://k_kits_user:k_kits_password@localhost:5432/k_kits_db
REDIS_URL=redis://localhost:6379

# 3. Développer normalement
pnpm dev
```

---

## 🔍 Vérifications Post-Migration

### Checklist Complète

- [ ] **Services Docker actifs**
  ```bash
  docker-compose ps
  # Tous les services doivent être "Up" et "healthy"
  ```

- [ ] **Base de données accessible**
  ```bash
  docker-compose exec postgres psql -U k_kits_user k_kits_db -c "SELECT COUNT(*) FROM \"User\";"
  ```

- [ ] **Redis fonctionne**
  ```bash
  docker-compose exec redis redis-cli ping
  # Doit retourner "PONG"
  ```

- [ ] **Application démarre**
  ```bash
  docker-compose logs app | findstr "ready"
  ```

- [ ] **Health check OK**
  ```bash
  curl http://localhost:3000/api/health
  # Doit retourner {"status":"healthy"}
  ```

- [ ] **Connexion fonctionne**
  - Ouvrir http://localhost:3000
  - Tester la connexion avec un compte existant

- [ ] **Données présentes**
  - Vérifier que vos organisations sont là
  - Vérifier que vos produits sont là
  - Vérifier que vos utilisateurs sont là

---

## ⚠️ Problèmes Courants

### Problème 1 : Conflit de Ports

**Erreur** : `Port 5432 is already allocated`

**Solution** :
```bash
# Option A : Arrêter PostgreSQL local
net stop postgresql-x64-14

# Option B : Changer le port Docker
# Dans docker-compose.yml, changer:
ports:
  - "5433:5432"  # Au lieu de 5432:5432

# Puis dans .env:
DATABASE_URL=postgresql://k_kits_user:k_kits_password@localhost:5433/k_kits_db
```

### Problème 2 : Données Non Restaurées

**Erreur** : Tables vides après restauration

**Solution** :
```bash
# 1. Vérifier le backup
head -n 20 backup.sql

# 2. Restaurer avec verbose
docker-compose exec -T postgres psql -U k_kits_user k_kits_db -v ON_ERROR_STOP=1 < backup.sql

# 3. Vérifier les tables
docker-compose exec postgres psql -U k_kits_user k_kits_db -c "\dt"
```

### Problème 3 : Migrations Prisma

**Erreur** : `Migration failed`

**Solution** :
```bash
# 1. Vérifier l'état des migrations
docker-compose exec app npx prisma migrate status

# 2. Appliquer les migrations manquantes
docker-compose exec app npx prisma migrate deploy

# 3. Si nécessaire, reset (⚠️ supprime les données)
docker-compose exec app npx prisma migrate reset
```

### Problème 4 : Variables d'Environnement

**Erreur** : `JWT_SECRET is not defined`

**Solution** :
```bash
# 1. Vérifier les variables dans le conteneur
docker-compose exec app env | findstr JWT

# 2. Redémarrer avec les nouvelles variables
docker-compose down
docker-compose up -d

# 3. Vérifier les logs
docker-compose logs app
```

---

## 🔙 Rollback (Retour en Arrière)

Si la migration ne fonctionne pas et vous voulez revenir en arrière :

```bash
# 1. Arrêter Docker
docker-compose down

# 2. Restaurer l'ancien .env
copy .env.backup .env

# 3. Redémarrer PostgreSQL local
net start postgresql-x64-14

# 4. Restaurer le backup dans PostgreSQL local
psql -U votre_user k_kits < backup_avant_docker.sql

# 5. Redémarrer l'app en local
pnpm dev
```

---

## 📊 Comparaison Avant/Après

### Avant Docker

```
┌─────────────────────────────────────┐
│  Développement Local                │
│                                     │
│  - PostgreSQL installé localement   │
│  - Redis installé localement        │
│  - Next.js en mode dev (pnpm dev)   │
│  - Configuration manuelle           │
│  - Dépendances système              │
└─────────────────────────────────────┘
```

### Après Docker

```
┌─────────────────────────────────────┐
│  Développement Conteneurisé         │
│                                     │
│  - PostgreSQL dans Docker           │
│  - Redis dans Docker                │
│  - Next.js dans Docker (optionnel)  │
│  - Configuration automatique        │
│  - Isolation complète               │
│  - Portable et reproductible        │
└─────────────────────────────────────┘
```

---

## ✅ Avantages de la Migration

### Avant
- ❌ Installation complexe de PostgreSQL
- ❌ Configuration manuelle de Redis
- ❌ Conflits de versions
- ❌ Difficile à partager avec l'équipe
- ❌ Environnement différent en production

### Après
- ✅ Installation en 1 commande
- ✅ Configuration automatique
- ✅ Versions isolées et contrôlées
- ✅ Facile à partager (docker-compose.yml)
- ✅ Environnement identique en production

---

## 🎯 Prochaines Étapes

Après une migration réussie :

1. **Supprimer les services locaux** (optionnel)
   ```bash
   # Désinstaller PostgreSQL local
   # Désinstaller Redis local
   ```

2. **Mettre à jour la documentation d'équipe**
   - Partager le nouveau processus Docker
   - Former l'équipe aux commandes Docker

3. **Configurer le CI/CD**
   - GitHub Actions déjà configuré
   - Tester le build automatique

4. **Planifier le déploiement production**
   - Utiliser la même image Docker
   - Configuration production dans .env.production

---

## 📚 Ressources

- **Guide Docker Complet** : [DOCKER.md](DOCKER.md)
- **Démarrage Rapide** : [QUICK_START_DOCKER.md](QUICK_START_DOCKER.md)
- **Dépannage** : [DOCKER_SETUP.md](DOCKER_SETUP.md)

---

**Questions sur la migration ?** Ouvrez une issue sur GitHub ou consultez la documentation.
