# 🔐 Guide d'utilisation du système de permissions

Ce guide explique comment utiliser le système de permissions dans la sidebar et les composants de K.Kits.

## 🏗️ Architecture des permissions

### Hooks disponibles

1. **`usePermissions(organizationId)`** - Hook principal pour les permissions
2. **`useUserPermissions(organizationId)`** - Récupère les permissions brutes
3. **`useSidebarPermissions(organizationId, baseUrl)`** - Permissions spécifiques à la sidebar
4. **`usePermissionGuard(permission, organizationId)`** - Vérification simple

### Composants de protection

1. **`<PermissionGuard>`** - Protège le contenu selon les permissions
2. **`<ProtectedSidebar>`** - Sidebar avec gestion des permissions et états
3. **`<AppSidebar>`** - Sidebar principale avec filtrage automatique

## 🚀 Utilisation dans les composants

### 1. Vérification simple des permissions

```tsx
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/lib/permissions";

function MyComponent({ organizationId }: { organizationId: string }) {
  const { can, is, hasPermission } = usePermissions(organizationId);

  return (
    <div>
      {/* Vérification avec helper */}
      {can.manageUsers && (
        <Button>Gérer les utilisateurs</Button>
      )}

      {/* Vérification directe */}
      {hasPermission(PERMISSIONS.SALE_CREATE) && (
        <Button>Nouvelle vente</Button>
      )}

      {/* Vérification de rôle */}
      {is.owner && (
        <Button variant="destructive">Supprimer organisation</Button>
      )}
    </div>
  );
}
```

### 2. Protection de contenu avec PermissionGuard

```tsx
import { PermissionGuard } from "@/components/permission-guard";
import { PERMISSIONS } from "@/lib/permissions";

function ProtectedPage({ organizationId }: { organizationId: string }) {
  return (
    <div>
      {/* Contenu toujours visible */}
      <h1>Page publique</h1>

      {/* Contenu protégé */}
      <PermissionGuard 
        requiredPermission={PERMISSIONS.USER_MANAGE}
        organizationId={organizationId}
      >
        <div>
          <h2>Section réservée aux gestionnaires</h2>
          <Button>Gérer l'équipe</Button>
        </div>
      </PermissionGuard>

      {/* Avec fallback personnalisé */}
      <PermissionGuard 
        requiredPermission={PERMISSIONS.ORG_SETTINGS}
        organizationId={organizationId}
        fallback={
          <div className="text-center p-4 text-muted-foreground">
            Contactez votre administrateur pour accéder aux paramètres.
          </div>
        }
      >
        <SettingsPanel />
      </PermissionGuard>
    </div>
  );
}
```

### 3. Sidebar avec permissions

La sidebar filtre automatiquement les éléments selon les permissions :

```tsx
// Dans layout.tsx
import { ProtectedSidebar } from "@/components/protected-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const organizationId = useParams().id as string;

  return (
    <SidebarProvider>
      <ProtectedSidebar organizationId={organizationId} />
      <SidebarInset>
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
```

### 4. Hook pour la sidebar personnalisée

```tsx
import { useSidebarPermissions } from "@/hooks/use-sidebar-permissions";

function CustomSidebar({ organizationId }: { organizationId: string }) {
  const { sidebarItems, quickActions, roleInfo } = useSidebarPermissions(
    organizationId,
    `/preferences/organizations/${organizationId}`
  );

  return (
    <nav>
      {sidebarItems.map(item => (
        <a key={item.url} href={item.url} className="nav-item">
          <item.icon />
          {item.title}
          {item.badge && <Badge>{item.badge}</Badge>}
        </a>
      ))}
      
      {roleInfo.isOwner && (
        <div className="admin-section">
          <h3>Administration</h3>
          {/* Contenu admin */}
        </div>
      )}
    </nav>
  );
}
```

## 🎯 Permissions disponibles

### Permissions principales

```typescript
// Dashboard
PERMISSIONS.DASHBOARD_READ

// Produits
PERMISSIONS.PRODUCT_CREATE
PERMISSIONS.PRODUCT_READ
PERMISSIONS.PRODUCT_UPDATE
PERMISSIONS.PRODUCT_DELETE

// Stock
PERMISSIONS.STOCK_READ
PERMISSIONS.STOCK_ADJUST
PERMISSIONS.STOCK_TRANSFER
PERMISSIONS.STOCK_INVENTORY

// Ventes
PERMISSIONS.SALE_CREATE
PERMISSIONS.SALE_READ
PERMISSIONS.SALE_UPDATE
PERMISSIONS.SALE_REFUND

// Utilisateurs
PERMISSIONS.USER_INVITE
PERMISSIONS.USER_MANAGE
PERMISSIONS.USER_ROLES

// Organisation
PERMISSIONS.ORG_SETTINGS
PERMISSIONS.REPORT_READ
PERMISSIONS.NOTIFICATION_READ
```

### Helpers de permissions

```typescript
const { can, is } = usePermissions(organizationId);

// Vérifications rapides
can.viewDashboard      // DASHBOARD_READ
can.createProduct      // PRODUCT_CREATE
can.manageUsers        // USER_MANAGE
can.adjustStock        // STOCK_ADJUST
can.transferStock      // STOCK_TRANSFER
can.createSale         // SALE_CREATE
can.viewReports        // REPORT_READ
can.manageSettings     // ORG_SETTINGS

// Rôles simplifiés
is.owner              // Propriétaire (toutes permissions)
is.manager            // Gestionnaire
is.seller             // Vendeur
is.stockManager       // Magasinier
```

## 🔧 Configuration des rôles

### Rôles prédéfinis

```typescript
// Dans /src/lib/permissions.ts
export const DEFAULT_ROLES = {
  OWNER: {
    name: "Propriétaire",
    permissions: ["*"], // Toutes les permissions
  },
  
  MANAGER: {
    name: "Gestionnaire",
    permissions: [
      PERMISSIONS.PRODUCT_CREATE,
      PERMISSIONS.PRODUCT_READ,
      PERMISSIONS.STOCK_READ,
      PERMISSIONS.USER_INVITE,
      // ...
    ]
  },
  
  VENDEUR: {
    name: "Vendeur",
    permissions: [
      PERMISSIONS.PRODUCT_READ,
      PERMISSIONS.SALE_CREATE,
      PERMISSIONS.STOCK_READ,
      // ...
    ]
  }
};
```

## 🚨 Bonnes pratiques

### 1. Toujours vérifier les permissions côté serveur

```typescript
// Dans une API route
import { hasPermission } from "@/lib/permissions";
import { getUserPermissions } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  const permissions = await getUserPermissions(user.id, organizationId);
  
  if (!hasPermission(permissions, PERMISSIONS.PRODUCT_CREATE)) {
    return new Response("Forbidden", { status: 403 });
  }
  
  // Logique métier...
}
```

### 2. Gérer les états de chargement

```tsx
function MyComponent({ organizationId }: { organizationId: string }) {
  const { isLoading } = useAuthWithRoles();
  const { can } = usePermissions(organizationId);

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <div>
      {can.manageUsers && <UserManagement />}
    </div>
  );
}
```

### 3. Fallbacks appropriés

```tsx
<PermissionGuard 
  requiredPermission={PERMISSIONS.USER_MANAGE}
  organizationId={organizationId}
  fallback={
    <Card>
      <CardContent className="text-center p-6">
        <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3>Accès restreint</h3>
        <p>Contactez votre administrateur pour gérer les utilisateurs.</p>
      </CardContent>
    </Card>
  }
>
  <UserManagementPanel />
</PermissionGuard>
```

### 4. Permissions granulaires

```tsx
// Plutôt que de vérifier un rôle global
if (userRole === "MANAGER") { ... }

// Vérifier la permission spécifique
if (can.manageUsers) { ... }
```

## 🔍 Debugging des permissions

### Afficher les permissions en développement

```tsx
function DebugPermissions({ organizationId }: { organizationId: string }) {
  const { permissions, can, is } = usePermissions(organizationId);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded text-xs">
      <h4>Debug Permissions</h4>
      <p>Org: {organizationId}</p>
      <p>Permissions: {permissions.length}</p>
      <p>Role: {is.owner ? 'Owner' : is.manager ? 'Manager' : 'Other'}</p>
      <details>
        <summary>All permissions</summary>
        <pre>{JSON.stringify(permissions, null, 2)}</pre>
      </details>
    </div>
  );
}
```

## 📝 Exemples complets

Voir le fichier `/src/components/permission-examples.tsx` pour des exemples d'utilisation complète du système de permissions.