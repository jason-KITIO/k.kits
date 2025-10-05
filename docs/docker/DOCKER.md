# 🐳 Guide Docker - K.Kits

## 📋 Prérequis

- Docker Desktop installé (Windows/Mac) ou Docker Engine (Linux)
- Docker Compose v2.0+
- 4GB RAM minimum disponible

## 🚀 Démarrage Rapide

### 1. Configuration

```bash
# Copier le fichier d'environnement
copy .env.docker .env

# Éditer .env avec vos configurations (Twilio, SMTP, etc.)
notepad .env
```

### 2. Lancer l'application

```bash
# Build et démarrage de tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f app
```

L'application sera accessible sur **http://localhost:3000**

### 3. Arrêter l'application

```bash
# Arrêter les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime les données)
docker-compose down -v
```

## 📦 Services Inclus

| Service | Port | Description |
|---------|------|-------------|
| **app** | 3000 | Application K.Kits (Next.js) |
| **postgres** | 5432 | Base de données PostgreSQL 15 |
| **redis** | 6379 | Cache Redis 7 |

## 🛠️ Commandes Utiles

### Gestion des conteneurs

```bash
# Voir les conteneurs actifs
docker-compose ps

# Redémarrer un service
docker-compose restart app

# Voir les logs d'un service
docker-compose logs -f postgres

# Accéder au shell d'un conteneur
docker-compose exec app sh
```

### Base de données

```bash
# Exécuter les migrations Prisma
docker-compose exec app npx prisma migrate deploy

# Ouvrir Prisma Studio
docker-compose exec app npx prisma studio

# Accéder à PostgreSQL
docker-compose exec postgres psql -U k_kits_user -d k_kits_db

# Backup de la base de données
docker-compose exec postgres pg_dump -U k_kits_user k_kits_db > backup.sql

# Restaurer la base de données
docker-compose exec -T postgres psql -U k_kits_user k_kits_db < backup.sql
```

### Redis

```bash
# Accéder au CLI Redis
docker-compose exec redis redis-cli

# Vider le cache Redis
docker-compose exec redis redis-cli FLUSHALL
```

### Build et optimisation

```bash
# Rebuild l'image sans cache
docker-compose build --no-cache app

# Rebuild et redémarrer
docker-compose up -d --build

# Nettoyer les images inutilisées
docker system prune -a
```

## 🔧 Configuration Avancée

### Variables d'environnement

Éditez le fichier `.env` ou modifiez directement `docker-compose.yml` :

```env
# Changer les ports exposés
ports:
  - "8080:3000"  # Accès via http://localhost:8080

# Utiliser une base de données externe
DATABASE_URL=postgresql://user:pass@external-host:5432/db
```

### Volumes persistants

Les données sont stockées dans des volumes Docker :

```bash
# Lister les volumes
docker volume ls

# Inspecter un volume
docker volume inspect k-kits_postgres_data

# Supprimer un volume (⚠️ perte de données)
docker volume rm k-kits_postgres_data
```

## 🚢 Déploiement en Production

### 1. Build de l'image

```bash
# Build de l'image de production
docker build -t k-kits:latest .

# Tag pour un registry
docker tag k-kits:latest your-registry.com/k-kits:latest

# Push vers le registry
docker push your-registry.com/k-kits:latest
```

### 2. Configuration de production

Créez un fichier `.env.production` :

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-db:5432/k_kits
REDIS_URL=redis://prod-redis:6379
JWT_SECRET=<strong-random-secret>
NEXTAUTH_SECRET=<strong-random-secret>
NEXTAUTH_URL=https://your-domain.com
```

### 3. Déploiement

```bash
# Avec docker-compose
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Ou avec Docker Swarm
docker stack deploy -c docker-compose.yml k-kits

# Ou avec Kubernetes
kubectl apply -f k8s/
```

## 🐛 Dépannage

### L'application ne démarre pas

```bash
# Vérifier les logs
docker-compose logs app

# Vérifier la santé des services
docker-compose ps

# Redémarrer tous les services
docker-compose restart
```

### Erreur de connexion à la base de données

```bash
# Vérifier que PostgreSQL est prêt
docker-compose exec postgres pg_isready

# Vérifier les variables d'environnement
docker-compose exec app env | grep DATABASE_URL
```

### Problèmes de permissions

```bash
# Sur Linux, ajuster les permissions
sudo chown -R $USER:$USER .

# Rebuild avec les bonnes permissions
docker-compose build --no-cache
```

### Nettoyer complètement

```bash
# Tout supprimer (conteneurs, volumes, images)
docker-compose down -v --rmi all
docker system prune -a --volumes
```

## 📊 Monitoring

### Logs en temps réel

```bash
# Tous les services
docker-compose logs -f

# Service spécifique
docker-compose logs -f app

# Dernières 100 lignes
docker-compose logs --tail=100 app
```

### Ressources utilisées

```bash
# Statistiques en temps réel
docker stats

# Espace disque utilisé
docker system df
```

## 🔐 Sécurité

### Bonnes pratiques

1. **Ne jamais commiter le fichier `.env`**
2. **Changer les secrets par défaut** (JWT_SECRET, NEXTAUTH_SECRET)
3. **Utiliser des mots de passe forts** pour PostgreSQL
4. **Limiter l'exposition des ports** en production
5. **Mettre à jour régulièrement** les images Docker

### Scan de sécurité

```bash
# Scanner l'image pour les vulnérabilités
docker scan k-kits:latest

# Avec Trivy
trivy image k-kits:latest
```

## 📚 Ressources

- [Documentation Docker](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment#docker-image)
- [Prisma Docker Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-docker)

---

**Besoin d'aide ?** Ouvrez une issue sur [GitHub](https://github.com/Jason-Kitio/k.kits/issues)
