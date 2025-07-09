import { getAllPosts } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import Breadcrumb from '@/components/Breadcrumb';
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

  const breadcrumbItems = [
    { name: 'home', href: '/' },
    { name: 'posts', href: '/posts' },
  ];

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />
        
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
          <div className="space-y-4 my-12">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
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