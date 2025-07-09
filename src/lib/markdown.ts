import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import type { Root, Image } from 'mdast';
import { measureAsync } from '@/lib/performance';

// Markdown processing cache
const markdownCache = new Map<string, { html: string; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

const wikiLinkRegex = /\[\[([^\]]+)\]\]/g;

function generateSlugFromWikiLink(link: string): string {
  return link
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-가-힣]/g, '');
}

function remarkWikiLink() {
  return (tree: Root) => {
    visit(tree, 'text', (node, index, parent) => {
      const value = node.value as string;
      const matches = [...value.matchAll(wikiLinkRegex)];
      
      if (matches.length === 0) return;
      
      const nodes: (typeof node)[] = [];
      let lastIndex = 0;
      
      matches.forEach((match) => {
        const [fullMatch, linkText] = match;
        const matchIndex = match.index!;
        
        if (matchIndex > lastIndex) {
          nodes.push({
            type: 'text',
            value: value.slice(lastIndex, matchIndex),
          });
        }
        
        const slug = generateSlugFromWikiLink(linkText);
        nodes.push({
          type: 'link',
          url: `/posts/${slug}`,
          children: [{ type: 'text', value: linkText }],
          data: {
            hProperties: {
              className: ['wiki-link'],
              'data-slug': slug,
            },
          },
        });
        
        lastIndex = matchIndex + fullMatch.length;
      });
      
      if (lastIndex < value.length) {
        nodes.push({
          type: 'text',
          value: value.slice(lastIndex),
        });
      }
      
      parent.children.splice(index, 1, ...nodes);
    });
  };
}

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

export function clearMarkdownCache(): void {
  markdownCache.clear();
}