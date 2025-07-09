# 단덕 블로그

Obsidian 노트를 활용한 개발 블로그 시스템입니다. Next.js 15와 React 19를 기반으로 구축되었으며, WikiLink 기능을 지원합니다.

## 주요 기능

- 📝 **Obsidian 마크다운 지원**: Obsidian에서 작성한 노트를 그대로 블로그 글로 활용
- 🔗 **WikiLink 지원**: `[[글 제목]]` 형식의 내부 링크 자동 변환
- 🚀 **ISR (Incremental Static Regeneration)**: 성능과 실시간성을 모두 확보
- 🌙 **다크 터미널 테마**: 개발자 친화적인 터미널 스타일 디자인
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 환경 지원
- ♿ **접근성**: ARIA 레이블, 키보드 네비게이션 지원
- 🔍 **SEO 최적화**: 메타데이터, Open Graph, JSON-LD 구조화 데이터
- 📊 **성능 모니터링**: Web Vitals 측정 및 Vercel Analytics 통합

## 기술 스택

- **프레임워크**: Next.js 15.3.5 (App Router)
- **언어**: TypeScript 5
- **스타일링**: Tailwind CSS 4 (Alpha)
- **마크다운**: remark, remark-gfm, gray-matter
- **폰트**: Inter, Noto Sans KR, JetBrains Mono
- **패키지 매니저**: pnpm
- **배포**: Vercel

## 시작하기

### 필수 조건

- Node.js 20.x LTS 이상
- pnpm 10.x 이상

### 설치

1. 저장소 클론
```bash
git clone https://github.com/dan-duck/danduck-blog.git
cd danduck-blog
```

2. 의존성 설치
```bash
pnpm install
```

3. 개발 서버 실행
```bash
pnpm dev
```

4. 브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 빌드

프로덕션 빌드 생성:
```bash
pnpm build
```

프로덕션 서버 실행:
```bash
pnpm start
```

## 프로젝트 구조

```
danduck-blog/
├── src/
│   ├── app/              # Next.js App Router 페이지
│   ├── components/       # React 컴포넌트
│   ├── lib/             # 유틸리티 함수
│   └── types/           # TypeScript 타입 정의
├── notes/               # Obsidian 마크다운 파일
├── public/             # 정적 파일
│   ├── images/         # 이미지 파일
│   └── assets/         # 기타 정적 자산
├── plans/              # 프로젝트 계획 문서
└── CLAUDE.md           # Claude AI 가이드라인
```

## 블로그 글 작성하기

### 1. 마크다운 파일 생성

`notes/` 폴더에 `.md` 파일 생성:

```markdown
---
title: 글 제목
date: 2024-12-28
tags: [태그1, 태그2]
description: 글 설명
author: 작성자
---

# 내용 작성

본문 내용...
```

### 2. WikiLink 사용

다른 글로 연결하려면:
```markdown
이 글에서 [[다른 글 제목]]을 참조하세요.
```

### 3. 이미지 추가

```markdown
![이미지 설명](/images/image.png)
```

## 커스터마이징

### 색상 테마 변경

`tailwind.config.ts`에서 색상 팔레트 수정:

```typescript
colors: {
  'accent-cyan': '#00ffff',
  'accent-green': '#00ff00',
  // ...
}
```

### 폰트 변경

`src/app/layout.tsx`에서 폰트 설정 수정

### 메타데이터 수정

`src/app/layout.tsx`의 `metadata` 객체 수정

## 테스트

### 테스트 실행
```bash
pnpm test
```

### 테스트 감시 모드
```bash
pnpm test:watch
```

### 커버리지 리포트
```bash
pnpm test:coverage
```

## 배포

Vercel을 통한 자동 배포가 설정되어 있습니다. `main` 브랜치에 푸시하면 자동으로 배포됩니다.

자세한 배포 방법은 [DEPLOYMENT.md](./DEPLOYMENT.md) 참조

## 문제 해결

### 빌드 에러
- Node.js 버전 확인 (20.x LTS 이상)
- `pnpm install` 재실행
- `.next` 폴더 삭제 후 재빌드

### WikiLink 동작 안 함
- 파일명과 링크 텍스트 일치 확인
- 파일이 `notes/` 폴더에 있는지 확인
- 개발 서버 재시작

### 한글 폰트 문제
- Noto Sans KR 폰트 로딩 확인
- `preload: false` 설정 확인

## 기여하기

기여를 환영합니다! 다음 과정을 따라주세요:

1. Fork 저장소
2. Feature 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'feat: 놀라운 기능 추가'`)
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 라이센스

이 프로젝트는 MIT 라이센스 하에 있습니다. 자세한 내용은 [LICENSE](./LICENSE) 파일을 참조하세요.

## 연락처

- 블로그: [https://danduck.blog](https://danduck.blog)
- GitHub: [@dan-duck](https://github.com/dan-duck)

---

Made with ❤️ by 단덕
