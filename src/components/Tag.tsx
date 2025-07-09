import Link from 'next/link';

interface TagProps {
  tag: string;
  href?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Tag({ 
  tag, 
  href,
  variant = 'default',
  size = 'sm',
  className = ''
}: TagProps) {
  const baseStyles = 'inline-flex items-center font-mono transition-all duration-200';
  
  const variantStyles = {
    default: 'bg-bg-secondary border border-border hover:border-accent-purple hover:bg-bg-hover',
    outline: 'border border-accent-purple text-accent-purple hover:bg-accent-purple/10',
    ghost: 'text-accent-purple hover:bg-accent-purple/10',
  };
  
  const sizeStyles = {
    sm: 'text-xs px-2 py-1 rounded',
    md: 'text-sm px-3 py-1.5 rounded-md',
    lg: 'text-base px-4 py-2 rounded-lg',
  };
  
  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  
  const content = (
    <>
      <span className="text-dim mr-1">#</span>
      {tag}
    </>
  );
  
  if (href) {
    return (
      <Link
        href={href}
        className={combinedStyles}
        aria-label={`태그: ${tag}`}
      >
        {content}
      </Link>
    );
  }
  
  return (
    <span
      className={combinedStyles}
      role="listitem"
      aria-label={`태그: ${tag}`}
    >
      {content}
    </span>
  );
}