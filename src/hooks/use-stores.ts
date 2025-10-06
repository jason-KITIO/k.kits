/**
 * @deprecated Ce fichier est conservé pour compatibilité. Utilisez @/hooks/features/stores à la place.
 * Fichier refactorisé: 166 lignes → 9 fichiers < 50 lignes
 */
export * from './features/stores';
export { useStoresWithFilters as useStores } from './features/stores/useStoreFilters';
export { useStoreById as useStore } from './features/stores/useStoreFilters';
export { useStoreStockById as useStoreStock } from './features/stores/useStoreFilters';
