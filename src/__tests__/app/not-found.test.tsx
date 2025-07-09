import { render, screen } from '@testing-library/react';
import NotFound from '@/app/not-found';

describe('404 Not Found Page', () => {
  it('renders 404 page content', () => {
    render(<NotFound />);

    // Check for 404 heading
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('404');

    // Check for error message
    expect(screen.getByText('페이지를 찾을 수 없습니다')).toBeInTheDocument();

    // Check for description
    expect(screen.getByText(/요청하신 페이지가 존재하지 않거나 이동되었습니다/)).toBeInTheDocument();
  });

  it('includes home link', () => {
    render(<NotFound />);

    const homeLink = screen.getByRole('link', { name: /홈으로 돌아가기/ });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('has terminal-style design elements', () => {
    const { container } = render(<NotFound />);

    // Check for error styling
    const errorHeading = screen.getByText('404');
    expect(errorHeading).toHaveClass('text-accent-red');

    // Check for ASCII art
    const asciiArt = container.querySelector('.ascii-art');
    expect(asciiArt).toBeInTheDocument();
    expect(asciiArt?.textContent).toContain('ERROR');
  });

  it('displays ASCII art error message', () => {
    const { container } = render(<NotFound />);

    const asciiArt = container.querySelector('pre');
    expect(asciiArt).toBeInTheDocument();
    expect(asciiArt?.textContent).toContain('ERROR');
    expect(asciiArt?.textContent).toContain('404');
  };

  it('has proper heading structure', () => {
    render(<NotFound />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('404');
    expect(heading).toHaveClass('text-6xl', 'font-bold', 'text-accent-red');
  };

  it('includes helpful navigation links', () => {
    render(<NotFound />);

    const homeLink = screen.getByRole('link', { name: /홈으로 돌아가기/ });
    const postsLink = screen.getByRole('link', { name: /모든 글 보기/ });
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(postsLink).toHaveAttribute('href', '/posts');
  });
});