import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

// Update `site` to your Netlify URL after first deploy (Site settings → Domain management).
export default defineConfig({
  site: "https://manoj-portfolio.netlify.app",
  integrations: [mdx(), sitemap(), tailwind()],
});
