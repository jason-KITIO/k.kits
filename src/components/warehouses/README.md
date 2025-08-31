# Module Entrepôts

Ce module fournit une interface complète pour gérer les entrepôts, leur stock, emplacements et gestionnaires.

## Fichiers créés

### Types

- `src/types/warehouse.ts` - Définitions TypeScript pour entrepôts, stock et emplacements

### Services

- `src/services/warehouse-service.ts` - Services pour les appels API

### Hooks

- `src/hooks/use-warehouses.ts` - Hooks React Query pour la gestion d'état

### Composants

- `src/components/warehouses/warehouses-manager.tsx` - Gestion des entrepôts
- `src/components/warehouses/warehouse-stock.tsx` - Affichage du stock par entrepôt
- `src/components/warehouses/locations-manager.tsx` - Gestion des emplacements
- `src/components/warehouses/warehouse-managers.tsx` - Affichage des gestionnaires

### Pages

- `app/organizations/[id]/warehouses/page.tsx` - Page principale des entrepôts
- `app/organizations/[id]/warehouses/stock/page.tsx` - Page du stock des entrepôts
- `app/organizations/[id]/warehouses/locations/page.tsx` - Page des emplacements
- `app/organizations/[id]/warehouses/managers/page.tsx` - Page des gestionnaires

## Utilisation

### Composants principaux

```tsx
import { WarehousesManager, WarehouseStock, LocationsManager, WarehouseManagers } from "@/components/warehouses";

// Gestion des entrepôts
<WarehousesManager organizationId="org-id" />

// Stock des entrepôts
<WarehouseStock organizationId="org-id" />

// Gestion des emplacements
<LocationsManager organizationId="org-id" />

// Gestionnaires d'entrepôts
<WarehouseManagers organizationId="org-id" />
```

### Hooks disponibles

```tsx
import {
  useWarehouses,
  useWarehouseStock,
  useLocations,
  useCreateWarehouse,
  useUpdateWarehouse,
  useDeleteWarehouse,
} from "@/hooks/use-warehouses";

// Récupérer les entrepôts
const { data: warehouses } = useWarehouses(organizationId);

// Récupérer le stock d'un entrepôt
const { data: stock } = useWarehouseStock(organizationId, warehouseId);

// Récupérer les emplacements
const { data: locations } = useLocations(organizationId, warehouseId);
```

## Fonctionnalités

### Mes entrepôts

- ✅ Création d'entrepôts
- ✅ Modification d'entrepôts
- ✅ Suppression d'entrepôts
- ✅ Assignation de gestionnaires
- ✅ Gestion des adresses

### Stock entrepôts

- ✅ Visualisation du stock par entrepôt
- ✅ Filtrage par entrepôt
- ✅ Indicateurs de statut (stock bas, rupture)
- ✅ Affichage des quantités réservées

### Emplacements

- ✅ Création d'emplacements par entrepôt
- ✅ Organisation par zone/allée/étagère/casier
- ✅ Modification et suppression
- ✅ Sélection d'entrepôt dynamique

### Gestionnaires

- ✅ Affichage des gestionnaires assignés
- ✅ Informations de contact
- ✅ Association entrepôt-gestionnaire

## API Routes utilisées

- `GET /api/organization/{organizationId}/warehouses` - Liste des entrepôts
- `POST /api/organization/{organizationId}/warehouses` - Création d'entrepôt
- `PUT /api/organization/{organizationId}/warehouses/{warehouseId}` - Modification
- `DELETE /api/organization/{organizationId}/warehouses/{warehouseId}` - Suppression
- `GET /api/organization/{organizationId}/warehouse-stock` - Stock global
- `GET /api/organization/{organizationId}/warehouse-stock/{warehouseId}` - Stock par entrepôt
- `GET /api/organization/{organizationId}/warehouses/{warehouseId}/locations` - Emplacements
- `POST /api/organization/{organizationId}/warehouses/{warehouseId}/locations` - Création emplacement
