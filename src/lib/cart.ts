export interface CartItem {
	id: number;
	title: string;
	price: number;
	image: string;
	quantity: number;
}

const STORAGE_KEY = "fake-store-cart";

export function readCart(): CartItem[] {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as CartItem[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

export function writeCart(items: CartItem[]): void {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	window.dispatchEvent(new CustomEvent("cart-updated"));
}

export function cartCount(items: CartItem[] = readCart()): number {
	return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartTotal(items: CartItem[] = readCart()): number {
	return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function addToCart(
	product: Omit<CartItem, "quantity">,
	quantity = 1,
): CartItem[] {
	const items = readCart();
	const existing = items.find((item) => item.id === product.id);
	if (existing) {
		existing.quantity += quantity;
	} else {
		items.push({ ...product, quantity });
	}
	writeCart(items);
	return items;
}

export function updateQuantity(id: number, quantity: number): CartItem[] {
	let items = readCart();
	if (quantity <= 0) {
		items = items.filter((item) => item.id !== id);
	} else {
		items = items.map((item) =>
			item.id === id ? { ...item, quantity } : item,
		);
	}
	writeCart(items);
	return items;
}

export function removeFromCart(id: number): CartItem[] {
	const items = readCart().filter((item) => item.id !== id);
	writeCart(items);
	return items;
}

export function clearCart(): CartItem[] {
	writeCart([]);
	return [];
}
