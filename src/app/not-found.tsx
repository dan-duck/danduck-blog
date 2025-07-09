import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-accent-red mb-4">404</h1>
          <p className="meta-comment text-xl">페이지를 찾을 수 없습니다</p>
        </div>
        
        <div className="ascii-art mb-8">
          <pre className="text-muted inline-block">
{`
     _______________
    |  ___________  |
    | |           | |
    | |   ERROR   | |
    | |     404   | |
    | |___________| |
    |_______________|
    \\_______________/
         \\|||||/
          |||||
    ~~~~~~~~~~~~~~
`}
          </pre>
        </div>
        
        <div className="space-y-4">
          <p className="text-muted">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
          
          <div className="flex gap-4 justify-center mt-8">
            <Link href="/" className="text-accent-green hover:glow">
              ← 홈으로 돌아가기
            </Link>
            <span className="text-dim">|</span>
            <Link href="/posts" className="text-accent-purple hover:glow">
              모든 글 보기 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}