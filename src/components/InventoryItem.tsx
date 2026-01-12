import type { InventoryItem as InventoryItemType } from '../types/mhw';

interface InventoryItemProps {
  inventoryItem: InventoryItemType;
  onQuantityChange: (delta: number) => void;
}

export function InventoryItem({ inventoryItem, onQuantityChange }: InventoryItemProps) {
  const { item, quantity } = inventoryItem;

  return (
    <div className="bg-white/50 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-(--color-text)">{item.name}</h3>
          <p className="text-sm text-(--color-secondary)">Quantity: {quantity}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => onQuantityChange(-1)}
            className="w-8 h-8 rounded-full border-2 border-solid border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-white transition-colors"
          >
            -
          </button>
          
          <span className="text-lg font-semibold min-w-8 text-center text-(--color-text)">
            {quantity}
          </span>
          
          <button
            onClick={() => onQuantityChange(1)}
            className="w-8 h-8 rounded-full border-2 border-solid border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-white transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
