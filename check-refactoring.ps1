# Script de vérification de la refactorisation
# Usage: .\check-refactoring.ps1

Write-Host "🔍 Vérification de la refactorisation K.Kits" -ForegroundColor Cyan
Write-Host "=" * 60

# Compter les lignes dans les pages refactorisées
$refactoredPages = @(
    "app\preferences\organizations\[id]\warehouses\[warehouseId]\page.tsx",
    "app\preferences\organizations\[id]\products\new\page.tsx"
)

Write-Host "`n✅ Pages Refactorisées:" -ForegroundColor Green
$totalBefore = 0
$totalAfter = 0

foreach ($page in $refactoredPages) {
    if (Test-Path $page) {
        $lines = (Get-Content -LiteralPath $page | Measure-Object -Line).Lines
        $totalAfter += $lines
        Write-Host "  📄 $page : $lines lignes" -ForegroundColor White
    }
}

Write-Host "`n📊 Statistiques:" -ForegroundColor Yellow
Write-Host "  Avant: 948 lignes (508 + 440)"
Write-Host "  Après: $totalAfter lignes"
Write-Host "  Économisé: $(948 - $totalAfter) lignes ($(([math]::Round((948 - $totalAfter) / 948 * 100, 1)))%)"

# Compter les composants créés
Write-Host "`n📦 Composants Créés:" -ForegroundColor Cyan

$componentFolders = @(
    "src\components\warehouses",
    "src\components\products",
    "src\components\shared"
)

$totalComponents = 0
foreach ($folder in $componentFolders) {
    if (Test-Path $folder) {
        $components = Get-ChildItem -Path $folder -Filter "*.tsx" -File
        $count = $components.Count
        $totalComponents += $count
        Write-Host "  📁 $folder : $count composants" -ForegroundColor White
        foreach ($comp in $components) {
            Write-Host "     - $($comp.Name)" -ForegroundColor Gray
        }
    }
}

Write-Host "`n  Total: $totalComponents composants réutilisables" -ForegroundColor Green

# Compter les hooks créés
Write-Host "`n🎣 Hooks Créés:" -ForegroundColor Cyan
$hooksFolder = "src\hooks"
if (Test-Path $hooksFolder) {
    $hooks = Get-ChildItem -Path $hooksFolder -Filter "use-*-dialogs.ts" -File
    Write-Host "  Total: $($hooks.Count) hooks" -ForegroundColor White
    foreach ($hook in $hooks) {
        Write-Host "     - $($hook.Name)" -ForegroundColor Gray
    }
}

# Vérifier les pages restantes
Write-Host "`n⏳ Pages Restantes à Refactoriser:" -ForegroundColor Yellow

$remainingPages = @(
    @{Path="app\preferences\organizations\[id]\products\[productId]\edit\page.tsx"; Lines=361},
    @{Path="app\preferences\organizations\[id]\stores\[storeId]\stock\page.tsx"; Lines=336},
    @{Path="app\preferences\organizations\[id]\warehouses\[warehouseId]\purchase-orders\[orderId]\page.tsx"; Lines=298},
    @{Path="app\preferences\organizations\[id]\suppliers\[supplierId]\edit\page.tsx"; Lines=297},
    @{Path="app\preferences\organizations\[id]\stores\[storeId]\sales\new\page.tsx"; Lines=281}
)

$totalRemaining = 0
foreach ($page in $remainingPages) {
    $totalRemaining += $page.Lines
    $priority = if ($page.Lines -gt 300) { "🔴 HAUTE" } elseif ($page.Lines -gt 200) { "🟠 MOYENNE" } else { "🟢 BASSE" }
    Write-Host "  $priority - $($page.Lines) lignes : $($page.Path)" -ForegroundColor White
}

Write-Host "`n📈 Progression:" -ForegroundColor Cyan
$totalPages = 20
$completedPages = 2
$progressPercent = [math]::Round($completedPages / $totalPages * 100, 1)
Write-Host "  Pages complétées: $completedPages / $totalPages ($progressPercent%)"
Write-Host "  Lignes économisées: $(948 - $totalAfter) / ~3,333 (estimation totale)"

Write-Host "`n✨ Prochaines Étapes:" -ForegroundColor Green
Write-Host "  1. Refactoriser products/[productId]/edit (réutiliser ProductForm*)"
Write-Host "  2. Refactoriser stores/[storeId]/stock (créer StoreStockTable)"
Write-Host "  3. Refactoriser purchase-orders/[orderId] (créer PurchaseOrder*)"
Write-Host "  4. Continuer avec les 15 pages restantes"

Write-Host "`n📚 Documentation:" -ForegroundColor Cyan
Write-Host "  - REFACTORING_SUMMARY.md : Résumé détaillé"
Write-Host "  - REFACTORING_GUIDE.md : Guide de refactorisation"
Write-Host "  - REFACTORING_STATUS.md : État actuel"
Write-Host "  - src/components/README.md : Documentation des composants"

Write-Host "`n" + "=" * 60
Write-Host "✅ Vérification terminée!" -ForegroundColor Green
