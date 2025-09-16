# 🔐 Guide du Système de Permissions K.Kits

Ce guide explique comment utiliser le système de permissions à trois niveaux de K.Kits pour sécuriser votre application.

## 📋 Vue d'ensemble

Le système de permissions K.Kits fonctionne sur **3 niveaux** :

1. **🎨 Protection de l'UI** - Masque les éléments selon les permissions
2. **🚪 Contrôle d'accès aux pages** - Redirige les utilisateurs non autorisés  
3. **🔒 Sécurité de l'API** - Vérifie les permissions côté serveur

## 🎨 Niveau 1 : Protection de l'UI

### Sidebar intelligente

La sidebar se met à jour automatiquement selon les permissions de l'utilisateur :

```tsx
// src/components/app-sidebar.tsx
// ✅ Déjà configuré - filtre automatiquement les menus
```

### Composants conditionnels

Utilisez le hook `useConditionalRender` pour afficher/masquer des éléments :

```tsx
import { useConditionalRender } from "@/hooks/use-permissions";

function MyComponent({ organizationId }: { organizationId: string }) {
  const { renderIfCan, renderIfIs } = useConditionalRender(organizationId);

  return (
    <div>
      {/* Affiche seulement si l'utilisateur peut créer des ventes */}
      {renderIfCan("createSale", (
        <Button>Nouvelle Vente</Button>
      ))}

      {/* Affiche seulement pour les propriétaires */}
      {renderIfIs("owner", (
        <Button variant="destructive">Supprimer Organisation</Button>
      ))}
    </div>
  );
}
```

### Vérification manuelle des permissions

```tsx
import { usePermissions } from "@/hooks/use-permissions";

function MyComponent({ organizationId }: { organizationId: string }) {
  const { can, is, hasPermission } = usePermissions(organizationId);

  if (!can.viewDashboard) {
    return <div>Accès refusé</div>;
  }

  return (
    <div>
      {can.createSale && <Button>Nouvelle Vente</Button>}
      {is.owner && <AdminPanel />}
      {hasPermission(PERMISSIONS.STOCK_READ) && <StockWidget />}
    </div>
  );
}
```

## 🚪 Niveau 2 : Contrôle d'accès aux pages

### Protection automatique des pages

Enveloppez vos pages avec le composant `PageProtection` :

```tsx
// app/preferences/organizations/[id]/stores/page.tsx
import { PageProtection } from "@/components/page-protection";
import { PERMISSIONS } from "@/lib/permissions";

export default function StoresPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <PageProtection 
      requiredPermission={PERMISSIONS.ORG_SETTINGS}
      organizationId={organizationId}
      fallbackUrl={`/preferences/organizations/${organizationId}/dashboard`}
    >
      {/* Contenu de votre page */}
      <div>Gestion des boutiques</div>
    </PageProtection>
  );
}
```

### Redirection intelligente

Le système redirige automatiquement vers une page autorisée selon le rôle :

- **Propriétaire/Gestionnaire** → Dashboard
- **Vendeur** → Page des ventes  
- **Magasinier** → Alertes de stock
- **Aucune permission** → Page de sélection d'organisation

## 🔒 Niveau 3 : Sécurité de l'API

### Protection automatique des routes

Utilisez `withApiProtection` pour protéger vos routes API :

```tsx
// app/api/organization/[organizationId]/stores/route.ts
import { withApiProtection } from "@/lib/api-protection";

export const GET = withApiProtection(
  async (req: NextRequest, { params, user, permissions }) => {
    const { organizationId } = await params;
    
    // L'utilisateur est déjà vérifié et autorisé
    // Vous avez accès à user et permissions
    
    const stores = await prisma.store.findMany({
      where: { organizationId }
    });
    
    return NextResponse.json(stores);
  }
);
```

### Protection manuelle avec permissions spécifiques

```tsx
// app/api/organization/[organizationId]/sales/route.ts
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";

export const GET = withPermission(PERMISSIONS.SALE_READ)(
  async (req: NextRequest, { params, user, permissions }) => {
    // Route protégée par la permission SALE_READ
    // ...
  }
);

export const POST = withPermission(PERMISSIONS.SALE_CREATE)(
  async (req: NextRequest, { params, user, permissions }) => {
    // Route protégée par la permission SALE_CREATE
    // ...
  }
);
```

## 🎯 Permissions Disponibles

### Permissions par catégorie

```typescript
// Produits
PERMISSIONS.PRODUCT_CREATE   // Créer des produits
PERMISSIONS.PRODUCT_READ     // Voir les produits  
PERMISSIONS.PRODUCT_UPDATE   // Modifier les produits
PERMISSIONS.PRODUCT_DELETE   // Supprimer les produits

// Stock
PERMISSIONS.STOCK_READ       // Voir les stocks
PERMISSIONS.STOCK_ADJUST     // Ajuster les stocks
PERMISSIONS.STOCK_TRANSFER   // Transférer le stock
PERMISSIONS.STOCK_INVENTORY  // Faire l'inventaire

// Ventes
PERMISSIONS.SALE_CREATE      // Créer des ventes
PERMISSIONS.SALE_READ        // Voir les ventes
PERMISSIONS.SALE_UPDATE      // Modifier les ventes
PERMISSIONS.SALE_REFUND      // Rembourser les ventes

// Utilisateurs
PERMISSIONS.USER_INVITE      // Inviter des utilisateurs
PERMISSIONS.USER_MANAGE      // Gérer les utilisateurs
PERMISSIONS.USER_ROLES       // Gérer les rôles

// Organisation
PERMISSIONS.ORG_SETTINGS     // Paramètres organisation
PERMISSIONS.DASHBOARD_READ   // Voir le dashboard
PERMISSIONS.REPORT_READ      // Voir les rapports
```

### Rôles prédéfinis

| Rôle | Permissions | Usage |
|------|-------------|-------|
| **Propriétaire** | Toutes (`*`) | Accès complet |
| **Gestionnaire** | Produits, Stock, Ventes, Équipe, Rapports | Gestion opérationnelle |
| **Vendeur** | Ventes, Clients, Consultation stock | Point de vente |
| **Magasinier** | Stock, Transferts, Inventaires | Gestion des stocks |

## 🛠️ Exemples d'implémentation

### 1. Page de dashboard avec actions conditionnelles

```tsx
// components/dashboard-actions.tsx
import { DashboardActions } from "@/components/dashboard-actions";

function Dashboard({ organizationId }: { organizationId: string }) {
  return (
    <PageProtection 
      requiredPermission={PERMISSIONS.DASHBOARD_READ}
      organizationId={organizationId}
    >
      <div>
        <h1>Dashboard</h1>
        <DashboardActions organizationId={organizationId} />
      </div>
    </PageProtection>
  );
}
```

### 2. API avec vérification de permissions

```tsx
// app/api/organization/[organizationId]/products/route.ts
export const GET = withApiProtection(async (req, { params, user }) => {
  // Automatiquement protégé par PERMISSIONS.PRODUCT_READ
  const products = await getProducts(params.organizationId);
  return NextResponse.json(products);
});

export const POST = withApiProtection(async (req, { params, user }) => {
  // Automatiquement protégé par PERMISSIONS.PRODUCT_CREATE  
  const body = await req.json();
  const product = await createProduct(params.organizationId, body);
  return NextResponse.json(product);
});
```

### 3. Composant avec permissions granulaires

```tsx
function ProductCard({ product, organizationId }) {
  const { can } = usePermissions(organizationId);

  return (
    <Card>
      <CardContent>
        <h3>{product.name}</h3>
        <p>{product.price}</p>
        
        <div className="flex gap-2">
          {can.updateProduct && (
            <Button variant="outline">Modifier</Button>
          )}
          {can.deleteProduct && (
            <Button variant="destructive">Supprimer</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

## 🚨 Bonnes Pratiques

### ✅ À faire

1. **Toujours protéger les 3 niveaux** - UI, Pages et API
2. **Utiliser les hooks fournis** - `usePermissions`, `useConditionalRender`
3. **Vérifier côté serveur** - Ne jamais faire confiance au client
4. **Permissions granulaires** - Préférer des permissions spécifiques
5. **Tester les permissions** - Vérifier avec différents rôles

### ❌ À éviter

1. **Protection UI seulement** - Toujours sécuriser l'API
2. **Permissions hardcodées** - Utiliser les constantes `PERMISSIONS`
3. **Logique dupliquée** - Utiliser les helpers fournis
4. **Oublier les redirections** - Toujours prévoir un fallback
5. **Permissions trop larges** - Éviter de donner plus que nécessaire

## 🔧 Dépannage

### Erreur 403 sur l'API

```bash
# Vérifiez que l'utilisateur a la bonne permission
# Vérifiez que l'organisation est correcte
# Vérifiez que la session est valide
```

### Redirection infinie

```bash
# Vérifiez que la page de fallback est accessible
# Vérifiez que l'utilisateur a au moins une permission
# Vérifiez la logique de redirection dans PageProtection
```

### Menu vide

```bash
# Vérifiez que l'utilisateur a des permissions
# Vérifiez que l'organizationId est correct
# Vérifiez les permissions dans DEFAULT_ROLES
```

## 📞 Support

Pour toute question sur le système de permissions :

1. Consultez ce guide
2. Vérifiez les exemples dans `/src/components/dashboard-actions.tsx`
3. Testez avec différents rôles
4. Ouvrez une issue si nécessaire

---

**🔐 Sécurité avant tout !** N'oubliez jamais de protéger vos APIs, même si l'UI masque les éléments.