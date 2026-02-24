import React from 'react';
import { Card, CardContent, CardActions, Box, Skeleton } from '@mui/material';

/**
 * TaskSkeleton component displays a loading placeholder for task cards
 * Implements Requirement 1.5: Display skeleton loading states during initial load and pagination
 * Implements Requirement 7.3: Display loading indicators during fetch
 */
const TaskSkeleton: React.FC = () => {
  return (
    <Card
      sx={{
        mb: 2,
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="flex-start" gap={1}>
          {/* Drag handle skeleton */}
          <Skeleton variant="circular" width={24} height={24} />
          
          <Box flex={1}>
            {/* Title skeleton */}
            <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
            
            {/* Description skeleton - two lines */}
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
            
            {/* Date skeleton */}
            <Skeleton variant="text" width="30%" height={16} />
          </Box>
        </Box>
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        {/* Action buttons skeleton */}
        <Skeleton variant="circular" width={32} height={32} sx={{ mr: 1 }} />
        <Skeleton variant="circular" width={32} height={32} />
      </CardActions>
    </Card>
  );
};

export default TaskSkeleton;
