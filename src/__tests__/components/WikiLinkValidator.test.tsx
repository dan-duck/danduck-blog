import { render, screen, waitFor } from '@testing-library/react';
import WikiLinkValidator from '@/components/WikiLinkValidator';

// Mock fetch
global.fetch = jest.fn();

describe('WikiLinkValidator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset DOM
    document.body.innerHTML = '';
  });

  it('checks and validates existing WikiLinks', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ exists: true }),
    });

    render(
      <div>
        <a href="/posts/existing-post" className="wiki-link" data-slug="existing-post">existing-post</a>
        <WikiLinkValidator />
      </div>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/posts/existing-post/exists');
    });

    // Should add valid class to existing links
    await waitFor(() => {
      const link = screen.getByText('existing-post');
      expect(link).toHaveClass('wiki-link-valid');
      expect(link).not.toHaveClass('wiki-link-broken');
    });
  });

  it('marks non-existent WikiLinks as broken', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ exists: false }),
    });

    render(
      <div>
        <a href="/posts/non-existent" className="wiki-link" data-slug="non-existent">non-existent</a>
        <WikiLinkValidator />
      </div>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/posts/non-existent/exists');
    });

    // Should add broken class to non-existent links
    await waitFor(() => {
      const link = screen.getByText('non-existent');
      expect(link).toHaveClass('wiki-link-broken');
      expect(link).not.toHaveClass('wiki-link-valid');
    });
  });

  it('ignores non-WikiLinks', async () => {
    render(
      <div>
        <a href="/about">About</a>
        <a href="/posts/test" className="normal-link">Normal Link</a>
        <WikiLinkValidator />
      </div>
    );

    // Wait a bit to ensure the component has initialized
    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    }, { timeout: 200 });
  });

  it('processes multiple WikiLinks in batches', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ json: async () => ({ exists: true }) })
      .mockResolvedValueOnce({ json: async () => ({ exists: false }) })
      .mockResolvedValueOnce({ json: async () => ({ exists: true }) });

    render(
      <div>
        <a href="/posts/post-1" className="wiki-link" data-slug="post-1">post-1</a>
        <a href="/posts/post-2" className="wiki-link" data-slug="post-2">post-2</a>
        <a href="/posts/post-3" className="wiki-link" data-slug="post-3">post-3</a>
        <WikiLinkValidator />
      </div>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    // Check classes are applied correctly
    await waitFor(() => {
      expect(screen.getByText('post-1')).toHaveClass('wiki-link-valid');
      expect(screen.getByText('post-2')).toHaveClass('wiki-link-broken');
      expect(screen.getByText('post-3')).toHaveClass('wiki-link-valid');
    });
  });

  it('handles fetch errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(
      <div>
        <a href="/posts/test" className="wiki-link" data-slug="test">test</a>
        <WikiLinkValidator />
      </div>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error checking link test:', expect.any(Error));
    });

    // Should mark as broken on error
    await waitFor(() => {
      const link = screen.getByText('test');
      expect(link).toHaveClass('wiki-link-broken');
    });

    consoleSpy.mockRestore();
  });

  it('only processes each link once', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ json: async () => ({ exists: true }) });

    const { rerender } = render(
      <div>
        <a href="/posts/test" className="wiki-link" data-slug="test">test</a>
        <WikiLinkValidator />
      </div>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Rerender should not cause duplicate checks
    rerender(
      <div>
        <a href="/posts/test" className="wiki-link" data-slug="test">test</a>
        <WikiLinkValidator />
      </div>
    );

    // Wait and ensure fetch wasn't called again
    await new Promise(resolve => setTimeout(resolve, 200));
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('renders nothing visible', () => {
    const { container } = render(<WikiLinkValidator />);
    expect(container.firstChild).toBeNull();
  });
});