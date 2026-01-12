import { useState, useEffect } from 'react';
import type { MHWItem, InventoryItem } from '../types/mhw';
import { loadInventory, saveInventory } from '../services/localStorage';

export interface UseInventoryResult {
  inventory: Map<number, InventoryItem>;
  addItem: (item: MHWItem, quantity: number) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, delta: number) => void;
  getItemQuantity: (itemId: number) => number;
}

export function useInventory(): UseInventoryResult {
  const [inventory, setInventory] = useState<Map<number, InventoryItem>>(
    () => loadInventory() || new Map()
  );

  // Persist inventory to localStorage whenever it changes
  useEffect(() => {
    saveInventory(inventory);
  }, [inventory]);

  const addItem = (item: MHWItem, quantity: number) => {
    setInventory((prev) => {
      const newInventory = new Map(prev);
      const existing = newInventory.get(item.id);
      
      if (existing) {
        newInventory.set(item.id, {
          item,
          quantity: existing.quantity + quantity,
        });
      } else {
        newInventory.set(item.id, { item, quantity });
      }
      
      return newInventory;
    });
  };

  const removeItem = (itemId: number) => {
    setInventory((prev) => {
      const newInventory = new Map(prev);
      newInventory.delete(itemId);
      return newInventory;
    });
  };

  const updateQuantity = (itemId: number, delta: number) => {
    setInventory((prev) => {
      const newInventory = new Map(prev);
      const existing = newInventory.get(itemId);
      
      if (!existing) return prev;
      
      const newQuantity = existing.quantity + delta;
      
      // Auto-remove items when quantity reaches 0
      if (newQuantity <= 0) {
        newInventory.delete(itemId);
      } else {
        newInventory.set(itemId, {
          ...existing,
          quantity: newQuantity,
        });
      }
      
      return newInventory;
    });
  };

  const getItemQuantity = (itemId: number): number => {
    return inventory.get(itemId)?.quantity || 0;
  };

  return {
    inventory,
    addItem,
    removeItem,
    updateQuantity,
    getItemQuantity,
  };
}
