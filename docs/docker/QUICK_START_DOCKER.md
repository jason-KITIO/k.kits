# 🚀 Quick Start Docker - K.Kits

## ⚡ Démarrage en 3 Minutes

### 1️⃣ Configuration (30 secondes)

```bash
# Copier le fichier de configuration
copy .env.docker .env
```

### 2️⃣ Lancer l'Application (2 minutes)

```bash
# Démarrer tous les services
docker-compose up -d
```

### 3️⃣ Vérifier (30 secondes)

```bash
# Voir l'état
docker-compose ps

# Ouvrir l'application
start http://localhost:3000
```

**C'est tout ! 🎉**

---

## 📝 Commandes Essentielles

### Windows (PowerShell)

```powershell
# Démarrer
.\docker.ps1 up

# Arrêter
.\docker.ps1 down

# Voir les logs
.\docker.ps1 logs

# État des services
.\docker.ps1 status

# Aide
.\docker.ps1 help
```

### Linux/Mac

```bash
# Démarrer
make up

# Arrêter
make down

# Voir les logs
make logs

# État des services
make status

# Aide
make help
```

---

## 🔧 Développement Local

Si vous voulez développer en local avec hot-reload :

```bash
# 1. Lancer uniquement PostgreSQL et Redis
docker-compose -f docker-compose.dev.yml up -d

# 2. Installer les dépendances
pnpm install

# 3. Appliquer les migrations
pnpm prisma migrate deploy

# 4. Lancer l'app en mode dev
pnpm dev
```

---

## 🌐 URLs Importantes

| Service | URL |
|---------|-----|
| Application | http://localhost:3000 |
| Health Check | http://localhost:3000/api/health |
| API Docs | http://localhost:3000/api-docs |
| Prisma Studio | `docker-compose exec app npx prisma studio` |

---

## 🆘 Problèmes ?

### L'application ne démarre pas

```bash
# Voir les logs
docker-compose logs app

# Redémarrer
docker-compose restart
```

### Port déjà utilisé

```bash
# Vérifier les ports
netstat -ano | findstr :3000

# Changer le port dans docker-compose.yml
ports:
  - "8080:3000"
```

### Tout nettoyer et recommencer

```bash
# Arrêter et supprimer tout
docker-compose down -v

# Redémarrer
docker-compose up -d
```

---

## 📚 Documentation Complète

- **Guide Complet** : [DOCKER.md](DOCKER.md)
- **Setup Détaillé** : [DOCKER_SETUP.md](DOCKER_SETUP.md)
- **Récapitulatif** : [CONTENEURISATION_COMPLETE.md](CONTENEURISATION_COMPLETE.md)

---

**Besoin d'aide ?** Ouvrez une issue sur GitHub ou consultez la documentation complète.
