# Phase 2: shadcn/ui Integration

## 프로젝트 개요

Phase 2는 shadcn/ui 컴포넌트 라이브러리를 블로그 프로젝트에 통합하는 단계입니다. 기존의 "code geek" 터미널/사이버펑크 미학을 유지하면서 shadcn/ui의 접근성과 컴포넌트 품질을 활용하는 것이 목표입니다.

### 핵심 원칙
1. **기존 디자인 정체성 유지**: 현재의 다크 테마와 네온 색상 팔레트를 보존
2. **점진적 마이그레이션**: 기존 기능을 손상시키지 않으면서 단계적으로 전환
3. **성능 최적화**: 현재의 성능 메트릭 유지 또는 개선
4. **개발자 경험 향상**: 재사용 가능한 컴포넌트와 일관된 API

## 기술 스택

### 필수 의존성
```json
{
  "dependencies": {
    "class-variance-authority": "^0.7.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "@radix-ui/react-*": "latest",
    "lucide-react": "^0.x"
  },
  "devDependencies": {
    "tailwindcss-animate": "^1.x"
  }
}
```

### 프로젝트 구조
```
src/
├── components/
│   ├── ui/                 # shadcn/ui 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── command.tsx
│   │   └── ...
│   ├── custom/            # 커스텀 컴포넌트
│   │   ├── terminal-prompt.tsx
│   │   ├── code-block.tsx
│   │   └── wiki-link.tsx
│   └── compound/          # 복합 컴포넌트
│       ├── post-card.tsx
│       ├── navigation-bar.tsx
│       └── command-palette.tsx
├── lib/
│   ├── utils.ts          # cn() 유틸리티 함수
│   └── theme.ts          # 테마 설정
└── styles/
    ├── globals.css       # 글로벌 스타일 + shadcn 유틸리티
    └── themes/
        └── code-geek.css # 커스텀 테마 변수
```

## 구현 단계

### Phase 2.1: 기초 설정 (1주차)

#### 1. shadcn/ui 초기화
```bash
# shadcn/ui CLI 설치 및 초기화
pnpm dlx shadcn@latest init

# 설정 옵션:
# - Style: New York
# - Base color: Neutral
# - CSS variables: Yes
# - Tailwind config: tailwind.config.ts
# - Components: src/components
# - Utils: src/lib/utils.ts
# - React Server Components: Yes
# - Write to components.json: Yes
```

#### 2. 테마 시스템 구축
```css
/* styles/themes/code-geek.css */
@layer base {
  :root {
    /* shadcn 기본 변수를 현재 색상으로 매핑 */
    --background: 10 10 10;           /* #0a0a0a */
    --foreground: 226 232 240;        /* #e2e8f0 */
    
    --card: 18 18 18;                 /* #121212 */
    --card-foreground: 226 232 240;
    
    --primary: 34 211 238;            /* #22d3ee - cyan */
    --primary-foreground: 10 10 10;
    
    --secondary: 99 102 241;          /* #6366f1 - indigo */
    --secondary-foreground: 241 245 249;
    
    --accent: 168 85 247;             /* #a855f7 - purple */
    --accent-foreground: 241 245 249;
    
    --destructive: 239 68 68;        /* #ef4444 */
    --destructive-foreground: 241 245 249;
    
    --border: 39 39 42;               /* #27272a */
    --input: 39 39 42;
    --ring: 34 211 238;
    
    /* 커스텀 변수 */
    --glow: 0 0 20px hsl(var(--primary) / 0.5);
    --terminal-cursor: 34 211 238;
    --code-bg: 24 24 27;              /* #18181b */
  }
}
```

#### 3. 컴포넌트 설정 파일
```json
// components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

### Phase 2.2: 핵심 컴포넌트 마이그레이션 (2주차)

#### 컴포넌트 우선순위
1. **기초 컴포넌트** (즉시 구현)
   - Button (터미널 스타일 variant 추가)
   - Card (글로우 효과 포함)
   - Badge (네온 스타일)
   - Separator (터미널 라인 스타일)

2. **네비게이션 컴포넌트**
   - Command (터미널 스타일 커맨드 팔레트)
   - Navigation Menu
   - Breadcrumb
   - Dropdown Menu

3. **피드백 컴포넌트**
   - Toast (터미널 알림 스타일)
   - Alert
   - Progress (로딩 바)
   - Skeleton (코드 블록 스타일)

4. **콘텐츠 컴포넌트**
   - Scroll Area
   - Collapsible
   - Tabs
   - Tooltip (위키링크용)

#### 커스텀 Button 예시
```tsx
// components/ui/button.tsx 확장
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // 커스텀 variants
        terminal: "bg-transparent border border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[var(--glow)] font-mono",
        neon: "bg-transparent text-primary border border-primary hover:bg-primary/20 hover:shadow-[var(--glow)] hover:border-transparent",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### Phase 2.3: 고급 기능 구현 (3주차)

#### 1. Command Palette 구현
- 터미널 스타일 커맨드 팔레트
- 키보드 단축키 (Cmd+K)
- 빠른 검색 및 네비게이션
- 최근 방문 포스트 표시

#### 2. 향상된 WikiLink 시스템
- Tooltip 컴포넌트로 미리보기
- Popover로 링크 정보 표시
- Command Palette 통합

#### 3. 인터랙티브 요소
- 포스트 목록 필터링 (Select, Checkbox)
- 태그 시스템 (Badge 컴포넌트)
- 검색 기능 (Input + Command)

### Phase 2.4: 성능 최적화 및 마무리 (4주차)

#### 최적화 전략
1. **번들 크기 최소화**
   - 사용하지 않는 컴포넌트 제거
   - 동적 임포트 활용
   - Tree shaking 최적화

2. **애니메이션 성능**
   - GPU 가속 활용
   - will-change 속성 적절히 사용
   - 애니메이션 debounce/throttle

3. **접근성 개선**
   - ARIA 레이블 검증
   - 키보드 네비게이션 테스트
   - 스크린 리더 호환성

## 체크리스트

### 설정 및 초기화
- [x] shadcn/ui CLI 설치
- [x] components.json 구성
- [x] 테마 변수 매핑
- [x] utils.ts 설정
- [x] Tailwind 플러그인 추가

### 기초 컴포넌트
- [x] Button 컴포넌트 마이그레이션
- [x] Card 컴포넌트 마이그레이션
- [x] Badge 컴포넌트 구현
- [x] Separator 스타일링
- [x] Input/Textarea 구현

### 네비게이션
- [x] Command Palette 구현
- [x] Navigation Menu 통합
- [x] Breadcrumb 개선
- [x] Mobile Menu 최적화

### 콘텐츠 및 피드백
- [ ] Toast 시스템 구현
- [ ] Alert 컴포넌트 추가
- [ ] Skeleton 로더 구현
- [ ] Progress 인디케이터

### 고급 기능
- [ ] WikiLink Tooltip
- [ ] 검색 기능 구현
- [ ] 필터링 시스템
- [ ] 키보드 단축키

### 테스트 및 최적화
- [ ] 컴포넌트 단위 테스트
- [ ] 접근성 감사
- [ ] 성능 프로파일링
- [ ] 번들 크기 분석

### 문서화
- [ ] 컴포넌트 스토리북
- [ ] 사용 가이드
- [ ] 테마 커스터마이징 문서
- [ ] 마이그레이션 가이드

## 미래 고려사항 (Phase 3 후보)

### Code Geek 애니메이션 및 효과
1. **매트릭스 레인 효과**
   - 페이지 전환 시 떨어지는 문자
   - 배경 애니메이션 옵션

2. **터미널 부트 시퀀스**
   - 첫 방문 시 ASCII 아트 로고
   - 타이핑 애니메이션 인트로

3. **글리치 효과**
   - 호버 시 글리치 애니메이션
   - 에러 페이지 글리치 효과

4. **코드 에디터 테마**
   - 다양한 신택스 하이라이팅 테마
   - 사용자 선택 가능한 에디터 스타일

5. **Vim 스타일 네비게이션**
   - j/k로 포스트 간 이동
   - / 로 검색 모드 진입
   - gg/G로 페이지 상단/하단 이동

6. **ASCII 아트 요소**
   - 로딩 스피너
   - 구분선 및 장식
   - 404 페이지 아트

### 성능 향상
- React 19 기능 활용 (Suspense, Transitions)
- 이미지 최적화 파이프라인
- 웹 워커 활용
- PWA 기능 추가

### 사용자 경험
- 다크/라이트 테마 토글 (터미널 스타일 유지)
- 폰트 크기 조절
- 읽기 모드
- 오프라인 지원

## 마일스톤

### Week 1: Foundation
- shadcn/ui 설정 완료
- 테마 시스템 구축
- 첫 번째 컴포넌트 마이그레이션

### Week 2: Core Components
- 모든 기초 컴포넌트 전환
- 네비게이션 시스템 개선
- 스타일 일관성 확보

### Week 3: Advanced Features
- Command Palette 완성
- 검색 및 필터링 구현
- 인터랙티브 요소 추가

### Week 4: Polish & Deploy
- 성능 최적화
- 접근성 검증
- 문서화 완료
- 프로덕션 배포

## 성공 지표

1. **성능**
   - Lighthouse 점수 90+ 유지
   - First Contentful Paint < 1.5s
   - 번들 크기 증가 < 20%

2. **접근성**
   - WCAG 2.1 AA 준수
   - 키보드 네비게이션 100% 지원
   - 스크린 리더 완벽 호환

3. **개발자 경험**
   - 컴포넌트 재사용성 향상
   - 일관된 API 및 props
   - 명확한 문서화

4. **사용자 경험**
   - 시각적 일관성 유지
   - 향상된 인터랙션
   - 빠른 응답성

---

이 계획은 기존 프로젝트의 강점을 유지하면서 shadcn/ui의 이점을 최대한 활용하도록 설계되었습니다. 각 단계는 독립적으로 구현 가능하며, 프로젝트 요구사항에 따라 조정할 수 있습니다.