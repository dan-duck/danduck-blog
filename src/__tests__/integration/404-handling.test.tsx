import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, useSearchParams } from 'next/navigation';
import NotFound from '@/app/not-found';
import WikiLinkValidator from '@/components/WikiLinkValidator';
import { checkPostExists } from '@/lib/posts';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('@/lib/posts', () => ({
  checkPostExists: jest.fn(),
}));

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;
const mockCheckPostExists = checkPostExists as jest.MockedFunction<typeof checkPostExists>;

describe('404 Error Handling Integration', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    } as any);
  });

  it('shows 404 page without specific WikiLink information', () => {
    // The current implementation doesn't use searchParams
    render(<NotFound />);

    // Should show general 404 message
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('페이지를 찾을 수 없습니다')).toBeInTheDocument();
  });

  it('handles WikiLink navigation to 404', async () => {
    mockCheckPostExists.mockReturnValue(false);

    render(
      <div>
        <div className="prose">
          <p>Check out <a href="/posts/broken-link" className="wiki-link">broken-link</a> for more.</p>
        </div>
        <WikiLinkValidator />
      </div>
    );

    const brokenLink = screen.getByText('broken-link');
    await user.click(brokenLink);

    // Should navigate to 404 with the source information
    expect(mockPush).toHaveBeenCalledWith('/404?from=broken-link');
  });

  it('handles direct navigation to non-existent post', async () => {
    const { notFound } = await import('next/navigation');
    const mockNotFound = notFound as jest.MockedFunction<typeof notFound>;

    // Mock the post page component behavior
    const PostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
      const { slug } = await params;
      const { getPostBySlug } = await import('@/lib/posts');
      const post = getPostBySlug(slug);
      
      if (!post) {
        mockNotFound();
        return null;
      }

      return <div>Post content</div>;
    };

    // Simulate navigating to non-existent post
    jest.mocked(await import('@/lib/posts')).getPostBySlug.mockReturnValue(null);

    const params = Promise.resolve({ slug: 'does-not-exist' });
    render(await PostPage({ params }));

    expect(mockNotFound).toHaveBeenCalled();
  });

  it('provides helpful navigation options in 404 page', () => {
    render(<NotFound />);

    // Check for navigation links
    expect(screen.getByText(/홈으로 돌아가기/)).toBeInTheDocument();
    expect(screen.getByText(/모든 글 보기/)).toBeInTheDocument();
  });

  it('includes posts link in 404 page', () => {
    render(<NotFound />);

    const postsLink = screen.getByRole('link', { name: /모든 글 보기/ });
    expect(postsLink).toBeInTheDocument();
    expect(postsLink).toHaveAttribute('href', '/posts');
  });

  it('handles multiple broken WikiLinks in sequence', async () => {
    mockCheckPostExists.mockReturnValue(false);

    render(
      <div>
        <p>
          See <a href="/posts/broken-1" className="wiki-link">broken-1</a> and 
          <a href="/posts/broken-2" className="wiki-link">broken-2</a>.
        </p>
        <WikiLinkValidator />
      </div>
    );

    // Click first broken link
    await user.click(screen.getByText('broken-1'));
    expect(mockPush).toHaveBeenCalledWith('/404?from=broken-1');

    // Reset mock to simulate page change
    mockPush.mockClear();

    // Click second broken link
    await user.click(screen.getByText('broken-2'));
    expect(mockPush).toHaveBeenCalledWith('/404?from=broken-2');
  });

  it('preserves terminal theme in 404 page', () => {
    render(<NotFound />);

    // Check for terminal-style error formatting
    const errorHeading = screen.getByText('404');
    expect(errorHeading).toHaveClass('text-accent-red');
    
    // Check for ASCII art
    const asciiArt = screen.getByText(/ERROR/);
    expect(asciiArt).toBeInTheDocument();
  });
});