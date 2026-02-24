/**
 * Smoke tests for task hooks
 * These tests verify that hooks are properly exported and have correct types
 */

import { useTasks } from '../useTasks';
import { useInfiniteTasks } from '../useInfiniteTasks';
import { useCreateTask } from '../useCreateTask';
import { useUpdateTask } from '../useUpdateTask';
import { useDeleteTask } from '../useDeleteTask';
import { taskKeys } from '../queryKeys';

describe('Task Hooks Exports', () => {
  it('should export useTasks', () => {
    expect(typeof useTasks).toBe('function');
  });

  it('should export useInfiniteTasks', () => {
    expect(typeof useInfiniteTasks).toBe('function');
  });

  it('should export useCreateTask', () => {
    expect(typeof useCreateTask).toBe('function');
  });

  it('should export useUpdateTask', () => {
    expect(typeof useUpdateTask).toBe('function');
  });

  it('should export useDeleteTask', () => {
    expect(typeof useDeleteTask).toBe('function');
  });

  it('should export taskKeys', () => {
    expect(taskKeys).toBeDefined();
    expect(taskKeys.all).toEqual(['tasks']);
  });
});

describe('Query Keys', () => {
  it('should generate correct query key for byColumn', () => {
    const key = taskKeys.byColumn('backlog', 1, 'test');
    expect(key).toEqual(['tasks', 'backlog', 1, 'test']);
  });

  it('should generate correct query key for detail', () => {
    const key = taskKeys.detail(42);
    expect(key).toEqual(['tasks', 'detail', 42]);
  });
});
