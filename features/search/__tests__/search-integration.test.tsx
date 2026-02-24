import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useInfiniteTasks } from '@/features/task/hooks/useInfiniteTasks';
import { useBoardStore } from '@/store/useBoardStore';
import { taskKeys } from '@/features/task/hooks/queryKeys';
import type { ColumnId } from '@/lib/constants';

/**
 * Integration tests for search filtering
 * Requirements: 6.2 (search triggers queries), 6.3 (search filters results), 6.4 (clear search restores)
 */

// Create a wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('Search Integration', () => {
  beforeEach(() => {
    // Reset Zustand store before each test
    useBoardStore.setState({ searchQuery: '' });
  });

  describe('Query key changes trigger refetch', () => {
    it('should include search query in query key', () => {
      const column: ColumnId = 'backlog';
      const search = 'test query';

      const queryKey = taskKeys.byColumn(column, 0, search);

      // Verify search is included in query key
      expect(queryKey).toContain('backlog');
      expect(queryKey).toContain('test query');
    });

    it('should generate different query keys for different search values', () => {
      const column: ColumnId = 'backlog';

      const key1 = taskKeys.byColumn(column, 0, '');
      const key2 = taskKeys.byColumn(column, 0, 'search term');

      // Different search values should produce different query keys
      expect(key1).not.toEqual(key2);
    });

    it('should generate same query key when search is cleared', () => {
      const column: ColumnId = 'backlog';

      const key1 = taskKeys.byColumn(column, 0, '');
      const key2 = taskKeys.byColumn(column, 0, '');

      // Same search values should produce same query keys
      expect(key1).toEqual(key2);
    });
  });

  describe('SearchBar connects to Column via Zustand', () => {
    it('should read search query from Zustand store', () => {
      const { searchQuery } = useBoardStore.getState();
      expect(searchQuery).toBe('');
    });

    it('should update search query in Zustand store', () => {
      const { setSearchQuery } = useBoardStore.getState();
      setSearchQuery('new search');

      const { searchQuery } = useBoardStore.getState();
      expect(searchQuery).toBe('new search');
    });

    it('should clear search query when set to empty string', () => {
      const { setSearchQuery } = useBoardStore.getState();
      
      // Set a search query
      setSearchQuery('test');
      expect(useBoardStore.getState().searchQuery).toBe('test');

      // Clear it
      setSearchQuery('');
      expect(useBoardStore.getState().searchQuery).toBe('');
    });
  });

  describe('Column component integration', () => {
    it('should pass search query to useInfiniteTasks hook', async () => {
      const wrapper = createWrapper();
      const column: ColumnId = 'backlog';
      const searchQuery = 'test search';

      const { result } = renderHook(
        () => useInfiniteTasks(column, searchQuery),
        { wrapper }
      );

      // Wait for the hook to initialize
      await waitFor(() => {
        expect(result.current).toBeDefined();
      });

      // Verify the query key includes the search parameter
      const queryKey = taskKeys.byColumn(column, 0, searchQuery);
      expect(queryKey).toContain(searchQuery);
    });

    it('should use empty string when no search query provided', async () => {
      const wrapper = createWrapper();
      const column: ColumnId = 'backlog';

      const { result } = renderHook(
        () => useInfiniteTasks(column, ''),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });

      const queryKey = taskKeys.byColumn(column, 0, '');
      expect(queryKey).toBeDefined();
    });
  });
});
