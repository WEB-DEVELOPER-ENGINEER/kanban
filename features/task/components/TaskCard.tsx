import React, { useCallback } from 'react';
import { Card, CardContent, CardActions, Typography, IconButton, Box, CircularProgress } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, DragIndicator as DragIcon } from '@mui/icons-material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types';
import { useBoardStore } from '@/store/useBoardStore';

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: number | string) => void;
  isDeleting?: boolean;
}

/**
 * TaskCard component displays an individual task with drag-and-drop functionality
 * Implements Requirements:
 * - 5.1: Drag visual feedback
 * - 10.1: Keyboard navigation and focus indicators
 * - 10.2: Keyboard-based drag-and-drop
 * - 11.1: Memoization for performance
 * - 4.4: Loading indicators
 */
const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, isDeleting = false }) => {
  const openEditModal = useBoardStore((state) => state.openEditModal);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  // Requirement 11.2: GPU-accelerated transforms for smooth drag performance
  // CSS.Transform.toString uses translate3d which triggers GPU acceleration
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    // Hint to browser to optimize for transforms
    willChange: isDragging ? 'transform' : undefined,
  };

  // Requirement 11.1: Use useCallback to prevent function recreation on each render
  const handleEdit = useCallback(() => {
    openEditModal(task.id);
  }, [openEditModal, task.id]);

  const handleDelete = useCallback(() => {
    onDelete(task.id);
  }, [onDelete, task.id]);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{
        mb: 2,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
      }}
      // Requirement 10.1 & 10.2: Make card focusable for keyboard navigation
      tabIndex={0}
      role="article"
      aria-label={`Task: ${task.title}`}
    >
      <CardContent>
        <Box display="flex" alignItems="flex-start" gap={1}>
          <Box
            {...attributes}
            {...listeners}
            sx={{
              cursor: 'grab',
              display: 'flex',
              alignItems: 'center',
              color: 'text.secondary',
              '&:active': {
                cursor: 'grabbing',
              },
            }}
            // Requirement 10.2: Keyboard drag-and-drop support
            role="button"
            aria-label={`Drag handle for task ${task.title}`}
            tabIndex={0}
          >
            <DragIcon />
          </Box>
          <Box flex={1}>
            <Typography variant="h6" component="h3" gutterBottom>
              {task.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {task.description}
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
              Created: {new Date(task.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <IconButton
          size="small"
          onClick={handleEdit}
          aria-label={`Edit task: ${task.title}`}
          color="primary"
          disabled={isDeleting}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={handleDelete}
          aria-label={`Delete task: ${task.title}`}
          color="error"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <CircularProgress size={20} color="error" aria-label="Deleting task" />
          ) : (
            <DeleteIcon fontSize="small" />
          )}
        </IconButton>
      </CardActions>
    </Card>
  );
};

// Wrap with React.memo for performance optimization (Requirement 11.1)
export default React.memo(TaskCard);
