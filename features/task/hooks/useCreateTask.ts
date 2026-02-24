import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { taskKeys } from './queryKeys';
import * as taskApi from '../api/taskApi';
import type { TaskFormData } from '../types';

/**
 * Hook for creating a new task with cache invalidation and notifications
 * Requirements: 2.2 (POST request), 2.3 (success notification and UI update), 
 *               2.5 (error notification), 8.2 (cache invalidation)
 * 
 * @returns React Query mutation result for creating tasks
 */
export function useCreateTask() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (data: TaskFormData) => taskApi.create(data),
    onSuccess: (newTask) => {
      // Invalidate all task queries to refetch and show the new task
      // Requirement 8.2: Mutation invalidates cache
      queryClient.invalidateQueries({
        queryKey: taskKeys.all,
      });

      // Requirement 2.3: Display success notification
      enqueueSnackbar('Task created successfully', { variant: 'success' });
    },
    onError: (error) => {
      // Requirement 2.5: Display error notification
      enqueueSnackbar('Failed to create task', { variant: 'error' });
      console.error('Failed to create task:', error);
    },
  });
}
