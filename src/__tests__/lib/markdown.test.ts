// Mock remark modules before importing anything else
jest.mock('remark', () => ({
  remark: jest.fn(() => ({
    use: jest.fn().mockReturnThis(),
    process: jest.fn((content) => Promise.resolve({
      toString: () => {
        // Simple mock that handles WikiLinks
        return content
          .replace(/\[\[([^\]]+)\]\]/g, (_, link) => {
            const slug = link.toLowerCase().replace(/\s+/g, '-');
            return `<a href="/posts/${slug}" class="wiki-link">${link}</a>`;
          })
          .replace(/^# (.+)$/gm, '<h1>$1</h1>')
          .replace(/^(.+)$/gm, '<p>$1</p>')
          .replace(/<p><h1>/g, '<h1>')
          .replace(/<\/h1><\/p>/g, '</h1>');
      }
    }))
  }))
}));
jest.mock('remark-html');
jest.mock('remark-gfm');

import { markdownToHtml } from '@/lib/markdown';

describe('markdownToHtml', () => {
  it('should convert basic markdown to HTML', async () => {
    const markdown = '# Hello World\n\nThis is a paragraph.';
    const html = await markdownToHtml(markdown);
    
    expect(html).toContain('<h1>Hello World</h1>');
    expect(html).toContain('<p>This is a paragraph.</p>');
  });

  it('should support GFM features', async () => {
    const markdown = `
- [ ] Task 1
- [x] Task 2

| Header | Value |
|--------|-------|
| Cell 1 | Cell 2 |
`;
    const html = await markdownToHtml(markdown);
    
    expect(html).toContain('<input type="checkbox"');
    expect(html).toContain('checked');
    expect(html).toContain('<table>');
    expect(html).toContain('<th>Header</th>');
  });

  it('should convert WikiLinks to HTML links', async () => {
    const markdown = 'Check out [[my-awesome-post]] for more info.';
    const html = await markdownToHtml(markdown);
    
    expect(html).toContain('href="/posts/my-awesome-post"');
    expect(html).toContain('class="wiki-link"');
    expect(html).toContain('>my-awesome-post</a>');
  });

  it('should handle WikiLinks with Korean text', async () => {
    const markdown = '[[한글 포스트]]를 확인하세요.';
    const html = await markdownToHtml(markdown);
    
    expect(html).toContain('href="/posts/%ED%95%9C%EA%B8%80-%ED%8F%AC%EC%8A%A4%ED%8A%B8"');
    expect(html).toContain('>한글 포스트</a>');
  });

  it('should handle multiple WikiLinks in one line', async () => {
    const markdown = 'See [[post-1]] and [[post-2]] for details.';
    const html = await markdownToHtml(markdown);
    
    expect(html.match(/wiki-link/g)).toHaveLength(2);
    expect(html).toContain('href="/posts/post-1"');
    expect(html).toContain('href="/posts/post-2"');
  });

  it('should handle WikiLinks with special characters', async () => {
    const markdown = '[[Post with Spaces & Special!]]';
    const html = await markdownToHtml(markdown);
    
    expect(html).toContain('href="/posts/post-with-spaces-special"');
  });

  it('should convert code blocks', async () => {
    const markdown = '```javascript\nconst x = 1;\n```';
    const html = await markdownToHtml(markdown);
    
    expect(html).toContain('<pre>');
    expect(html).toContain('<code>');
    expect(html).toContain('const x = 1;');
  });

  it('should handle inline code', async () => {
    const markdown = 'Use `npm install` to install dependencies.';
    const html = await markdownToHtml(markdown);
    
    expect(html).toContain('<code>npm install</code>');
  });

  it('should convert images with correct paths', async () => {
    const markdown = '![Alt text](/images/test.png)';
    const html = await markdownToHtml(markdown);
    
    expect(html).toContain('<img src="/images/test.png" alt="Alt text">');
  });

  it('should handle empty markdown', async () => {
    const html = await markdownToHtml('');
    expect(html).toBe('');
  });

  it('should cache repeated conversions', async () => {
    const markdown = '# Cached Content';
    
    const start = Date.now();
    await markdownToHtml(markdown);
    const firstCallTime = Date.now() - start;
    
    const cacheStart = Date.now();
    const cachedHtml = await markdownToHtml(markdown);
    const cacheCallTime = Date.now() - cacheStart;
    
    expect(cachedHtml).toContain('<h1>Cached Content</h1>');
    expect(cacheCallTime).toBeLessThan(firstCallTime);
  });
});