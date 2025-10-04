// Export centralisé de tous les hooks optimisés
export * from "./use-auth";
export * from "./use-current-user";
export * from "./use-organization";
// export * from "./use-organizations";
export * from "./use-invitation";
export * from "./use-invitations";
export * from "./use-dashboard";
export * from "./use-roles";
export * from "./use-organization-roles";
export * from "./use-phone-auth";
export * from "./useOrganization";
// export * from "./useStore"; // Conflit avec use-stores.ts
export * from "./use-mobile";
export * from "./use-auth-with-roles";
export * from "./use-logout";
export * from "./use-permissions";
export * from "./use-warehouses";
export * from "./use-stores";

// Employee stock system hooks
export * from "./use-stock-movement-requests";

// Hooks d'optimisation
export * from "./use-optimized-query";
export * from "./use-prefetch";
export * from "./use-optimistic-mutations";
export * from "./use-skeleton";