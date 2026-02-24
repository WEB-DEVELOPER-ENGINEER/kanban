import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useBoardStore } from '@/store/useBoardStore';

/**
 * Custom hook for managing search functionality with debouncing
 * Debounces user input by 300ms before updating the global search query
 * 
 * @returns Object containing raw input value and setter function
 */
export function useSearch() {
  // Local state for immediate input updates (no lag in input field)
  const [inputValue, setInputValue] = useState('');
  
  // Debounce the input value by 300ms
  const [debouncedValue] = useDebounce(inputValue, 300);
  
  // Get the Zustand action to update global search query
  const setSearchQuery = useBoardStore((state) => state.setSearchQuery);
  
  // Update global search query when debounced value changes
  useEffect(() => {
    setSearchQuery(debouncedValue);
  }, [debouncedValue, setSearchQuery]);
  
  return {
    inputValue,
    setInputValue,
  };
}
