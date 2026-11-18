import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** All published posts, newest first. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatDate(date: Date, style: 'long' | 'short' = 'long'): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Short teaser for a post: the front-matter description if there is one,
 * otherwise the first real paragraph of the body, trimmed at a word boundary.
 */
export function excerpt(post: Post, max = 200): string | undefined {
  if (post.data.description) return post.data.description;
  const paragraphs = (post.body ?? '').split(/\n\s*\n/);
  for (const raw of paragraphs) {
    const p = raw.trim();
    if (!p || p.startsWith('!') || p.startsWith('<') || p.startsWith('- ') || p.startsWith('>')) continue;
    const text = p
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[*_`]+/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (text.length < 40) continue;
    if (text.length <= max) return text;
    return text.slice(0, max).replace(/\s+\S*$/, '').replace(/[,;:.\-–]+$/, '') + '…';
  }
  return undefined;
}

/**
 * About the first half of a post as plain-text paragraphs, for the home page.
 * Always whole paragraphs; skips images, lists, quotes and raw HTML.
 */
export function previewParagraphs(post: Post): string[] {
  const clean = (raw: string) =>
    raw
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[*_`]+/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  const paras = (post.body ?? '')
    .split(/\n\s*\n/)
    .map((r) => r.trim())
    .filter((p) => p && !/^(!|<|- |\d+\. |>|#)/.test(p))
    .map(clean)
    .filter(Boolean);
  const words = (t: string) => t.split(/\s+/).length;
  const half = paras.reduce((n, p) => n + words(p), 0) / 2;
  const out: string[] = [];
  let count = 0;
  for (const p of paras) {
    out.push(p);
    count += words(p);
    if (count >= half) break;
  }
  return out;
}

export interface Topic {
  name: string;
  slug: string;
  posts: Post[];
}

/** Topics with their posts, largest first. */
export function groupByTopic(posts: Post[]): Topic[] {
  const map = new Map<string, Topic>();
  for (const post of posts) {
    const name = post.data.topic;
    const slug = slugify(name);
    if (!map.has(slug)) map.set(slug, { name, slug, posts: [] });
    map.get(slug)!.posts.push(post);
  }
  return [...map.values()].sort((a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name));
}
