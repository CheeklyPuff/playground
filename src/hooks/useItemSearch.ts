import { useState, useEffect, useMemo } from 'react';
import type { MHWItem } from '../types/mhw';
import { fetchAllItems, searchItems } from '../services/mhwApi';

export interface UseItemSearchResult {
  items: MHWItem[];
  searchQuery: string;
  filteredItems: MHWItem[];
  isLoading: boolean;
  error: string | null;
  setSearchQuery: (query: string) => void;
}

export function useItemSearch(): UseItemSearchResult {
  const [items, setItems] = useState<MHWItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch items on mount
  useEffect(() => {
    const loadItems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedItems = await fetchAllItems();
        setItems(fetchedItems);
      } catch (err) {
        setError('Unable to load items. Please check your connection.');
        console.error('Error fetching items:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, []);

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    return searchItems(searchQuery, items);
  }, [searchQuery, items]);

  return {
    items,
    searchQuery,
    filteredItems,
    isLoading,
    error,
    setSearchQuery,
  };
}
