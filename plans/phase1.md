# Phase 1 상세 개발 계획서 - 기본 블로그 구축

## 개요
- **목표**: Obsidian 노트를 Next.js로 변환하여 기본적인 블로그 + 위키링크 기능 구현
- **기간**: 1-2주 (약 40-80시간)
- **우선순위**: 핵심 기능 우선, 최소 기능 제품(MVP) 완성

---

## 1. 프로젝트 초기 설정 (Day 1)

### 1.1 개발 환경 구성
- **Node.js 버전 확인**: v20.x LTS 이상
- **pnpm 설치**: `npm install -g pnpm`
- **VSCode 확장 프로그램 설치**:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - MDX
  - TypeScript 관련 확장

### 1.2 Next.js 프로젝트 생성
```bash
pnpm create next-app@latest obsidian-blog --typescript --tailwind --app --turbopack
```
- **설정 옵션**:
  - TypeScript: Yes
  - ESLint: Yes
  - Tailwind CSS: Yes
  - src/ directory: Yes
  - App Router: Yes
  - Turbopack: Yes
  - Import alias: @/*

### 1.3 프로젝트 구조 설정
- `notes/` 폴더 생성 (Obsidian 원본 마크다운)
- `.gitignore`에 `.obsidian/` 추가
- `public/` 하위 폴더 구조:
  - `images/` (블로그 이미지)
  - `assets/` (기타 정적 자원)

### 1.4 기본 의존성 설치
```bash
# 핵심 의존성
pnpm add gray-matter remark remark-gfm remark-html unist-util-visit

# 타입 정의
pnpm add -D @types/unist
```

### 1.5 Git 저장소 초기화
- GitHub 저장소 생성
- 초기 커밋
- 브랜치 전략 수립 (main, develop, feature/*)

---

## 2. 기본 레이아웃 및 라우팅 구성 (Day 2-3)

### 2.1 루트 레이아웃 (`app/layout.tsx`)
- **메타데이터 설정**:
  - 사이트 제목
  - 기본 설명
  - 파비콘
  - Open Graph 기본값
- **전역 스타일**:
  - `globals.css` 임포트
  - 폰트 설정 (Inter, Noto Sans KR)
  - 다크모드 지원 준비

### 2.2 내비게이션 컴포넌트
- **헤더 컴포넌트** (`components/Header.tsx`):
  - 사이트 로고/제목
  - 메인 메뉴 (홈, 포스트, 소개)
  - 반응형 모바일 메뉴
- **푸터 컴포넌트** (`components/Footer.tsx`):
  - 저작권 정보
  - 소셜 링크
  - RSS 피드 링크 (준비)

### 2.3 페이지 라우트 구조
- **홈페이지** (`app/page.tsx`):
  - 최근 포스트 목록
  - 소개 섹션
  - 주요 포스트 하이라이트
- **포스트 목록** (`app/posts/page.tsx`):
  - 전체 포스트 목록
  - 페이지네이션 준비
  - 정렬 옵션 (날짜순)
- **개별 포스트** (`app/posts/[slug]/page.tsx`):
  - 포스트 내용 표시
  - 메타데이터
  - 네비게이션 (이전/다음 포스트)

### 2.4 에러 페이지
- **404 페이지** (`app/not-found.tsx`)
- **에러 바운더리** (`app/error.tsx`)
- **로딩 상태** (`app/loading.tsx`)

---

## 3. 마크다운 처리 시스템 구축 (Day 4-5)

### 3.1 포스트 로딩 시스템 (`lib/posts.ts`)
- **파일 시스템 접근**:
  - `notes/` 폴더 스캔
  - `.md` 파일 필터링
  - 파일명에서 slug 생성
- **메타데이터 파싱**:
  - gray-matter로 frontmatter 추출
  - 기본값 설정 (제목, 날짜, 태그)
  - 유효성 검사
- **포스트 정렬**:
  - 날짜 기준 내림차순
  - 제목 기준 정렬 옵션

### 3.2 마크다운 프로세서 (`lib/markdown.ts`)
- **기본 마크다운 변환**:
  - remark 파이프라인 설정
  - GFM (GitHub Flavored Markdown) 지원
  - HTML 변환
- **위키링크 플러그인 개발**:
  - 정규식으로 `[[노트]]` 패턴 감지
  - slug 변환 로직 (한글 지원)
  - HTML 앵커 태그 생성
  - data 속성 추가 (원본 제목)
- **이미지 경로 처리**:
  - 상대 경로 → 절대 경로 변환
  - public 폴더 매핑

### 3.3 타입 정의 (`types/post.ts`)
```typescript
interface Post {
  slug: string
  title: string
  date: string
  content: string
  excerpt?: string
  tags?: string[]
  author?: string
  coverImage?: string
}

interface ProcessedPost extends Post {
  htmlContent: string
  readingTime: number
  wordCount: number
}
```

---

## 4. 위키링크 기능 구현 (Day 6-7)

### 4.1 서버사이드 위키링크 처리
- **remark 플러그인 작성**:
  - AST 트리 순회
  - 텍스트 노드에서 위키링크 찾기
  - HTML 노드로 변환
  - 클래스명 추가 (`wiki-link`)
- **slug 생성 규칙**:
  - 공백 → 하이픈
  - 특수문자 제거
  - 한글 유지
  - 소문자 변환

### 4.2 클라이언트사이드 링크 검증
- **WikiLinkValidator 컴포넌트**:
  - useEffect로 DOM 스캔
  - 각 위키링크 유효성 검사
  - 비동기 batch 처리
  - 에러 처리
- **API 엔드포인트 생성**:
  - `/api/posts/[slug]/exists`
  - 파일 존재 여부 확인
  - 캐싱 전략

### 4.3 스타일링
- **링크 상태별 스타일**:
  - 유효한 링크: 파란색, 점선 밑줄
  - 깨진 링크: 빨간색, 물결 밑줄
  - 호버 효과
  - 툴팁 준비

---

## 5. ISR 및 캐싱 설정 (Day 8)

### 5.1 ISR 구현
- **페이지별 revalidate 설정**:
  - 포스트 목록: 60초
  - 개별 포스트: 300초 (5분)
  - 홈페이지: 300초
- **generateStaticParams 구현**:
  - 모든 포스트 slug 사전 생성
  - 빌드 시간 최적화

### 5.2 캐싱 전략
- **데이터 캐싱**:
  - 포스트 목록 메모이제이션
  - 마크다운 처리 결과 캐싱
- **API 응답 캐싱**:
  - 링크 존재 확인 결과
  - Cache-Control 헤더 설정

### 5.3 성능 모니터링 준비
- **Web Vitals 측정**:
  - LCP, FID, CLS 추적
  - 성능 로깅

---

## 6. SEO 및 메타데이터 (Day 9)

### 6.1 메타데이터 생성
- **generateMetadata 함수**:
  - 동적 제목
  - 설명 (첫 160자)
  - 키워드
  - 작성자 정보
- **Open Graph 태그**:
  - og:title, og:description
  - og:type (article)
  - og:image (추후 구현)
  - og:url

### 6.2 구조화된 데이터
- **JSON-LD 스키마**:
  - Article 스키마
  - BreadcrumbList
  - Person (작성자)
- **사이트맵 준비**:
  - 정적 페이지
  - 동적 포스트

### 6.3 robots.txt 및 기타
- **robots.txt 생성**
- **canonical URL 설정**
- **언어 설정** (ko-KR)

---

## 7. 스타일링 및 UI/UX (Day 10-11)

### 7.1 Tailwind CSS 설정
- **커스텀 설정**:
  - 색상 팔레트
  - 폰트 스케일
  - 간격 시스템
  - 브레이크포인트
- **prose 플러그인 커스터마이징**:
  - 제목 스타일
  - 문단 간격
  - 리스트 스타일
  - 코드 블록

### 7.2 컴포넌트 스타일링
- **레이아웃 컴포넌트**:
  - 최대 너비 설정
  - 패딩/마진 시스템
  - 그리드 레이아웃
- **포스트 컴포넌트**:
  - 읽기 최적화 타이포그래피
  - 이미지 스타일
  - 인용구 스타일

### 7.3 반응형 디자인
- **모바일 최적화**:
  - 터치 타겟 크기
  - 가독성
  - 네비게이션 메뉴
- **태블릿/데스크톱**:
  - 사이드바 레이아웃
  - 멀티 컬럼

### 7.4 접근성
- **ARIA 레이블**
- **키보드 네비게이션**
- **스크린 리더 지원**
- **색상 대비**

---

## 8. 테스트 및 디버깅 (Day 12)

### 8.1 유닛 테스트 준비
- **테스트 환경 설정**:
  - Jest 설정
  - React Testing Library
- **주요 테스트 케이스**:
  - 마크다운 변환
  - 위키링크 처리
  - 포스트 로딩

### 8.2 통합 테스트
- **E2E 테스트 시나리오**:
  - 포스트 목록 표시
  - 포스트 상세 페이지
  - 위키링크 클릭
  - 404 처리

### 8.3 디버깅 및 최적화
- **성능 프로파일링**:
  - 빌드 시간
  - 런타임 성능
  - 번들 크기
- **에러 추적**:
  - 콘솔 에러
  - 네트워크 에러
  - 빌드 에러

---

## 9. Vercel 배포 (Day 13)

### 9.1 Vercel 프로젝트 설정
- **Vercel CLI 설치**
- **프로젝트 연결**:
  - GitHub 연동
  - 환경 변수 설정
  - 도메인 설정
- **빌드 설정**:
  - 빌드 명령어
  - 출력 디렉토리
  - Node.js 버전

### 9.2 배포 파이프라인
- **자동 배포 설정**:
  - main 브랜치 자동 배포
  - PR 프리뷰 배포
- **환경 변수**:
  - 프로덕션/개발 분리
  - 시크릿 관리

### 9.3 모니터링 설정
- **Vercel Analytics**:
  - 페이지 뷰
  - Web Vitals
- **에러 추적**:
  - 런타임 에러
  - 빌드 실패

---

## 10. 문서화 및 마무리 (Day 14)

### 10.1 README 작성
- **프로젝트 소개**
- **설치 가이드**
- **사용 방법**:
  - 새 포스트 추가
  - 위키링크 사용법
  - 배포 방법
- **기여 가이드라인**

### 10.2 코드 문서화
- **JSDoc 주석**:
  - 주요 함수
  - 컴포넌트
  - 유틸리티
- **타입 정의 문서**

### 10.3 샘플 콘텐츠
- **테스트용 포스트 3개**:
  - 마크다운 기능 소개
  - 위키링크 데모
  - 이미지/코드 예제
- **상호 참조 예제**

---

## 체크리스트 - Phase 1 완료 기준

### 프로젝트 설정
- [ ] Next.js 15 프로젝트 생성
- [ ] TypeScript 설정
- [ ] Tailwind CSS 설정
- [ ] ESLint/Prettier 설정
- [ ] 프로젝트 폴더 구조 생성
- [ ] Git 저장소 초기화
- [ ] 필수 의존성 설치
- [ ] 환경 변수 설정 파일 생성

### 레이아웃 및 라우팅
- [ ] 루트 레이아웃 구현
- [ ] 헤더 컴포넌트 생성
- [ ] 푸터 컴포넌트 생성
- [ ] 모바일 반응형 네비게이션
- [ ] 홈페이지 구현
- [ ] 포스트 목록 페이지 구현
- [ ] 개별 포스트 페이지 구현
- [ ] 404 페이지 구현
- [ ] 에러 페이지 구현
- [ ] 로딩 상태 구현

### 마크다운 처리
- [ ] 포스트 파일 로딩 함수 구현
- [ ] gray-matter 메타데이터 파싱
- [ ] remark 파이프라인 설정
- [ ] GFM 지원 추가
- [ ] HTML 변환 구현
- [ ] 이미지 경로 처리
- [ ] 포스트 정렬 로직
- [ ] 타입 정의 작성

### 위키링크 기능
- [ ] 위키링크 정규식 작성
- [ ] remark 플러그인 개발
- [ ] slug 생성 함수 (한글 지원)
- [ ] HTML 변환 로직
- [ ] WikiLinkValidator 컴포넌트
- [ ] 링크 존재 확인 API 엔드포인트
- [ ] 클라이언트 검증 로직
- [ ] 에러 처리 구현

### ISR 및 성능
- [ ] generateStaticParams 구현
- [ ] revalidate 시간 설정
- [ ] 포스트 목록 캐싱
- [ ] 마크다운 처리 캐싱
- [ ] API 응답 캐싱
- [ ] 성능 측정 코드 추가

### SEO 및 메타데이터
- [ ] generateMetadata 함수 구현
- [ ] Open Graph 태그 설정
- [ ] Twitter Card 태그
- [ ] 구조화된 데이터 (JSON-LD)
- [ ] robots.txt 생성
- [ ] canonical URL 설정
- [ ] 언어 및 지역 설정

### 스타일링
- [ ] Tailwind 커스텀 설정
- [ ] 전역 CSS 스타일
- [ ] prose 커스터마이징
- [ ] 위키링크 스타일 (유효/무효)
- [ ] 반응형 브레이크포인트
- [ ] 다크모드 준비 (CSS 변수)
- [ ] 접근성 스타일

### UI 컴포넌트
- [ ] 포스트 카드 컴포넌트
- [ ] 날짜 포맷팅 컴포넌트
- [ ] 태그 컴포넌트 (준비)
- [ ] 페이지네이션 컴포넌트 (준비)
- [ ] 브레드크럼 컴포넌트

### 테스트
- [ ] 마크다운 변환 테스트
- [ ] 위키링크 처리 테스트
- [ ] 포스트 로딩 테스트
- [ ] API 엔드포인트 테스트
- [ ] 링크 검증 테스트
- [ ] 빌드 성공 확인
- [ ] 성능 프로파일링

### 배포
- [ ] Vercel 계정 생성
- [ ] 프로젝트 연결
- [ ] 환경 변수 설정
- [ ] 도메인 설정 (선택)
- [ ] 빌드 설정 구성
- [ ] 첫 배포 성공
- [ ] 자동 배포 확인
- [ ] 프리뷰 배포 테스트

### 문서화
- [ ] README.md 작성
- [ ] 설치 가이드
- [ ] 사용 방법 문서
- [ ] 코드 주석 추가
- [ ] 타입 정의 문서화
- [ ] 샘플 포스트 3개 작성
- [ ] 위키링크 데모 콘텐츠
- [ ] 트러블슈팅 가이드

### 최종 검증
- [ ] 새 노트 추가 → 자동 반영 테스트
- [ ] 위키링크 정상 작동 확인
- [ ] 깨진 링크 스타일 확인
- [ ] 모바일 반응형 테스트
- [ ] SEO 검사 도구 실행
- [ ] 성능 점수 확인 (Lighthouse)
- [ ] 접근성 검사
- [ ] 크로스 브라우저 테스트