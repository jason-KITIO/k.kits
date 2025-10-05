# Script PowerShell pour gérer K.Kits avec Docker
# Usage: .\docker.ps1 <command>

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

function Show-Help {
    Write-Host "===================================" -ForegroundColor Cyan
    Write-Host "K.Kits - Commandes Docker" -ForegroundColor Cyan
    Write-Host "===================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Développement:" -ForegroundColor Yellow
    Write-Host "  .\docker.ps1 dev          - Lancer services dev (DB + Redis)"
    Write-Host "  .\docker.ps1 up           - Lancer tous les services"
    Write-Host "  .\docker.ps1 down         - Arrêter tous les services"
    Write-Host "  .\docker.ps1 restart      - Redémarrer les services"
    Write-Host "  .\docker.ps1 logs         - Voir les logs"
    Write-Host ""
    Write-Host "Build:" -ForegroundColor Yellow
    Write-Host "  .\docker.ps1 build        - Build l'image Docker"
    Write-Host "  .\docker.ps1 rebuild      - Rebuild sans cache"
    Write-Host ""
    Write-Host "Base de données:" -ForegroundColor Yellow
    Write-Host "  .\docker.ps1 migrate      - Appliquer les migrations"
    Write-Host "  .\docker.ps1 studio       - Ouvrir Prisma Studio"
    Write-Host "  .\docker.ps1 backup       - Backup de la DB"
    Write-Host ""
    Write-Host "Production:" -ForegroundColor Yellow
    Write-Host "  .\docker.ps1 prod         - Lancer en mode production"
    Write-Host ""
    Write-Host "Nettoyage:" -ForegroundColor Yellow
    Write-Host "  .\docker.ps1 clean        - Nettoyer conteneurs et volumes"
    Write-Host "  .\docker.ps1 clean-all    - Nettoyer tout (images incluses)"
    Write-Host ""
    Write-Host "Utilitaires:" -ForegroundColor Yellow
    Write-Host "  .\docker.ps1 status       - Vérifier l'état des services"
    Write-Host "  .\docker.ps1 shell        - Accéder au shell de l'app"
    Write-Host ""
}

function Start-Dev {
    Write-Host "🚀 Démarrage des services de développement..." -ForegroundColor Green
    docker-compose -f docker-compose.dev.yml up -d
    Write-Host "✅ Services dev démarrés (PostgreSQL + Redis)" -ForegroundColor Green
    Write-Host "📝 Lancer 'pnpm dev' pour démarrer l'app" -ForegroundColor Yellow
}

function Start-All {
    Write-Host "🚀 Démarrage de tous les services..." -ForegroundColor Green
    docker-compose up -d
    Write-Host "✅ Tous les services démarrés" -ForegroundColor Green
    Write-Host "🌐 Application: http://localhost:3000" -ForegroundColor Cyan
}

function Stop-All {
    Write-Host "🛑 Arrêt des services..." -ForegroundColor Yellow
    docker-compose down
    Write-Host "✅ Services arrêtés" -ForegroundColor Green
}

function Restart-All {
    Write-Host "🔄 Redémarrage des services..." -ForegroundColor Yellow
    docker-compose restart
    Write-Host "✅ Services redémarrés" -ForegroundColor Green
}

function Show-Logs {
    Write-Host "📋 Affichage des logs..." -ForegroundColor Cyan
    docker-compose logs -f
}

function Build-Image {
    Write-Host "🔨 Build de l'image Docker..." -ForegroundColor Yellow
    docker-compose build
    Write-Host "✅ Image buildée" -ForegroundColor Green
}

function Rebuild-Image {
    Write-Host "🔨 Rebuild de l'image sans cache..." -ForegroundColor Yellow
    docker-compose build --no-cache
    Write-Host "✅ Image rebuildée" -ForegroundColor Green
}

function Run-Migrate {
    Write-Host "🔄 Application des migrations Prisma..." -ForegroundColor Yellow
    docker-compose exec app npx prisma migrate deploy
    Write-Host "✅ Migrations appliquées" -ForegroundColor Green
}

function Open-Studio {
    Write-Host "🎨 Ouverture de Prisma Studio..." -ForegroundColor Cyan
    docker-compose exec app npx prisma studio
}

function Backup-Database {
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $filename = "backup_$timestamp.sql"
    Write-Host "💾 Création du backup..." -ForegroundColor Yellow
    docker-compose exec postgres pg_dump -U k_kits_user k_kits_db > $filename
    Write-Host "✅ Backup créé: $filename" -ForegroundColor Green
}

function Start-Prod {
    Write-Host "🚀 Démarrage en mode production..." -ForegroundColor Green
    docker-compose -f docker-compose.prod.yml up -d
    Write-Host "✅ Production démarrée" -ForegroundColor Green
}

function Clean-All {
    Write-Host "🧹 Nettoyage des conteneurs et volumes..." -ForegroundColor Yellow
    docker-compose down -v
    Write-Host "✅ Conteneurs et volumes supprimés" -ForegroundColor Green
}

function Clean-Everything {
    Write-Host "🧹 Nettoyage complet..." -ForegroundColor Red
    $confirm = Read-Host "⚠️  Cela supprimera TOUT (conteneurs, volumes, images). Continuer? (y/N)"
    if ($confirm -eq 'y' -or $confirm -eq 'Y') {
        docker-compose down -v --rmi all
        docker system prune -a --volumes -f
        Write-Host "✅ Nettoyage complet effectué" -ForegroundColor Green
    } else {
        Write-Host "❌ Annulé" -ForegroundColor Yellow
    }
}

function Show-Status {
    Write-Host "📊 État des services:" -ForegroundColor Cyan
    docker-compose ps
    Write-Host ""
    Write-Host "Santé des services:" -ForegroundColor Cyan
    
    # Test PostgreSQL
    $pgTest = docker-compose exec postgres pg_isready -U k_kits_user 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PostgreSQL: OK" -ForegroundColor Green
    } else {
        Write-Host "❌ PostgreSQL: Non disponible" -ForegroundColor Red
    }
    
    # Test Redis
    $redisTest = docker-compose exec redis redis-cli ping 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Redis: OK" -ForegroundColor Green
    } else {
        Write-Host "❌ Redis: Non disponible" -ForegroundColor Red
    }
}

function Open-Shell {
    Write-Host "🐚 Ouverture du shell de l'application..." -ForegroundColor Cyan
    docker-compose exec app sh
}

# Router les commandes
switch ($Command.ToLower()) {
    "help" { Show-Help }
    "dev" { Start-Dev }
    "up" { Start-All }
    "down" { Stop-All }
    "restart" { Restart-All }
    "logs" { Show-Logs }
    "build" { Build-Image }
    "rebuild" { Rebuild-Image }
    "migrate" { Run-Migrate }
    "studio" { Open-Studio }
    "backup" { Backup-Database }
    "prod" { Start-Prod }
    "clean" { Clean-All }
    "clean-all" { Clean-Everything }
    "status" { Show-Status }
    "shell" { Open-Shell }
    default {
        Write-Host "❌ Commande inconnue: $Command" -ForegroundColor Red
        Write-Host ""
        Show-Help
    }
}
