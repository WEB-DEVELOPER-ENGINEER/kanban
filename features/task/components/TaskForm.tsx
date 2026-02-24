import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Stack,
  CircularProgress,
} from '@mui/material';
import { useBoardStore } from '@/store/useBoardStore';
import { useCreateTask } from '../hooks/useCreateTask';
import { useUpdateTask } from '../hooks/useUpdateTask';
import { useTasks } from '../hooks/useTasks';
import { COLUMNS } from '@/lib/constants';
import type { TaskFormData } from '../types';
import type { ColumnId } from '@/lib/constants';

/**
 * TaskForm component for creating and editing tasks
 * Implements Requirements:
 * - 2.1: Modal form with title, description, and column fields
 * - 2.4: Validation for empty/whitespace-only titles
 * - 3.1: Pre-populate form fields when editing
 * - 3.4: Validation for empty titles in edit mode
 */
const TaskForm: React.FC = () => {
  const editingTaskId = useBoardStore((state) => state.editingTaskId);
  const closeModal = useBoardStore((state) => state.closeModal);
  
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [column, setColumn] = useState<ColumnId>('backlog');
  const [titleError, setTitleError] = useState('');

  // Determine if we're in edit mode
  const isEditMode = editingTaskId !== null;

  // Fetch the task being edited (if in edit mode)
  // We need to find the task across all columns
  const backlogQuery = useTasks('backlog');
  const inProgressQuery = useTasks('in_progress');
  const reviewQuery = useTasks('review');
  const doneQuery = useTasks('done');

  // Find the task being edited
  const editingTask = React.useMemo(() => {
    if (!isEditMode) return null;

    const allTasks = [
      ...(backlogQuery.data?.tasks || []),
      ...(inProgressQuery.data?.tasks || []),
      ...(reviewQuery.data?.tasks || []),
      ...(doneQuery.data?.tasks || []),
    ];

    return allTasks.find((task) => task.id === editingTaskId) || null;
  }, [
    isEditMode,
    editingTaskId,
    backlogQuery.data,
    inProgressQuery.data,
    reviewQuery.data,
    doneQuery.data,
  ]);

  // Pre-populate form when editing (Requirement 3.1)
  useEffect(() => {
    if (isEditMode && editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setColumn(editingTask.column);
    } else {
      // Reset form for create mode
      setTitle('');
      setDescription('');
      setColumn('backlog');
    }
    setTitleError('');
  }, [isEditMode, editingTask]);

  // Validate title for empty/whitespace-only strings (Requirements 2.4, 3.4)
  const validateTitle = (value: string): boolean => {
    if (!value.trim()) {
      setTitleError('Title cannot be empty or contain only whitespace');
      return false;
    }
    setTitleError('');
    return true;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    // Clear error when user starts typing
    if (titleError && value.trim()) {
      setTitleError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate title
    if (!validateTitle(title)) {
      return;
    }

    const formData: TaskFormData = {
      title: title.trim(),
      description: description.trim(),
      column,
    };

    try {
      if (isEditMode && editingTaskId) {
        // Update existing task (Requirement 3.2)
        await updateMutation.mutateAsync({
          id: editingTaskId,
          data: formData,
        });
      } else {
        // Create new task (Requirement 2.2)
        await createMutation.mutateAsync(formData);
      }

      // Close modal on success (Requirements 2.3, 3.3)
      closeModal();
    } catch (error) {
      // Error handling is done in the mutation hooks
      // Modal stays open with user data intact (Requirements 2.5, 3.5)
      console.error('Form submission error:', error);
    }
  };

  const handleCancel = () => {
    closeModal();
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={3}>
        <TextField
          label="Title"
          value={title}
          onChange={handleTitleChange}
          error={!!titleError}
          helperText={titleError}
          required
          fullWidth
          autoFocus
          disabled={isSubmitting}
          inputProps={{
            'aria-label': 'Task title',
            'aria-required': 'true',
            'aria-invalid': !!titleError,
            'aria-describedby': titleError ? 'title-error-text' : undefined,
          }}
          FormHelperTextProps={{
            id: 'title-error-text',
            role: 'alert',
            'aria-live': 'polite',
          }}
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={4}
          fullWidth
          disabled={isSubmitting}
          inputProps={{
            'aria-label': 'Task description',
          }}
        />

        <TextField
          select
          label="Column"
          value={column}
          onChange={(e) => setColumn(e.target.value as ColumnId)}
          fullWidth
          disabled={isSubmitting}
          inputProps={{
            'aria-label': 'Select task column',
          }}
          SelectProps={{
            MenuProps: {
              'aria-label': 'Column selection menu',
            },
          }}
        >
          {COLUMNS.map((col) => (
            <MenuItem key={col.id} value={col.id}>
              {col.label}
            </MenuItem>
          ))}
        </TextField>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            onClick={handleCancel}
            disabled={isSubmitting}
            variant="outlined"
            aria-label="Cancel and close form"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : undefined}
            aria-label={isEditMode ? 'Update task' : 'Create new task'}
          >
            {isEditMode ? 'Update Task' : 'Create Task'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default TaskForm;
