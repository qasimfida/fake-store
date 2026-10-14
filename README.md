# Fake Store

A functioning fake store powered by [Fake Store API](https://fakestoreapi.com/), with a blog managed by [EmDash](https://emdashcms.com/). Built with Astro, React, and EmDash.

## Stack

- **Astro** — pages and server rendering
- **React** — interactive cart UI
- **EmDash** — CMS for the blog (`/_emdash/admin`)
- **Fake Store API** — products, categories, and ratings

## Routes

| Page | Route |
|---|---|
| Home (landing) | `/` |
| Store | `/store` |
| Product | `/store/:id` |
| Cart | `/store/cart` |
| Blog posts | `/posts` |
| Search | `/search` |
| Admin | `/_emdash/admin` |

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
