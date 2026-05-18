# Blog posts (not published)

Each essay lives in its own folder: `your-post-slug/index.md`

## Add a post from an older site

1. Copy `_template/` and rename the folder (e.g. `my-old-essay/`).
2. Paste your writing into `index.md` below the frontmatter `---` lines.
3. Set `title`, `description`, and `date`.
4. Set `category: writing` (personal) or `category: career` (PM / AI ops notes for recruiters).
5. Set `draft: false` when you want it on the live blog.

Folders starting with `_` (like `_template`) are ignored by the site.

## Upvotes & comments

On each published post, readers can upvote and leave a comment with their name (no login).

Data is stored on Netlify when deployed. To test locally with working comments:

```bash
npm run dev:netlify
```
