// Mock remark modules
jest.mock('remark');
jest.mock('remark-html');
jest.mock('remark-gfm');

import { slugifyWikiLink } from '@/lib/markdown';

describe('WikiLink Processing', () => {
  describe('slugifyWikiLink', () => {
    it('should convert basic text to slug', () => {
      expect(slugifyWikiLink('My Awesome Post')).toBe('my-awesome-post');
    });

    it('should handle Korean text', () => {
      expect(slugifyWikiLink('한글 포스트')).toBe('%ED%95%9C%EA%B8%80-%ED%8F%AC%EC%8A%A4%ED%8A%B8');
    });

    it('should handle mixed Korean and English', () => {
      expect(slugifyWikiLink('Next.js로 블로그 만들기')).toBe('nextjs%EB%A1%9C-%EB%B8%94%EB%A1%9C%EA%B7%B8-%EB%A7%8C%EB%93%A4%EA%B8%B0');
    });

    it('should remove special characters', () => {
      expect(slugifyWikiLink('Post with @#$% Special!')).toBe('post-with-special');
    });

    it('should handle multiple spaces', () => {
      expect(slugifyWikiLink('Post   with    spaces')).toBe('post-with-spaces');
    });

    it('should handle leading and trailing spaces', () => {
      expect(slugifyWikiLink('  Trimmed Post  ')).toBe('trimmed-post');
    });

    it('should handle empty string', () => {
      expect(slugifyWikiLink('')).toBe('');
    });

    it('should handle only special characters', () => {
      expect(slugifyWikiLink('@#$%^&*()')).toBe('');
    });

    it('should preserve hyphens', () => {
      expect(slugifyWikiLink('already-hyphenated-post')).toBe('already-hyphenated-post');
    });

    it('should handle numbers', () => {
      expect(slugifyWikiLink('Post 123 with Numbers')).toBe('post-123-with-numbers');
    });
  });

  describe('WikiLink regex patterns', () => {
    const wikiLinkRegex = /\[\[([^\]]+)\]\]/g;

    it('should match basic WikiLinks', () => {
      const text = 'Check out [[my-post]] for more.';
      const matches = text.match(wikiLinkRegex);
      expect(matches).toEqual(['[[my-post]]']);
    });

    it('should match multiple WikiLinks', () => {
      const text = 'See [[post-1]] and [[post-2]] and [[post-3]].';
      const matches = text.match(wikiLinkRegex);
      expect(matches).toEqual(['[[post-1]]', '[[post-2]]', '[[post-3]]']);
    });

    it('should match WikiLinks with spaces', () => {
      const text = 'Read [[My Awesome Post]] now.';
      const matches = text.match(wikiLinkRegex);
      expect(matches).toEqual(['[[My Awesome Post]]']);
    });

    it('should match WikiLinks with Korean', () => {
      const text = '[[한글 제목]]을 확인하세요.';
      const matches = text.match(wikiLinkRegex);
      expect(matches).toEqual(['[[한글 제목]]']);
    });

    it('should not match single brackets', () => {
      const text = 'This [is] not [[a-link]].';
      const matches = text.match(wikiLinkRegex);
      expect(matches).toEqual(['[[a-link]]']);
    });

    it('should not match empty WikiLinks', () => {
      const text = 'Empty [[]] should not match [[valid]].';
      const matches = text.match(wikiLinkRegex);
      expect(matches).toEqual(['[[valid]]']);
    });
  });
});