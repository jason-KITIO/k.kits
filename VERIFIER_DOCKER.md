# ✅ Vérification et Lancement Docker - K.Kits

## 📋 Étape 1 : Vérifier la Conteneurisation

### Vérifier que tous les fichiers Docker existent

```bash
# Vérifier les fichiers principaux
dir Dockerfile
dir docker-compose.yml
dir docker-compose.dev.yml
dir docker-compose.prod.yml
dir .dockerignore
dir docker-entrypoint.sh
dir .env.docker
```

**Résultat attendu** : Tous les fichiers doivent exister ✅

### Vérifier Docker Desktop

```bash
# Vérifier que Docker est installé
docker --version

# Vérifier que Docker Compose est installé
docker-compose --version

# Vérifier que Docker est démarré
docker ps
```

**Résultat attendu** :
- Docker version 20.x ou supérieur
- Docker Compose version 2.x ou supérieur
- Liste vide ou conteneurs existants (pas d'erreur)

---

## 🚀 Étape 2 : Lancer le Projet sur Docker

### Option A : Avec Script PowerShell (Recommandé pour Windows)

```powershell
# 1. Copier la configuration
copy .env.docker .env

# 2. Éditer .env (optionnel pour le test)
notepad .env

# 3. Lancer tous les services
.\docker.ps1 up

# 4. Vérifier l'état
.\docker.ps1 status

# 5. Voir les logs
.\docker.ps1 logs
```

### Option B : Avec Docker Compose Direct

```bash
# 1. Copier la configuration
copy .env.docker .env

# 2. Lancer tous les services
docker-compose up -d

# 3. Vérifier l'état
docker-compose ps

# 4. Voir les logs
docker-compose logs -f
```

### Option C : Avec Makefile (Linux/Mac)

```bash
# 1. Copier la configuration
cp .env.docker .env

# 2. Lancer tous les services
make up

# 3. Vérifier l'état
make status

# 4. Voir les logs
make logs
```

---

## 🔍 Étape 3 : Vérifier que Tout Fonctionne

### 1. Vérifier les Conteneurs

```bash
docker-compose ps
```

**Résultat attendu** :
```
NAME                STATUS              PORTS
k-kits-app          Up (healthy)        0.0.0.0:3000->3000/tcp
k-kits-postgres     Up (healthy)        0.0.0.0:5432->5432/tcp
k-kits-redis        Up (healthy)        0.0.0.0:6379->6379/tcp
```

### 2. Vérifier PostgreSQL

```bash
docker-compose exec postgres pg_isready -U k_kits_user
```

**Résultat attendu** : `k_kits_user:5432 - accepting connections`

### 3. Vérifier Redis

```bash
docker-compose exec redis redis-cli ping
```

**Résultat attendu** : `PONG`

### 4. Vérifier l'Application

```bash
# Ouvrir dans le navigateur
start http://localhost:3000

# Ou tester avec curl
curl http://localhost:3000/api/health
```

**Résultat attendu** :
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "database": "connected",
    "api": "running"
  }
}
```

### 5. Vérifier les Logs

```bash
# Logs de l'application
docker-compose logs app

# Rechercher des erreurs
docker-compose logs app | findstr "error"
```

**Résultat attendu** : Pas d'erreurs critiques

---

## 📊 Checklist Complète

### Avant le Lancement
- [ ] Docker Desktop installé et démarré
- [ ] Fichier `.env` créé (copié depuis `.env.docker`)
- [ ] Ports 3000, 5432, 6379 disponibles

### Après le Lancement
- [ ] 3 conteneurs actifs (app, postgres, redis)
- [ ] Tous les conteneurs "healthy"
- [ ] PostgreSQL répond (`pg_isready`)
- [ ] Redis répond (`ping` → `PONG`)
- [ ] Application accessible (http://localhost:3000)
- [ ] Health check OK (http://localhost:3000/api/health)
- [ ] Pas d'erreurs dans les logs

---

## 🎯 Test Complet

Exécutez ce script pour tout vérifier :

```powershell
# Script de vérification complète
Write-Host "🔍 Vérification Docker K.Kits" -ForegroundColor Cyan
Write-Host ""

# 1. Docker installé
Write-Host "1. Docker installé..." -NoNewline
docker --version > $null 2>&1
if ($?) { Write-Host " ✅" -ForegroundColor Green } else { Write-Host " ❌" -ForegroundColor Red }

# 2. Fichiers Docker
Write-Host "2. Fichiers Docker..." -NoNewline
if (Test-Path "Dockerfile") { Write-Host " ✅" -ForegroundColor Green } else { Write-Host " ❌" -ForegroundColor Red }

# 3. Conteneurs actifs
Write-Host "3. Conteneurs actifs..." -NoNewline
$containers = docker-compose ps -q
if ($containers) { Write-Host " ✅" -ForegroundColor Green } else { Write-Host " ❌" -ForegroundColor Red }

# 4. PostgreSQL
Write-Host "4. PostgreSQL..." -NoNewline
docker-compose exec postgres pg_isready -U k_kits_user > $null 2>&1
if ($?) { Write-Host " ✅" -ForegroundColor Green } else { Write-Host " ❌" -ForegroundColor Red }

# 5. Redis
Write-Host "5. Redis..." -NoNewline
docker-compose exec redis redis-cli ping > $null 2>&1
if ($?) { Write-Host " ✅" -ForegroundColor Green } else { Write-Host " ❌" -ForegroundColor Red }

# 6. Application
Write-Host "6. Application..." -NoNewline
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing -ErrorAction SilentlyContinue
if ($response.StatusCode -eq 200) { Write-Host " ✅" -ForegroundColor Green } else { Write-Host " ❌" -ForegroundColor Red }

Write-Host ""
Write-Host "✅ Vérification terminée !" -ForegroundColor Green
```

---

## 🐛 Problèmes Courants

### Problème 1 : Port déjà utilisé

**Erreur** : `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solution** :
```bash
# Trouver le processus
netstat -ano | findstr :3000

# Arrêter le processus ou changer le port dans docker-compose.yml
ports:
  - "8080:3000"
```

### Problème 2 : Docker Desktop non démarré

**Erreur** : `Cannot connect to the Docker daemon`

**Solution** : Démarrer Docker Desktop depuis le menu Windows

### Problème 3 : Migrations Prisma échouent

**Erreur** : `Migration failed`

**Solution** :
```bash
# Forcer les migrations
docker-compose exec app npx prisma migrate deploy

# Ou reset (⚠️ supprime les données)
docker-compose exec app npx prisma migrate reset
```

### Problème 4 : Conteneur ne démarre pas

**Solution** :
```bash
# Voir les logs détaillés
docker-compose logs app

# Rebuild complet
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 🎉 Succès !

Si toutes les vérifications sont ✅, votre application est correctement conteneurisée et fonctionne !

### Prochaines Étapes

1. **Créer un compte** : http://localhost:3000/register
2. **Se connecter** : http://localhost:3000/login
3. **Explorer l'API** : http://localhost:3000/api-docs
4. **Voir Prisma Studio** : `docker-compose exec app npx prisma studio`

### Commandes Utiles

```bash
# Arrêter
docker-compose down

# Redémarrer
docker-compose restart

# Voir les logs
docker-compose logs -f

# Accéder au shell
docker-compose exec app sh

# Backup DB
docker-compose exec postgres pg_dump -U k_kits_user k_kits_db > backup.sql
```

---

**Documentation complète** : [docs/docker/](docs/docker/)
