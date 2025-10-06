# 🔧 Guide de Refactorisation Rapide

## 🎯 Objectif
Réduire les 18 pages restantes de ~3,800 lignes à ~1,200 lignes en utilisant les composants réutilisables.

---

## 📚 Composants Disponibles

### 1. **PageHeader** - En-tête de page
```tsx
import { PageHeader } from "@/components/shared/page-header";

<PageHeader 
  title="Titre de la page"
  description="Description optionnelle"
  backHref="/chemin/retour"
  actions={<Button>Action</Button>}
/>
```

### 2. **StatsCards** - Cartes de statistiques
```tsx
import { StatsCards } from "@/components/shared/stats-cards";
import { Package, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total", value: 100, icon: Package },
  { label: "Valeur", value: "1000 FCFA", icon: TrendingUp }
];

<StatsCards stats={stats} columns={4} />
```

### 3. **DataTableGeneric** - Tableau générique
```tsx
import { DataTableGeneric } from "@/components/shared/data-table-generic";

const columns = [
  { header: "Nom", accessor: (item) => item.name },
  { header: "Prix", accessor: (item) => formatCurrency(item.price) }
];

<DataTableGeneric 
  data={items}
  columns={columns}
  isLoading={isLoading}
  keyExtractor={(item) => item.id}
/>
```

### 4. **ProductForm*** - Formulaires produits
```tsx
import { ProductFormGeneral } from "@/components/products/product-form-general";
import { ProductFormPricing } from "@/components/products/product-form-pricing";
import { ProductFormStock } from "@/components/products/product-form-stock";

<Form>
  <ProductFormGeneral control={form.control} {...props} />
  <ProductFormPricing control={form.control} />
  <ProductFormStock control={form.control} />
</Form>
```

### 5. **Warehouse*** - Composants entrepôt
```tsx
import { WarehouseStatsCards } from "@/components/warehouses/warehouse-stats-cards";
import { WarehouseStockTable } from "@/components/warehouses/warehouse-stock-table";
import { WarehouseMovementsTable } from "@/components/warehouses/warehouse-movements-table";
import { WarehouseOrdersTable } from "@/components/warehouses/warehouse-orders-table";
import { WarehouseActionsMenu } from "@/components/warehouses/warehouse-actions-menu";
```

---

## 🚀 Processus de Refactorisation (5 étapes)

### Étape 1: Identifier les sections répétitives
- En-têtes de page
- Cartes de statistiques
- Tableaux de données
- Formulaires longs
- Menus d'actions

### Étape 2: Extraire en composants
```tsx
// AVANT (dans page.tsx)
<div className="flex items-center gap-4">
  <Button variant="ghost" size="sm" asChild>
    <Link href={backPath}><ArrowLeft /></Link>
  </Button>
  <div className="flex-1">
    <h1 className="text-3xl font-bold">{title}</h1>
    <p className="text-muted-foreground">{description}</p>
  </div>
  <div className="flex gap-2">{actions}</div>
</div>

// APRÈS
<PageHeader title={title} description={description} backHref={backPath} actions={actions} />
```

### Étape 3: Créer des hooks pour la logique
```tsx
// hooks/use-store-dialogs.ts
export function useStoreDialogs() {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  return { editOpen, setEditOpen, deleteOpen, setDeleteOpen };
}
```

### Étape 4: Simplifier les imports
```tsx
// AVANT (15+ imports)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// ... 12 autres imports

// APRÈS (5 imports)
import { PageHeader } from "@/components/shared/page-header";
import { StatsCards } from "@/components/shared/stats-cards";
import { DataTableGeneric } from "@/components/shared/data-table-generic";
```

### Étape 5: Tester et valider
- Vérifier que toutes les fonctionnalités marchent
- Tester les interactions utilisateur
- Vérifier les styles

---

## 📋 Checklist par Page

### Pour chaque page à refactoriser:

- [ ] Lire le fichier et identifier les sections
- [ ] Remplacer l'en-tête par `<PageHeader />`
- [ ] Remplacer les cartes stats par `<StatsCards />`
- [ ] Remplacer les tableaux par `<DataTableGeneric />`
- [ ] Extraire les formulaires longs en composants
- [ ] Créer un hook pour les états de dialogues
- [ ] Simplifier les imports
- [ ] Tester la page
- [ ] Vérifier la réduction de lignes

---

## 🎨 Templates de Refactorisation

### Template 1: Page de Liste
```tsx
"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCards } from "@/components/shared/stats-cards";
import { DataTableGeneric } from "@/components/shared/data-table-generic";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useData } from "@/hooks/use-data";

export default function ListPage() {
  const params = useParams();
  const { data, isLoading } = useData(params.id);

  const stats = [/* ... */];
  const columns = [/* ... */];

  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title="Liste"
        backHref="/back"
        actions={<Button><Plus />Nouveau</Button>}
      />
      <StatsCards stats={stats} />
      <DataTableGeneric data={data} columns={columns} isLoading={isLoading} keyExtractor={(i) => i.id} />
    </div>
  );
}
```

### Template 2: Page de Formulaire
```tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { FormSectionGeneral } from "@/components/entity/form-section-general";

export default function FormPage() {
  const params = useParams();
  const router = useRouter();
  const form = useForm({ /* ... */ });

  const onSubmit = async (data) => { /* ... */ };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Formulaire" backHref="/back" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormSectionGeneral control={form.control} />
          <Button type="submit">Enregistrer</Button>
        </form>
      </Form>
    </div>
  );
}
```

### Template 3: Page de Détails
```tsx
"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCards } from "@/components/shared/stats-cards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTableGeneric } from "@/components/shared/data-table-generic";
import { useEntity } from "@/hooks/use-entity";

export default function DetailsPage() {
  const params = useParams();
  const { data, isLoading } = useEntity(params.id);

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="p-6 space-y-6">
      <PageHeader title={data.name} backHref="/back" />
      <StatsCards stats={[/* ... */]} />
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <Card>
            <CardHeader><CardTitle>Titre</CardTitle></CardHeader>
            <CardContent>
              <DataTableGeneric data={data.items} columns={[/* ... */]} isLoading={false} keyExtractor={(i) => i.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

---

## ⚡ Raccourcis de Refactorisation

### Remplacements Rapides

1. **En-tête de page:**
   - Chercher: `<div className="flex items-center gap-4">` + `<h1>` + `<Button>` + `<Link>`
   - Remplacer par: `<PageHeader />`

2. **Cartes de stats:**
   - Chercher: `<div className="grid">` + multiple `<Card>` avec stats
   - Remplacer par: `<StatsCards stats={[...]} />`

3. **Tableaux:**
   - Chercher: `<Table>` + `<TableHeader>` + `<TableBody>` + `.map()`
   - Remplacer par: `<DataTableGeneric columns={[...]} />`

4. **Dialogues:**
   - Chercher: multiple `useState` pour dialogues
   - Remplacer par: `const dialogs = useEntityDialogs()`

---

## 📊 Objectifs de Réduction

| Taille Originale | Objectif | Réduction |
|------------------|----------|-----------|
| 300-500 lignes   | 80-120   | ~75%      |
| 200-300 lignes   | 60-90    | ~70%      |
| 100-200 lignes   | 40-60    | ~65%      |

---

## ✅ Validation Finale

Après refactorisation, vérifier:

1. ✅ Toutes les fonctionnalités marchent
2. ✅ Les styles sont identiques
3. ✅ Les performances sont maintenues
4. ✅ Le code est plus lisible
5. ✅ Les composants sont réutilisables
6. ✅ La réduction de lignes est >60%

---

## 🎯 Résultat Attendu

**Avant:** 20 pages, ~4,500 lignes
**Après:** 20 pages, ~1,500 lignes
**Gain:** ~3,000 lignes (66% de réduction)
**Composants réutilisables:** 20+
**Maintenabilité:** ⬆️⬆️⬆️
