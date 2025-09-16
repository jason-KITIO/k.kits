"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity, // JAMAIS considéré comme périmé
        gcTime: Infinity, // JAMAIS supprimé du cache
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false, // CRITIQUE: ne jamais refetch au mount
        refetchOnReconnect: false,
        refetchInterval: false, // Pas de polling automatique
      },
      mutations: {
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
}
