import { api } from '@/lib/api';
import { PAGE_SIZE } from '@/lib/constants';
import type {
  Task,
  TaskFormData,
  TasksResponse,
  GetTasksByColumnParams,
} from '../types';

/**
 * Fetch tasks by column with optional pagination and search
 * @param params - Column, page, limit, and search parameters
 * @returns Promise with tasks, hasMore flag, and total count
 */
export async function getByColumn(
  params: GetTasksByColumnParams
): Promise<TasksResponse> {
  const { column, page = 1, limit = PAGE_SIZE, search = '' } = params;

  // json-server 1.x doesn't support _page/_limit with filtering
  // Fetch all tasks for the column
  const response = await api.get<Task[]>('/tasks', {
    params: {
      column,
    },
  });

  // json-server 1.x returns array directly for filtered queries
  let allTasks: Task[] = Array.isArray(response.data) ? response.data : [];

  // Client-side search filtering
  if (search) {
    const searchLower = search.toLowerCase();
    allTasks = allTasks.filter(task => 
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower)
    );
  }

  // Client-side pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const tasks = allTasks.slice(startIndex, endIndex);
  const totalCount = allTasks.length;
  const hasMore = endIndex < totalCount;

  return {
    tasks,
    hasMore,
    total: totalCount,
  };
}

/**
 * Create a new task
 * @param data - Task form data (title, description, column)
 * @returns Promise with the created task
 */
export async function create(data: TaskFormData): Promise<Task> {
  const response = await api.post<Task>('/tasks', {
    ...data,
    createdAt: new Date().toISOString(),
    order: Date.now(), // Use timestamp for initial order
  });

  return response.data;
}

/**
 * Update an existing task
 * @param id - Task ID
 * @param data - Partial task data to update
 * @returns Promise with the updated task
 */
export async function update(
  id: number | string,
  data: Partial<Task>
): Promise<Task> {
  const response = await api.patch<Task>(`/tasks/${id}`, data);
  return response.data;
}

/**
 * Delete a task
 * @param id - Task ID to delete
 * @returns Promise that resolves when deletion is complete
 */
export async function deleteTask(id: number | string): Promise<void> {
  await api.delete(`/tasks/${id}`);
}
