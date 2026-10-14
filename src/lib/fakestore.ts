const API_BASE = "https://fakestoreapi.com";

export interface Product {
	id: number;
	title: string;
	price: number;
	description: string;
	category: string;
	image: string;
	rating: {
		rate: number;
		count: number;
	};
}

async function fetchJson<T>(path: string): Promise<T> {
	const res = await fetch(`${API_BASE}${path}`);
	if (!res.ok) {
		throw new Error(`FakeStoreAPI ${path} failed (${res.status})`);
	}
	return res.json() as Promise<T>;
}

export function getProducts(): Promise<Product[]> {
	return fetchJson<Product[]>("/products");
}

export function getProduct(id: number): Promise<Product> {
	return fetchJson<Product>(`/products/${id}`);
}

export function getCategories(): Promise<string[]> {
	return fetchJson<string[]>("/products/categories");
}

export function getProductsByCategory(category: string): Promise<Product[]> {
	return fetchJson<Product[]>(
		`/products/category/${encodeURIComponent(category)}`,
	);
}

export function formatPrice(price: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(price);
}
