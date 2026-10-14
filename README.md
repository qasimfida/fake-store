# Fake Store

A functioning fake store powered by [Fake Store API](https://fakestoreapi.com/), with a blog managed by [EmDash](https://emdashcms.com/). Built with Astro, React, and EmDash.

## Stack

- **Astro** — pages and server rendering
- **React** — cart, auth, and checkout UI
- **EmDash** — CMS for the blog (`/_emdash/admin`)
- **Fake Store API** — products, auth (`/auth/login`), users, carts

## Routes

| Page | Route |
|---|---|
| Home (landing) | `/` |
| Store | `/store` |
| Product | `/store/:id` |
| Cart | `/store/cart` |
| Checkout | `/store/checkout` |
| Blog posts | `/posts` |
| Search | `/search` |
| Admin | `/_emdash/admin` |

## Checkout

1. Add items to the cart.
2. Open `/store/checkout` and sign in with FakeStoreAPI (`johnd` / `m38rmF$`).
3. Confirm the shipping form (prefilled from `GET /users/:id`).
4. Place order via `POST /carts`.

## Setup

```bash
npm install
npm run dev
```

1. Open http://localhost:4321/_emdash/admin and finish the EmDash setup wizard (creates the blog content model and sample posts).
2. Browse the store at http://localhost:4321/store.
3. Cart data is stored in the browser (`localStorage`).

Keep `.env` private — it holds `EMDASH_ENCRYPTION_KEY`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm start` | Run the built Node server |
