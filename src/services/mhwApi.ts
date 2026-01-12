import type { MHWItem } from '../types/mhw';

const MHW_API_BASE_URL = 'https://mhw-db.com';

/**
 * Fetches all items from the MHW-DB API
 */
export async function fetchAllItems(): Promise<MHWItem[]> {
  try {
    const response = await fetch(`${MHW_API_BASE_URL}/items`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data as MHWItem[];
  } catch (error) {
    console.error('Failed to fetch items from MHW API:', error);
    throw error;
  }
}

/**
 * Filters items by search query (case-insensitive name matching)
 */
export function searchItems(query: string, items: MHWItem[]): MHWItem[] {
  if (!query.trim()) {
    return items;
  }
  
  const lowerQuery = query.toLowerCase();
  return items.filter(item => 
    item.name.toLowerCase().includes(lowerQuery)
  );
}
