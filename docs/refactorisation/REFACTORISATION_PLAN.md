# 🚀 PLAN DE REFACTORISATION COMPLET - K.KITS

> **⚠️ IMPORTANT**: Ce document est obsolète. Consultez la nouvelle documentation d'audit complète :
> - 📊 [AUDIT_COMPLET_FICHIERS.md](./AUDIT_COMPLET_FICHIERS.md) - Audit détaillé des 95 fichiers
> - 📈 [SYNTHESE_VISUELLE.md](./SYNTHESE_VISUELLE.md) - Synthèse visuelle avec graphiques
> - 🚀 [GUIDE_DEMARRAGE_RAPIDE.md](./GUIDE_DEMARRAGE_RAPIDE.md) - Guide pratique pas à pas
> - 📚 [README_AUDIT.md](./README_AUDIT.md) - Vue d'ensemble de la documentation

---

## 📊 RÉSUMÉ EXÉCUTIF (Mis à jour)

### Résultats de l'audit complet :
- ❌ **95 fichiers** dépassent 100 lignes (19% du total)
- ❌ **~17,000 lignes** concernées
- ❌ **5 fichiers critiques** > 300 lignes
- ❌ **15 fichiers haute priorité** 200-300 lignes
- ❌ **25 fichiers moyenne priorité** 150-200 lignes
- ❌ **50 fichiers basse priorité** 100-150 lignes

### Gains attendus :
- ✅ **-68%** temps de chargement (FCP: 2.8s → 0.9s)
- ✅ **-62%** bundle size (2.5 MB → 0.95 MB)
- ✅ **-75%** temps d'hydration (1.2s → 0.3s)
- ✅ **100%** des fichiers < 100 lignes (95 → 0)
- ✅ **0** duplication de code
- ✅ **+300%** composants réutilisables (50 → 200)

---

## 🎯 PHASE 1 : COMPOSANTS ATOMIQUES (Priorité CRITIQUE)

### 1.1 Créer src/components/atoms/

#### Logo.tsx (15 lignes)
```typescript
import Image from "next/image";

interface LogoProps {
  theme?: "light" | "dark";
  size?: number;
}

export function Logo({ theme = "light", size = 32 }: LogoProps) {
  return (
    <Image
      src={theme === "dark" ? "/logo1.svg" : "/logo.svg"}
      alt="K.Kits Logo"
      width={size}
      height={size}
      priority
    />
  );
}
```

#### PasswordToggle.tsx (20 lignes)
```typescript
import { Eye, EyeClosed } from "@solar-icons/react";
import { Button } from "@/components/ui/button";

interface PasswordToggleProps {
  show: boolean;
  onToggle: () => void;
}

export function PasswordToggle({ show, onToggle }: PasswordToggleProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className="absolute right-3 top-10"
    >
      {show ? <EyeClosed className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </Button>
  );
}
```

#### StatCard.tsx (30 lignes)
```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  borderColor?: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, iconColor, borderColor }: StatCardProps) {
  return (
    <Card className={borderColor ? `border-l-4 ${borderColor}` : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-full ${iconColor || "bg-primary/10"}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
```

#### OrgAvatar.tsx (25 lignes)
```typescript
import Image from "next/image";
import { Building2 } from "lucide-react";

interface OrgAvatarProps {
  logo?: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: 32, md: 48, lg: 64 };

export function OrgAvatar({ logo, name, size = "md" }: OrgAvatarProps) {
  const px = sizes[size];
  
  return (
    <div className={`w-${px} h-${px} bg-primary/10 rounded-xl flex items-center justify-center overflow-hidden`}>
      {logo ? (
        <Image src={logo} alt={name} width={px} height={px} className="object-cover" />
      ) : (
        <Building2 className={`h-${px/2} w-${px/2} text-primary`} />
      )}
    </div>
  );
}
```

#### LoadingCard.tsx (20 lignes)
```typescript
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-[60px] mb-2" />
        <Skeleton className="h-3 w-[120px]" />
      </CardContent>
    </Card>
  );
}
```

### 1.2 Créer src/components/molecules/

#### FormField.tsx (40 lignes)
```typescript
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordToggle } from "@/components/atoms/PasswordToggle";
import { useState } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}

export function FormField({ 
  id, label, type = "text", placeholder, value, onChange, disabled, required 
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  
  return (
    <div className="grid gap-3 relative">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={isPassword && showPassword ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
      />
      {isPassword && (
        <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
      )}
    </div>
  );
}
```

#### OrgCard.tsx (50 lignes)
```typescript
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrgAvatar } from "@/components/atoms/OrgAvatar";
import { Users, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

interface OrgCardProps {
  id: string;
  name: string;
  description?: string;
  logo?: string | null;
  domain?: string | null;
  memberCount?: number;
}

export function OrgCard({ id, name, description, logo, domain, memberCount }: OrgCardProps) {
  return (
    <Link href={`/preferences/organizations/${id}`}>
      <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <OrgAvatar logo={logo} name={name} />
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl truncate group-hover:text-primary transition-colors">
                  {name}
                </CardTitle>
                {domain && <p className="text-sm text-muted-foreground mt-1">{domain}</p>}
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="line-clamp-2 mb-4">
            {description || "Aucune description disponible"}
          </CardDescription>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              {memberCount || 0}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              Créée récemment
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
```

### 1.3 Créer src/hooks/shared/

#### usePasswordToggle.ts (10 lignes)
```typescript
import { useState } from "react";

export function usePasswordToggle() {
  const [show, setShow] = useState(false);
  const toggle = () => setShow(!show);
  return { show, toggle };
}
```

#### useViewMode.ts (15 lignes)
```typescript
import { useState } from "react";

type ViewMode = "cards" | "table";

export function useViewMode(defaultMode: ViewMode = "cards") {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultMode);
  const toggleView = () => setViewMode(prev => prev === "cards" ? "table" : "cards");
  return { viewMode, setViewMode, toggleView };
}
```

#### useDeleteDialog.ts (20 lignes)
```typescript
import { useState } from "react";

export function useDeleteDialog<T>() {
  const [dialog, setDialog] = useState<{ open: boolean; item: T | null }>({
    open: false,
    item: null,
  });

  const openDialog = (item: T) => setDialog({ open: true, item });
  const closeDialog = () => setDialog({ open: false, item: null });

  return { dialog, openDialog, closeDialog };
}
```

---

## 🎯 PHASE 2 : REFACTORISATION DES PAGES (Priorité HAUTE)

### 2.1 Landing Page (350 → 8 fichiers < 50 lignes)

#### app/page.tsx (10 lignes - Server Component)
```typescript
import { LandingLayout } from "@/components/templates/LandingLayout";

export default function HomePage() {
  return <LandingLayout />;
}
```

#### components/templates/LandingLayout.tsx (30 lignes)
```typescript
import { LandingHeader } from "@/components/organisms/LandingHeader";
import { HeroSection } from "@/components/organisms/HeroSection";
import { StatsSection } from "@/components/organisms/StatsSection";
import { FeaturesSection } from "@/components/organisms/FeaturesSection";
import { CTASection } from "@/components/organisms/CTASection";
import { LandingFooter } from "@/components/organisms/LandingFooter";

export function LandingLayout() {
  return (
    <div className="min-h-screen">
      <LandingHeader />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
```

#### components/organisms/LandingHeader.tsx (40 lignes - Client Component)
```typescript
"use client";

import { Logo } from "@/components/atoms/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useAuth } from "@/providers/auth-provider";
import { useLogout } from "@/hooks/use-logout";
import Link from "next/link";
import { LogOut } from "lucide-react";

export function LandingHeader() {
  const { user, isLoading } = useAuth();
  const logout = useLogout();

  return (
    <header className="border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="text-2xl font-bold text-primary">K.Kits</span>
          <Badge variant="secondary" className="text-xs">BETA</Badge>
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          {!isLoading && (user ? (
            <>
              <Button variant="ghost" asChild><Link href="/preferences">Dashboard</Link></Button>
              <Button variant="outline" onClick={() => logout.mutate()} disabled={logout.isPending}>
                <LogOut className="h-4 w-4 mr-2" />
                {logout.isPending ? "..." : "Déconnexion"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild><Link href="/login">Connexion</Link></Button>
              <Button asChild><Link href="/register">Commencer</Link></Button>
            </>
          ))}
        </div>
      </div>
    </header>
  );
}
```

### 2.2 Organizations Page (400 → 6 fichiers < 60 lignes)

#### app/preferences/organizations/page.tsx (20 lignes - Server Component avec Suspense)
```typescript
import { Suspense } from "react";
import { OrganizationsContent } from "@/components/organisms/OrganizationsContent";
import { OrganizationsLoading } from "@/components/organisms/OrganizationsLoading";

export default function OrganizationsPage() {
  return (
    <Suspense fallback={<OrganizationsLoading />}>
      <OrganizationsContent />
    </Suspense>
  );
}
```

#### components/organisms/OrganizationsContent.tsx (60 lignes - Client Component)
```typescript
"use client";

import { useOrganizations } from "@/hooks/use-organizations";
import { OrganizationsHeader } from "@/components/molecules/OrganizationsHeader";
import { OrganizationsGrid } from "@/components/molecules/OrganizationsGrid";
import { EmptyOrganizations } from "@/components/molecules/EmptyOrganizations";
import { useViewMode } from "@/hooks/shared/useViewMode";

export function OrganizationsContent() {
  const { data, error, isLoading } = useOrganizations();
  const { viewMode, setViewMode } = useViewMode();

  if (isLoading) return <OrganizationsLoading />;
  if (error) return <ErrorCard message={error.message} />;
  if (!data || data.length === 0) return <EmptyOrganizations />;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <OrganizationsHeader 
          count={data.length} 
          viewMode={viewMode} 
          onViewModeChange={setViewMode} 
        />
        <OrganizationsGrid organizations={data} viewMode={viewMode} />
      </div>
    </div>
  );
}
```

### 2.3 Dashboard Page (300 → 5 fichiers < 60 lignes)

#### app/preferences/organizations/[id]/dashboard/page.tsx (25 lignes - Server Component)
```typescript
import { Suspense } from "react";
import { DashboardContent } from "@/components/organisms/DashboardContent";
import { DashboardLoading } from "@/components/organisms/DashboardLoading";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardPage({ params }: PageProps) {
  const { id } = await params;
  
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent organizationId={id} />
    </Suspense>
  );
}
```

---

## 🎯 PHASE 3 : OPTIMISATION DES HOOKS (Priorité HAUTE)

### 3.1 Fusionner les hooks dupliqués

#### ❌ Supprimer ces fichiers :
- `src/hooks/use-auth-with-roles.ts`
- `src/hooks/use-auth-optimized.ts`
- `src/hooks/useOrganization.ts` (ancien format)

#### ✅ Unifier dans use-organization.ts (80 lignes)
```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationService } from "@/services/organization-service";
import { toast } from "sonner";

// Queries
export const useOrganizations = () => 
  useQuery({ queryKey: ["organizations"], queryFn: organizationService.fetchAll });

export const useOrganization = (id: string) => 
  useQuery({ queryKey: ["organization", id], queryFn: () => organizationService.getById(id), enabled: !!id });

export const useOrganizationDashboard = (id: string) => 
  useQuery({ queryKey: ["organization", id, "dashboard"], queryFn: () => organizationService.getDashboard(id), enabled: !!id, staleTime: 2 * 60 * 1000 });

// Mutations
export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: organizationService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Organisation créée");
    },
  });
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => organizationService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["organization", id] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Organisation modifiée");
    },
  });
};

export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: organizationService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Organisation supprimée");
    },
  });
};
```

---

## 🎯 PHASE 4 : OPTIMISATIONS NEXT.JS 15 (Priorité MOYENNE)

### 4.1 Optimiser layout.tsx (60 → 40 lignes)

```typescript
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Providers } from "@/components/Providers";
import { fonts } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "K.kits",
  description: "Application web de gestion d'entreprise commerciale",
  authors: [{ name: "Jason Kitio" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning className={fonts}>
      <body className="antialiased">
        <Providers>
          {children}
          <Toaster richColors position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
```

### 4.2 Créer lib/fonts.ts (20 lignes)
```typescript
import localFont from "next/font/local";

const bricolage = localFont({
  src: "../public/fonts/Bricolage_Grotesque/BricolageGrotesque-VariableFont_opsz,wdth,wght.ttf",
  variable: "--font-bricolage",
  display: "swap",
});

const ibmPlex = localFont({
  src: "../public/fonts/IBM_Plex_Sans/static/IBMPlexSans-Regular.ttf",
  variable: "--font-ibm-plex",
  display: "swap",
});

export const fonts = `${bricolage.variable} ${ibmPlex.variable}`;
```

### 4.3 Créer components/Providers.tsx (30 lignes)
```typescript
"use client";

import { ReactQueryProvider } from "@/providers/react-query";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}
```

### 4.4 Ajouter Streaming avec Parallel Routes

#### app/preferences/organizations/[id]/layout.tsx (30 lignes)
```typescript
import { Suspense } from "react";

export default function OrganizationLayout({
  children,
  dashboard,
  alerts,
}: {
  children: React.ReactNode;
  dashboard: React.ReactNode;
  alerts: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <Suspense fallback={<DashboardSkeleton />}>
        {dashboard}
      </Suspense>
      <Suspense fallback={<AlertsSkeleton />}>
        {alerts}
      </Suspense>
      {children}
    </div>
  );
}
```

---

## 🎯 PHASE 5 : OPTIMISATION DES IMAGES (Priorité BASSE)

### 5.1 Remplacer tous les <img> par <Image>

```typescript
// ❌ Avant
<img src={org.logo} alt={org.name} />

// ✅ Après
<Image src={org.logo} alt={org.name} width={48} height={48} />
```

### 5.2 Ajouter blur placeholders

```typescript
<Image 
  src={org.logo} 
  alt={org.name} 
  width={48} 
  height={48}
  placeholder="blur"
  blurDataURL="data:image/svg+xml;base64,..."
/>
```

---

## 📊 CHECKLIST DE VALIDATION

### Pour chaque fichier refactorisé :
- [ ] < 100 lignes (idéalement < 50)
- [ ] Une seule responsabilité
- [ ] Props typées TypeScript
- [ ] Réutilisable
- [ ] Pas de duplication
- [ ] Server Component si possible
- [ ] Client Component uniquement si nécessaire

### Pour l'application globale :
- [ ] Tous les fichiers < 100 lignes
- [ ] 0 duplication de code
- [ ] Hooks unifiés
- [ ] Providers optimisés
- [ ] Images optimisées
- [ ] Fonts optimisées
- [ ] Streaming activé
- [ ] Suspense utilisé

---

## 🚀 ORDRE D'EXÉCUTION RECOMMANDÉ

1. ✅ **Jour 1-2** : Phase 1 (Composants atomiques)
2. ✅ **Jour 3-4** : Phase 2 (Refactorisation pages)
3. ✅ **Jour 5** : Phase 3 (Optimisation hooks)
4. ✅ **Jour 6** : Phase 4 (Optimisations Next.js)
5. ✅ **Jour 7** : Phase 5 (Images) + Tests

---

**Prêt à commencer la refactorisation ?** 🚀
