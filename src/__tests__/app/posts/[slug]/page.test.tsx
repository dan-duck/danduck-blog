import { render, screen } from '@testing-library/react';
import PostPage from '@/app/posts/[slug]/page';
import { getPostBySlug } from '@/lib/posts';
import { markdownToHtml } from '@/lib/markdown';
import { notFound } from 'next/navigation';

// Mock dependencies
jest.mock('@/lib/posts');
jest.mock('@/lib/markdown');
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

const mockGetPostBySlug = getPostBySlug as jest.MockedFunction<typeof getPostBySlug>;
const mockMarkdownToHtml = markdownToHtml as jest.MockedFunction<typeof markdownToHtml>;
const mockNotFound = notFound as jest.MockedFunction<typeof notFound>;

// Mock components
jest.mock('@/components/WikiLinkValidator', () => ({
  default: () => <div data-testid="wiki-link-validator" />,
}));

jest.mock('@/components/JsonLd', () => ({
  ArticleJsonLd: () => null,
  BreadcrumbJsonLd: () => null,
}));

jest.mock('@/components/Breadcrumb', () => ({
  default: ({ items }: any) => (
    <nav data-testid="breadcrumb">
      {items.map((item: any) => (
        <span key={item.href}>{item.name}</span>
      ))}
    </nav>
  ),
}));

jest.mock('@/components/DateFormatter', () => ({
  default: ({ date }: any) => <time>{date}</time>,
}));

jest.mock('@/components/Tag', () => ({
  default: ({ tag }: any) => <span>#{tag}</span>,
}));

describe('Post Detail Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders post content correctly', async () => {
    const mockPost = {
      slug: 'test-post',
      title: 'Test Post Title',
      date: '2024-01-01',
      content: '# Test Content',
      tags: ['test', 'jest'],
      author: 'Test Author',
      description: 'Test description',
    };

    mockGetPostBySlug.mockReturnValue(mockPost);
    mockMarkdownToHtml.mockResolvedValue('<h1>Test Content</h1>');

    const params = Promise.resolve({ slug: 'test-post' });
    const { container } = render(await PostPage({ params }));

    // Check breadcrumb
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    expect(screen.getByText('home')).toBeInTheDocument();
    expect(screen.getByText('posts')).toBeInTheDocument();
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();

    // Check post header
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Test Post Title');
    expect(heading).toHaveAttribute('id', 'post-title');

    // Check metadata
    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();

    // Check tags
    expect(screen.getByText('#test')).toBeInTheDocument();
    expect(screen.getByText('#jest')).toBeInTheDocument();

    // Check content
    const contentDiv = container.querySelector('.prose');
    expect(contentDiv).toBeInTheDocument();
    expect(contentDiv?.innerHTML).toBe('<h1>Test Content</h1>');

    // Check WikiLinkValidator is rendered
    expect(screen.getByTestId('wiki-link-validator')).toBeInTheDocument();
  });

  it('calls notFound when post does not exist', async () => {
    mockGetPostBySlug.mockReturnValue(null);

    const params = Promise.resolve({ slug: 'non-existent' });
    
    try {
      await PostPage({ params });
    } catch (error) {
      // notFound() throws an error in Next.js
    }

    expect(mockNotFound).toHaveBeenCalled();
    expect(mockMarkdownToHtml).not.toHaveBeenCalled();
  });

  it('renders post without optional fields', async () => {
    const mockPost = {
      slug: 'minimal-post',
      title: 'Minimal Post',
      date: '2024-01-01',
      content: 'Simple content',
      tags: [],
    };

    mockGetPostBySlug.mockReturnValue(mockPost);
    mockMarkdownToHtml.mockResolvedValue('<p>Simple content</p>');

    const params = Promise.resolve({ slug: 'minimal-post' });
    render(await PostPage({ params }));

    expect(screen.getByText('Minimal Post')).toBeInTheDocument();
    expect(screen.queryByText('Test Author')).not.toBeInTheDocument();
    expect(screen.queryByText('#test')).not.toBeInTheDocument();
  });

  it('includes back to posts link', async () => {
    const mockPost = {
      slug: 'test-post',
      title: 'Test Post',
      date: '2024-01-01',
      content: 'Content',
      tags: [],
    };

    mockGetPostBySlug.mockReturnValue(mockPost);
    mockMarkdownToHtml.mockResolvedValue('<p>Content</p>');

    const params = Promise.resolve({ slug: 'test-post' });
    render(await PostPage({ params }));

    const backLink = screen.getByText('← 모든 글로 돌아가기');
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest('a')).toHaveAttribute('href', '/posts');
  });

  it('sets correct aria attributes', async () => {
    const mockPost = {
      slug: 'accessible-post',
      title: 'Accessible Post',
      date: '2024-01-01',
      content: 'Content',
      tags: ['accessibility'],
    };

    mockGetPostBySlug.mockReturnValue(mockPost);
    mockMarkdownToHtml.mockResolvedValue('<p>Content</p>');

    const params = Promise.resolve({ slug: 'accessible-post' });
    render(await PostPage({ params }));

    const article = screen.getByRole('article');
    expect(article).toHaveAttribute('aria-labelledby', 'post-title');

    const contentInfo = screen.getByRole('contentinfo');
    expect(contentInfo).toBeInTheDocument();

    const tagList = screen.getByRole('list', { name: '태그 목록' });
    expect(tagList).toBeInTheDocument();
  });
});