import { Link } from 'react-router-dom';
import { useItemSearch } from '../hooks/useItemSearch';
import { useInventory } from '../hooks/useInventory';
import { SearchInterface } from '../components/SearchInterface';
import { InventoryDisplay } from '../components/InventoryDisplay';

function MonsterHunter() {
  const {
    filteredItems,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
  } = useItemSearch();

  const {
    inventory,
    addItem,
    updateQuantity,
    getItemQuantity,
    clearInventory,
  } = useInventory();

  return (
    <div className="min-h-screen bg-(--color-background) text-(--color-text) p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-(--color-primary)">
            MHW: Board Game
          </h1>
          <Link 
            to="/" 
            className="px-6 py-3 border-2 border-solid border-(--color-primary) text-(--color-primary) rounded-lg hover:opacity-90 transition-opacity"
          >
            Back
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
          <div className="bg-white/85 rounded-lg p-6 shadow-md overflow-hidden flex flex-col">
            <h2 className="text-2xl font-bold text-(--color-primary) mb-4">
              Search Items
            </h2>
            <SearchInterface
              items={filteredItems}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              isLoading={isLoading}
              error={error}
              onAddItem={addItem}
              getItemQuantity={getItemQuantity}
            />
          </div>

          <div className="bg-white/85 rounded-lg p-6 shadow-md overflow-hidden flex flex-col">
            <InventoryDisplay
              inventory={inventory}
              onUpdateQuantity={updateQuantity}
              onClearInventory={clearInventory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonsterHunter;
