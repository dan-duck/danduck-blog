# 컴포넌트 가이드

이 문서는 단덕 블로그의 주요 컴포넌트들을 설명합니다.

## 레이아웃 컴포넌트

### Header
위치: `src/components/Header.tsx`

네비게이션 헤더 컴포넌트입니다.

```tsx
<Header />
```

**기능:**
- 로고 및 사이트 제목
- 주요 메뉴 (Posts, About, Tags)
- 모바일 반응형 메뉴
- 스티키 헤더

### Footer
위치: `src/components/Footer.tsx`

페이지 하단 푸터 컴포넌트입니다.

```tsx
<Footer />
```

**기능:**
- 저작권 정보
- 소셜 미디어 링크 (GitHub, Twitter, RSS)
- 기술 스택 표시

## UI 컴포넌트

### PostCard
위치: `src/components/PostCard.tsx`

포스트 목록에서 사용되는 카드 컴포넌트입니다.

```tsx
<PostCard post={postMetadata} />
```

**Props:**
- `post: PostMetadata` - 포스트 메타데이터

**기능:**
- 제목, 설명, 날짜 표시
- 작성자 정보
- 태그 목록 (최대 3개 표시)
- 호버 효과

### DateFormatter
위치: `src/components/DateFormatter.tsx`

날짜를 다양한 형식으로 표시하는 컴포넌트입니다.

```tsx
<DateFormatter date="2024-12-28" format="full" relative={true} />
```

**Props:**
- `date: string` - ISO 날짜 문자열
- `format?: 'full' | 'short' | 'relative'` - 표시 형식
- `relative?: boolean` - 상대 시간 표시 여부
- `className?: string` - 추가 CSS 클래스

**형식:**
- `full`: "2024년 12월 28일 토요일 오전 9:00"
- `short`: "2024-12-28"
- `relative`: "2일 전"

### Tag
위치: `src/components/Tag.tsx`

태그를 표시하는 컴포넌트입니다.

```tsx
<Tag tag="React" variant="default" size="md" />
```

**Props:**
- `tag: string` - 태그 이름
- `variant?: 'default' | 'outline' | 'ghost'` - 스타일 변형
- `size?: 'sm' | 'md' | 'lg'` - 크기
- `onClick?: () => void` - 클릭 핸들러

### Pagination
위치: `src/components/Pagination.tsx`

페이지네이션 컴포넌트입니다.

```tsx
<Pagination 
  currentPage={1} 
  totalPages={10} 
  basePath="/posts" 
/>
```

**Props:**
- `currentPage: number` - 현재 페이지
- `totalPages: number` - 전체 페이지 수
- `basePath: string` - 기본 경로
- `className?: string` - 추가 CSS 클래스

**기능:**
- 페이지 번호 표시
- 이전/다음 버튼
- 페이지 점프 (...)
- 현재 페이지 하이라이트

### Breadcrumb
위치: `src/components/Breadcrumb.tsx`

브레드크럼 네비게이션 컴포넌트입니다.

```tsx
<Breadcrumb items={[
  { name: '홈', href: '/' },
  { name: '포스트', href: '/posts' },
  { name: '현재 글' }
]} />
```

**Props:**
- `items: BreadcrumbItem[]` - 브레드크럼 항목 배열
- `className?: string` - 추가 CSS 클래스

**BreadcrumbItem:**
```typescript
{
  name: string;
  href?: string;
}
```

## 기능 컴포넌트

### WikiLinkValidator
위치: `src/components/WikiLinkValidator.tsx`

WikiLink 유효성을 검증하고 스타일을 적용하는 클라이언트 컴포넌트입니다.

```tsx
<WikiLinkValidator />
```

**기능:**
- 페이지의 모든 WikiLink 검색
- API를 통한 링크 유효성 확인
- 유효/무효 링크 스타일 적용
- 배치 처리로 성능 최적화

### SkipLink
위치: `src/components/SkipLink.tsx`

접근성을 위한 스킵 링크 컴포넌트입니다.

```tsx
<SkipLink />
```

**기능:**
- 키보드 탐색 시 주요 콘텐츠로 바로 이동
- 포커스 시에만 표시

### ScreenReaderOnly
위치: `src/components/ScreenReaderOnly.tsx`

스크린 리더 전용 콘텐츠를 위한 컴포넌트입니다.

```tsx
<ScreenReaderOnly>
  추가 설명 텍스트
</ScreenReaderOnly>
```

**Props:**
- `children: React.ReactNode` - 숨길 콘텐츠
- `as?: keyof React.JSX.IntrinsicElements` - 렌더링할 HTML 요소

### Analytics
위치: `src/components/Analytics.tsx`

Vercel Analytics와 Speed Insights를 통합하는 컴포넌트입니다.

```tsx
<Analytics />
```

**기능:**
- 방문자 통계 수집
- 성능 지표 측정
- 자동으로 Vercel에 데이터 전송

### JsonLd
위치: `src/components/JsonLd.tsx`

구조화된 데이터를 위한 JSON-LD 컴포넌트들입니다.

```tsx
<ArticleJsonLd post={post} />
<BreadcrumbJsonLd items={breadcrumbItems} />
<PersonJsonLd name="단덕" />
```

**컴포넌트:**
- `ArticleJsonLd` - 블로그 글 구조화 데이터
- `BreadcrumbJsonLd` - 브레드크럼 구조화 데이터
- `PersonJsonLd` - 작성자 구조화 데이터

## 스타일링 가이드

모든 컴포넌트는 다음 원칙을 따릅니다:

1. **Tailwind CSS 우선**: 인라인 스타일 대신 Tailwind 클래스 사용
2. **터미널 테마**: 다크 배경, 밝은 텍스트, 터미널 스타일 요소
3. **반응형**: 모바일 우선 디자인
4. **접근성**: ARIA 레이블, 키보드 네비게이션 지원

### 색상 팔레트
- `accent-cyan`: #00ffff (주요 강조)
- `accent-green`: #00ff00 (성공, 링크)
- `accent-purple`: #ff00ff (태그)
- `accent-red`: #ff0080 (에러, 경고)
- `text-primary`: #e4e4e7 (주요 텍스트)
- `text-secondary`: #a1a1aa (보조 텍스트)

## 커스텀 컴포넌트 생성

새 컴포넌트 생성 시:

1. TypeScript 인터페이스 정의
2. JSDoc 주석 추가
3. 기본 props 설정
4. 접근성 속성 포함
5. 스토리북 스토리 작성 (선택)

예시:
```tsx
/**
 * 커스텀 버튼 컴포넌트
 */
interface CustomButtonProps {
  /** 버튼 텍스트 */
  children: React.ReactNode;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 버튼 변형 */
  variant?: 'primary' | 'secondary';
  /** 비활성화 상태 */
  disabled?: boolean;
}

export default function CustomButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
}: CustomButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'px-4 py-2 rounded transition-colors',
        variant === 'primary' && 'bg-accent-cyan text-black',
        variant === 'secondary' && 'bg-gray-800 text-white',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}
```

---

자세한 구현은 각 컴포넌트 파일을 참조하세요.