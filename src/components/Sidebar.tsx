'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItem {
  title: string;
  href: string;
  items?: SidebarItem[];
}

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
}

export default function Sidebar({ items, title }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (href: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(href)) {
      newExpanded.delete(href);
    } else {
      newExpanded.add(href);
    }
    setExpandedItems(newExpanded);
  };

  const renderItem = (item: SidebarItem, level = 0) => {
    const isActive = pathname === item.href;
    const hasChildren = item.items && item.items.length > 0;
    const isExpanded = expandedItems.has(item.href);

    return (
      <li key={item.href} className={`sidebar-item level-${level}`}>
        <div className="flex items-center">
          {hasChildren && (
            <button
              onClick={() => toggleExpanded(item.href)}
              className="sidebar-toggle"
              aria-expanded={isExpanded}
              aria-label={`Toggle ${item.title} submenu`}
            >
              <span className="text-accent-cyan font-mono">
                {isExpanded ? '▼' : '▶'}
              </span>
            </button>
          )}
          <Link
            href={item.href}
            className={`sidebar-link ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.title}
          </Link>
        </div>
        {hasChildren && isExpanded && (
          <ul className="sidebar-submenu">
            {item.items!.map(child => renderItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <nav className="sidebar" role="navigation" aria-label={title || 'Sidebar navigation'}>
      {title && (
        <h2 className="sidebar-title">
          <span className="text-accent-purple font-mono">$</span> {title}
        </h2>
      )}
      <ul className="sidebar-list">
        {items.map(item => renderItem(item))}
      </ul>
    </nav>
  );
}