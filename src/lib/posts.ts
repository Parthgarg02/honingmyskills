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
 * The picture that represents a post: the front-matter cover if set,
 * otherwise the first markdown image in the body.
 */
export function coverOf(post: Post): { src: string; alt: string } | undefined {
  if (post.data.cover) return { src: post.data.cover, alt: post.data.coverAlt ?? '' };
  const m = (post.body ?? '').match(/!\[([^\]]*)\]\(([^)\s]+)[^)]*\)/);
  return m ? { src: m[2], alt: m[1] } : undefined;
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
