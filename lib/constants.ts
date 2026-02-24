// Column IDs for the kanban board
export type ColumnId = 'backlog' | 'in_progress' | 'review' | 'done';

// Column configuration with display names
export const COLUMNS: Array<{ id: ColumnId; label: string }> = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

// API base URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Pagination configuration
export const PAGE_SIZE = 10; // Number of tasks per page for infinite scroll
