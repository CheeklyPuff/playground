import type { MHWItem } from '../types/mhw';

interface ItemCardProps {
  item: MHWItem;
  quantity: number;
  onQuantityChange: (delta: number) => void;
}

export function ItemCard({ item, quantity, onQuantityChange }: ItemCardProps) {
  const rarityColors = [
    'text-gray-400',
    'text-gray-300',
    'text-green-400',
    'text-green-500',
    'text-blue-400',
    'text-blue-500',
    'text-purple-400',
    'text-purple-500',
    'text-yellow-400',
    'text-yellow-500',
    'text-orange-400',
    'text-orange-500',
    'text-red-500',
  ];

  const rarityColor = rarityColors[item.rarity] || 'text-gray-400';

  return (
    <div className="bg-white/50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg text-(--color-text)">{item.name}</h3>
        <span className={`text-sm font-bold ${rarityColor}`}>
          ★{item.rarity}
        </span>
      </div>
      
      <div className="flex items-center gap-3 mt-3">
        <button
          onClick={() => onQuantityChange(-1)}
          disabled={quantity === 0}
          className="w-8 h-8 rounded-full border-2 border-solid border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
  );
}
