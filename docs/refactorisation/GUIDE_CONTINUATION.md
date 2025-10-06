# 🚀 GUIDE DE CONTINUATION - REFACTORISATION K.KITS

**Pour continuer la refactorisation des 90 fichiers restants**

---

## 📋 ÉTAT ACTUEL

✅ **5 fichiers refactorisés** (5%)  
⏳ **90 fichiers restants** (95%)  
🎯 **Objectif** : 0 fichiers > 100 lignes

---

## 🎯 PLAN D'ACTION

### ÉTAPE 1 : Composants Critiques (Priorité HAUTE)

**Fichiers à refactoriser** : 8 fichiers (>250 lignes)

```bash
# 1. create-purchase-order-dialog.tsx (340 lignes)
# Découper en :
- PurchaseOrderForm.tsx (80 lignes)
- SupplierSelector.tsx (50 lignes)
- ProductItemsList.tsx (70 lignes)
- PurchaseOrderSummary.tsx (60 lignes)
- usePurchaseOrderForm.ts (60 lignes)

# 2. profit-report.tsx (321 lignes)
# Découper en :
- ProfitReportFilters.tsx (60 lignes)
- ProfitReportChart.tsx (80 lignes)
- ProfitReportTable.tsx (70 lignes)
- ProfitReportSummary.tsx (50 lignes)
- useProfitReport.ts (50 lignes)

# 3. customer-report.tsx (291 lignes)
# Découper en :
- CustomerReportFilters.tsx (60 lignes)
- CustomerReportChart.tsx (70 lignes)
- CustomerReportTable.tsx (70 lignes)
- CustomerReportStats.tsx (50 lignes)
- useCustomerReport.ts (40 lignes)

# 4. user-settings.tsx (287 lignes)
# Découper en :
- ProfileSection.tsx (70 lignes)
- SecuritySection.tsx (70 lignes)
- NotificationSection.tsx (60 lignes)
- PreferencesSection.tsx (60 lignes)
- useUserSettings.ts (25 lignes)

# 5. role-list.tsx (276 lignes)
# Découper en :
- RoleCard.tsx (60 lignes)
- RolePermissions.tsx (70 lignes)
- RoleActions.tsx (50 lignes)
- CreateRoleDialog.tsx (70 lignes)
- useRoles.ts (25 lignes)

# 6. performance-report.tsx (275 lignes)
# Découper en :
- PerformanceFilters.tsx (60 lignes)
- PerformanceMetrics.tsx (70 lignes)
- PerformanceChart.tsx (70 lignes)
- PerformanceTable.tsx (60 lignes)
- usePerformanceReport.ts (15 lignes)

# 7. app-sidebar.tsx (267 lignes)
# Découper en :
- SidebarHeader.tsx (50 lignes)
- SidebarNav.tsx (70 lignes)
- SidebarFooter.tsx (40 lignes)
- SidebarUser.tsx (50 lignes)
- useSidebarState.ts (40 lignes)

# 8. financial-report.tsx (248 lignes)
# Découper en :
- FinancialFilters.tsx (60 lignes)
- FinancialChart.tsx (70 lignes)
- FinancialTable.tsx (60 lignes)
- FinancialSummary.tsx (50 lignes)
- useFinancialReport.ts (8 lignes)
```

**Temps estimé** : 4-6 heures

---

### ÉTAPE 2 : Module Reports Complet (Priorité HAUTE)

**Créer des composants partagés** pour tous les reports :

```bash
# Créer src/components/reports/shared/
mkdir src/components/reports/shared

# Composants partagés :
- ReportFilters.tsx (60 lignes)
- ReportChart.tsx (70 lignes)
- ReportTable.tsx (70 lignes)
- ReportSummary.tsx (50 lignes)
- ReportExport.tsx (40 lignes)

# Hooks partagés :
mkdir src/hooks/features/reports
- useReportFilters.ts (40 lignes)
- useReportData.ts (50 lignes)
- useReportExport.ts (30 lignes)
```

**Temps estimé** : 3-4 heures

---

### ÉTAPE 3 : Dialogs Warehouses (Priorité MOYENNE)

**7 fichiers à refactoriser** :

```bash
# Créer src/components/warehouses/shared/
mkdir src/components/warehouses/shared

# Composants partagés :
- WarehouseForm.tsx (70 lignes)
- ProductSelector.tsx (60 lignes)
- QuantityInput.tsx (40 lignes)
- TransferSummary.tsx (50 lignes)

# Refactoriser chaque dialog :
1. delete-warehouse-dialog.tsx (200 → 60 lignes)
2. stock-transfer-dialog.tsx (197 → 70 lignes)
3. restock-dialog.tsx (195 → 70 lignes)
4. store-transfer-dialog.tsx (191 → 70 lignes)
5. stock-adjustment-dialog.tsx (181 → 70 lignes)
6. create-warehouse-dialog.tsx (179 → 70 lignes)
```

**Temps estimé** : 3-4 heures

---

### ÉTAPE 4 : Schémas & Services (Priorité MOYENNE)

```bash
# 1. report.schema.ts (243 lignes)
# Découper en :
- profitReport.schema.ts (50 lignes)
- customerReport.schema.ts (50 lignes)
- performanceReport.schema.ts (50 lignes)
- financialReport.schema.ts (50 lignes)
- shared.schema.ts (40 lignes)

# 2. organization-service.ts (158 lignes)
# Découper en :
- organizationQueries.ts (60 lignes)
- organizationMutations.ts (60 lignes)
- organizationHelpers.ts (35 lignes)

# 3. api-protection.ts (158 lignes)
# Découper en :
- authMiddleware.ts (60 lignes)
- permissionMiddleware.ts (60 lignes)
- validationMiddleware.ts (35 lignes)
```

**Temps estimé** : 2-3 heures

---

### ÉTAPE 5 : Composants UI (Priorité BASSE)

```bash
# Composants UI à refactoriser :
- calendar.tsx (203 lignes)
- skeletons.tsx (186 lignes)
- data-table.tsx (180 lignes)
- select.tsx (171 lignes)

# Stratégie : Découper en sous-composants
```

**Temps estimé** : 2-3 heures

---

### ÉTAPE 6 : Fichiers Restants (Priorité BASSE)

**73 fichiers** entre 100-150 lignes

**Stratégie** :
1. Grouper par module (invitations, settings, nav, etc.)
2. Créer des composants partagés par module
3. Refactoriser par batch de 10 fichiers

**Temps estimé** : 10-12 heures

---

## 🛠️ MÉTHODOLOGIE

### Pour chaque fichier :

1. **Analyser** le fichier
   ```bash
   # Compter les lignes
   powershell -Command "(Get-Content 'src/path/to/file.tsx' | Measure-Object -Line).Lines"
   ```

2. **Identifier** les responsabilités
   - Logique métier → Hook
   - UI complexe → Organism
   - UI simple → Molecule
   - UI atomique → Atom

3. **Créer** les nouveaux fichiers
   - Respecter la limite de 100 lignes
   - Nommer clairement
   - Typer strictement

4. **Remplacer** l'ancien fichier
   - Importer les nouveaux composants
   - Assembler
   - Maintenir la compatibilité

5. **Tester**
   ```bash
   pnpm dev
   pnpm lint
   pnpm test
   ```

6. **Documenter**
   - Mettre à jour PROGRESSION.md
   - Commit avec message clair

---

## 📝 TEMPLATE DE COMMIT

```bash
git commit -m "refactor(component): [nom] - découpage atomique

- Extrait X atoms: [liste]
- Extrait Y molecules: [liste]
- Extrait Z organisms: [liste]
- Réduit de [A] lignes à [B] lignes
- Tests: [passent/à ajouter]

Refs #[issue]"
```

---

## ✅ CHECKLIST PAR FICHIER

- [ ] Fichier < 100 lignes
- [ ] Responsabilité unique
- [ ] Types TypeScript stricts
- [ ] Pas de `any`
- [ ] Exports propres
- [ ] Documentation inline
- [ ] Tests passent
- [ ] Lint OK
- [ ] Build OK
- [ ] Compatibilité maintenue

---

## 🎯 OBJECTIFS PAR SEMAINE

### Semaine 1 (Actuelle)
- [x] Fondations (5 fichiers) ✅
- [ ] Composants critiques (8 fichiers)
- [ ] Module Reports (7 fichiers)

**Objectif** : 20 fichiers refactorisés

### Semaine 2
- [ ] Dialogs Warehouses (7 fichiers)
- [ ] Schémas & Services (3 fichiers)
- [ ] Composants UI (4 fichiers)
- [ ] Invitations (2 fichiers)

**Objectif** : 36 fichiers refactorisés

### Semaine 3-4
- [ ] 59 fichiers restants

**Objectif** : 95 fichiers refactorisés ✅

---

## 📊 SUIVI DE PROGRESSION

Mettre à jour après chaque fichier :

```markdown
## Fichiers Refactorisés

- [x] use-warehouses.ts (442 → 7 fichiers)
- [x] useStore.ts (405 → 7 fichiers)
- [x] use-stores.ts (166 → 9 fichiers)
- [x] use-sidebar-permissions.ts (165 → 4 fichiers)
- [x] landing-page.tsx (376 → 6 fichiers)
- [ ] create-purchase-order-dialog.tsx (340 → ? fichiers)
- [ ] profit-report.tsx (321 → ? fichiers)
- [ ] ...
```

---

## 🚀 COMMENCER MAINTENANT

```bash
# 1. Créer une branche
git checkout -b refactor/phase-2-critiques

# 2. Commencer par le premier fichier critique
# create-purchase-order-dialog.tsx

# 3. Suivre la méthodologie ci-dessus

# 4. Commit régulièrement

# 5. Mettre à jour la documentation
```

---

## 💡 CONSEILS

1. **Ne pas se précipiter** - Qualité > Vitesse
2. **Tester régulièrement** - Éviter les régressions
3. **Documenter** - Faciliter la maintenance
4. **Réutiliser** - Créer des composants partagés
5. **Demander de l'aide** - Si bloqué

---

## 📞 RESSOURCES

- [PROGRESSION.md](./PROGRESSION.md) - Suivi détaillé
- [RESUME_SESSION.md](./RESUME_SESSION.md) - Résumé de la session
- [GUIDE_DEMARRAGE_RAPIDE.md](./GUIDE_DEMARRAGE_RAPIDE.md) - Guide initial
- [SYNTHESE_VISUELLE.md](./SYNTHESE_VISUELLE.md) - Vue d'ensemble

---

**Bonne continuation ! 💪**

**Objectif** : 0 fichiers > 100 lignes  
**Progression** : 5/95 (5%) → 95/95 (100%)

---

**Créé le** : ${new Date().toLocaleString('fr-FR')}
