'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-green-500/30 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-green-400">
              <span className="text-green-500">&gt;</span> danduck.blog
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/posts" className="text-gray-300 hover:text-green-400 transition-colors">
              Posts
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-green-400 transition-colors">
              About
            </Link>
            <Link href="/tags" className="text-gray-300 hover:text-green-400 transition-colors">
              Tags
            </Link>
          </nav>

          <button
            className="md:hidden text-gray-300 hover:text-green-400 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-green-500/30">
            <div className="flex flex-col space-y-2">
              <Link
                href="/posts"
                className="px-4 py-2 text-gray-300 hover:text-green-400 hover:bg-green-500/10 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Posts
              </Link>
              <Link
                href="/about"
                className="px-4 py-2 text-gray-300 hover:text-green-400 hover:bg-green-500/10 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/tags"
                className="px-4 py-2 text-gray-300 hover:text-green-400 hover:bg-green-500/10 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Tags
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}