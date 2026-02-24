import { useQuery } from '@tanstack/react-query';
import { taskKeys } from './queryKeys';
import * as taskApi from '../api/taskApi';
import type { ColumnId } from '@/lib/constants';

/**
 * Hook for fetching tasks by column with pagination and search
 * Requirements: 1.2 (fetch tasks by column), 7.2 (pagination)
 * 
 * @param column - Column ID to fetch tasks for
 * @param page - Page number for pagination
 * @param search - Search query string
 * @returns React Query result with tasks data
 */
export function useTasks(column: ColumnId, page: number = 1, search: string = '') {
  return useQuery({
    queryKey: taskKeys.byColumn(column, page, search),
    queryFn: () => taskApi.getByColumn({ column, page, search }),
  });
}
