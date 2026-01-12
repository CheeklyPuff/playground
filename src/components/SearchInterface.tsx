import type { MHWItem } from '../types/mhw';
import { ItemCard } from './ItemCard';

interface SearchInterfaceProps {
  items: MHWItem[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLoading: boolean;
  error: string | null;
  onAddItem: (item: MHWItem, quantity: number) => void;
  getItemQuantity: (itemId: number) => number;
}

export function SearchInterface({
  items,
  searchQuery,
  onSearchChange,
  isLoading,
  error,
  onAddItem,
  getItemQuantity,
}: SearchInterfaceProps) {
  const handleQuantityChange = (item: MHWItem, delta: number) => {
    const currentQuantity = getItemQuantity(item.id);
    const newQuantity = currentQuantity + delta;
    
    if (newQuantity >= 0) {
      onAddItem(item, delta);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search items..."
          className="w-full px-4 py-2 rounded-lg border-2 border-solid border-(--color-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
        />
      </div>

      {isLoading && (
        <div className="text-center py-8 text-(--color-text)">
          Loading items...
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-2 border-solid border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {!isLoading && !error && items.length === 0 && (
        <div className="text-center py-8 text-(--color-secondary)">
          No results found
        </div>
      )}

      {!isLoading && !error && items.length > 0 && (
        <div className="flex-1 overflow-y-auto space-y-3">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              quantity={getItemQuantity(item.id)}
              onQuantityChange={(delta) => handleQuantityChange(item, delta)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
