import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getPostSlugs } from '@/lib/posts';
import { markdownToHtml } from '@/lib/markdown';
import WikiLinkValidator from '@/components/WikiLinkValidator';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import type { Metadata } from 'next';

export const revalidate = 300;

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }
  
  const description = post.description || post.content.slice(0, 160).replace(/\n/g, ' ');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://danduck.dev';
  const canonicalUrl = `${baseUrl}/posts/${slug}`;
  
  return {
    title: post.title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
      url: canonicalUrl,
    },
    keywords: post.tags,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    notFound();
  }
  
  const contentHtml = await markdownToHtml(post.content);
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://danduck.dev';
  const postUrl = `${baseUrl}/posts/${slug}`;
  
  return (
    <article className="container mx-auto px-4 py-20">
      <ArticleJsonLd
        title={post.title}
        description={post.description || post.content.slice(0, 160)}
        datePublished={post.date}
        author={post.author || '단덕'}
        url={postUrl}
        keywords={post.tags}
      />
      <BreadcrumbJsonLd
        items={[
          { name: '홈', url: baseUrl },
          { name: '글 목록', url: `${baseUrl}/posts` },
          { name: post.title, url: postUrl },
        ]}
      />
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <div className="mb-6">
            <Link href="/posts" className="text-accent-green hover:glow">
              ← 모든 글로 돌아가기
            </Link>
          </div>
          
          <h1 className="function-heading mb-4">{post.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-muted">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            {post.author && (
              <>
                <span className="text-dim">•</span>
                <span>{post.author}</span>
              </>
            )}
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-4">
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
        </header>
        
        <div className="ascii-divider">
          ═══════════════════════════════════════════════════════════════
        </div>
        
        <div 
          className="prose prose-invert max-w-none my-12"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
        
        <div className="ascii-divider mt-16">
          ▀▄▀▄▀▄ [ EOF ] ▄▀▄▀▄▀
        </div>
      </div>
      <WikiLinkValidator />
    </article>
  );
}