import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import type { Root, Image } from 'mdast';

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

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(gfm)
    .use(remarkWikiLink)
    .use(remarkImagePath)
    .use(html, { sanitize: false })
    .process(markdown);
  
  return result.toString();
}