import { useEffect, useState } from "react";
import { cartCount, readCart } from "../../lib/cart";

export default function CartBadge() {
	const [count, setCount] = useState(0);

	useEffect(() => {
		const sync = () => setCount(cartCount(readCart()));
		sync();
		window.addEventListener("cart-updated", sync);
		window.addEventListener("storage", sync);
		return () => {
			window.removeEventListener("cart-updated", sync);
			window.removeEventListener("storage", sync);
		};
	}, []);

	return (
		<a href="/store/cart" className="cart-badge">
			Cart
			{count > 0 && <span className="cart-badge-count">{count}</span>}
		</a>
	);
}
