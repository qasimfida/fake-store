import { useEffect, useState } from "react";
import {
	clearSession,
	isLoggedIn,
	readUser,
	type AuthUser,
} from "../../lib/auth";
import {
	cartTotal,
	clearCart,
	readCart,
	type CartItem,
} from "../../lib/cart";
import { createCart, formatPrice } from "../../lib/fakestore";
import LoginForm from "./LoginForm";

interface CheckoutForm {
	firstname: string;
	lastname: string;
	email: string;
	phone: string;
	street: string;
	number: string;
	city: string;
	zipcode: string;
}

function formFromUser(user: AuthUser): CheckoutForm {
	return {
		firstname: user.name.firstname,
		lastname: user.name.lastname,
		email: user.email,
		phone: user.phone,
		street: user.address.street,
		number: String(user.address.number),
		city: user.address.city,
		zipcode: user.address.zipcode,
	};
}

export default function CheckoutView() {
	const [items, setItems] = useState<CartItem[]>([]);
	const [user, setUser] = useState<AuthUser | null>(null);
	const [form, setForm] = useState<CheckoutForm | null>(null);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [orderId, setOrderId] = useState<number | null>(null);

	useEffect(() => {
		const sync = () => {
			setItems(readCart());
			const next = isLoggedIn() ? readUser() : null;
			setUser(next);
			setForm(next ? formFromUser(next) : null);
		};
		sync();
		window.addEventListener("cart-updated", sync);
		window.addEventListener("auth-updated", sync);
		window.addEventListener("storage", sync);
		return () => {
			window.removeEventListener("cart-updated", sync);
			window.removeEventListener("auth-updated", sync);
			window.removeEventListener("storage", sync);
		};
	}, []);

	if (orderId !== null) {
		return (
			<div className="checkout-success">
				<h2>Order placed</h2>
				<p>
					FakeStoreAPI created cart <strong>#{orderId}</strong> for{" "}
					{user?.username}.
				</p>
				<div className="checkout-success-actions">
					<a href="/store" className="store-btn">
						Keep shopping
					</a>
					<a href="/store/cart" className="store-btn-ghost">
						Back to cart
					</a>
				</div>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="cart-empty">
				<p>Your cart is empty.</p>
				<a href="/store" className="store-btn">
					Browse products
				</a>
			</div>
		);
	}

	if (!user || !form) {
		return (
			<div className="checkout-auth">
				<div className="checkout-auth-copy">
					<h2>Sign in to checkout</h2>
					<p>
						Auth uses FakeStoreAPI <code>POST /auth/login</code>. Your
						profile fields prefill the shipping form.
					</p>
				</div>
				<LoginForm onSuccess={(next) => {
					setUser(next);
					setForm(formFromUser(next));
				}} />
			</div>
		);
	}

	const total = cartTotal(items);

	function updateField<K extends keyof CheckoutForm>(key: K, value: string) {
		setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
	}

	async function handlePlaceOrder(e: { preventDefault(): void }) {
		e.preventDefault();
		if (!user || !form) return;
		setBusy(true);
		setError(null);
		try {
			const cart = await createCart({
				userId: user.id,
				date: new Date().toISOString().slice(0, 10),
				products: items.map((item) => ({
					productId: item.id,
					quantity: item.quantity,
				})),
			});
			clearCart();
			setItems([]);
			setOrderId(cart.id);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Could not create cart.",
			);
		} finally {
			setBusy(false);
		}
	}

	return (
		<div className="checkout-layout">
			<form className="store-form checkout-form" onSubmit={handlePlaceOrder}>
				<div className="checkout-userbar">
					<p>
						Signed in as <strong>{user.username}</strong>
					</p>
					<button
						type="button"
						className="store-btn-ghost"
						onClick={() => clearSession()}
					>
						Sign out
					</button>
				</div>

				<h2>Shipping details</h2>
				<div className="store-form-row">
					<label>
						First name
						<input
							value={form.firstname}
							onChange={(e) => updateField("firstname", e.target.value)}
							required
						/>
					</label>
					<label>
						Last name
						<input
							value={form.lastname}
							onChange={(e) => updateField("lastname", e.target.value)}
							required
						/>
					</label>
				</div>
				<label>
					Email
					<input
						type="email"
						value={form.email}
						onChange={(e) => updateField("email", e.target.value)}
						required
					/>
				</label>
				<label>
					Phone
					<input
						value={form.phone}
						onChange={(e) => updateField("phone", e.target.value)}
						required
					/>
				</label>
				<label>
					Street
					<input
						value={form.street}
						onChange={(e) => updateField("street", e.target.value)}
						required
					/>
				</label>
				<div className="store-form-row">
					<label>
						Number
						<input
							value={form.number}
							onChange={(e) => updateField("number", e.target.value)}
							required
						/>
					</label>
					<label>
						City
						<input
							value={form.city}
							onChange={(e) => updateField("city", e.target.value)}
							required
						/>
					</label>
					<label>
						Zip
						<input
							value={form.zipcode}
							onChange={(e) => updateField("zipcode", e.target.value)}
							required
						/>
					</label>
				</div>

				{error && <p className="store-form-error">{error}</p>}

				<button type="submit" className="store-btn" disabled={busy}>
					{busy ? "Placing order…" : "Place order"}
				</button>
			</form>

			<aside className="checkout-summary">
				<h2>Order summary</h2>
				<ul>
					{items.map((item) => (
						<li key={item.id}>
							<span>
								{item.title} × {item.quantity}
							</span>
							<strong>{formatPrice(item.price * item.quantity)}</strong>
						</li>
					))}
				</ul>
				<p className="cart-total">
					Total <strong>{formatPrice(total)}</strong>
				</p>
				<p className="store-form-hint">
					Places a cart with <code>POST /carts</code>.
				</p>
			</aside>
		</div>
	);
}
