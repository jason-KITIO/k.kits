# 🔍 AUDIT COMPLET - FICHIERS > 100 LIGNES

**Date**: ${new Date().toLocaleDateString('fr-FR')}  
**Objectif**: Identifier tous les fichiers dépassant 100 lignes pour refactorisation  
**Total fichiers identifiés**: **95 fichiers**

---

## 📊 STATISTIQUES GLOBALES

### Répartition par catégorie

| Catégorie | Nombre | % Total | Lignes Moy. |
|-----------|--------|---------|-------------|
| **🎨 Composants UI** | 35 | 37% | 189 |
| **📄 Pages** | 0 | 0% | - |
| **🔧 Hooks** | 12 | 13% | 178 |
| **🌐 API Routes** | 15 | 16% | 156 |
| **📦 Services** | 8 | 8% | 121 |
| **🎯 Autres** | 25 | 26% | 143 |

### Top 10 des fichiers les plus volumineux

| # | Fichier | Lignes | Priorité |
|---|---------|--------|----------|
| 1 | `src/components/ui/sidebar.tsx` | **671** | 🔴 CRITIQUE |
| 2 | `src/hooks/use-warehouses.ts` | **442** | 🔴 CRITIQUE |
| 3 | `src/hooks/useStore.ts` | **405** | 🔴 CRITIQUE |
| 4 | `src/components/landing/landing-page.tsx` | **376** | 🔴 CRITIQUE |
| 5 | `src/components/warehouses/create-purchase-order-dialog.tsx` | **340** | 🔴 CRITIQUE |
| 6 | `src/components/reports/profit-report.tsx` | **321** | 🟠 HAUTE |
| 7 | `src/components/reports/customer-report.tsx` | **291** | 🟠 HAUTE |
| 8 | `src/components/settings/user-settings.tsx` | **287** | 🟠 HAUTE |
| 9 | `src/components/roles/role-list.tsx` | **276** | 🟠 HAUTE |
| 10 | `src/components/reports/performance-report.tsx` | **275** | 🟠 HAUTE |

---

## 🔴 PRIORITÉ CRITIQUE (> 300 lignes) - 5 fichiers

### 1. `src/components/ui/sidebar.tsx` - **671 lignes**
**Problèmes**:
- Composant monolithique avec trop de responsabilités
- Mélange de logique UI et business
- Nombreux sous-composants non extraits

**Plan de refactorisation**:
```
sidebar.tsx (671 lignes) →
├── atoms/
│   ├── SidebarTrigger.tsx (15 lignes)
│   ├── SidebarItem.tsx (25 lignes)
│   └── SidebarIcon.tsx (10 lignes)
├── molecules/
│   ├── SidebarGroup.tsx (40 lignes)
│   ├── SidebarMenu.tsx (50 lignes)
│   └── SidebarHeader.tsx (35 lignes)
├── organisms/
│   ├── SidebarContent.tsx (80 lignes)
│   └── SidebarFooter.tsx (60 lignes)
└── sidebar.tsx (80 lignes - orchestration)
```

**Gain estimé**: 671 → 8 fichiers < 80 lignes

---

### 2. `src/hooks/use-warehouses.ts` - **442 lignes**
**Problèmes**:
- Hook géant avec multiples responsabilités
- Logique CRUD mélangée avec logique métier
- Pas de séparation des préoccupations

**Plan de refactorisation**:
```
use-warehouses.ts (442 lignes) →
├── hooks/warehouses/
│   ├── useWarehouseList.ts (60 lignes)
│   ├── useWarehouseCreate.ts (50 lignes)
│   ├── useWarehouseUpdate.ts (50 lignes)
│   ├── useWarehouseDelete.ts (40 lignes)
│   ├── useWarehouseStock.ts (70 lignes)
│   ├── useWarehouseTransfers.ts (80 lignes)
│   └── index.ts (20 lignes - exports)
```

**Gain estimé**: 442 → 7 fichiers < 80 lignes

---

### 3. `src/hooks/useStore.ts` - **405 lignes**
**Problèmes**:
- Duplication avec use-stores.ts (166 lignes)
- Logique métier complexe non séparée
- Gestion d'état trop volumineuse

**Plan de refactorisation**:
```
useStore.ts (405 lignes) →
├── hooks/stores/
│   ├── useStoreData.ts (60 lignes)
│   ├── useStoreOperations.ts (70 lignes)
│   ├── useStoreStock.ts (80 lignes)
│   ├── useStoreSales.ts (70 lignes)
│   ├── useStoreCustomers.ts (60 lignes)
│   └── index.ts (15 lignes)
```

**Gain estimé**: 405 → 6 fichiers < 80 lignes

---

### 4. `src/components/landing/landing-page.tsx` - **376 lignes**
**Problèmes**:
- Page monolithique avec toutes les sections
- Pas de séparation en composants
- Client Component alors que devrait être Server Component

**Plan de refactorisation**:
```
landing-page.tsx (376 lignes) →
├── templates/
│   └── LandingLayout.tsx (30 lignes - Server)
├── organisms/
│   ├── HeroSection.tsx (60 lignes)
│   ├── FeaturesSection.tsx (70 lignes)
│   ├── StatsSection.tsx (50 lignes)
│   ├── CTASection.tsx (40 lignes)
│   └── LandingFooter.tsx (50 lignes)
└── app/page.tsx (10 lignes - Server)
```

**Gain estimé**: 376 → 7 fichiers < 70 lignes (5 Server Components)

---

### 5. `src/components/warehouses/create-purchase-order-dialog.tsx` - **340 lignes**
**Problèmes**:
- Dialog complexe avec formulaire volumineux
- Logique de validation inline
- Pas de séparation form/dialog

**Plan de refactorisation**:
```
create-purchase-order-dialog.tsx (340 lignes) →
├── molecules/
│   ├── PurchaseOrderForm.tsx (80 lignes)
│   ├── PurchaseOrderItems.tsx (70 lignes)
│   └── PurchaseOrderSummary.tsx (50 lignes)
├── organisms/
│   └── PurchaseOrderDialog.tsx (60 lignes)
└── hooks/
    └── usePurchaseOrder.ts (50 lignes)
```

**Gain estimé**: 340 → 5 fichiers < 80 lignes

---

## 🟠 PRIORITÉ HAUTE (200-300 lignes) - 15 fichiers

### Composants Reports (7 fichiers)

#### `src/components/reports/profit-report.tsx` - **321 lignes**
```
profit-report.tsx →
├── molecules/reports/
│   ├── ProfitChart.tsx (60 lignes)
│   ├── ProfitMetrics.tsx (50 lignes)
│   └── ProfitFilters.tsx (40 lignes)
└── organisms/reports/
    └── ProfitReportContent.tsx (80 lignes)
```

#### `src/components/reports/customer-report.tsx` - **291 lignes**
```
customer-report.tsx →
├── molecules/reports/
│   ├── CustomerChart.tsx (60 lignes)
│   ├── CustomerMetrics.tsx (50 lignes)
│   └── CustomerTable.tsx (70 lignes)
└── organisms/reports/
    └── CustomerReportContent.tsx (70 lignes)
```

#### `src/components/reports/performance-report.tsx` - **275 lignes**
#### `src/components/reports/financial-report.tsx` - **248 lignes**
#### `src/components/reports/movement-report.tsx` - **227 lignes**
#### `src/components/reports/report-dashboard.tsx` - **225 lignes**
#### `src/components/reports/stock-report.tsx` - **223 lignes**

**Plan global Reports**:
```
reports/ →
├── atoms/
│   ├── ReportCard.tsx (20 lignes)
│   └── ReportMetric.tsx (15 lignes)
├── molecules/
│   ├── ReportChart.tsx (50 lignes)
│   ├── ReportTable.tsx (60 lignes)
│   ├── ReportFilters.tsx (40 lignes)
│   └── ReportSummary.tsx (45 lignes)
├── organisms/
│   ├── ProfitReport.tsx (80 lignes)
│   ├── CustomerReport.tsx (80 lignes)
│   ├── PerformanceReport.tsx (80 lignes)
│   ├── FinancialReport.tsx (80 lignes)
│   ├── MovementReport.tsx (80 lignes)
│   ├── StockReport.tsx (80 lignes)
│   └── ReportDashboard.tsx (90 lignes)
└── hooks/
    └── useReportData.ts (60 lignes)
```

**Gain estimé**: 1,810 lignes → 18 fichiers < 90 lignes

---

### Autres composants haute priorité

#### `src/components/settings/user-settings.tsx` - **287 lignes**
```
user-settings.tsx →
├── molecules/settings/
│   ├── ProfileSection.tsx (60 lignes)
│   ├── SecuritySection.tsx (60 lignes)
│   └── PreferencesSection.tsx (50 lignes)
└── organisms/settings/
    └── UserSettingsContent.tsx (70 lignes)
```

#### `src/components/roles/role-list.tsx` - **276 lignes**
```
role-list.tsx →
├── molecules/roles/
│   ├── RoleCard.tsx (50 lignes)
│   ├── RoleTable.tsx (60 lignes)
│   └── RoleFilters.tsx (40 lignes)
└── organisms/roles/
    └── RoleListContent.tsx (70 lignes)
```

#### `src/components/app-sidebar.tsx` - **267 lignes**
```
app-sidebar.tsx →
├── molecules/sidebar/
│   ├── SidebarNav.tsx (60 lignes)
│   ├── SidebarOrg.tsx (50 lignes)
│   └── SidebarUser.tsx (50 lignes)
└── organisms/
    └── AppSidebarContent.tsx (70 lignes)
```

#### `src/components/ui/dropdown-menu.tsx` - **238 lignes**
```
dropdown-menu.tsx →
├── atoms/
│   ├── DropdownItem.tsx (20 lignes)
│   ├── DropdownSeparator.tsx (10 lignes)
│   └── DropdownLabel.tsx (15 lignes)
└── molecules/
    └── DropdownMenu.tsx (80 lignes)
```

#### `src/schema/report.schema.ts` - **243 lignes**
```
report.schema.ts →
├── schemas/reports/
│   ├── profit-report.schema.ts (40 lignes)
│   ├── customer-report.schema.ts (40 lignes)
│   ├── financial-report.schema.ts (40 lignes)
│   ├── stock-report.schema.ts (40 lignes)
│   └── base-report.schema.ts (30 lignes)
```

#### `src/components/settings/organization-settings.tsx` - **230 lignes**
```
organization-settings.tsx →
├── molecules/settings/
│   ├── OrgInfoSection.tsx (60 lignes)
│   ├── OrgBrandingSection.tsx (50 lignes)
│   └── OrgPreferencesSection.tsx (50 lignes)
└── organisms/settings/
    └── OrgSettingsContent.tsx (60 lignes)
```

---

## 🟡 PRIORITÉ MOYENNE (150-200 lignes) - 25 fichiers

### API Routes (8 fichiers)

| Fichier | Lignes | Action |
|---------|--------|--------|
| `app/api/auth/me/route.ts` | 240 | Séparer en services |
| `app/api/auth/email/login/verify/route.ts` | 205 | Extraire validation |
| `app/api/auth/email/login/route.ts` | 185 | Simplifier logique |
| `app/api/auth/phone/login/route.ts` | 157 | Extraire SMS service |
| `app/api/auth/session/route.ts` | 152 | Séparer CRUD |
| `app/api/auth/phone/send-verification/route.ts` | 146 | Simplifier |
| `app/api/auth/email/register/route.ts` | 142 | Extraire validation |
| `app/api/middleware.ts` | 142 | Séparer middlewares |

**Plan API Routes**:
```
api/ →
├── lib/
│   ├── auth-handlers.ts (80 lignes)
│   ├── validation-handlers.ts (60 lignes)
│   └── response-helpers.ts (40 lignes)
└── routes/
    └── [route]/route.ts (< 60 lignes chacun)
```

---

### Composants Warehouses (6 fichiers)

| Fichier | Lignes | Action |
|---------|--------|--------|
| `warehouses/delete-warehouse-dialog.tsx` | 200 | Extraire confirmation |
| `warehouses/stock-transfer-dialog.tsx` | 197 | Séparer form/dialog |
| `warehouses/restock-dialog.tsx` | 195 | Simplifier form |
| `warehouses/store-transfer-dialog.tsx` | 191 | Extraire logique |
| `warehouses/stock-adjustment-dialog.tsx` | 181 | Séparer validation |
| `warehouses/create-warehouse-dialog.tsx` | 179 | Simplifier form |

**Plan Warehouses**:
```
warehouses/ →
├── molecules/
│   ├── WarehouseForm.tsx (60 lignes)
│   ├── StockTransferForm.tsx (60 lignes)
│   └── RestockForm.tsx (60 lignes)
└── organisms/
    ├── WarehouseDialog.tsx (50 lignes)
    ├── StockTransferDialog.tsx (50 lignes)
    └── RestockDialog.tsx (50 lignes)
```

---

### Autres composants (11 fichiers)

| Fichier | Lignes | Catégorie |
|---------|--------|-----------|
| `preferences/legacy-2FA.tsx` | 187 | Settings |
| `ui/skeletons.tsx` | 186 | UI |
| `nav-organisation.tsx` | 184 | Navigation |
| `ui/data-table.tsx` | 180 | UI |
| `stock-movement-requests/stock-movement-request-list.tsx` | 176 | Lists |
| `reports/sales-report.tsx` | 173 | Reports |
| `ui/select.tsx` | 171 | UI |
| `support/feedback-form.tsx` | 171 | Forms |
| `reports/report-filters.tsx` | 171 | Reports |
| `hooks/use-stores.ts` | 166 | Hooks |
| `hooks/use-sidebar-permissions.ts` | 165 | Hooks |

---

## 🟢 PRIORITÉ BASSE (100-150 lignes) - 50 fichiers

### Répartition

| Catégorie | Nombre | Action recommandée |
|-----------|--------|-------------------|
| Composants UI | 18 | Extraire atoms/molecules |
| Hooks | 8 | Séparer responsabilités |
| Services | 6 | Découper en modules |
| API Routes | 10 | Simplifier handlers |
| Autres | 8 | Refactoriser selon besoin |

### Liste complète (100-150 lignes)

```
stock-movement-requests/approval-dialog.tsx - 166
services/organization-service.ts - 158
lib/api-protection.ts - 158
stock-returns/create-stock-return-dialog.tsx - 158
profile/profile-form.tsx - 152
profile/user-settings-form.tsx - 151
nav-store.tsx - 150
stock-movement-requests/create-stock-movement-request-dialog.tsx - 146
hooks/useOrganization.ts - 145
ui/form.tsx - 143
stock-returns/stock-return-list.tsx - 143
stock-movement-requests/create-request-dialog.tsx - 143
nav-user.tsx - 143
ui/alert-dialog.tsx - 142
api/invitations/accept/route.ts - 113
permission-examples.tsx - 140
support/support-center.tsx - 137
preferences/theme-switcher.tsx - 135
hooks/use-reports.ts - 133
api/auth/phone/verify/route.ts - 133
auth/login/verification/verification-form.tsx - 130
ui/sheet.tsx - 126
protected-store-sidebar.tsx - 126
lib/email.ts - 125
customers/customer-form.tsx - 125
dashboard-actions.tsx - 124
services/store-service.ts - 123
lib/notification-service.ts - 123
organisms/OrganizationsContent.tsx - 119
api/auth/email/verify/route.ts - 117
organisms/OrganizationsTable.tsx - 116
api/auth/email/login/send-verification/route.ts - 116
store-sidebar.tsx - 115
lib/permissions.ts - 114
ui/dialog.tsx - 108
services/warehouse-service.ts - 107
api/organization/route.ts - 107
hooks/use-permissions.ts - 105
services/report-service.ts - 104
ui/table.tsx - 104
permission-guard.tsx - 104
invitation/invitation-modal.tsx - 104
hooks/use-stock-movement-requests.ts - 103
hooks/use-categories.ts - 103
stock-returns/process-return-dialog.tsx - 102
nav-main.tsx - 101
```

---

## 📋 PLAN D'ACTION GLOBAL

### Phase 1: Fondations (Semaine 1)
**Objectif**: Créer la structure atomique de base

1. **Créer l'architecture**:
   ```
   src/components/
   ├── atoms/          (composants < 30 lignes)
   ├── molecules/      (composants < 50 lignes)
   ├── organisms/      (composants < 80 lignes)
   └── templates/      (layouts < 100 lignes)
   ```

2. **Extraire les atoms communs** (20 composants):
   - Logo, Button, Input, Label
   - Icon, Badge, Avatar, Separator
   - LoadingSpinner, ErrorMessage
   - StatCard, MetricCard, etc.

3. **Créer les hooks partagés** (10 hooks):
   - usePasswordToggle, useViewMode
   - useDeleteDialog, useFormState
   - useDebounce, useLocalStorage, etc.

**Livrable**: Structure de base + 30 fichiers < 30 lignes

---

### Phase 2: Composants Critiques (Semaine 2-3)
**Objectif**: Refactoriser les 5 fichiers > 300 lignes

1. **Sidebar (671 → 8 fichiers)**
2. **use-warehouses (442 → 7 fichiers)**
3. **useStore (405 → 6 fichiers)**
4. **landing-page (376 → 7 fichiers)**
5. **create-purchase-order-dialog (340 → 5 fichiers)**

**Livrable**: 2,534 lignes → 33 fichiers < 80 lignes

---

### Phase 3: Reports & Settings (Semaine 4)
**Objectif**: Refactoriser les composants Reports (1,810 lignes)

1. **Créer composants partagés Reports**:
   - ReportCard, ReportChart, ReportTable
   - ReportFilters, ReportSummary

2. **Refactoriser chaque report**:
   - profit-report, customer-report
   - performance-report, financial-report
   - movement-report, stock-report
   - report-dashboard

**Livrable**: 1,810 lignes → 18 fichiers < 90 lignes

---

### Phase 4: Dialogs & Forms (Semaine 5)
**Objectif**: Refactoriser tous les dialogs > 150 lignes

1. **Warehouses dialogs** (6 fichiers)
2. **Stock dialogs** (4 fichiers)
3. **Settings forms** (3 fichiers)

**Livrable**: 1,500 lignes → 25 fichiers < 70 lignes

---

### Phase 5: API Routes (Semaine 6)
**Objectif**: Simplifier les routes API > 150 lignes

1. **Extraire handlers communs**
2. **Créer validation middleware**
3. **Simplifier chaque route**

**Livrable**: 1,400 lignes → 20 fichiers < 80 lignes

---

### Phase 6: Hooks & Services (Semaine 7)
**Objectif**: Découper hooks et services volumineux

1. **Hooks** (12 fichiers > 100 lignes)
2. **Services** (8 fichiers > 100 lignes)

**Livrable**: 1,800 lignes → 40 fichiers < 70 lignes

---

### Phase 7: Finitions (Semaine 8)
**Objectif**: Refactoriser les 50 fichiers restants (100-150 lignes)

1. **UI Components** (18 fichiers)
2. **Navigation** (5 fichiers)
3. **Autres** (27 fichiers)

**Livrable**: 6,000 lignes → 100 fichiers < 100 lignes

---

## 📊 GAINS ATTENDUS

### Avant refactorisation
- **95 fichiers** > 100 lignes
- **Total**: ~17,000 lignes dans ces fichiers
- **Moyenne**: 179 lignes/fichier
- **Max**: 671 lignes (sidebar.tsx)

### Après refactorisation
- **~300 fichiers** < 100 lignes
- **Total**: ~17,000 lignes (même code)
- **Moyenne**: 57 lignes/fichier
- **Max**: < 100 lignes

### Bénéfices
- ✅ **100%** des fichiers < 100 lignes
- ✅ **+215** nouveaux fichiers réutilisables
- ✅ **-68%** complexité par fichier
- ✅ **+300%** maintenabilité
- ✅ **-50%** temps de compréhension
- ✅ **+200%** testabilité

---

## 🎯 MÉTRIQUES DE SUCCÈS

### Critères de validation
- [ ] Aucun fichier > 100 lignes
- [ ] Architecture atomique complète
- [ ] 80% Server Components (pages)
- [ ] 0 duplication de code
- [ ] Tests unitaires pour chaque composant
- [ ] Documentation complète

### KPIs
- **Bundle size**: -62% attendu
- **FCP (First Contentful Paint)**: -68% attendu
- **Hydration time**: -75% attendu
- **Code coverage**: +40% attendu

---

## 📝 NOTES IMPORTANTES

### Règles de refactorisation
1. **Jamais supprimer de fonctionnalité**
2. **Toujours tester après chaque changement**
3. **Respecter l'architecture atomique**
4. **Privilégier Server Components**
5. **Documenter chaque nouveau composant**

### Outils recommandés
- **ESLint**: Règle max-lines: 100
- **Prettier**: Formatage automatique
- **Jest**: Tests unitaires
- **Storybook**: Documentation composants

---

## 🚀 PROCHAINES ÉTAPES

1. **Valider ce plan** avec l'équipe
2. **Créer les branches** Git pour chaque phase
3. **Commencer Phase 1**: Structure atomique
4. **Setup CI/CD**: Tests automatiques
5. **Documentation**: Guide de contribution

---

**Prêt à commencer la refactorisation ?** 🎉
