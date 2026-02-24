import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { taskKeys } from './queryKeys';
import * as taskApi from '../api/taskApi';
import type { Task } from '../types';

interface UpdateTaskParams {
  id: number | string;
  data: Partial<Task>;
}

/**
 * Hook for updating a task with optimistic updates and rollback on error
 * Requirements: 3.2 (PATCH request), 3.3 (success notification), 3.5 (error notification),
 *               5.2 (optimistic update), 5.3 (column move PATCH), 
 *               5.4 (rollback on error), 8.2 (cache invalidation)
 * 
 * @returns React Query mutation result for updating tasks
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ id, data }: UpdateTaskParams) => taskApi.update(id, data),
    
    // Optimistic update: Update UI immediately before API responds
    // Requirement 5.2: Optimistic column move
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: taskKeys.all });

      // Snapshot the previous state for rollback
      const previousQueries = queryClient.getQueriesData({ queryKey: taskKeys.all });

      // Optimistically update all matching queries
      queryClient.setQueriesData({ queryKey: taskKeys.all }, (old: any) => {
        if (!old) return old;

        // Handle infinite query structure
        if (old.pages) {
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              tasks: page.tasks.map((task: Task) =>
                task.id === id ? { ...task, ...data } : task
              ),
            })),
          };
        }

        // Handle regular query structure
        if (old.tasks) {
          return {
            ...old,
            tasks: old.tasks.map((task: Task) =>
              task.id === id ? { ...task, ...data } : task
            ),
          };
        }

        return old;
      });

      // Return context with snapshot for rollback
      return { previousQueries };
    },

    onSuccess: () => {
      // Invalidate queries to refetch fresh data from server
      // Requirement 8.2: Mutation invalidates cache
      queryClient.invalidateQueries({
        queryKey: taskKeys.all,
      });

      // Requirement 3.3: Display success notification
      enqueueSnackbar('Task updated successfully', { variant: 'success' });
    },

    // Rollback on error
    // Requirement 5.4: Failed move rollback with error notification
    onError: (error, _variables, context) => {
      // Restore all previous query states
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      // Requirement 3.5: Display error notification
      enqueueSnackbar('Failed to update task', { variant: 'error' });
      console.error('Failed to update task:', error);
    },

    // Always refetch after error or success to ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.all,
      });
    },
  });
}
