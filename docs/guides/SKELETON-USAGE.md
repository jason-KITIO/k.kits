# 🎨 Guide d'utilisation des Skeletons Shadcn/ui

## ✅ Skeletons implémentés dans l'application

### 📊 **Pages principales optimisées**
- ✅ Dashboard (`/dashboard/page.tsx`)
- ✅ Boutiques (`/stores/page.tsx`) 
- ✅ Utilisateurs (`/users/page.tsx`)
- ✅ Rôles (`/role/page.tsx`)

### 🧩 **Composants disponibles**

#### **1. Composants de base**
```tsx
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton simple
<Skeleton className="h-4 w-[250px]" />
<Skeleton className="h-12 w-12 rounded-full" />
```

#### **2. Composants composés**
```tsx
import { 
  PageHeaderSkeleton, 
  StatsCardsSkeleton, 
  TableSkeleton, 
  CardGridSkeleton 
} from "@/components/ui/loading-states";

// En-tête de page
<PageHeaderSkeleton />

// Cartes de statistiques
<StatsCardsSkeleton count={4} />

// Tableau
<TableSkeleton rows={5} />

// Grille de cartes
<CardGridSkeleton count={6} />
```

#### **3. Hooks utilitaires**
```tsx
import { useSkeleton, createTableSkeleton, createCardListSkeleton } from "@/hooks/use-skeleton";

// Hook simple
const content = useSkeleton({
  isLoading,
  skeleton: <PageHeaderSkeleton />,
  children: <ActualContent />
});

// Générateurs rapides
const tableSkeleton = createTableSkeleton(5, 4); // 5 lignes, 4 colonnes
const cardsSkeleton = createCardListSkeleton(6); // 6 cartes
```

## 🚀 **Exemples d'implémentation**

### **Dashboard complet**
```tsx
export default function DashboardPage() {
  const { data, isLoading } = useDashboard(organizationId);

  if (isLoading) {
    return (
      <div className="space-y-8 p-6">
        <PageHeaderSkeleton />
        <StatsCardsSkeleton count={4} />
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-[150px]" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-3 w-[100px]" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return <ActualDashboard data={data} />;
}
```

### **Liste avec tableau**
```tsx
export default function UsersPage() {
  const { data: users, isLoading } = useUsers(organizationId);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <PageHeaderSkeleton />
        <StatsCardsSkeleton count={4} />
        <TableSkeleton rows={8} />
      </div>
    );
  }

  return <UsersList users={users} />;
}
```

### **Grille de cartes**
```tsx
export default function StoresPage() {
  const { data: stores, isLoading } = useStores(organizationId);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <PageHeaderSkeleton />
        <StatsCardsSkeleton count={4} />
        <CardGridSkeleton count={6} />
      </div>
    );
  }

  return <StoresList stores={stores} />;
}
```

## 🎯 **Bonnes pratiques**

### **1. Cohérence visuelle**
- ✅ Utiliser les mêmes dimensions que le contenu réel
- ✅ Respecter la structure de layout (Card, Grid, etc.)
- ✅ Maintenir les espacements identiques

### **2. Performance**
- ✅ Éviter les skeletons trop complexes
- ✅ Utiliser `Array.from({ length: n })` pour les répétitions
- ✅ Réutiliser les composants skeleton

### **3. Accessibilité**
- ✅ Le composant Skeleton de Shadcn inclut `aria-label="Loading"`
- ✅ Utiliser des textes de chargement explicites quand nécessaire

## 📋 **Checklist d'implémentation**

### **Pour chaque page :**
- [ ] Identifier les états de loading
- [ ] Créer le skeleton correspondant à la structure
- [ ] Utiliser les composants Shadcn Skeleton
- [ ] Tester la cohérence visuelle
- [ ] Vérifier les performances

### **Structure type :**
```tsx
// 1. Imports
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// 2. Hook de données
const { data, isLoading } = useData();

// 3. Skeleton conditionnel
if (isLoading) {
  return (
    <div className="space-y-6 p-6">
      {/* Structure identique au contenu réel */}
      <PageHeaderSkeleton />
      <StatsCardsSkeleton />
      <ContentSkeleton />
    </div>
  );
}

// 4. Contenu réel
return <ActualContent data={data} />;
```

## 🔄 **Migration des anciens loaders**

### **Avant (à éviter)**
```tsx
if (isLoading) return <div>Chargement...</div>;
if (isLoading) return <PageLoader text="Chargement..." />;
```

### **Après (recommandé)**
```tsx
if (isLoading) {
  return (
    <div className="space-y-6 p-6">
      <PageHeaderSkeleton />
      <StatsCardsSkeleton />
      <TableSkeleton />
    </div>
  );
}
```

---

**Résultat** : Interface plus professionnelle et expérience utilisateur améliorée ! ✨