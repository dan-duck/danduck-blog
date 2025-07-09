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

/**
 * 파일명에서 slug를 생성합니다.
 * @param filename - 마크다운 파일명 (예: "my-post.md")
 * @returns 확장자가 제거된 slug (예: "my-post")
 */
function generateSlugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, '');
}

/**
 * notes 디렉토리의 모든 포스트 slug를 가져옵니다.
 * @returns 포스트 slug 배열
 */
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

/**
 * slug로 특정 포스트를 가져옵니다.
 * @param slug - 포스트 slug
 * @returns 포스트 데이터 또는 null
 */
export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    // Check if file exists before trying to read it
    if (!fs.existsSync(fullPath)) {
      // Don't log error for non-existent files, this is expected for broken WikiLinks
      return null;
    }
    
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

/**
 * 모든 포스트의 메타데이터를 가져옵니다.
 * 성능을 위해 1분간 캐싱됩니다.
 * @returns 날짜 내림차순으로 정렬된 포스트 메타데이터 배열
 */
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

/**
 * 포스트 캐시를 초기화합니다.
 * 주로 테스트나 개발 중에 사용됩니다.
 */
export function clearPostsCache(): void {
  postsCache = null;
  cacheTime = 0;
}

/**
 * 특정 slug의 포스트가 존재하는지 확인합니다.
 * @param slug - 확인할 포스트 slug
 * @returns 존재 여부
 */
export function checkPostExists(slug: string): boolean {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  return fs.existsSync(fullPath);
}