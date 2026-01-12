import type { InventoryItem as InventoryItemType } from '../types/mhw';
import { InventoryItem } from './InventoryItem';

interface InventoryDisplayProps {
  inventory: Map<number, InventoryItemType>;
  onUpdateQuantity: (itemId: number, delta: number) => void;
  onClearInventory: () => void;
}

export function InventoryDisplay({ inventory, onUpdateQuantity, onClearInventory }: InventoryDisplayProps) {
  const inventoryArray = Array.from(inventory.values());

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-(--color-primary)">
          My Inventory
        </h2>
        {inventoryArray.length > 0 && (
          <button
            onClick={onClearInventory}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {inventoryArray.length === 0 ? (
        <div className="text-center py-8 text-(--color-secondary)">
          Your inventory is empty
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3">
          {inventoryArray.map((invItem) => (
            <InventoryItem
              key={invItem.item.id}
              inventoryItem={invItem}
              onQuantityChange={(delta) => onUpdateQuantity(invItem.item.id, delta)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
