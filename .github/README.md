# GitHub Actions - K.Kits

## 🔄 Workflows Configurés

### Docker Build & Push

**Fichier** : `.github/workflows/docker-build.yml`

**Déclencheurs** :
- Push sur `main` ou `develop`
- Tags `v*` (ex: v1.0.0)
- Pull Requests vers `main`

**Actions** :
1. Checkout du code
2. Configuration Docker Buildx
3. Connexion au GitHub Container Registry
4. Build de l'image Docker
5. Push vers `ghcr.io/jason-kitio/k-kits`

**Tags générés** :
- `main` → `ghcr.io/jason-kitio/k-kits:main`
- `develop` → `ghcr.io/jason-kitio/k-kits:develop`
- `v1.0.0` → `ghcr.io/jason-kitio/k-kits:v1.0.0`
- Commit SHA → `ghcr.io/jason-kitio/k-kits:sha-abc123`

## 🚀 Utilisation

### Déployer une Nouvelle Version

```bash
# 1. Créer un tag
git tag v1.0.0

# 2. Push le tag
git push origin v1.0.0

# 3. GitHub Actions build et push automatiquement
# 4. L'image sera disponible sur ghcr.io
```

### Utiliser l'Image

```bash
# Pull l'image
docker pull ghcr.io/jason-kitio/k-kits:v1.0.0

# Lancer le conteneur
docker run -p 3000:3000 --env-file .env ghcr.io/jason-kitio/k-kits:v1.0.0
```

## 🔐 Configuration Requise

### Secrets GitHub

Aucun secret supplémentaire requis ! Le workflow utilise `GITHUB_TOKEN` automatiquement fourni.

### Permissions

Le workflow nécessite :
- `contents: read` - Lire le code
- `packages: write` - Écrire dans GitHub Container Registry

## 📦 GitHub Container Registry

Les images sont publiées sur :
```
ghcr.io/jason-kitio/k-kits
```

### Rendre l'Image Publique

1. Aller sur https://github.com/Jason-Kitio/k.kits/pkgs/container/k.kits
2. Cliquer sur "Package settings"
3. Changer la visibilité en "Public"

## 🔄 Workflow Futur

### Tests Automatisés (À venir)

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm test
```

### Déploiement Automatique (À venir)

```yaml
name: Deploy

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # SSH vers serveur
          # Pull nouvelle image
          # Redémarrer services
```

## 📚 Ressources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Action](https://github.com/docker/build-push-action)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
