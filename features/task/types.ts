import { ColumnId } from '@/lib/constants';

/**
 * Task interface representing a work item in the kanban board
 */
export interface Task {
  id: number | string; // json-server 1.x uses string IDs
  title: string;
  description: string;
  column: ColumnId;
  createdAt: string; // ISO 8601 timestamp
  order: number; // for deterministic sort within column
}

/**
 * Form data for creating or updating a task
 */
export interface TaskFormData {
  title: string;
  description: string;
  column: ColumnId;
}

/**
 * Response from the API when fetching tasks with pagination
 */
export interface TasksResponse {
  tasks: Task[];
  hasMore: boolean;
  total: number;
}

/**
 * Parameters for fetching tasks by column
 */
export interface GetTasksByColumnParams {
  column: ColumnId;
  page?: number;
  limit?: number;
  search?: string;
}
