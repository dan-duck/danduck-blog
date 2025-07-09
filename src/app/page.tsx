import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { PersonJsonLd } from '@/components/JsonLd';
import PostCard from '@/components/PostCard';
import type { Metadata } from 'next';

export const revalidate = 300;

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://danduck.dev',
  },
};

export default function Home() {
  const recentPosts = getAllPosts().slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-20">
      <PersonJsonLd
        name="단덕"
        url="https://danduck.dev"
        description="Obsidian 노트로 만든 개발 블로그"
      />
      <div className="max-w-4xl mx-auto">
          {/* Terminal-style header */}
          <div className="mb-12">
            <h1 className="function-heading glitch">단덕 블로그</h1>
            <p className="meta-comment mt-2">개발자의 생각과 경험을 기록하는 공간</p>
          </div>

          {/* ASCII Art Divider */}
          <div className="ascii-divider">
            ═══════════════════════════════════════════════════════════════
          </div>

          {/* Welcome Section */}
          <section className="my-12">
            <h2 className="mb-4">
              <span className="text-muted font-mono">const</span> welcome <span className="text-muted">=</span> <span className="text-dim">{`{`}</span>
            </h2>
            
            <div className="pl-8 space-y-2">
              <p>
                <span className="text-muted">message:</span> <span className="text-code">{`"안녕하세요, 단덕 블로그입니다"`}</span>,
              </p>
              <p>
                <span className="text-muted">description:</span> <span className="text-code">{`"Obsidian으로 작성한 노트들을 공유합니다"`}</span>,
              </p>
              <p>
                <span className="text-muted">stack:</span> [<span className="text-code">{`"Next.js"`}</span>, <span className="text-code">{`"React"`}</span>, <span className="text-code">{`"TypeScript"`}</span>],
              </p>
              <p>
                <span className="text-muted">status:</span> <span className="text-accent-green">{`"building"`}</span>
                <span className="cursor"></span>
              </p>
            </div>
            
            <p className="text-dim mt-2">{`};`}</p>
          </section>

          {/* Recent Posts */}
          {recentPosts.length > 0 && (
            <section className="my-12">
              <h3 className="mb-6 font-mono">
                <span className="text-accent-purple">$</span> recent_posts
              </h3>
              
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Link href="/posts" className="text-accent-green hover:glow inline-flex items-center gap-2">
                  <span>→</span> 모든 글 보기
                </Link>
              </div>
            </section>
          )}

          {/* Quick Links */}
          <section className="my-12">
            <h3 className="mb-4 font-mono">
              <span className="text-accent-purple">$</span> quick_links
            </h3>
            
            <ul className="terminal-list space-y-3">
              <li>
                <Link href="/posts" className="hover:glow">
                  모든 글 보기
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:glow">
                  소개
                </Link>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:glow">
                  GitHub
                </a>
              </li>
            </ul>
          </section>

          {/* ASCII Art Footer */}
          <div className="ascii-divider mt-16">
            ▀▄▀▄▀▄ [ EOF ] ▄▀▄▀▄▀
          </div>
      </div>
    </div>
  );
}