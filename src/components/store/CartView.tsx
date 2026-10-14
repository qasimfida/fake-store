import { useEffect, useState } from "react";
import {
	cartTotal,
	readCart,
	removeFromCart,
	updateQuantity,
	type CartItem,
} from "../../lib/cart";
import { formatPrice } from "../../lib/fakestore";

export default function CartView() {
	const [items, setItems] = useState<CartItem[]>([]);

	useEffect(() => {
		const sync = () => setItems(readCart());
		sync();
		window.addEventListener("cart-updated", sync);
		window.addEventListener("storage", sync);
		return () => {
			window.removeEventListener("cart-updated", sync);
			window.removeEventListener("storage", sync);
		};
	}, []);

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

	const total = cartTotal(items);

	return (
		<div className="cart-view">
			<ul className="cart-list">
				{items.map((item) => (
					<li key={item.id} className="cart-item">
						<a href={`/store/${item.id}`} className="cart-item-image">
							<img src={item.image} alt={item.title} />
						</a>
						<div className="cart-item-info">
							<a href={`/store/${item.id}`}>
								<h2>{item.title}</h2>
							</a>
							<p className="cart-item-price">{formatPrice(item.price)}</p>
							<div className="cart-item-actions">
								<label>
									Qty
									<input
										type="number"
										min={1}
										value={item.quantity}
										onChange={(e) =>
											setItems(
												updateQuantity(item.id, Number(e.target.value) || 1),
											)
										}
									/>
								</label>
								<button
									type="button"
									className="store-btn-ghost"
									onClick={() => setItems(removeFromCart(item.id))}
								>
									Remove
								</button>
							</div>
						</div>
						<p className="cart-item-line">
							{formatPrice(item.price * item.quantity)}
						</p>
					</li>
				))}
			</ul>
			<div className="cart-summary">
				<p className="cart-total">
					Total <strong>{formatPrice(total)}</strong>
				</p>
				<a href="/store/checkout" className="store-btn">
					Checkout
				</a>
			</div>
		</div>
	);
}
