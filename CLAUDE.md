# Honing My Skills: instructions for Claude

This repo is the blog at https://honingmyskills.com, written by Parth Garg (Lucknow). It is an Astro static site, deployed by Cloudflare Pages on every push to `main`. Posts are published by committing a markdown file. There is no CMS.

## Publishing a post

1. Create `src/content/posts/<slug>.md`. The file name is the URL: `/posts/<slug>`. Use lowercase words joined by hyphens, no dates in the slug.
2. Front matter (all fields in `src/content.config.ts`):

```yaml
---
title: "Post title"
date: 2026-11-12            # publication date, YYYY-MM-DD
topic: "Historical fiction" # ONE topic. Reuse an existing one when it fits (see below)
description: "One or two sentences. Shown on the home page and in link previews."
cover: /images/posts/<slug>.jpg   # optional
coverAlt: "What the image shows"  # required if cover is set
tags: [book, history]             # optional
draft: false                      # true = never built or published
---
```

3. Write the body in markdown below the front matter. Do not repeat the title as an `#` heading; the layout renders it. Use `##` for sections.
4. Images go in `public/images/posts/`, named after the post slug. Compress to about 1600px wide, under 400 KB. Always give meaningful alt text.
5. Run `npm run build` and fix any error before committing.
6. Commit with a short message such as `Add post: <title>` and push to `main`. Cloudflare deploys within about a minute.

Current topics: Historical fiction, Science & curiosity, Mind & life, Society & technology, Sports, Photography, Books, Games, My journey. Add a new topic only when none fits; it appears automatically on `/topics`.

## Voice

Friendly, personal, first person, curious. Written to understand things properly and share what was learned. Keep the author's own wording when editing a draft: fix grammar and typos, tighten, but do not rewrite the voice or add claims the author did not make. Never invent quotes, statistics or facts; flag anything that needs checking.

## Rules

- Do not change the design (`src/styles/global.css`, layouts, components) unless asked.
- Never publish (push to `main`) a post the author has not approved. Use `draft: true` or a branch for work in progress.
- Old Tumblr links are redirected in `public/_redirects`. Do not delete that file.
- Dates are shown in UTC; use the real publication date.
- Do not commit `node_modules/`, `dist/` or `.env`.
