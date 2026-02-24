import React, { useRef, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { useInfiniteTasks } from '@/features/task/hooks/useInfiniteTasks';
import { useDeleteTask } from '@/features/task/hooks/useDeleteTask';
import { useBoardStore } from '@/store/useBoardStore';
import TaskCard from '@/features/task/components/TaskCard';
import TaskSkeleton from '@/features/task/components/TaskSkeleton';
import ColumnHeader from '@/features/board/components/ColumnHeader';
import type { ColumnId } from '@/lib/constants';

interface ColumnProps {
  column: ColumnId;
}

/**
 * Column component displays tasks for a single workflow stage with infinite scroll
 * Implements Requirements:
 * - 1.2: Fetch and display tasks in respective columns
 * - 1.4: Display error messages without crashing
 * - 1.5: Display skeleton loading states
 * - 7.1: Display only first page initially
 * - 7.2: Auto-fetch next page on scroll
 * - 7.3: Display loading indicator during fetch
 * - 7.4: Stop fetching when all tasks loaded
 * - 7.5: Retain previously loaded pages in memory
 */
const Column: React.FC<ColumnProps> = ({ column }) => {
  const searchQuery = useBoardStore((state) => state.searchQuery);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Make column a droppable zone for drag-and-drop
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column}`,
    data: {
      type: 'column',
      column,
    },
  });

  // Fetch tasks with infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteTasks(column, searchQuery);

  // Delete task mutation
  const deleteTaskMutation = useDeleteTask();

  // Flatten all pages into a single array of tasks
  const tasks = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.tasks) ?? [];
  }, [data]);

  // Calculate total task count from all pages
  const totalTaskCount = React.useMemo(() => {
    return data?.pages[0]?.total ?? 0;
  }, [data]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Fetch next page when sentinel is visible and there are more pages
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Requirement 11.1: Use useCallback to prevent function recreation on each render
  const handleDeleteTask = useCallback((taskId: number | string) => {
    deleteTaskMutation.mutate(taskId);
  }, [deleteTaskMutation]);

  // Loading state - show skeletons (Requirement 1.5)
  if (isLoading) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        role="region"
        aria-label={`${column.replace('_', ' ')} column`}
        aria-busy="true"
      >
        <ColumnHeader column={column} taskCount={0} />
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }} role="status" aria-live="polite">
          {[1, 2, 3].map((i) => (
            <TaskSkeleton key={i} />
          ))}
        </Box>
      </Box>
    );
  }

  // Error state (Requirement 1.4)
  if (isError) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        role="region"
        aria-label={`${column.replace('_', ' ')} column`}
      >
        <ColumnHeader column={column} taskCount={0} />
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          <Alert severity="error" role="alert" aria-live="assertive">
            {error instanceof Error ? error.message : 'Failed to load tasks'}
          </Alert>
        </Box>
      </Box>
    );
  }

  // Get task IDs for SortableContext
  const taskIds = tasks.map((task) => task.id);

  return (
    <Box
      ref={setNodeRef}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: isOver ? 'action.hover' : 'transparent',
        transition: 'background-color 0.2s ease',
      }}
      role="region"
      aria-label={`${column.replace('_', ' ')} column`}
    >
      {/* Column header with title and task count */}
      <ColumnHeader column={column} taskCount={totalTaskCount} />

      {/* Scrollable task list */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
        }}
        role="list"
        aria-label={`Tasks in ${column.replace('_', ' ')} column`}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: 'center', mt: 4 }}
              role="status"
              aria-live="polite"
            >
              No tasks found
            </Typography>
          ) : (
            tasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onDelete={handleDeleteTask}
                isDeleting={deleteTaskMutation.isPending && deleteTaskMutation.variables === task.id}
              />
            ))
          )}
        </SortableContext>

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} style={{ height: '1px' }} aria-hidden="true" />

        {/* Loading indicator for next page */}
        {isFetchingNextPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }} role="status" aria-live="polite">
            <CircularProgress size={24} aria-label="Loading more tasks" />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Column;
