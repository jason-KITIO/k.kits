#!/bin/bash
# Script Bash pour gérer K.Kits avec Docker
# Usage: ./docker.sh <command>

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

show_help() {
    echo -e "${CYAN}===================================${NC}"
    echo -e "${CYAN}K.Kits - Commandes Docker${NC}"
    echo -e "${CYAN}===================================${NC}"
    echo ""
    echo -e "${YELLOW}Développement:${NC}"
    echo "  ./docker.sh dev          - Lancer services dev (DB + Redis)"
    echo "  ./docker.sh up           - Lancer tous les services"
    echo "  ./docker.sh down         - Arrêter tous les services"
    echo "  ./docker.sh restart      - Redémarrer les services"
    echo "  ./docker.sh logs         - Voir les logs"
    echo ""
    echo -e "${YELLOW}Build:${NC}"
    echo "  ./docker.sh build        - Build l'image Docker"
    echo "  ./docker.sh rebuild      - Rebuild sans cache"
    echo ""
    echo -e "${YELLOW}Base de données:${NC}"
    echo "  ./docker.sh migrate      - Appliquer les migrations"
    echo "  ./docker.sh studio       - Ouvrir Prisma Studio"
    echo "  ./docker.sh backup       - Backup de la DB"
    echo ""
    echo -e "${YELLOW}Production:${NC}"
    echo "  ./docker.sh prod         - Lancer en mode production"
    echo ""
    echo -e "${YELLOW}Nettoyage:${NC}"
    echo "  ./docker.sh clean        - Nettoyer conteneurs et volumes"
    echo "  ./docker.sh clean-all    - Nettoyer tout (images incluses)"
    echo ""
    echo -e "${YELLOW}Utilitaires:${NC}"
    echo "  ./docker.sh status       - Vérifier l'état des services"
    echo "  ./docker.sh shell        - Accéder au shell de l'app"
    echo ""
}

start_dev() {
    echo -e "${GREEN}🚀 Démarrage des services de développement...${NC}"
    docker-compose -f docker-compose.dev.yml up -d
    echo -e "${GREEN}✅ Services dev démarrés (PostgreSQL + Redis)${NC}"
    echo -e "${YELLOW}📝 Lancer 'pnpm dev' pour démarrer l'app${NC}"
}

start_all() {
    echo -e "${GREEN}🚀 Démarrage de tous les services...${NC}"
    docker-compose up -d
    echo -e "${GREEN}✅ Tous les services démarrés${NC}"
    echo -e "${CYAN}🌐 Application: http://localhost:3000${NC}"
}

stop_all() {
    echo -e "${YELLOW}🛑 Arrêt des services...${NC}"
    docker-compose down
    echo -e "${GREEN}✅ Services arrêtés${NC}"
}

restart_all() {
    echo -e "${YELLOW}🔄 Redémarrage des services...${NC}"
    docker-compose restart
    echo -e "${GREEN}✅ Services redémarrés${NC}"
}

show_logs() {
    echo -e "${CYAN}📋 Affichage des logs...${NC}"
    docker-compose logs -f
}

build_image() {
    echo -e "${YELLOW}🔨 Build de l'image Docker...${NC}"
    docker-compose build
    echo -e "${GREEN}✅ Image buildée${NC}"
}

rebuild_image() {
    echo -e "${YELLOW}🔨 Rebuild de l'image sans cache...${NC}"
    docker-compose build --no-cache
    echo -e "${GREEN}✅ Image rebuildée${NC}"
}

run_migrate() {
    echo -e "${YELLOW}🔄 Application des migrations Prisma...${NC}"
    docker-compose exec app npx prisma migrate deploy
    echo -e "${GREEN}✅ Migrations appliquées${NC}"
}

open_studio() {
    echo -e "${CYAN}🎨 Ouverture de Prisma Studio...${NC}"
    docker-compose exec app npx prisma studio
}

backup_database() {
    timestamp=$(date +%Y%m%d_%H%M%S)
    filename="backup_${timestamp}.sql"
    echo -e "${YELLOW}💾 Création du backup...${NC}"
    docker-compose exec postgres pg_dump -U k_kits_user k_kits_db > "$filename"
    echo -e "${GREEN}✅ Backup créé: $filename${NC}"
}

start_prod() {
    echo -e "${GREEN}🚀 Démarrage en mode production...${NC}"
    docker-compose -f docker-compose.prod.yml up -d
    echo -e "${GREEN}✅ Production démarrée${NC}"
}

clean_all() {
    echo -e "${YELLOW}🧹 Nettoyage des conteneurs et volumes...${NC}"
    docker-compose down -v
    echo -e "${GREEN}✅ Conteneurs et volumes supprimés${NC}"
}

clean_everything() {
    echo -e "${RED}🧹 Nettoyage complet...${NC}"
    read -p "⚠️  Cela supprimera TOUT (conteneurs, volumes, images). Continuer? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v --rmi all
        docker system prune -a --volumes -f
        echo -e "${GREEN}✅ Nettoyage complet effectué${NC}"
    else
        echo -e "${YELLOW}❌ Annulé${NC}"
    fi
}

show_status() {
    echo -e "${CYAN}📊 État des services:${NC}"
    docker-compose ps
    echo ""
    echo -e "${CYAN}Santé des services:${NC}"
    
    # Test PostgreSQL
    if docker-compose exec postgres pg_isready -U k_kits_user > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PostgreSQL: OK${NC}"
    else
        echo -e "${RED}❌ PostgreSQL: Non disponible${NC}"
    fi
    
    # Test Redis
    if docker-compose exec redis redis-cli ping > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Redis: OK${NC}"
    else
        echo -e "${RED}❌ Redis: Non disponible${NC}"
    fi
}

open_shell() {
    echo -e "${CYAN}🐚 Ouverture du shell de l'application...${NC}"
    docker-compose exec app sh
}

# Router les commandes
case "${1:-help}" in
    help)
        show_help
        ;;
    dev)
        start_dev
        ;;
    up)
        start_all
        ;;
    down)
        stop_all
        ;;
    restart)
        restart_all
        ;;
    logs)
        show_logs
        ;;
    build)
        build_image
        ;;
    rebuild)
        rebuild_image
        ;;
    migrate)
        run_migrate
        ;;
    studio)
        open_studio
        ;;
    backup)
        backup_database
        ;;
    prod)
        start_prod
        ;;
    clean)
        clean_all
        ;;
    clean-all)
        clean_everything
        ;;
    status)
        show_status
        ;;
    shell)
        open_shell
        ;;
    *)
        echo -e "${RED}❌ Commande inconnue: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
