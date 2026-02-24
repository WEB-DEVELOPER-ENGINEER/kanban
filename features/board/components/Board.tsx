import React, { useCallback } from 'react';
import { Box, Container } from '@mui/material';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Column from './Column';
import { COLUMNS } from '@/lib/constants';
import { useBoardStore } from '@/store/useBoardStore';
import { useUpdateTask } from '@/features/task/hooks/useUpdateTask';
import type { ColumnId } from '@/lib/constants';
import type { Task } from '@/features/task/types';

/**
 * Board component - Root container for the kanban board with drag-and-drop
 * 
 * Implements Requirements:
 * - 1.1: Display four columns in horizontal grid layout
 * - 5.2: Optimistic column move
 * - 5.3: Column move triggers PATCH
 * - 5.4: Failed move rollback
 * - 5.5: Keyboard drag-and-drop support
 * - 10.2: Keyboard-based drag-and-drop operations
 * - 10.3: ARIA announcements for drag operations
 */
const Board: React.FC = () => {
  const setDraggingTaskId = useBoardStore((state) => state.setDraggingTaskId);
  const draggingTaskId = useBoardStore((state) => state.draggingTaskId);
  const updateTaskMutation = useUpdateTask();

  // Configure sensors for pointer and keyboard input
  // Requirement 5.5 & 10.2: Support keyboard-based drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts (prevents accidental drags)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Handle drag start event
   * Requirement 5.1: Visual feedback during drag
   * Requirement 11.1: Use useCallback to prevent function recreation
   */
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id as number;
    setDraggingTaskId(taskId);
  }, [setDraggingTaskId]);

  /**
   * Handle drag end event
   * Requirements:
   * - 5.2: Optimistic column move
   * - 5.3: Column move triggers PATCH
   * - 5.4: Failed move rollback (handled in useUpdateTask)
   * - 11.1: Use useCallback to prevent function recreation
   */
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    // Clear dragging state
    setDraggingTaskId(null);

    // If dropped outside a valid drop zone, do nothing
    if (!over) {
      return;
    }

    const taskId = active.id as number;
    const task = active.data.current?.task as Task | undefined;
    
    // Determine the target column
    // The 'over' can be either a column or another task
    let targetColumn: ColumnId | undefined;
    
    if (over.data.current?.type === 'column') {
      targetColumn = over.data.current.column as ColumnId;
    } else if (over.data.current?.type === 'task') {
      targetColumn = over.data.current.task.column as ColumnId;
    }

    // If we have a valid task and target column, and the column changed
    if (task && targetColumn && task.column !== targetColumn) {
      // Requirement 5.3: Send PATCH request to update task's column
      // Requirement 5.2: Optimistic update happens in useUpdateTask
      updateTaskMutation.mutate({
        id: taskId,
        data: { column: targetColumn },
      });
    }
  }, [setDraggingTaskId, updateTaskMutation]);

  /**
   * ARIA announcements for accessibility
   * Requirement 10.3: Provide ARIA announcements describing drag state and drop result
   */
  const announcements = {
    onDragStart({ active }: DragStartEvent) {
      const task = active.data.current?.task as Task | undefined;
      return task
        ? `Picked up task: ${task.title}`
        : 'Picked up draggable item';
    },
    onDragOver({ active, over }: any) {
      const task = active.data.current?.task as Task | undefined;
      if (!task) return '';

      if (over) {
        const overColumn = over.data.current?.type === 'column'
          ? over.data.current.column
          : over.data.current?.task?.column;
        
        if (overColumn) {
          const columnLabel = COLUMNS.find(col => col.id === overColumn)?.label;
          return `Task ${task.title} is over ${columnLabel} column`;
        }
      }
      return `Task ${task.title} is no longer over a droppable area`;
    },
    onDragEnd({ active, over }: DragEndEvent) {
      const task = active.data.current?.task as Task | undefined;
      if (!task) return 'Dragging ended';

      if (over) {
        const targetColumn = over.data.current?.type === 'column'
          ? over.data.current.column
          : over.data.current?.task?.column;
        
        if (targetColumn && targetColumn !== task.column) {
          const columnLabel = COLUMNS.find(col => col.id === targetColumn)?.label;
          return `Task ${task.title} was moved to ${columnLabel} column`;
        }
      }
      return `Task ${task.title} was dropped in its original position`;
    },
    onDragCancel({ active }: any) {
      const task = active.data.current?.task as Task | undefined;
      return task
        ? `Dragging cancelled for task: ${task.title}`
        : 'Dragging was cancelled';
    },
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      accessibility={{
        announcements,
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Requirement 1.1: Display four columns in horizontal grid layout */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 2,
            height: 'calc(100vh - 200px)',
          }}
        >
          {COLUMNS.map((column) => (
            <Box
              key={column.id}
              sx={{
                height: '100%',
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: 1,
                overflow: 'hidden',
              }}
            >
              <Column column={column.id} />
            </Box>
          ))}
        </Box>
      </Container>

      {/* DragOverlay for better visual feedback during drag */}
      <DragOverlay>
        {draggingTaskId ? (
          <Box
            sx={{
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: 3,
              opacity: 0.9,
              cursor: 'grabbing',
            }}
          >
            Dragging...
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Board;
