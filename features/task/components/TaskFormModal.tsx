import React, { useRef, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { useBoardStore } from '@/store/useBoardStore';
import TaskForm from './TaskForm';

/**
 * TaskFormModal component wrapping TaskForm in a MUI Dialog
 * Implements Requirements:
 * - 2.1: Modal form for creating tasks
 * - 3.1: Modal form for editing tasks
 * - 10.5: Focus trap and focus restoration on close
 * - 11.5: Lazy-loadable for code splitting
 */
const TaskFormModal: React.FC = () => {
  const isModalOpen = useBoardStore((state) => state.isModalOpen);
  const editingTaskId = useBoardStore((state) => state.editingTaskId);
  const closeModal = useBoardStore((state) => state.closeModal);

  // Store reference to the element that triggered the modal
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Capture the active element when modal opens
  useEffect(() => {
    if (isModalOpen && !triggerElementRef.current) {
      triggerElementRef.current = document.activeElement as HTMLElement;
    }
  }, [isModalOpen]);

  // Restore focus to trigger element when modal closes
  // Requirement 11.1: Use useCallback to prevent function recreation
  const handleClose = useCallback(() => {
    closeModal();
    
    // Restore focus after a brief delay to ensure modal is fully closed
    setTimeout(() => {
      if (triggerElementRef.current && typeof triggerElementRef.current.focus === 'function') {
        triggerElementRef.current.focus();
      }
      triggerElementRef.current = null;
    }, 0);
  }, [closeModal]);

  const isEditMode = editingTaskId !== null;

  return (
    <Dialog
      open={isModalOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="task-form-dialog-title"
      // MUI Dialog automatically implements focus trap (Requirement 10.5)
      // disableRestoreFocus is false by default, which handles focus restoration
    >
      <DialogTitle id="task-form-dialog-title">
        {isEditMode ? 'Edit Task' : 'Create New Task'}
      </DialogTitle>
      <DialogContent>
        <TaskForm />
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormModal;
