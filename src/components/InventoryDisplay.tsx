import type { InventoryItem as InventoryItemType } from '../types/mhw';
import { InventoryItem } from './InventoryItem';

interface InventoryDisplayProps {
  inventory: Map<number, InventoryItemType>;
  onUpdateQuantity: (itemId: number, delta: number) => void;
}

export function InventoryDisplay({ inventory, onUpdateQuantity }: InventoryDisplayProps) {
  const inventoryArray = Array.from(inventory.values());

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold text-(--color-primary) mb-4">
        My Inventory
      </h2>

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
