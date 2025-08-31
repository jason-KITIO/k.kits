# Gestion des Catégories

Ce module fournit une interface complète pour gérer les catégories dans l'application K.Kits.

## Fichiers créés

### Types

- `src/types/category.ts` - Définitions TypeScript pour les catégories

### Services

- `src/services/category-service.ts` - Services pour les appels API

### Hooks

- `src/hooks/use-categories.ts` - Hooks React Query pour la gestion d'état

### Composants

- `src/components/categories/category-form.tsx` - Formulaire de création/modification
- `src/components/categories/category-modal.tsx` - Modal pour le formulaire
- `src/components/categories/delete-category-modal.tsx` - Modal de confirmation de suppression
- `src/components/categories/categories-manager.tsx` - Interface principale de gestion
- `src/components/categories/category-tree.tsx` - Arbre hiérarchique des catégories

### Pages

- `app/organizations/[id]/categories/page.tsx` - Page de gestion des catégories
- `app/organizations/[id]/categories/tree/page.tsx` - Page d'arbre des catégories

## Utilisation

### Composant principal

```tsx
import { CategoriesManager } from "@/components/categories";

<CategoriesManager organizationId="your-org-id" />;
```

### Arbre des catégories

```tsx
import { CategoryTree } from "@/components/categories";

<CategoryTree
  organizationId="your-org-id"
  onCategorySelect={(category) => console.log(category)}
/>;
```

### Hooks disponibles

```tsx
import {
  useCategories,
  useCategoryTree,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/use-categories";

// Récupérer toutes les catégories
const { data: categories } = useCategories(organizationId);

// Récupérer l'arbre hiérarchique
const { data: tree } = useCategoryTree(organizationId);

// Créer une catégorie
const createMutation = useCreateCategory(organizationId);
```

## Fonctionnalités

- ✅ Création de catégories
- ✅ Modification de catégories
- ✅ Suppression de catégories
- ✅ Hiérarchie parent/enfant
- ✅ Couleurs et icônes personnalisées
- ✅ Arbre interactif avec expansion/réduction
- ✅ Interface responsive
- ✅ Gestion d'erreurs avec toast notifications

## API Routes utilisées

- `GET /api/organization/{organizationId}/categories` - Liste des catégories
- `POST /api/organization/{organizationId}/categories` - Création
- `GET /api/organization/{organizationId}/categories/tree` - Arbre hiérarchique
- `GET /api/organization/{organizationId}/categories/{categoryId}` - Détails d'une catégorie
- `PUT /api/organization/{organizationId}/categories/{categoryId}` - Modification
- `DELETE /api/organization/{organizationId}/categories/{categoryId}` - Suppression
