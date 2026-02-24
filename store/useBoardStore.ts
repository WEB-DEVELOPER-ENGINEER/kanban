import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface BoardStore {
  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Modal state
  isModalOpen: boolean;
  editingTaskId: number | string | null;
  openCreateModal: () => void;
  openEditModal: (taskId: number | string) => void;
  closeModal: () => void;

  // Drag state
  draggingTaskId: number | string | null;
  setDraggingTaskId: (taskId: number | string | null) => void;
}

export const useBoardStore = create<BoardStore>()(
  devtools(
    (set) => ({
      // Initial search state
      searchQuery: '',
      setSearchQuery: (query: string) =>
        set({ searchQuery: query }, false, 'setSearchQuery'),

      // Initial modal state
      isModalOpen: false,
      editingTaskId: null,
      openCreateModal: () =>
        set(
          { isModalOpen: true, editingTaskId: null },
          false,
          'openCreateModal'
        ),
      openEditModal: (taskId: number | string) =>
        set(
          { isModalOpen: true, editingTaskId: taskId },
          false,
          'openEditModal'
        ),
      closeModal: () =>
        set(
          { isModalOpen: false, editingTaskId: null },
          false,
          'closeModal'
        ),

      // Initial drag state
      draggingTaskId: null,
      setDraggingTaskId: (taskId: number | string | null) =>
        set({ draggingTaskId: taskId }, false, 'setDraggingTaskId'),
    }),
    { name: 'BoardStore' }
  )
);
