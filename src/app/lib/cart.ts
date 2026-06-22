import type { MenuItem } from "./menu-items";

const STORAGE_KEY = "universe:cart";
const UPDATED_EVENT = "universe-cart-updated";

export type CartLineItem = MenuItem & { lineId: string };

function readCart(): CartLineItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartLineItem =>
        item != null &&
        typeof item === "object" &&
        typeof (item as CartLineItem).lineId === "string" &&
        typeof (item as CartLineItem).id === "number",
    );
  } catch {
    return [];
  }
}

function persistCart(items: CartLineItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore quota / privacy mode
  }
  window.dispatchEvent(new Event(UPDATED_EVENT));
}

export function getCartCount(): number {
  return readCart().length;
}

export function getCartItems(): CartLineItem[] {
  return readCart();
}

export function getCartTotal(): number {
  return readCart().reduce((sum, item) => sum + item.price, 0);
}

export function addToCart(item: MenuItem) {
  const lineId = `${item.id}-${Date.now()}`;
  persistCart([...readCart(), { ...item, lineId }]);
}

export function removeCartLine(lineId: string) {
  persistCart(readCart().filter((item) => item.lineId !== lineId));
}

export function clearCart() {
  persistCart([]);
}

export function subscribeCartUpdated(callback: () => void) {
  const handler = () => callback();
  window.addEventListener(UPDATED_EVENT, handler);
  return () => window.removeEventListener(UPDATED_EVENT, handler);
}
