'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-accent-red mb-4">오류가 발생했습니다</h1>
          <p className="meta-comment">예기치 않은 오류가 발생했습니다</p>
        </div>
        
        <div className="ascii-art mb-8">
          <pre className="text-muted inline-block text-sm">
{`
    ╔══════════════════╗
    ║  SYSTEM ERROR    ║
    ║  ──────────────  ║
    ║  [!] Exception   ║
    ║      occurred    ║
    ╚══════════════════╝
`}
          </pre>
        </div>
        
        <div className="space-y-6">
          <div className="bg-muted/10 p-4 rounded-lg text-left max-w-md mx-auto">
            <p className="font-mono text-sm text-muted">
              Error: {error.message || 'Unknown error'}
            </p>
            {error.digest && (
              <p className="font-mono text-xs text-dim mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="px-4 py-2 bg-accent-green/20 text-accent-green rounded hover:bg-accent-green/30 transition-colors"
            >
              다시 시도
            </button>
            <Link 
              href="/"
              className="px-4 py-2 bg-accent-purple/20 text-accent-purple rounded hover:bg-accent-purple/30 transition-colors"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}