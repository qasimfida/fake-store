const TOKEN_KEY = "fake-store-token";
const USER_KEY = "fake-store-user";

export interface AuthUser {
	id: number;
	email: string;
	username: string;
	name: {
		firstname: string;
		lastname: string;
	};
	phone: string;
	address: {
		city: string;
		street: string;
		number: number;
		zipcode: string;
	};
}

export function readToken(): string | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(TOKEN_KEY);
}

export function readUser(): AuthUser | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(USER_KEY);
		return raw ? (JSON.parse(raw) as AuthUser) : null;
	} catch {
		return null;
	}
}

export function writeSession(token: string, user: AuthUser): void {
	localStorage.setItem(TOKEN_KEY, token);
	localStorage.setItem(USER_KEY, JSON.stringify(user));
	window.dispatchEvent(new CustomEvent("auth-updated"));
}

export function clearSession(): void {
	localStorage.removeItem(TOKEN_KEY);
	localStorage.removeItem(USER_KEY);
	window.dispatchEvent(new CustomEvent("auth-updated"));
}

export function isLoggedIn(): boolean {
	return !!readToken() && !!readUser();
}
