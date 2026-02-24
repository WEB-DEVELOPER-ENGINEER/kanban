import { QueryClient } from '@tanstack/react-query';

// Configure QueryClient with settings for caching, retry, and refetch behavior
// Requirements: 8.1 (30s staleTime), 8.3 (refetchOnWindowFocus), 8.4 (retry: 2)
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30 seconds - data is fresh for 30s (Requirement 8.1)
      gcTime: 5 * 60_000, // 5 minutes - garbage collection time
      retry: 2, // Retry failed queries up to 2 times (Requirement 8.4)
      refetchOnWindowFocus: true, // Refetch stale queries when window regains focus (Requirement 8.3)
      refetchOnReconnect: true, // Refetch when network reconnects
      refetchOnMount: true, // Refetch on component mount if data is stale
    },
    mutations: {
      retry: 1, // Retry failed mutations once
    },
  },
});
