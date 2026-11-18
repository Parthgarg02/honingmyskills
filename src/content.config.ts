import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Every post is one markdown file in src/content/posts/. The file name is the URL slug.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    // One topic per post. Used for the kicker label and the /topics pages.
    topic: z.string(),
    // One or two sentences. Shown on the home page and in RSS / social cards.
    description: z.string().optional(),
    // Optional cover image: a path under /public, e.g. /images/posts/my-post.jpg
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    // Drafts are never built or published.
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
