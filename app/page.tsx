'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import dynamic from 'next/dynamic';
import { useCallback } from 'react';
import { SearchBar } from '@/features/search';
import Board from '@/features/board/components/Board';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useBoardStore } from '@/store/useBoardStore';

// Lazy-load TaskFormModal for code splitting (Requirement 11.5)
const TaskFormModal = dynamic(
  () => import('@/features/task/components/TaskFormModal'),
  { ssr: false }
);

/**
 * Main Dashboard Page
 * 
 * Implements Requirements:
 * - 1.1: Display four columns in horizontal grid layout
 * - 1.4: Error boundaries to prevent crashes
 * - 2.1: Create task button that opens modal
 * - 11.1: Performance optimization with useCallback
 * - 11.5: Lazy-load TaskFormModal for code splitting
 */
export default function Home() {
  const openCreateModal = useBoardStore((state) => state.openCreateModal);

  // Requirement 11.1: Use useCallback to prevent function recreation
  const handleCreateClick = useCallback(() => {
    openCreateModal();
  }, [openCreateModal]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
        component="header"
        role="banner"
      >
        <Typography variant="h3" component="h1">
          Kanban ToDo Dashboard
        </Typography>
        
        {/* Requirement 2.1: Create task button that opens modal */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
          sx={{ minWidth: 150 }}
          aria-label="Create new task"
        >
          Create Task
        </Button>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }} component="section" aria-label="Search section">
        <SearchBar />
      </Box>

      {/* Board with Error Boundary */}
      {/* Requirement 1.4: Wrap columns in error boundaries */}
      <Box component="main" role="main" aria-label="Kanban board">
        <ErrorBoundary>
          <Board />
        </ErrorBoundary>
      </Box>

      {/* Task Form Modal (lazy-loaded) */}
      <TaskFormModal />
    </Container>
  );
}
