import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig, fontProviders } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";

export default defineConfig({
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			database: sqlite({ url: "file:./data.db" }),
			storage: local({
				directory: "./uploads",
				baseUrl: "/_emdash/api/media/file",
			}),
		}),
	],
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Inter",
			cssVariable: "--font-body",
			weights: [400, 500, 600, 700],
			fallbacks: ["sans-serif"],
		},
		{
			provider: fontProviders.google(),
			name: "JetBrains Mono",
			cssVariable: "--font-mono",
			weights: [400, 500],
			fallbacks: ["monospace"],
		},
		{
			provider: fontProviders.google(),
			name: "Syne",
			cssVariable: "--font-landing-display",
			weights: [500, 600, 700],
			styles: ["normal"],
			subsets: ["latin"],
			fallbacks: ["sans-serif"],
		},
		{
			provider: fontProviders.google(),
			name: "Figtree",
			cssVariable: "--font-landing-body",
			weights: [400, 500, 600],
			styles: ["normal"],
			subsets: ["latin"],
			fallbacks: ["sans-serif"],
		},
	],
	devToolbar: { enabled: false },
});
