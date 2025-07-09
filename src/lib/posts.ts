import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post, PostMetadata } from '@/types/post';
import { measureSync, perfLogger } from '@/lib/performance';

const postsDirectory = path.join(process.cwd(), 'notes');

// Memoization cache
let postsCache: PostMetadata[] | null = null;
let cacheTime: number = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute cache

function generateSlugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, '');
}

export function getPostSlugs(): string[] {
  try {
    const files = fs.readdirSync(postsDirectory);
    return files
      .filter((file) => file.endsWith('.md'))
      .map((file) => generateSlugFromFilename(file));
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const post: Post = {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString(),
      tags: data.tags || [],
      description: data.description,
      author: data.author,
      content,
    };

    return post;
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getAllPosts(): PostMetadata[] {
  return measureSync('getAllPosts', () => {
    // Check if cache is valid
    const now = Date.now();
    if (postsCache && (now - cacheTime) < CACHE_DURATION) {
      perfLogger.mark('cache-hit');
      perfLogger.measure('cache-hit');
      return postsCache;
    }

    // Build new cache
    const slugs = getPostSlugs();
    const posts = slugs
      .map((slug) => {
        const post = getPostBySlug(slug);
        if (!post) return null;
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { content: _, ...metadata } = post;
        return metadata;
      })
      .filter((post): post is PostMetadata => post !== null)
      .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));

    // Update cache
    postsCache = posts;
    cacheTime = now;

    return posts;
  });
}

export function clearPostsCache(): void {
  postsCache = null;
  cacheTime = 0;
}

export function checkPostExists(slug: string): boolean {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  return fs.existsSync(fullPath);
}