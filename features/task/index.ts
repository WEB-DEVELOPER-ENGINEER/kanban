/**
 * Task feature module exports
 * Provides components, hooks, API functions, and types for task management
 * 
 * Implements Requirements:
 * - 12.1: Feature-first project structure with clear exports
 * - 12.5: Clear index.ts files exporting public APIs
 */

// Components
export { default as TaskCard } from './components/TaskCard';
export { default as TaskForm } from './components/TaskForm';
export { default as TaskFormModal } from './components/TaskFormModal';
export { default as TaskSkeleton } from './components/TaskSkeleton';

// Hooks
export {
  useTasks,
  useInfiniteTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  taskKeys,
} from './hooks';

// Types
export type {
  Task,
  TaskFormData,
  TasksResponse,
  GetTasksByColumnParams,
} from './types';

// API
export * as taskApi from './api/taskApi';
