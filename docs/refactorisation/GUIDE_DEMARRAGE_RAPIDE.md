# 🚀 GUIDE DE DÉMARRAGE RAPIDE - REFACTORISATION

## 📋 PRÉREQUIS

Avant de commencer, assurez-vous d'avoir :
- ✅ Lu l'[AUDIT_COMPLET_FICHIERS.md](./AUDIT_COMPLET_FICHIERS.md)
- ✅ Lu la [SYNTHESE_VISUELLE.md](./SYNTHESE_VISUELLE.md)
- ✅ Accès Git avec droits de création de branches
- ✅ Node.js 18+ et pnpm installés
- ✅ VS Code avec extensions recommandées

---

## 🎯 PHASE 1 : FONDATIONS (JOUR 1-2)

### Étape 1.1 : Créer la structure de base

```bash
# Créer les dossiers atoms, molecules, organisms, templates
mkdir -p src/components/atoms
mkdir -p src/components/molecules
mkdir -p src/components/organisms
mkdir -p src/components/templates

# Créer les dossiers hooks partagés
mkdir -p src/hooks/shared
mkdir -p src/hooks/features
```

### Étape 1.2 : Créer les fichiers index

```bash
# Créer les fichiers d'export
touch src/components/atoms/index.ts
touch src/components/molecules/index.ts
touch src/components/organisms/index.ts
touch src/components/templates/index.ts
touch src/hooks/shared/index.ts
```

### Étape 1.3 : Extraire le premier atom (Logo)

**Créer** `src/components/atoms/Logo.tsx`:
```typescript
import Image from "next/image";

interface LogoProps {
  theme?: "light" | "dark";
  size?: number;
  className?: string;
}

export function Logo({ theme = "light", size = 32, className }: LogoProps) {
  return (
    <Image
      src={theme === "dark" ? "/logo1.svg" : "/logo.svg"}
      alt="K.Kits Logo"
      width={size}
      height={size}
      priority
      className={className}
    />
  );
}
```

**Exporter** dans `src/components/atoms/index.ts`:
```typescript
export { Logo } from "./Logo";
```

**Tester** :
```bash
# Remplacer toutes les utilisations de logo dans l'app
# Exemple: Dans app-sidebar.tsx
import { Logo } from "@/components/atoms";

// Remplacer:
<Image src="/logo.svg" alt="Logo" width={32} height={32} />
// Par:
<Logo size={32} />
```

---

## 🔥 PHASE 2 : PREMIER FICHIER CRITIQUE (JOUR 3-5)

### Objectif : Refactoriser `sidebar.tsx` (671 lignes)

#### Jour 3 : Analyse et planification

1. **Lire le fichier** `src/components/ui/sidebar.tsx`
2. **Identifier les composants** à extraire
3. **Créer un plan** de découpage

#### Jour 4 : Extraction des atoms

**Créer** `src/components/atoms/SidebarTrigger.tsx`:
```typescript
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface SidebarTriggerProps {
  onClick: () => void;
  className?: string;
}

export function SidebarTrigger({ onClick, className }: SidebarTriggerProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}
```

**Créer** `src/components/atoms/SidebarItem.tsx`:
```typescript
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  active?: boolean;
}

export function SidebarItem({ href, icon: Icon, label, active }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
        active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}
```

#### Jour 5 : Extraction des molecules et assemblage

**Créer** `src/components/molecules/SidebarMenu.tsx`:
```typescript
import { SidebarItem } from "@/components/atoms";

interface MenuItem {
  href: string;
  icon: any;
  label: string;
}

interface SidebarMenuProps {
  items: MenuItem[];
  activeHref?: string;
}

export function SidebarMenu({ items, activeHref }: SidebarMenuProps) {
  return (
    <nav className="space-y-1">
      {items.map((item) => (
        <SidebarItem
          key={item.href}
          {...item}
          active={activeHref === item.href}
        />
      ))}
    </nav>
  );
}
```

**Refactoriser** `src/components/ui/sidebar.tsx`:
```typescript
import { SidebarTrigger } from "@/components/atoms";
import { SidebarMenu } from "@/components/molecules";
// ... autres imports

export function Sidebar() {
  // Logique simplifiée (< 80 lignes)
  return (
    <aside>
      <SidebarTrigger onClick={toggle} />
      <SidebarMenu items={menuItems} activeHref={pathname} />
      {/* ... */}
    </aside>
  );
}
```

---

## 🎨 PHASE 3 : LANDING PAGE (JOUR 6-7)

### Objectif : Refactoriser `landing-page.tsx` (376 lignes)

#### Jour 6 : Extraire les organisms

**Créer** `src/components/organisms/HeroSection.tsx`:
```typescript
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/atoms";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="py-20 text-center">
      <Logo size={64} className="mx-auto mb-6" />
      <h1 className="text-5xl font-bold mb-4">
        Gérez votre inventaire simplement
      </h1>
      <p className="text-xl text-muted-foreground mb-8">
        Solution SaaS complète pour PME et grandes organisations
      </p>
      <div className="flex gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/register">Commencer gratuitement</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/login">Se connecter</Link>
        </Button>
      </div>
    </section>
  );
}
```

**Créer** `src/components/organisms/FeaturesSection.tsx`:
```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, BarChart, Shield } from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Gestion de stock",
    description: "Suivi en temps réel de vos stocks"
  },
  // ... autres features
];

export function FeaturesSection() {
  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold text-center mb-12">
        Fonctionnalités principales
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <feature.icon className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
```

#### Jour 7 : Créer le template et la page

**Créer** `src/components/templates/LandingLayout.tsx`:
```typescript
import { HeroSection } from "@/components/organisms/HeroSection";
import { FeaturesSection } from "@/components/organisms/FeaturesSection";
import { StatsSection } from "@/components/organisms/StatsSection";
import { CTASection } from "@/components/organisms/CTASection";
import { LandingFooter } from "@/components/organisms/LandingFooter";

export function LandingLayout() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
```

**Simplifier** `app/page.tsx`:
```typescript
import { LandingLayout } from "@/components/templates/LandingLayout";

export default function HomePage() {
  return <LandingLayout />;
}
```

**Supprimer** `src/components/landing/landing-page.tsx` (376 lignes)

---

## 📊 PHASE 4 : HOOKS (JOUR 8-10)

### Objectif : Refactoriser `use-warehouses.ts` (442 lignes)

#### Jour 8 : Créer la structure

```bash
mkdir -p src/hooks/features/warehouses
```

#### Jour 9 : Découper par responsabilité

**Créer** `src/hooks/features/warehouses/useWarehouseList.ts`:
```typescript
import { useQuery } from "@tanstack/react-query";
import { warehouseService } from "@/services/warehouse-service";

export function useWarehouseList(organizationId: string) {
  return useQuery({
    queryKey: ["warehouses", organizationId],
    queryFn: () => warehouseService.getAll(organizationId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

**Créer** `src/hooks/features/warehouses/useWarehouseCreate.ts`:
```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { warehouseService } from "@/services/warehouse-service";
import { toast } from "sonner";

export function useWarehouseCreate(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: warehouseService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses", organizationId] });
      toast.success("Entrepôt créé avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la création");
    },
  });
}
```

**Créer** `src/hooks/features/warehouses/index.ts`:
```typescript
export { useWarehouseList } from "./useWarehouseList";
export { useWarehouseCreate } from "./useWarehouseCreate";
export { useWarehouseUpdate } from "./useWarehouseUpdate";
export { useWarehouseDelete } from "./useWarehouseDelete";
export { useWarehouseStock } from "./useWarehouseStock";
export { useWarehouseTransfers } from "./useWarehouseTransfers";
```

#### Jour 10 : Remplacer les utilisations

```typescript
// Avant
import { useWarehouses } from "@/hooks/use-warehouses";
const { warehouses, createWarehouse, updateWarehouse } = useWarehouses(orgId);

// Après
import { useWarehouseList, useWarehouseCreate, useWarehouseUpdate } from "@/hooks/features/warehouses";
const { data: warehouses } = useWarehouseList(orgId);
const { mutate: createWarehouse } = useWarehouseCreate(orgId);
const { mutate: updateWarehouse } = useWarehouseUpdate(orgId);
```

**Supprimer** `src/hooks/use-warehouses.ts` (442 lignes)

---

## ✅ CHECKLIST QUOTIDIENNE

### Avant de commencer
- [ ] Créer une branche Git: `git checkout -b refactor/phase-X`
- [ ] Lire la documentation du fichier à refactoriser
- [ ] Identifier les dépendances
- [ ] Planifier le découpage

### Pendant le travail
- [ ] Respecter la limite de 100 lignes par fichier
- [ ] Ajouter les types TypeScript stricts
- [ ] Documenter chaque nouveau composant
- [ ] Tester au fur et à mesure

### Après chaque fichier
- [ ] Vérifier que l'app fonctionne: `pnpm dev`
- [ ] Lancer les tests: `pnpm test`
- [ ] Vérifier ESLint: `pnpm lint`
- [ ] Commit: `git commit -m "refactor: [fichier] - description"`

### Fin de journée
- [ ] Push la branche: `git push origin refactor/phase-X`
- [ ] Mettre à jour la documentation
- [ ] Noter les problèmes rencontrés
- [ ] Planifier le lendemain

---

## 🛠️ COMMANDES UTILES

### Compter les lignes d'un fichier
```bash
# Windows PowerShell
(Get-Content "src/components/ui/sidebar.tsx" | Measure-Object -Line).Lines

# Unix/Linux/Mac
wc -l src/components/ui/sidebar.tsx
```

### Trouver tous les fichiers > 100 lignes
```bash
# PowerShell
Get-ChildItem -Path src -Include *.tsx,*.ts -Recurse | Where-Object { (Get-Content $_.FullName | Measure-Object -Line).Lines -gt 100 } | Select-Object FullName, @{Name="Lines";Expression={(Get-Content $_.FullName | Measure-Object -Line).Lines}} | Sort-Object Lines -Descending
```

### Rechercher les utilisations d'un composant
```bash
# PowerShell
Get-ChildItem -Path src,app -Include *.tsx,*.ts -Recurse | Select-String -Pattern "import.*sidebar" | Select-Object Path, LineNumber
```

### Lancer les tests d'un fichier spécifique
```bash
pnpm test src/components/atoms/Logo.test.tsx
```

---

## 📝 TEMPLATE DE COMMIT

```
refactor(component): [nom du fichier] - [action]

- Extrait [X] atoms: [liste]
- Extrait [Y] molecules: [liste]
- Réduit de [Z] lignes à [W] lignes
- Tests ajoutés: [oui/non]

Closes #[numéro issue]
```

**Exemple**:
```
refactor(sidebar): sidebar.tsx - découpage atomique

- Extrait 3 atoms: SidebarTrigger, SidebarItem, SidebarIcon
- Extrait 2 molecules: SidebarMenu, SidebarHeader
- Réduit de 671 lignes à 80 lignes
- Tests ajoutés: oui

Closes #123
```

---

## 🚨 PROBLÈMES COURANTS

### Problème 1 : Imports circulaires
**Symptôme**: Erreur "Cannot access X before initialization"

**Solution**:
```typescript
// ❌ Mauvais
// atoms/index.ts
export * from "./Logo";
export * from "./Button"; // Button utilise Logo

// ✅ Bon
// atoms/index.ts
export { Logo } from "./Logo";
export { Button } from "./Button";

// Button.tsx
import { Logo } from "./Logo"; // Import direct
```

### Problème 2 : Types manquants
**Symptôme**: Erreur TypeScript "Property X does not exist"

**Solution**:
```typescript
// Toujours définir les interfaces
interface ComponentProps {
  prop1: string;
  prop2?: number; // Optionnel
  children?: React.ReactNode;
}

export function Component({ prop1, prop2, children }: ComponentProps) {
  // ...
}
```

### Problème 3 : Tests qui échouent
**Symptôme**: Tests rouges après refactorisation

**Solution**:
```bash
# Mettre à jour les snapshots
pnpm test -- -u

# Vérifier les imports dans les tests
# Mettre à jour les mocks si nécessaire
```

---

## 📚 RESSOURCES

### Documentation
- [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [React Server Components](https://react.dev/reference/rsc/server-components)

### Outils
- [VS Code Extension: ES7+ React/Redux/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)
- [VS Code Extension: Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)

---

## 🎯 OBJECTIF QUOTIDIEN

```
Jour 1-2:   Fondations (structure + 10 atoms)
Jour 3-5:   Sidebar (671 → 8 fichiers)
Jour 6-7:   Landing (376 → 7 fichiers)
Jour 8-10:  Hooks (442 → 7 fichiers)
```

**Total Semaine 1-2**: 1,489 lignes → 32 fichiers < 80 lignes ✅

---

## 🚀 PRÊT À COMMENCER ?

1. **Créer la branche**:
   ```bash
   git checkout -b refactor/phase-1-fondations
   ```

2. **Créer la structure**:
   ```bash
   mkdir -p src/components/{atoms,molecules,organisms,templates}
   mkdir -p src/hooks/{shared,features}
   ```

3. **Commencer par le premier atom** (Logo.tsx)

4. **Suivre la checklist quotidienne**

5. **Commit régulièrement**

**Bonne refactorisation ! 💪**
