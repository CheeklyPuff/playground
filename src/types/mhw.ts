/**
 * Monster Hunter World Item from the MHW-DB API
 */
export interface MHWItem {
  id: number;
  name: string;
  description: string;
  rarity: number;
  carryLimit: number;
  value: number;
}

/**
 * Item in the user's inventory with quantity
 */
export interface InventoryItem {
  item: MHWItem;
  quantity: number;
}

/**
 * Inventory state for local storage serialization
 */
export type InventoryState = Array<{
  itemId: number;
  quantity: number;
  item: MHWItem;
}>;
