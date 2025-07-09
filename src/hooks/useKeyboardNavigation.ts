'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useKeyboardNavigation() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Navigation shortcuts
      switch (e.key) {
        case 'h':
          if (e.altKey) {
            e.preventDefault();
            router.push('/');
          }
          break;
        case 'p':
          if (e.altKey) {
            e.preventDefault();
            router.push('/posts');
          }
          break;
        case '/':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            // Focus search when implemented
            const searchInput = document.querySelector('input[type="search"]');
            if (searchInput instanceof HTMLInputElement) {
              searchInput.focus();
            }
          }
          break;
        case 'Escape':
          // Remove focus from current element
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [router]);
}