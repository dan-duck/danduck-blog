import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import type { Root, Image, Link, Text, PhrasingContent } from 'mdast';
import { measureAsync } from '@/lib/performance';

// Markdown processing cache
const markdownCache = new Map<string, { html: string; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

const wikiLinkRegex = /\[\[([^\]]+)\]\]/g;

/**
 * WikiLink 텍스트를 URL-safe slug로 변환합니다.
 * 한글 문자를 지원합니다.
 * @param link - WikiLink 텍스트 (예: "내 글 제목")
 * @returns URL-safe slug (예: "내-글-제목")
 */
function generateSlugFromWikiLink(link: string): string {
  return link
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-가-힣]/g, '');
}

/**
 * remark 플러그인: WikiLink 문법을 HTML 링크로 변환합니다.
 * [[링크 텍스트]] 형식을 <a href="/posts/링크-텍스트">링크 텍스트</a>로 변환
 */
function remarkWikiLink() {
  return (tree: Root) => {
    visit(tree, 'text', (node, index, parent) => {
      const value = node.value as string;
      const matches = [...value.matchAll(wikiLinkRegex)];
      
      if (matches.length === 0) return;
      
      const nodes: PhrasingContent[] = [];
      let lastIndex = 0;
      
      matches.forEach((match) => {
        const [fullMatch, linkText] = match;
        const matchIndex = match.index!;
        
        if (matchIndex > lastIndex) {
          nodes.push({
            type: 'text',
            value: value.slice(lastIndex, matchIndex),
          } as Text);
        }
        
        const slug = generateSlugFromWikiLink(linkText);
        nodes.push({
          type: 'link',
          url: `/posts/${slug}`,
          children: [{ type: 'text', value: linkText } as Text],
          data: {
            hProperties: {
              className: ['wiki-link'],
              'data-slug': slug,
            },
          },
        } as Link);
        
        lastIndex = matchIndex + fullMatch.length;
      });
      
      if (lastIndex < value.length) {
        nodes.push({
          type: 'text',
          value: value.slice(lastIndex),
        } as Text);
      }
      
      if (parent && typeof index === 'number') {
        parent.children.splice(index, 1, ...nodes);
      }
    });
  };
}

/**
 * remark 플러그인: 상대 경로 이미지를 절대 경로로 변환합니다.
 * 예: "image.png" → "/images/image.png"
 */
function remarkImagePath() {
  return (tree: Root) => {
    visit(tree, 'image', (node: Image) => {
      // Process relative image paths
      if (node.url && !node.url.startsWith('http') && !node.url.startsWith('/')) {
        // Convert relative paths to absolute paths
        // Assuming images are stored in public/images/
        node.url = `/images/${node.url}`;
      }
    });
  };
}

function generateCacheKey(markdown: string): string {
  // Simple hash function for cache key
  let hash = 0;
  for (let i = 0; i < markdown.length; i++) {
    const char = markdown.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}

/**
 * 마크다운을 HTML로 변환합니다.
 * WikiLink 처리, GFM 지원, 이미지 경로 변환을 포함합니다.
 * 성능을 위해 5분간 캐싱됩니다.
 * @param markdown - 변환할 마크다운 텍스트
 * @returns 변환된 HTML 문자열
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  return measureAsync('markdownToHtml', async () => {
    const cacheKey = generateCacheKey(markdown);
    const cached = markdownCache.get(cacheKey);
    
    // Check if cached result is valid
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      return cached.html;
    }
    
    // Process markdown
    const result = await remark()
      .use(gfm)
      .use(remarkWikiLink)
      .use(remarkImagePath)
      .use(html, { sanitize: false })
      .process(markdown);
    
    const htmlContent = result.toString();
    
    // Update cache
    markdownCache.set(cacheKey, {
      html: htmlContent,
      timestamp: Date.now()
    });
    
    // Clean old cache entries
    if (markdownCache.size > 100) {
      const now = Date.now();
      for (const [key, value] of markdownCache.entries()) {
        if (now - value.timestamp > CACHE_DURATION) {
          markdownCache.delete(key);
        }
      }
    }
    
    return htmlContent;
  });
}

/**
 * 마크다운 캐시를 초기화합니다.
 * 주로 테스트나 개발 중에 사용됩니다.
 */
export function clearMarkdownCache(): void {
  markdownCache.clear();
}