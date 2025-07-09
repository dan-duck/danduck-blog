'use client';

import { useEffect, useRef, useState } from 'react';

interface LinkStatus {
  [slug: string]: boolean;
}

export default function WikiLinkValidator() {
  const [linkStatus, setLinkStatus] = useState<LinkStatus>({});
  const processedLinks = useRef<Set<string>>(new Set());

  useEffect(() => {
    const checkLinks = async () => {
      // Find all wiki links on the page
      const wikiLinks = document.querySelectorAll('a.wiki-link');
      const slugsToCheck: string[] = [];

      wikiLinks.forEach((link) => {
        const slug = link.getAttribute('data-slug');
        if (slug && !processedLinks.current.has(slug)) {
          slugsToCheck.push(slug);
          processedLinks.current.add(slug);
        }
      });

      if (slugsToCheck.length === 0) return;

      try {
        // Batch process links
        const batchSize = 10;
        const results: LinkStatus = {};

        for (let i = 0; i < slugsToCheck.length; i += batchSize) {
          const batch = slugsToCheck.slice(i, i + batchSize);
          
          // Check links in parallel within each batch
          const promises = batch.map(async (slug) => {
            try {
              const response = await fetch(`/api/posts/${slug}/exists`);
              const data = await response.json();
              return { slug, exists: data.exists };
            } catch (error) {
              console.error(`Error checking link ${slug}:`, error);
              return { slug, exists: false };
            }
          });

          const batchResults = await Promise.all(promises);
          batchResults.forEach(({ slug, exists }) => {
            results[slug] = exists;
          });
        }

        setLinkStatus((prev) => ({ ...prev, ...results }));
      } catch (error) {
        console.error('Error validating wiki links:', error);
      }
    };

    // Delay initial check to ensure DOM is ready
    const timeoutId = setTimeout(checkLinks, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    // Apply styles based on link status
    Object.entries(linkStatus).forEach(([slug, exists]) => {
      const links = document.querySelectorAll(`a.wiki-link[data-slug="${slug}"]`);
      links.forEach((link) => {
        if (exists) {
          link.classList.add('wiki-link-valid');
          link.classList.remove('wiki-link-broken');
        } else {
          link.classList.add('wiki-link-broken');
          link.classList.remove('wiki-link-valid');
        }
      });
    });
  }, [linkStatus]);

  // This component doesn't render anything visible
  return null;
}