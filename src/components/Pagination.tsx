'use client';

import Link from 'next/link';
import { useMemo } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  className?: string;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  basePath,
  className = '' 
}: PaginationProps) {
  const pageNumbers = useMemo(() => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];
    let l;

    // Generate page numbers to display
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    // Add dots where needed
    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <nav 
      className={`flex items-center justify-center gap-2 font-mono text-sm ${className}`}
      role="navigation"
      aria-label="페이지네이션"
    >
      {/* Previous button */}
      {currentPage > 1 ? (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="px-3 py-2 text-text-secondary hover:text-accent-cyan transition-colors"
          aria-label="이전 페이지"
        >
          <span className="text-accent-green">&lt;</span> prev
        </Link>
      ) : (
        <span className="px-3 py-2 text-text-tertiary cursor-not-allowed">
          <span className="text-dim">&lt;</span> prev
        </span>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        <span className="text-dim">[</span>
        {pageNumbers.map((number, index) => (
          <span key={index}>
            {number === '...' ? (
              <span className="px-2 text-text-tertiary">...</span>
            ) : number === currentPage ? (
              <span 
                className="px-3 py-1 bg-accent-cyan text-bg-primary rounded"
                aria-current="page"
              >
                {number}
              </span>
            ) : (
              <Link
                href={`${basePath}?page=${number}`}
                className="px-3 py-1 text-text-secondary hover:text-accent-cyan hover:bg-bg-hover rounded transition-all"
                aria-label={`페이지 ${number}`}
              >
                {number}
              </Link>
            )}
          </span>
        ))}
        <span className="text-dim">]</span>
      </div>

      {/* Next button */}
      {currentPage < totalPages ? (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="px-3 py-2 text-text-secondary hover:text-accent-cyan transition-colors"
          aria-label="다음 페이지"
        >
          next <span className="text-accent-green">&gt;</span>
        </Link>
      ) : (
        <span className="px-3 py-2 text-text-tertiary cursor-not-allowed">
          next <span className="text-dim">&gt;</span>
        </span>
      )}

      {/* Page info */}
      <div className="ml-4 text-text-tertiary hidden sm:block">
        <span className="text-dim">page</span> {currentPage} <span className="text-dim">of</span> {totalPages}
      </div>
    </nav>
  );
}