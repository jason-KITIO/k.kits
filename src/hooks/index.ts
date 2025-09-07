// Export centralisé de tous les hooks optimisés
export * from "./use-auth";
export * from "./use-current-user";
export * from "./use-organization";
export * from "./use-organizations";
export * from "./use-invitation";
export * from "./use-invitations";
export * from "./use-dashboard";
export * from "./use-roles";
export * from "./use-organization-roles";
export * from "./use-phone-auth";
export * from "./useOrganization";
export * from "./useStore";
export * from "./use-mobile";

// Hooks d'optimisation
export * from "./use-cache-config";
export * from "./use-prefetch";
export * from "./use-optimistic-mutations";

// Configuration par défaut pour tous les hooks
export { CACHE_CONFIG, COMMON_OPTIONS, SPECIAL_OPTIONS } from "./use-cache-config";