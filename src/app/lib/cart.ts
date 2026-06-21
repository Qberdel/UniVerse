import { getMenuItemById, type MenuItem } from "./menu-items";

const STORAGE_KEY = "universe:cart";
const UPDATED_EVENT = "universe-cart-updated";

export type CartLineItem = MenuItem & { lineId: string };

function readCartIds(): number[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is number => typeof id === "number");
  } catch {
    return [];
  }
}

function persistCartIds(ids: number[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore quota / privacy mode
  }
  window.dispatchEvent(new Event(UPDATED_EVENT));
}

export function getCartCount(): number {
  return readCartIds().length;
}

export function getCartItems(): CartLineItem[] {
  return readCartIds().flatMap((id, index) => {
    const item = getMenuItemById(id);
    if (!item) return [];
    return [{ ...item, lineId: `${id}-${index}` }];
  });
}

export function addToCart(itemId: number) {
  persistCartIds([...readCartIds(), itemId]);
}

export function removeCartLine(lineId: string) {
  const ids = readCartIds();
  const index = Number(lineId.split("-").pop());
  if (!Number.isInteger(index) || index < 0 || index >= ids.length) return;
  persistCartIds(ids.filter((_, i) => i !== index));
}

export function clearCart() {
  persistCartIds([]);
}

export function subscribeCartUpdated(callback: () => void) {
  const handler = () => callback();
  window.addEventListener(UPDATED_EVENT, handler);
  return () => window.removeEventListener(UPDATED_EVENT, handler);
}
