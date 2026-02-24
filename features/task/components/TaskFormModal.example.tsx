/**
 * Example usage of TaskFormModal with lazy loading
 * This demonstrates how to use next/dynamic for code splitting (Requirement 11.5)
 */

import dynamic from 'next/dynamic';
import { useBoardStore } from '@/store/useBoardStore';

// Lazy-load TaskFormModal for code splitting
const TaskFormModal = dynamic(() => import('./TaskFormModal'), {
  ssr: false, // Disable SSR for modal since it's client-side only
});

export function ExampleUsage() {
  const openCreateModal = useBoardStore((state) => state.openCreateModal);
  const openEditModal = useBoardStore((state) => state.openEditModal);

  return (
    <div>
      <button onClick={openCreateModal}>Create Task</button>
      <button onClick={() => openEditModal(1)}>Edit Task 1</button>
      
      {/* Modal is lazy-loaded and only included in bundle when needed */}
      <TaskFormModal />
    </div>
  );
}
