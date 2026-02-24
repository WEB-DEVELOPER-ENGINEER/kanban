import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useSearch } from '../hooks/useSearch';
import { useCallback } from 'react';

/**
 * SearchBar component with debounced search functionality
 * Provides a Material UI text field with search icon
 * Debounces input by 300ms before triggering global search query update
 * 
 * Implements Requirements:
 * - 6.1: Debounced search input
 * - 10.1: Keyboard navigation and focus indicators
 * - 11.1: Performance optimization with useCallback
 */
export function SearchBar() {
  const { inputValue, setInputValue } = useSearch();
  
  // Requirement 11.1: Use useCallback to prevent function recreation
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, [setInputValue]);
  
  return (
    <TextField
      fullWidth
      placeholder="Search tasks..."
      value={inputValue}
      onChange={handleChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      inputProps={{
        'aria-label': 'Search tasks by title or description',
        'role': 'searchbox',
      }}
      sx={{
        maxWidth: 600,
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'background.paper',
        },
      }}
    />
  );
}
