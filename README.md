# manoj-portfolio

Personal site built with [AstroNano](https://astro.build/themes/details/astronano/) ([markhorn-dev/astro-nano](https://github.com/markhorn-dev/astro-nano)).

## Local dev

```bash
npm install
npm run dev
```

## Customize

| What | Where |
|------|--------|
| Name, email, socials | `src/consts.ts` |
| Homepage copy | `src/pages/index.astro` |
| Work history | `src/content/work/*.md` |
| Projects | `src/content/projects/*/index.md` |
| Essays (blog) | `src/content/blog/*/index.md` — set `draft: false` when ready |
| Photo | Replace `public/me.svg` or add `public/me.jpg` and update `index.astro` |
| Resume | `public/resume.pdf` |
| Site URL (sitemap) | `astro.config.mjs` → `site` after Netlify deploy |

## Deploy (Netlify)

1. Push to GitHub (`Kill3r-28/manoj-portfolio`).
2. [app.netlify.com/start](https://app.netlify.com/start) → Import from Git → select the repo.
3. Build settings are read from `netlify.toml` (`npm run build`, publish `dist`).
4. After deploy, set `site` in `astro.config.mjs` to your `*.netlify.app` URL and push again.

## Theme credit

MIT · [AstroNano by Mark Horn](https://astro.build/themes/details/astronano/)
