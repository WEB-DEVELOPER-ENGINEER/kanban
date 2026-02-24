import { useBoardStore } from './useBoardStore';

describe('useBoardStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useBoardStore.getState();
    store.closeModal();
    store.setSearchQuery('');
    store.setDraggingTaskId(null);
  });

  describe('Search state', () => {
    it('should initialize with empty search query', () => {
      const { searchQuery } = useBoardStore.getState();
      expect(searchQuery).toBe('');
    });

    it('should update search query', () => {
      const { setSearchQuery } = useBoardStore.getState();
      setSearchQuery('test query');
      
      const { searchQuery } = useBoardStore.getState();
      expect(searchQuery).toBe('test query');
    });
  });

  describe('Modal state', () => {
    it('should initialize with modal closed', () => {
      const { isModalOpen, editingTaskId } = useBoardStore.getState();
      expect(isModalOpen).toBe(false);
      expect(editingTaskId).toBe(null);
    });

    it('should open create modal', () => {
      const { openCreateModal } = useBoardStore.getState();
      openCreateModal();
      
      const { isModalOpen, editingTaskId } = useBoardStore.getState();
      expect(isModalOpen).toBe(true);
      expect(editingTaskId).toBe(null);
    });

    it('should open edit modal with task ID', () => {
      const { openEditModal } = useBoardStore.getState();
      openEditModal(42);
      
      const { isModalOpen, editingTaskId } = useBoardStore.getState();
      expect(isModalOpen).toBe(true);
      expect(editingTaskId).toBe(42);
    });

    it('should close modal and reset editing task ID', () => {
      const { openEditModal, closeModal } = useBoardStore.getState();
      openEditModal(42);
      closeModal();
      
      const { isModalOpen, editingTaskId } = useBoardStore.getState();
      expect(isModalOpen).toBe(false);
      expect(editingTaskId).toBe(null);
    });
  });

  describe('Drag state', () => {
    it('should initialize with no dragging task', () => {
      const { draggingTaskId } = useBoardStore.getState();
      expect(draggingTaskId).toBe(null);
    });

    it('should set dragging task ID', () => {
      const { setDraggingTaskId } = useBoardStore.getState();
      setDraggingTaskId(123);
      
      const { draggingTaskId } = useBoardStore.getState();
      expect(draggingTaskId).toBe(123);
    });

    it('should clear dragging task ID', () => {
      const { setDraggingTaskId } = useBoardStore.getState();
      setDraggingTaskId(123);
      setDraggingTaskId(null);
      
      const { draggingTaskId } = useBoardStore.getState();
      expect(draggingTaskId).toBe(null);
    });
  });
});
