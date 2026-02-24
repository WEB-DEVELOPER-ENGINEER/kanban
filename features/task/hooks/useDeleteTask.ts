import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { taskKeys } from './queryKeys';
import * as taskApi from '../api/taskApi';

/**
 * Hook for deleting a task with cache invalidation and notifications
 * Requirements: 4.1 (DELETE request), 4.2 (remove from UI and success notification), 
 *               4.3 (error notification), 8.2 (cache invalidation)
 * 
 * @returns React Query mutation result for deleting tasks
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (id: number | string) => taskApi.deleteTask(id),
    
    onSuccess: (_data, deletedId) => {
      // Invalidate all task queries to refetch and remove the deleted task
      // Requirement 8.2: Mutation invalidates cache
      queryClient.invalidateQueries({
        queryKey: taskKeys.all,
      });

      // Requirement 4.2: Display success notification
      enqueueSnackbar('Task deleted successfully', { variant: 'success' });
    },

    onError: (error) => {
      // Requirement 4.3: Display error notification
      enqueueSnackbar('Failed to delete task', { variant: 'error' });
      console.error('Failed to delete task:', error);
    },
  });
}
