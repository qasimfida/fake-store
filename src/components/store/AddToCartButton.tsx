import { useState } from "react";
import { addToCart } from "../../lib/cart";

interface Props {
	id: number;
	title: string;
	price: number;
	image: string;
}

export default function AddToCartButton({ id, title, price, image }: Props) {
	const [added, setAdded] = useState(false);

	function handleClick() {
		addToCart({ id, title, price, image });
		setAdded(true);
		window.setTimeout(() => setAdded(false), 1500);
	}

	return (
		<button type="button" className="store-btn" onClick={handleClick}>
			{added ? "Added to cart" : "Add to cart"}
		</button>
	);
}
