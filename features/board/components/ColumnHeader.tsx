import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import type { ColumnId } from '@/lib/constants';
import { COLUMNS } from '@/lib/constants';

interface ColumnHeaderProps {
  column: ColumnId;
  taskCount: number;
}

/**
 * ColumnHeader component displays the column title and task count badge
 * Implements Requirements:
 * - 1.1: Display four columns with labels
 * - 1.3: Display count badge showing number of tasks in column header
 */
const ColumnHeader: React.FC<ColumnHeaderProps> = ({ column, taskCount }) => {
  // Find the column label from COLUMNS constant
  const columnConfig = COLUMNS.find((col) => col.id === column);
  const columnLabel = columnConfig?.label || column;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
      component="header"
    >
      <Typography
        variant="h6"
        component="h2"
        sx={{
          fontWeight: 600,
          color: 'text.primary',
        }}
      >
        {columnLabel}
      </Typography>
      
      <Chip
        label={taskCount}
        size="small"
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          fontWeight: 600,
          minWidth: 32,
        }}
        aria-label={`${taskCount} tasks in ${columnLabel} column`}
      />
    </Box>
  );
};

export default ColumnHeader;
