import type { InventoryItem, InventoryState } from '../types/mhw';

const INVENTORY_STORAGE_KEY = 'mhw-inventory';

/**
 * Saves inventory to local storage
 */
export function saveInventory(inventory: Map<number, InventoryItem>): void {
  try {
    const inventoryArray: InventoryState = Array.from(inventory.values()).map(
      (invItem) => ({
        itemId: invItem.item.id,
        quantity: invItem.quantity,
        item: invItem.item,
      })
    );
    
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventoryArray));
  } catch (error) {
    console.error('Failed to save inventory to localStorage:', error);
  }
}

/**
 * Loads inventory from local storage
 * Returns null if no inventory exists or if data is corrupted
 */
export function loadInventory(): Map<number, InventoryItem> | null {
  try {
    const stored = localStorage.getItem(INVENTORY_STORAGE_KEY);
    
    if (!stored) {
      return null;
    }
    
    const inventoryArray: InventoryState = JSON.parse(stored);
    const inventory = new Map<number, InventoryItem>();
    
    inventoryArray.forEach((entry) => {
      inventory.set(entry.itemId, {
        item: entry.item,
        quantity: entry.quantity,
      });
    });
    
    return inventory;
  } catch (error) {
    console.error('Failed to load inventory from localStorage:', error);
    return null;
  }
}

/**
 * Clears inventory from local storage
 */
export function clearInventory(): void {
  try {
    localStorage.removeItem(INVENTORY_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear inventory from localStorage:', error);
  }
}
