# Honing My Skills

The source of https://honingmyskills.com. An [Astro](https://astro.build) static site in a newspaper style, with markdown posts, topics, an archive, RSS and a sitemap.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
```

## Where things live

| What | Where |
| --- | --- |
| Posts | `src/content/posts/*.md` |
| Site name, tagline, social links, subscribe URL | `src/consts.ts` |
| Colours, fonts, spacing | `src/styles/global.css` (variables at the top) |
| Page layout and navigation | `src/layouts/Base.astro` |
| Old Tumblr URL redirects | `public/_redirects` |
| How Claude publishes posts | `CLAUDE.md` |

## Deploy on Cloudflare Pages

1. Push this repo to GitHub.
2. In Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**, and choose the repo.
3. Build settings: framework **Astro**, build command `npm run build`, output directory `dist`, environment variable `NODE_VERSION=22`.
4. Deploy, and check the preview address (`*.pages.dev`) first.
5. **Custom domains → honingmyskills.com** (and `www`). Follow Cloudflare's DNS instructions. This is the step that moves the site off Tumblr, so do it only when the content is imported and checked.
6. In Tumblr, remove the custom domain setting after the switch.

Every push to `main` then redeploys the site. Pull requests get their own preview address.

## Before going live

- [x] All 21 Tumblr posts are imported as markdown, with matching old-URL redirects in `public/_redirects`.
- [ ] Images still load from Tumblr's servers. Move them into `public/images/posts/` (from the Tumblr export) so they survive if Tumblr is closed.
- [ ] Add alt text to the post images (they have none yet).
- [ ] Review the About page text (`src/pages/about.astro`).
- [ ] Confirm topics on each post (`topic:` in the front matter).
- [ ] Optionally swap the hosted Mailchimp signup link for an embedded form.

## Moving the images off Tumblr

The post text is already here. The images are still linked from Tumblr's servers. In Tumblr, **Settings → your blog → Export** emails a zip containing the original images. Hand that file over and the images are moved into `public/images/posts/` and the links are updated.
