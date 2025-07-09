import Link from 'next/link';
import { PostMetadata } from '@/types/post';
import DateFormatter from './DateFormatter';

interface PostCardProps {
  post: PostMetadata;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="post-card group">
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="p-6 bg-bg-secondary border border-border rounded-lg hover:bg-bg-hover hover:border-accent-cyan transition-all duration-200">
          {/* Terminal prompt style */}
          <div className="flex items-start gap-3">
            <span className="text-accent-green font-mono font-bold select-none">&gt;</span>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">
                {post.title}
              </h3>
              
              {post.description && (
                <p className="mt-2 text-text-secondary line-clamp-2">
                  {post.description}
                </p>
              )}
              
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                <DateFormatter date={post.date} />
                
                {post.author && (
                  <>
                    <span className="text-dim" aria-hidden="true">•</span>
                    <span className="text-text-tertiary">{post.author}</span>
                  </>
                )}
                
                {post.tags && post.tags.length > 0 && (
                  <>
                    <span className="text-dim" aria-hidden="true">•</span>
                    <div className="flex gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-accent-purple">
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-text-tertiary">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}