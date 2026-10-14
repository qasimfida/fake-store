import type { AuthUser } from "./auth";

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

export interface ApiUser extends AuthUser {
	password?: string;
}

export interface CartPayload {
	userId: number;
	date: string;
	products: Array<{ productId: number; quantity: number }>;
}

export interface CartResponse extends CartPayload {
	id: number;
}

async function fetchJson<T>(
	path: string,
	init?: RequestInit,
): Promise<T> {
	const res = await fetch(`${API_BASE}${path}`, init);
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

export async function login(
	username: string,
	password: string,
): Promise<{ token: string }> {
	return fetchJson<{ token: string }>("/auth/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ username, password }),
	});
}

export function getUsers(): Promise<ApiUser[]> {
	return fetchJson<ApiUser[]>("/users");
}

export function getUser(id: number): Promise<ApiUser> {
	return fetchJson<ApiUser>(`/users/${id}`);
}

export async function registerUser(input: {
	email: string;
	username: string;
	password: string;
	firstname: string;
	lastname: string;
	phone: string;
	city: string;
	street: string;
	number: number;
	zipcode: string;
}): Promise<ApiUser> {
	return fetchJson<ApiUser>("/users", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			email: input.email,
			username: input.username,
			password: input.password,
			name: {
				firstname: input.firstname,
				lastname: input.lastname,
			},
			address: {
				city: input.city,
				street: input.street,
				number: input.number,
				zipcode: input.zipcode,
				geolocation: { lat: "0", long: "0" },
			},
			phone: input.phone,
		}),
	});
}

export function createCart(payload: CartPayload): Promise<CartResponse> {
	return fetchJson<CartResponse>("/carts", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
}

/** Decode FakeStore JWT payload (unsigned demo token). */
export function decodeTokenUserId(token: string): number | null {
	try {
		const payload = token.split(".")[1];
		if (!payload) return null;
		const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
		const sub = Number(json.sub);
		return Number.isFinite(sub) ? sub : null;
	} catch {
		return null;
	}
}
