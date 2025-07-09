import Link from 'next/link';
import { Fragment } from 'react';

export interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav 
      className={`font-mono text-sm ${className}`}
      aria-label="브레드크럼"
    >
      <ol className="flex items-center flex-wrap">
        <li className="flex items-center">
          <span className="text-accent-green mr-2">$</span>
          <span className="text-text-tertiary">pwd:</span>
        </li>
        {items.map((item, index) => (
          <Fragment key={item.href}>
            <li className="flex items-center">
              {index < items.length - 1 ? (
                <>
                  <span className="text-dim mx-2">/</span>
                  <Link
                    href={item.href}
                    className="text-text-secondary hover:text-accent-cyan transition-colors"
                  >
                    {item.name}
                  </Link>
                </>
              ) : (
                <>
                  <span className="text-dim mx-2">/</span>
                  <span 
                    className="text-accent-cyan"
                    aria-current="page"
                  >
                    {item.name}
                  </span>
                  <span className="cursor ml-1" />
                </>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}