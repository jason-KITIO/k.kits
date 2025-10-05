# 🚀 Guide de Lancement Docker - K.Kits

## ✅ Vérification Complète

Votre conteneurisation est **COMPLÈTE** ! Tous les fichiers nécessaires sont présents :

- ✅ Dockerfile
- ✅ docker-compose.yml
- ✅ docker-compose.dev.yml
- ✅ docker-compose.prod.yml
- ✅ .dockerignore
- ✅ docker-entrypoint.sh
- ✅ .env.docker
- ✅ Scripts (docker.ps1, docker.sh, Makefile)
- ✅ Documentation complète (docs/docker/)

**Docker installé** :
- ✅ Docker version 28.1.1
- ✅ Docker Compose version 2.35.1

---

## 🎯 Lancement en 5 Étapes

### Étape 1 : Démarrer Docker Desktop

1. **Ouvrir Docker Desktop** depuis le menu Windows
2. **Attendre** que Docker soit complètement démarré (icône verte)
3. **Vérifier** : Ouvrir PowerShell et taper `docker ps`

**Résultat attendu** : Liste vide ou conteneurs existants (pas d'erreur)

---

### Étape 2 : Configurer l'Environnement

```powershell
# Ouvrir PowerShell dans le dossier du projet
cd "c:\Users\Jason Kitio\Documents\K Kits\k.kits"

# Copier la configuration (si pas déjà fait)
copy .env.docker .env

# (Optionnel) Éditer .env pour ajouter vos configurations Twilio/SMTP
notepad .env
```

**Note** : Pour un test rapide, vous pouvez garder les valeurs par défaut.

---

### Étape 3 : Lancer les Services

**Option A : Avec le script PowerShell (Recommandé)**

```powershell
# Lancer tous les services
.\docker.ps1 up

# Attendre 30-60 secondes que tout démarre
```

**Option B : Avec Docker Compose**

```powershell
# Lancer tous les services
docker-compose up -d

# Voir les logs en temps réel
docker-compose logs -f
```

---

### Étape 4 : Vérifier que Tout Fonctionne

```powershell
# Vérifier l'état des conteneurs
docker-compose ps

# Vérifier PostgreSQL
docker-compose exec postgres pg_isready -U k_kits_user

# Vérifier Redis
docker-compose exec redis redis-cli ping

# Ouvrir l'application
start http://localhost:3000

# Tester le health check
start http://localhost:3000/api/health
```

**Résultats attendus** :
- 3 conteneurs actifs (app, postgres, redis)
- PostgreSQL : "accepting connections"
- Redis : "PONG"
- Application accessible sur http://localhost:3000
- Health check retourne `{"status":"healthy"}`

---

### Étape 5 : Explorer l'Application

1. **Page d'accueil** : http://localhost:3000
2. **API Documentation** : http://localhost:3000/api-docs
3. **Health Check** : http://localhost:3000/api/health

---

## 📊 Commandes Utiles

### Gestion des Services

```powershell
# Démarrer
.\docker.ps1 up
# ou
docker-compose up -d

# Arrêter
.\docker.ps1 down
# ou
docker-compose down

# Redémarrer
.\docker.ps1 restart
# ou
docker-compose restart

# Voir les logs
.\docker.ps1 logs
# ou
docker-compose logs -f

# Voir l'état
.\docker.ps1 status
# ou
docker-compose ps
```

### Base de Données

```powershell
# Appliquer les migrations
docker-compose exec app npx prisma migrate deploy

# Ouvrir Prisma Studio
docker-compose exec app npx prisma studio

# Accéder à PostgreSQL
docker-compose exec postgres psql -U k_kits_user -d k_kits_db

# Backup
docker-compose exec postgres pg_dump -U k_kits_user k_kits_db > backup.sql
```

### Développement

```powershell
# Accéder au shell de l'app
docker-compose exec app sh

# Voir les logs d'un service spécifique
docker-compose logs -f app
docker-compose logs -f postgres
docker-compose logs -f redis

# Rebuild l'image
docker-compose build --no-cache app
docker-compose up -d
```

---

## 🐛 Résolution de Problèmes

### Problème 1 : Docker Desktop ne démarre pas

**Solution** :
1. Redémarrer Docker Desktop
2. Redémarrer l'ordinateur si nécessaire
3. Vérifier que la virtualisation est activée dans le BIOS

### Problème 2 : Port 3000 déjà utilisé

**Erreur** : `Bind for 0.0.0.0:3000 failed`

**Solution** :
```powershell
# Trouver le processus
netstat -ano | findstr :3000

# Arrêter le processus ou changer le port
# Éditer docker-compose.yml :
ports:
  - "8080:3000"  # Au lieu de 3000:3000
```

### Problème 3 : Conteneur ne démarre pas

**Solution** :
```powershell
# Voir les logs détaillés
docker-compose logs app

# Nettoyer et redémarrer
docker-compose down
docker-compose up -d

# Si ça ne marche pas, rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Problème 4 : Erreur de connexion à la base de données

**Solution** :
```powershell
# Vérifier que PostgreSQL est prêt
docker-compose exec postgres pg_isready

# Attendre 30 secondes et réessayer
# Les migrations Prisma se font automatiquement au démarrage
```

### Problème 5 : Tout nettoyer et recommencer

```powershell
# Arrêter et supprimer tout
docker-compose down -v

# Redémarrer
docker-compose up -d
```

---

## 📋 Checklist de Vérification

### Avant le Lancement
- [ ] Docker Desktop installé
- [ ] Docker Desktop démarré (icône verte)
- [ ] Fichier .env créé
- [ ] PowerShell ouvert dans le dossier du projet

### Pendant le Lancement
- [ ] Commande `docker-compose up -d` exécutée
- [ ] Attendre 30-60 secondes
- [ ] Pas d'erreurs dans les logs

### Après le Lancement
- [ ] 3 conteneurs actifs (`docker-compose ps`)
- [ ] PostgreSQL répond (`pg_isready`)
- [ ] Redis répond (`ping`)
- [ ] Application accessible (http://localhost:3000)
- [ ] Health check OK (http://localhost:3000/api/health)

---

## 🎉 Succès !

Si tout fonctionne, vous avez réussi ! Votre application K.Kits tourne maintenant sur Docker.

### Prochaines Étapes

1. **Créer un compte** : http://localhost:3000/register
2. **Se connecter** : http://localhost:3000/login
3. **Explorer l'API** : http://localhost:3000/api-docs
4. **Développer** : Modifier le code et voir les changements

### Pour Arrêter

```powershell
# Arrêter les services
docker-compose down

# Arrêter et supprimer les données (⚠️)
docker-compose down -v
```

---

## 📚 Documentation

- **[Guide Complet](docs/docker/DOCKER.md)** - Documentation complète
- **[Démarrage Rapide](docs/docker/QUICK_START_DOCKER.md)** - Guide rapide
- **[Vérification](VERIFIER_DOCKER.md)** - Tests de vérification
- **[Index](docs/docker/DOCKER_INDEX.md)** - Tous les guides

---

**Besoin d'aide ?** Consultez la documentation ou ouvrez une issue sur GitHub.
