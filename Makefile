# Makefile pour K.Kits Docker
# Usage: make <command>

.PHONY: help build up down restart logs clean dev prod migrate studio backup

# Afficher l'aide
help:
	@echo "==================================="
	@echo "K.Kits - Commandes Docker"
	@echo "==================================="
	@echo ""
	@echo "Développement:"
	@echo "  make dev          - Lancer services dev (DB + Redis)"
	@echo "  make up           - Lancer tous les services"
	@echo "  make down         - Arrêter tous les services"
	@echo "  make restart      - Redémarrer les services"
	@echo "  make logs         - Voir les logs"
	@echo ""
	@echo "Build:"
	@echo "  make build        - Build l'image Docker"
	@echo "  make rebuild      - Rebuild sans cache"
	@echo ""
	@echo "Base de données:"
	@echo "  make migrate      - Appliquer les migrations"
	@echo "  make studio       - Ouvrir Prisma Studio"
	@echo "  make backup       - Backup de la DB"
	@echo ""
	@echo "Production:"
	@echo "  make prod         - Lancer en mode production"
	@echo ""
	@echo "Nettoyage:"
	@echo "  make clean        - Nettoyer conteneurs et volumes"
	@echo "  make clean-all    - Nettoyer tout (images incluses)"
	@echo ""

# Développement - Services uniquement
dev:
	docker-compose -f docker-compose.dev.yml up -d
	@echo "✅ Services dev démarrés (PostgreSQL + Redis)"
	@echo "📝 Lancer 'pnpm dev' pour démarrer l'app"

# Lancer tous les services
up:
	docker-compose up -d
	@echo "✅ Tous les services démarrés"
	@echo "🌐 Application: http://localhost:3000"

# Arrêter les services
down:
	docker-compose down
	@echo "✅ Services arrêtés"

# Redémarrer
restart:
	docker-compose restart
	@echo "✅ Services redémarrés"

# Voir les logs
logs:
	docker-compose logs -f

# Build l'image
build:
	docker-compose build
	@echo "✅ Image buildée"

# Rebuild sans cache
rebuild:
	docker-compose build --no-cache
	@echo "✅ Image rebuildée sans cache"

# Migrations Prisma
migrate:
	docker-compose exec app npx prisma migrate deploy
	@echo "✅ Migrations appliquées"

# Prisma Studio
studio:
	docker-compose exec app npx prisma studio
	@echo "🎨 Prisma Studio ouvert"

# Backup de la base de données
backup:
	docker-compose exec postgres pg_dump -U k_kits_user k_kits_db > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ Backup créé"

# Production
prod:
	docker-compose -f docker-compose.prod.yml up -d
	@echo "✅ Production démarrée"

# Nettoyer conteneurs et volumes
clean:
	docker-compose down -v
	@echo "✅ Conteneurs et volumes supprimés"

# Nettoyer tout
clean-all:
	docker-compose down -v --rmi all
	docker system prune -a --volumes -f
	@echo "✅ Nettoyage complet effectué"

# Vérifier l'état
status:
	docker-compose ps
	@echo ""
	@echo "Santé des services:"
	@docker-compose exec postgres pg_isready -U k_kits_user || echo "❌ PostgreSQL non disponible"
	@docker-compose exec redis redis-cli ping || echo "❌ Redis non disponible"
