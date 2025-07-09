import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: '모든 글',
  description: '단덕 블로그의 모든 글 목록입니다.',
  alternates: {
    canonical: 'https://danduck.dev/posts',
  },
};

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="function-heading">모든 글</h1>
          <p className="meta-comment mt-2">총 {posts.length}개의 글이 있습니다</p>
        </div>

        <div className="ascii-divider">
          ═══════════════════════════════════════════════════════════════
        </div>

        {posts.length === 0 ? (
          <div className="my-12 text-center">
            <p className="text-muted">아직 작성된 글이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-8 my-12">
            {posts.map((post) => (
              <article key={post.slug} className="border-l-2 border-dim pl-6">
                <h2 className="text-xl font-bold mb-2">
                  <Link href={`/posts/${post.slug}`} className="hover:glow">
                    {post.title}
                  </Link>
                </h2>
                
                <div className="flex items-center gap-4 text-sm text-muted mb-3">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('ko-KR')}
                  </time>
                  {post.author && (
                    <>
                      <span className="text-dim">•</span>
                      <span>{post.author}</span>
                    </>
                  )}
                </div>
                
                {post.description && (
                  <p className="text-muted mb-3">{post.description}</p>
                )}
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-muted/10 rounded text-accent-purple"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        <div className="ascii-divider mt-16">
          ▀▄▀▄▀▄ [ EOF ] ▄▀▄▀▄▀
        </div>
      </div>
    </div>
  );
}