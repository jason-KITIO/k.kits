# 📦 Composants Réutilisables - K.Kits

## 📂 Structure

```
components/
├── shared/              # Composants génériques réutilisables
│   ├── page-header.tsx
│   ├── stats-cards.tsx
│   └── data-table-generic.tsx
├── warehouses/          # Composants spécifiques aux entrepôts
│   ├── warehouse-stats-cards.tsx
│   ├── warehouse-actions-menu.tsx
│   ├── warehouse-stock-table.tsx
│   ├── warehouse-movements-table.tsx
│   └── warehouse-orders-table.tsx
├── products/            # Composants spécifiques aux produits
│   ├── product-form-general.tsx
│   ├── product-form-pricing.tsx
│   └── product-form-stock.tsx
└── ui/                  # Composants UI de base (shadcn)
```

---

## 🎨 Composants Shared

### PageHeader
En-tête de page avec titre, description, bouton retour et actions.

```tsx
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

<PageHeader 
  title="Gestion des Produits"
  description="Liste de tous les produits"
  backHref="/preferences/organizations/123"
  actions={
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Nouveau Produit
    </Button>
  }
/>
```

### StatsCards
Cartes de statistiques avec icônes.

```tsx
import { StatsCards } from "@/components/shared/stats-cards";
import { Package, TrendingUp, ShoppingCart } from "lucide-react";

const stats = [
  { label: "Total Produits", value: 150, icon: Package },
  { label: "Valeur Stock", value: "1,500,000 FCFA", icon: TrendingUp },
  { label: "Commandes", value: 25, icon: ShoppingCart }
];

<StatsCards stats={stats} columns={3} />
```

### DataTableGeneric
Tableau de données générique avec chargement.

```tsx
import { DataTableGeneric } from "@/components/shared/data-table-generic";
import { Badge } from "@/components/ui/badge";

const columns = [
  { 
    header: "Nom", 
    accessor: (item) => item.name,
    className: "font-medium"
  },
  { 
    header: "Statut", 
    accessor: (item) => <Badge>{item.status}</Badge>
  },
  { 
    header: "Prix", 
    accessor: (item) => formatCurrency(item.price)
  }
];

<DataTableGeneric 
  data={products}
  columns={columns}
  isLoading={isLoading}
  keyExtractor={(item) => item.id}
/>
```

---

## 🏭 Composants Warehouses

### WarehouseStatsCards
Cartes de statistiques spécifiques aux entrepôts.

```tsx
import { WarehouseStatsCards } from "@/components/warehouses/warehouse-stats-cards";

<WarehouseStatsCards 
  organizationId={orgId}
  stock={stockData}
  purchaseOrders={ordersData}
/>
```

### WarehouseActionsMenu
Menu d'actions pour un entrepôt.

```tsx
import { WarehouseActionsMenu } from "@/components/warehouses/warehouse-actions-menu";

<WarehouseActionsMenu
  organizationId={orgId}
  warehouseId={warehouseId}
  hasStock={stock.length > 0}
  onRestock={() => setRestockOpen(true)}
  onTransfer={() => setTransferOpen(true)}
  onStoreTransfer={() => setStoreTransferOpen(true)}
  onDelete={() => setDeleteOpen(true)}
/>
```

### WarehouseStockTable
Tableau de stock d'entrepôt.

```tsx
import { WarehouseStockTable } from "@/components/warehouses/warehouse-stock-table";

<WarehouseStockTable 
  organizationId={orgId}
  stock={stockData}
  isLoading={isLoading}
/>
```

### WarehouseMovementsTable
Tableau des mouvements de stock.

```tsx
import { WarehouseMovementsTable } from "@/components/warehouses/warehouse-movements-table";

<WarehouseMovementsTable 
  movements={movementsData}
  isLoading={isLoading}
/>
```

### WarehouseOrdersTable
Tableau des commandes d'achat.

```tsx
import { WarehouseOrdersTable } from "@/components/warehouses/warehouse-orders-table";

<WarehouseOrdersTable
  organizationId={orgId}
  warehouseId={warehouseId}
  orders={ordersData}
  isLoading={isLoading}
  onMarkAsReceived={(orderId) => handleReceive(orderId)}
  isMarkingReceived={isPending}
/>
```

---

## 🛍️ Composants Products

### ProductFormGeneral
Section informations générales du formulaire produit.

```tsx
import { ProductFormGeneral } from "@/components/products/product-form-general";

<ProductFormGeneral
  control={form.control}
  categories={categories}
  suppliers={suppliers}
  warehouses={warehouses}
  categoriesLoading={categoriesLoading}
  suppliersLoading={suppliersLoading}
  warehousesLoading={warehousesLoading}
/>
```

### ProductFormPricing
Section prix et coûts du formulaire produit.

```tsx
import { ProductFormPricing } from "@/components/products/product-form-pricing";

<ProductFormPricing control={form.control} />
```

### ProductFormStock
Section stock initial du formulaire produit.

```tsx
import { ProductFormStock } from "@/components/products/product-form-stock";

<ProductFormStock control={form.control} />
```

---

## 🎣 Hooks Personnalisés

### useWarehouseDialogs
Gestion des états de dialogues d'entrepôt.

```tsx
import { useWarehouseDialogs } from "@/hooks/use-warehouse-dialogs";

const dialogs = useWarehouseDialogs();

// Utilisation
<Button onClick={() => dialogs.setAdjustmentDialogOpen(true)}>
  Ajuster Stock
</Button>

<StockAdjustmentDialog 
  open={dialogs.adjustmentDialogOpen}
  onOpenChange={dialogs.setAdjustmentDialogOpen}
/>
```

---

## 📝 Exemple Complet

### Page de Liste avec Tous les Composants

```tsx
"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCards } from "@/components/shared/stats-cards";
import { DataTableGeneric } from "@/components/shared/data-table-generic";
import { Button } from "@/components/ui/button";
import { Plus, Package, TrendingUp } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { useCurrencyFormatter } from "@/hooks/use-currency";

export default function ProductsPage() {
  const params = useParams();
  const orgId = params.id as string;
  const { data: products, isLoading } = useProducts(orgId);
  const formatCurrency = useCurrencyFormatter(orgId);

  const stats = [
    { label: "Total Produits", value: products?.length || 0, icon: Package },
    { 
      label: "Valeur Totale", 
      value: formatCurrency(products?.reduce((sum, p) => sum + p.unitPrice, 0) || 0),
      icon: TrendingUp 
    }
  ];

  const columns = [
    { header: "Nom", accessor: (p) => p.name, className: "font-medium" },
    { header: "SKU", accessor: (p) => p.sku },
    { header: "Prix", accessor: (p) => formatCurrency(p.unitPrice) }
  ];

  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title="Produits"
        description="Gérez votre catalogue de produits"
        backHref={`/preferences/organizations/${orgId}`}
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Produit
          </Button>
        }
      />
      
      <StatsCards stats={stats} columns={2} />
      
      <DataTableGeneric 
        data={products}
        columns={columns}
        isLoading={isLoading}
        keyExtractor={(p) => p.id}
      />
    </div>
  );
}
```

---

## 🎯 Bonnes Pratiques

### 1. Toujours utiliser les composants partagés
❌ **Mauvais:**
```tsx
<div className="flex items-center gap-4">
  <Button variant="ghost" size="sm" asChild>
    <Link href="/back"><ArrowLeft /></Link>
  </Button>
  <h1 className="text-3xl font-bold">Titre</h1>
</div>
```

✅ **Bon:**
```tsx
<PageHeader title="Titre" backHref="/back" />
```

### 2. Extraire la logique complexe en hooks
❌ **Mauvais:**
```tsx
const [open1, setOpen1] = useState(false);
const [open2, setOpen2] = useState(false);
const [open3, setOpen3] = useState(false);
// ... 10 autres états
```

✅ **Bon:**
```tsx
const dialogs = useEntityDialogs();
// Tous les états gérés dans le hook
```

### 3. Utiliser DataTableGeneric pour les tableaux
❌ **Mauvais:**
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Col1</TableHead>
      <TableHead>Col2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data?.map(item => (
      <TableRow key={item.id}>
        <TableCell>{item.col1}</TableCell>
        <TableCell>{item.col2}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

✅ **Bon:**
```tsx
<DataTableGeneric 
  data={data}
  columns={[
    { header: "Col1", accessor: (i) => i.col1 },
    { header: "Col2", accessor: (i) => i.col2 }
  ]}
  isLoading={isLoading}
  keyExtractor={(i) => i.id}
/>
```

---

## 🔧 Création de Nouveaux Composants

### Quand créer un nouveau composant?

1. **Code répété 3+ fois** → Créer un composant partagé
2. **Section >50 lignes** → Extraire en composant
3. **Logique complexe** → Créer un hook
4. **Formulaire >100 lignes** → Diviser en sections

### Template de Composant

```tsx
"use client";

import { ComponentProps } from "react";

interface MyComponentProps {
  // Props typées
  data: DataType;
  onAction: () => void;
  isLoading?: boolean;
}

export function MyComponent({ data, onAction, isLoading = false }: MyComponentProps) {
  // Logique du composant
  
  if (isLoading) return <div>Chargement...</div>;
  
  return (
    <div>
      {/* JSX du composant */}
    </div>
  );
}
```

---

## 📚 Ressources

- [Guide de Refactorisation](../REFACTORING_GUIDE.md)
- [Résumé de Refactorisation](../REFACTORING_SUMMARY.md)
- [État de Refactorisation](../REFACTORING_STATUS.md)
- [Documentation shadcn/ui](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [TanStack Query](https://tanstack.com/query)

---

**Dernière mise à jour:** $(date)
**Composants disponibles:** 12
**Pages refactorisées:** 2/20
