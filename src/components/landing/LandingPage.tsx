import { useEffect, useState } from "react";
import "./landing.css";

export interface LandingProduct {
	id: number;
	title: string;
	price: number;
	image: string;
	category: string;
}

export interface LandingPost {
	slug: string;
	title: string;
	excerpt: string | null;
	date: string | null;
}

interface Props {
	brand: string;
	tagline: string;
	products: LandingProduct[];
	posts: LandingPost[];
}

function formatPrice(price: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(price);
}

export default function LandingPage({
	brand,
	tagline,
	products,
	posts,
}: Props) {
	const [ready, setReady] = useState(false);
	const heroImages = products.slice(0, 4);

	useEffect(() => {
		const id = requestAnimationFrame(() => setReady(true));
		return () => cancelAnimationFrame(id);
	}, []);

	return (
		<div className={`landing ${ready ? "is-ready" : ""}`}>
			<section className="landing-hero" aria-label="Hero">
				<div className="landing-hero-visual" aria-hidden="true">
					<div className="landing-hero-wash" />
					<div className="landing-hero-grid">
						{heroImages.map((product, index) => (
							<figure
								key={product.id}
								className={`landing-hero-shot landing-hero-shot--${index + 1}`}
							>
								<img src={product.image} alt="" loading={index < 2 ? "eager" : "lazy"} />
							</figure>
						))}
					</div>
				</div>

				<div className="landing-hero-copy">
					<p className="landing-brand">{brand}</p>
					<h1 className="landing-headline">
						Things worth
						<br />
						bringing home.
					</h1>
					<p className="landing-lede">
						{tagline ||
							"A working shop and journal built on live product data—browse, bag it, and read along."}
					</p>
					<div className="landing-cta">
						<a className="landing-cta-primary" href="/store">
							Shop the store
						</a>
						<a className="landing-cta-secondary" href="/posts">
							Read the blog
						</a>
					</div>
				</div>
			</section>

			<section className="landing-section landing-products">
				<div className="landing-section-head">
					<h2>From the floor</h2>
					<p>A sample of what’s live on Fake Store API right now.</p>
				</div>
				<ul className="landing-product-rail">
					{products.map((product, index) => (
						<li
							key={product.id}
							style={{ ["--i" as string]: index }}
						>
							<a href={`/store/${product.id}`} className="landing-product">
								<span className="landing-product-media">
									<img src={product.image} alt={product.title} loading="lazy" />
								</span>
								<span className="landing-product-meta">
									<span className="landing-product-title">{product.title}</span>
									<span className="landing-product-price">
										{formatPrice(product.price)}
									</span>
								</span>
							</a>
						</li>
					))}
				</ul>
				<div className="landing-section-foot">
					<a href="/store">View all products</a>
				</div>
			</section>

			<section className="landing-section landing-journal">
				<div className="landing-section-head">
					<h2>From the journal</h2>
					<p>Notes, drops, and store stories from EmDash.</p>
				</div>
				{posts.length === 0 ? (
					<div className="landing-journal-empty">
						<p>Publish a post in the admin to fill this space.</p>
						<a href="/_emdash/admin">Open admin</a>
					</div>
				) : (
					<ul className="landing-post-list">
						{posts.map((post, index) => (
							<li key={post.slug} style={{ ["--i" as string]: index }}>
								<a href={`/posts/${post.slug}`} className="landing-post">
									{post.date && (
										<time dateTime={post.date}>{formatDate(post.date)}</time>
									)}
									<strong>{post.title}</strong>
									{post.excerpt && <span>{post.excerpt}</span>}
								</a>
							</li>
						))}
					</ul>
				)}
				<div className="landing-section-foot">
					<a href="/posts">Browse the blog</a>
				</div>
			</section>
		</div>
	);
}

function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}
