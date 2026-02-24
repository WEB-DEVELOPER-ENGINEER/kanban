import { useInfiniteQuery } from '@tanstack/react-query';
import { taskKeys } from './queryKeys';
import * as taskApi from '../api/taskApi';
import type { ColumnId } from '@/lib/constants';

/**
 * Hook for fetching tasks with infinite scroll pagination
 * Requirements: 7.2 (infinite scroll pagination), 7.4 (pagination completion), 7.5 (page retention)
 * 
 * @param column - Column ID to fetch tasks for
 * @param search - Search query string
 * @returns React Query infinite query result
 */
export function useInfiniteTasks(column: ColumnId, search: string = '') {
  return useInfiniteQuery({
    queryKey: taskKeys.byColumn(column, 0, search), // Use 0 for infinite queries
    queryFn: ({ pageParam = 1 }) =>
      taskApi.getByColumn({ column, page: pageParam, search }),
    getNextPageParam: (lastPage, allPages) => {
      // Return next page number if there are more pages, undefined otherwise
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    // Keep previous data while fetching new pages for smooth UX
    placeholderData: (previousData) => previousData,
  });
}
