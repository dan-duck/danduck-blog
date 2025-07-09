# Next.js + Obsidian + Vercel 블로그 구축 계획

## 1. 개요
- **목표**: Obsidian으로 작성한 Markdown 노트를 Next.js(ISR)로 변환하여 Vercel에 자동 배포되는 개인 블로그 구축
- **컨셉**: 옵시디언 노트를 웹상에 공개하여 모두가 볼 수 있게 하는 지식 공유 플랫폼
- **스택**: Next.js 15 · React 19 · Tailwind CSS 4 · @next/mdx · gray-matter · pnpm · GitHub Actions · Vercel

---

## 2. 기술적 결정사항

### 2.1 렌더링 방식: ISR (Incremental Static Regeneration)
```typescript
// ISR 설정으로 SEO + 성능 + 유연성 확보
export const revalidate = 300 // 5분마다 재검증
```

**장점**:
- ✅ **SEO 완벽**: 정적 HTML 생성
- ✅ **빠른 로딩**: 캐시된 페이지 제공
- ✅ **자동 업데이트**: 새 노트 추가 시 자동 반영
- ✅ **서버 부하 최소**: 캐시 활용

### 2.2 위키링크 처리: 하이브리드 방식
1. **서버**: 기본 위키링크 `[[노트]]` → `<a href="/posts/노트">노트</a>` 변환
2. **클라이언트**: 링크 유효성 검사 (존재하지 않는 링크 빨간색 표시)

**Phase 1 기능**:
- ✅ 기본 위키링크 변환
- ✅ 링크 유효성 검사
- ⏳ 호버 프리뷰 (Phase 2)
- ⏳ 백링크 (Phase 3)
- ⏳ 그래프 뷰 (Phase 4)

### 2.3 배포: Vercel
- **Free Tier**: 100GB 대역폭, 6,000분 빌드 시간
- **Next.js 최적화**: 1급 지원
- **자동 배포**: GitHub push 시 자동 배포

---

## 3. 프로젝트 구조
```
/
├─ src/
│  ├─ app/          # App Router
│  │  ├─ page.tsx   # 홈페이지
│  │  ├─ posts/     # 블로그 라우트
│  │  │  ├─ [slug]/page.tsx  # 개별 포스트
│  │  │  └─ page.tsx         # 포스트 목록
│  │  └─ api/       # API 엔드포인트
│  │     └─ posts/[slug]/exists/route.ts
│  ├─ lib/          # 유틸리티 함수
│  │  ├─ posts.ts   # 포스트 로딩
│  │  └─ markdown.ts # 마크다운 처리
│  └─ components/   # React 컴포넌트
│     └─ WikiLinkValidator.tsx
├─ notes/           # Obsidian 마크다운 원본
├─ public/          # 정적 파일
└─ .obsidian/       # Obsidian 설정 (.gitignore)
```

---

## 4. 단계별 개발 계획

### Phase 1: 기본 블로그 (1-2주)
**목표**: 기본적인 마크다운 블로그 + 위키링크 기능

**구현 사항**:
- [x] Next.js 15 프로젝트 설정
- [ ] 기본 레이아웃 구성
- [ ] 마크다운 → HTML 변환 (remark/rehype)
- [ ] 위키링크 서버 처리
- [ ] ISR 설정
- [ ] 링크 유효성 검사 (클라이언트)
- [ ] Vercel 배포 설정

**핵심 파일**:
```typescript
// lib/markdown.ts - 위키링크 처리
function remarkWikiLink() {
  return (tree: any) => {
    visit(tree, 'text', (node: any) => {
      node.value = node.value.replace(
        /\[\[([^\]]+)\]\]/g,
        (match: string, title: string) => {
          const slug = title.toLowerCase().replace(/\s+/g, '-')
          return `<a href="/posts/${slug}" class="wiki-link" data-title="${title}">${title}</a>`
        }
      )
    })
  }
}
```

### Phase 2: UX 개선 (3-4주)
**목표**: 호버 프리뷰, 검색 기능

**구현 사항**:
- [ ] 호버 프리뷰 (옵시디언 스타일)
- [ ] 전체 검색 기능
- [ ] 태그 시스템
- [ ] 반응형 디자인 최적화

### Phase 3: 고급 기능 (5-6주)
**목표**: 백링크, 그래프 뷰

**구현 사항**:
- [ ] 백링크 자동 생성
- [ ] 노트 간 연결 그래프
- [ ] RSS 피드
- [ ] 사이트맵 생성

### Phase 4: 최적화 (7-8주)
**목표**: 성능 최적화, SEO 완성

**구현 사항**:
- [ ] 이미지 최적화
- [ ] OG 이미지 자동 생성
- [ ] 성능 모니터링
- [ ] 접근성 개선

---

## 5. 의존성 설치
```bash
# 핵심 의존성
pnpm add @next/mdx gray-matter remark remark-gfm remark-html
pnpm add unist-util-visit

# 개발 의존성
pnpm add -D @types/node typescript tailwindcss

# 추후 Phase 2+에서 추가할 의존성
# pnpm add fuse.js (검색)
# pnpm add d3 (그래프 뷰)
```

---

## 6. 핵심 구현 코드

### 6.1 마크다운 처리 (`lib/markdown.ts`)
```typescript
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'
import { visit } from 'unist-util-visit'

function remarkWikiLink() {
  return (tree: any) => {
    visit(tree, 'text', (node: any) => {
      const wikiLinkRegex = /\[\[([^\]]+)\]\]/g
      
      if (wikiLinkRegex.test(node.value)) {
        node.type = 'html'
        node.value = node.value.replace(
          wikiLinkRegex,
          (match: string, title: string) => {
            const slug = title.toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9가-힣-]/g, '')
            
            return `<a href="/posts/${slug}" class="wiki-link" data-title="${title}">${title}</a>`
          }
        )
      }
    })
  }
}

export async function processMarkdown(content: string) {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkWikiLink)
    .use(remarkHtml)
    .process(content)
  
  return result.toString()
}
```

### 6.2 포스트 로딩 (`lib/posts.ts`)
```typescript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'notes')

export async function getPost(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title || slug,
    date: data.date || new Date().toISOString(),
    content,
    ...data
  }
}

export async function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter(name => name.endsWith('.md'))
    .map(name => name.replace(/\.md$/, ''))
    .map(getPost)

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}
```

### 6.3 포스트 페이지 (`app/posts/[slug]/page.tsx`)
```typescript
import { getPost, getAllPosts } from '@/lib/posts'
import { processMarkdown } from '@/lib/markdown'
import WikiLinkValidator from '@/components/WikiLinkValidator'
import { Metadata } from 'next'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug)
  
  return {
    title: post.title,
    description: post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160),
      type: 'article',
    },
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  const htmlContent = await processMarkdown(post.content)
  
  return (
    <article className="prose prose-lg mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
        <time className="text-gray-500">
          {new Date(post.date).toLocaleDateString('ko-KR')}
        </time>
      </header>
      
      <div 
        className="post-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      
      <WikiLinkValidator />
    </article>
  )
}

// ISR 설정
export const revalidate = 300 // 5분마다 재검증
```

### 6.4 위키링크 검증 (`components/WikiLinkValidator.tsx`)
```typescript
'use client'

import { useEffect } from 'react'

export default function WikiLinkValidator() {
  useEffect(() => {
    const validateWikiLinks = async () => {
      const wikiLinks = document.querySelectorAll('.wiki-link')
      
      const validationPromises = Array.from(wikiLinks).map(async (link) => {
        const href = link.getAttribute('href')
        const title = link.getAttribute('data-title')
        
        if (href) {
          try {
            const slug = href.replace('/posts/', '')
            const response = await fetch(`/api/posts/${slug}/exists`)
            
            if (!response.ok) {
              link.classList.add('wiki-link-broken')
              link.setAttribute('title', `"${title}" 페이지가 존재하지 않습니다`)
            }
          } catch (error) {
            link.classList.add('wiki-link-broken')
          }
        }
      })
      
      await Promise.all(validationPromises)
    }

    validateWikiLinks()
  }, [])

  return null
}
```

### 6.5 링크 존재 확인 API (`app/api/posts/[slug]/exists/route.ts`)
```typescript
import { getPost } from '@/lib/posts'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await getPost(params.slug)
    return new NextResponse(null, { status: 200 })
  } catch {
    return new NextResponse(null, { status: 404 })
  }
}
```

---

## 7. 스타일링 (`globals.css`)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 위키링크 스타일 */
.wiki-link {
  @apply text-blue-600 underline decoration-dotted hover:text-blue-800 transition-colors;
}

.wiki-link-broken {
  @apply text-red-600 decoration-wavy cursor-help;
}

/* 프로즈 커스터마이징 */
.prose {
  @apply max-w-none;
}

.prose h1 {
  @apply text-3xl font-bold mb-4;
}

.prose h2 {
  @apply text-2xl font-semibold mb-3 mt-6;
}

.prose p {
  @apply mb-4 leading-relaxed;
}

.prose ul {
  @apply mb-4 pl-6;
}

.prose li {
  @apply mb-2;
}

.prose blockquote {
  @apply border-l-4 border-blue-500 pl-4 italic my-4;
}

.prose code {
  @apply bg-gray-100 px-2 py-1 rounded text-sm;
}

.prose pre {
  @apply bg-gray-900 text-white p-4 rounded-lg overflow-x-auto;
}
```

---

## 8. package.json 스크립트
```json
{
  "name": "obsidian-blog",
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@next/mdx": "^15.3.5",
    "gray-matter": "^4.0.3",
    "next": "15.3.5",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "remark": "^15.0.1",
    "remark-gfm": "^4.0.0",
    "remark-html": "^16.0.1",
    "unist-util-visit": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

---

## 9. 배포 설정

### 9.1 Vercel 배포
```bash
# Vercel CLI 설치 및 배포
npm i -g vercel
vercel --prod
```

### 9.2 GitHub Actions (선택사항)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with: { version: 8 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 10. 로컬 개발 플로우
```bash
# 개발 서버 실행
pnpm dev

# 새 노트 추가 시
# 1. notes/새-노트.md 생성
# 2. 자동으로 /posts/새-노트 경로 생성
# 3. 위키링크 [[새-노트]] 자동 연결

# 프로덕션 빌드 테스트
pnpm build && pnpm start
```

---

## 11. 추후 업그레이드 로드맵

### Phase 2 (호버 프리뷰)
- [ ] 호버 시 노트 미리보기
- [ ] 검색 기능 (Fuse.js)
- [ ] 태그 시스템

### Phase 3 (백링크)
- [ ] 자동 백링크 생성
- [ ] 노트 간 연결 그래프
- [ ] RSS 피드

### Phase 4 (최적화)
- [ ] 이미지 최적화
- [ ] OG 이미지 자동 생성
- [ ] 성능 모니터링

---

## 12. 체크리스트

### Phase 1 완료 목표
- [ ] Next.js 15 프로젝트 초기 설정
- [ ] 기본 마크다운 렌더링
- [ ] 위키링크 변환 (서버)
- [ ] 링크 유효성 검사 (클라이언트)
- [ ] ISR 설정
- [ ] 기본 스타일링
- [ ] Vercel 배포 성공
- [ ] `notes/` 폴더에 샘플 노트 3개 추가

### 테스트 시나리오
1. 새 노트 생성 → 5분 후 자동 반영 확인
2. 위키링크 `[[기존-노트]]` → 파란색 링크 확인
3. 위키링크 `[[없는-노트]]` → 빨간색 링크 확인
4. 모바일 반응형 확인
5. SEO 메타 태그 확인

---

> 이 계획서는 **Phase 1 기본 기능 구현**에 중점을 두고 작성되었습니다.
> 각 Phase 완료 후 사용자 피드백을 받아 다음 단계를 조정합니다. 