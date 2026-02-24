import type { ColumnId } from '@/lib/constants';

/**
 * Query key factory for task-related queries
 * Provides consistent query keys for React Query cache management
 */
export const taskKeys = {
  /**
   * Base key for all task queries
   */
  all: ['tasks'] as const,

  /**
   * Query key for fetching tasks by column with pagination and search
   * @param column - Column ID
   * @param page - Page number (for pagination)
   * @param search - Search query string
   */
  byColumn: (column: ColumnId, page: number, search: string) =>
    ['tasks', column, page, search] as const,

  /**
   * Query key for a specific task by ID
   * @param id - Task ID
   */
  detail: (id: number | string) => ['tasks', 'detail', id] as const,
};
