import { render, screen } from '@testing-library/react';
import PostCard from '@/components/PostCard';
import { PostMetadata } from '@/types/post';

const mockPost: PostMetadata = {
  slug: 'test-post',
  title: 'Test Post Title',
  date: '2024-01-01',
  description: 'This is a test post description',
  tags: ['test', 'jest', 'react'],
  author: 'Test Author',
};

describe('PostCard Component', () => {
  it('renders post information correctly', () => {
    render(<PostCard post={mockPost} />);
    
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    expect(screen.getByText('This is a test post description')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('#test')).toBeInTheDocument();
    expect(screen.getByText('#jest')).toBeInTheDocument();
    expect(screen.getByText('#react')).toBeInTheDocument();
  });

  it('renders without description', () => {
    const postWithoutDesc = { ...mockPost, description: undefined };
    render(<PostCard post={postWithoutDesc} />);
    
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    expect(screen.queryByText('This is a test post description')).not.toBeInTheDocument();
  });

  it('renders without author', () => {
    const postWithoutAuthor = { ...mockPost, author: undefined };
    render(<PostCard post={postWithoutAuthor} />);
    
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    expect(screen.queryByText('Test Author')).not.toBeInTheDocument();
  });

  it('renders without tags', () => {
    const postWithoutTags = { ...mockPost, tags: [] };
    render(<PostCard post={postWithoutTags} />);
    
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    expect(screen.queryByText('#test')).not.toBeInTheDocument();
  });

  it('limits displayed tags to 3', () => {
    const postWithManyTags = {
      ...mockPost,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
    };
    render(<PostCard post={postWithManyTags} />);
    
    expect(screen.getByText('#tag1')).toBeInTheDocument();
    expect(screen.getByText('#tag2')).toBeInTheDocument();
    expect(screen.getByText('#tag3')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
    expect(screen.queryByText('#tag4')).not.toBeInTheDocument();
  });

  it('creates correct link to post', () => {
    render(<PostCard post={mockPost} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/posts/test-post');
  });

  it('applies hover styles', () => {
    render(<PostCard post={mockPost} />);
    
    const card = screen.getByRole('article');
    expect(card).toHaveClass('post-card', 'group');
  });
});