import fs from 'fs';
import path from 'path';
import { 
  getPostSlugs, 
  getPostBySlug, 
  getAllPosts, 
  checkPostExists,
  clearPostsCache 
} from '@/lib/posts';

// Mock fs module
jest.mock('fs');
const mockFs = fs as jest.Mocked<typeof fs>;

// Mock path module partially
jest.mock('path', () => ({
  ...jest.requireActual('path'),
  join: jest.fn((...args) => args.join('/')),
}));

describe('Post Loading Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearPostsCache();
  });

  describe('getPostSlugs', () => {
    it('should return markdown file slugs', () => {
      mockFs.readdirSync.mockReturnValue([
        'post-1.md',
        'post-2.md',
        'not-markdown.txt',
        'README.md',
      ] as any);

      const slugs = getPostSlugs();
      
      expect(slugs).toEqual(['post-1', 'post-2', 'README']);
      expect(mockFs.readdirSync).toHaveBeenCalledWith(expect.stringContaining('/notes'));
    });

    it('should handle empty directory', () => {
      mockFs.readdirSync.mockReturnValue([]);
      
      const slugs = getPostSlugs();
      
      expect(slugs).toEqual([]);
    });

    it('should handle read error gracefully', () => {
      mockFs.readdirSync.mockImplementation(() => {
        throw new Error('Permission denied');
      });
      
      const slugs = getPostSlugs();
      
      expect(slugs).toEqual([]);
    });
  });

  describe('getPostBySlug', () => {
    it('should return post data for valid slug', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(`---
title: Test Post
date: 2024-01-01
tags: [test, jest]
description: Test description
author: Test Author
---

# Test Content

This is test content.`);

      const post = getPostBySlug('test-post');
      
      expect(post).toEqual({
        slug: 'test-post',
        title: 'Test Post',
        date: '2024-01-01',
        tags: ['test', 'jest'],
        description: 'Test description',
        author: 'Test Author',
        content: '# Test Content\n\nThis is test content.',
      });
    });

    it('should handle missing frontmatter gracefully', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue('# Just Content\n\nNo frontmatter here.');

      const post = getPostBySlug('no-frontmatter');
      
      expect(post).toEqual({
        slug: 'no-frontmatter',
        title: 'no-frontmatter',
        date: expect.any(String),
        tags: [],
        description: undefined,
        author: undefined,
        content: '# Just Content\n\nNo frontmatter here.',
      });
    });

    it('should return null for non-existent file', () => {
      mockFs.existsSync.mockReturnValue(false);

      const post = getPostBySlug('does-not-exist');
      
      expect(post).toBeNull();
      expect(mockFs.readFileSync).not.toHaveBeenCalled();
    });

    it('should handle read error gracefully', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('Read error');
      });

      const post = getPostBySlug('error-post');
      
      expect(post).toBeNull();
    });
  });

  describe('getAllPosts', () => {
    beforeEach(() => {
      mockFs.readdirSync.mockReturnValue(['post-1.md', 'post-2.md', 'post-3.md'] as any);
      mockFs.existsSync.mockReturnValue(true);
    });

    it('should return all posts sorted by date', () => {
      mockFs.readFileSync
        .mockReturnValueOnce('---\ntitle: Post 1\ndate: 2024-01-03\n---\nContent 1')
        .mockReturnValueOnce('---\ntitle: Post 2\ndate: 2024-01-01\n---\nContent 2')
        .mockReturnValueOnce('---\ntitle: Post 3\ndate: 2024-01-02\n---\nContent 3');

      const posts = getAllPosts();
      
      expect(posts).toHaveLength(3);
      expect(posts[0].title).toBe('Post 1'); // Most recent
      expect(posts[1].title).toBe('Post 3');
      expect(posts[2].title).toBe('Post 2'); // Oldest
      
      // Should not include content in metadata
      posts.forEach(post => {
        expect(post).not.toHaveProperty('content');
      });
    });

    it('should filter out posts that fail to load', () => {
      mockFs.readFileSync
        .mockReturnValueOnce('---\ntitle: Valid Post\ndate: 2024-01-01\n---\nContent')
        .mockImplementationOnce(() => { throw new Error('Read error'); })
        .mockReturnValueOnce('---\ntitle: Another Valid\ndate: 2024-01-02\n---\nContent');

      const posts = getAllPosts();
      
      expect(posts).toHaveLength(2);
      expect(posts[0].title).toBe('Another Valid');
      expect(posts[1].title).toBe('Valid Post');
    });

    it('should use cache on subsequent calls', () => {
      mockFs.readFileSync.mockReturnValue('---\ntitle: Cached Post\ndate: 2024-01-01\n---\nContent');

      // First call
      const posts1 = getAllPosts();
      expect(mockFs.readdirSync).toHaveBeenCalledTimes(1);
      
      // Second call should use cache
      const posts2 = getAllPosts();
      expect(posts2).toEqual(posts1);
      expect(mockFs.readdirSync).toHaveBeenCalledTimes(1); // Not called again
    });
  });

  describe('checkPostExists', () => {
    it('should return true for existing post', () => {
      mockFs.existsSync.mockReturnValue(true);
      
      const exists = checkPostExists('existing-post');
      
      expect(exists).toBe(true);
      expect(mockFs.existsSync).toHaveBeenCalledWith(expect.stringContaining('existing-post.md'));
    });

    it('should return false for non-existing post', () => {
      mockFs.existsSync.mockReturnValue(false);
      
      const exists = checkPostExists('non-existing');
      
      expect(exists).toBe(false);
    });
  });

  describe('clearPostsCache', () => {
    it('should clear the cache', () => {
      mockFs.readdirSync.mockReturnValue(['post.md'] as any);
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue('---\ntitle: Test\ndate: 2024-01-01\n---\nContent');

      // Fill cache
      getAllPosts();
      expect(mockFs.readdirSync).toHaveBeenCalledTimes(1);
      
      // Clear cache
      clearPostsCache();
      
      // Next call should read from disk again
      getAllPosts();
      expect(mockFs.readdirSync).toHaveBeenCalledTimes(2);
    });
  });
});