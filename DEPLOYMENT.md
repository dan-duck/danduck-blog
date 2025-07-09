# Vercel 배포 가이드

이 문서는 danduck-blog를 Vercel에 배포하는 방법을 설명합니다.

## 사전 준비사항

1. [Vercel 계정](https://vercel.com/signup) 생성
2. GitHub 계정과 연동
3. 이 저장소가 GitHub에 푸시되어 있어야 함

## 배포 방법

### 방법 1: Vercel 대시보드를 통한 배포 (권장)

1. [Vercel 대시보드](https://vercel.com/dashboard)에 로그인
2. "New Project" 클릭
3. GitHub 저장소 목록에서 `danduck-blog` 선택
4. 프로젝트 설정:
   - Framework Preset: `Next.js` (자동 감지됨)
   - Root Directory: `./` (기본값)
   - Build Command: `pnpm build` (자동 감지됨)
   - Output Directory: `.next` (자동 감지됨)
   - Install Command: `pnpm install` (자동 감지됨)
5. 환경 변수 설정 (필요시):
   - `NEXT_PUBLIC_SITE_URL`: 배포된 사이트 URL
6. "Deploy" 클릭

### 방법 2: Vercel CLI를 통한 배포

1. Vercel CLI 설치 (이미 설치됨):
   ```bash
   npm i -g vercel
   ```

2. 프로젝트 루트에서 실행:
   ```bash
   vercel
   ```

3. 프롬프트에 따라 설정:
   - 계정 로그인/선택
   - 프로젝트 연결 (새 프로젝트 또는 기존 프로젝트)
   - 설정 확인

4. 프로덕션 배포:
   ```bash
   vercel --prod
   ```

## 환경 변수

Vercel 대시보드의 Project Settings > Environment Variables에서 설정:

### 필수 환경 변수
- 없음 (기본 설정으로 동작)

### 선택적 환경 변수
- `NEXT_PUBLIC_SITE_URL`: 사이트 URL (예: https://danduck.vercel.app)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: Google Analytics ID (추후 추가 시)

## 커스텀 도메인 설정

1. Vercel 대시보드에서 프로젝트 선택
2. Settings > Domains
3. 도메인 추가 (예: danduck.blog)
4. DNS 설정 안내에 따라 도메인 공급자에서 설정

## 배포 후 확인사항

1. 빌드 로그 확인
2. 모든 페이지 접근 가능 여부 확인
3. WikiLink 기능 동작 확인
4. API 엔드포인트 동작 확인 (`/api/posts/[slug]/exists`)
5. 이미지 및 정적 자산 로딩 확인

## 자동 배포

GitHub 저장소와 연결되면:
- `main` 브랜치 푸시 시 자동으로 프로덕션 배포
- PR 생성 시 프리뷰 배포 자동 생성

## 문제 해결

### 빌드 실패 시
1. Vercel 대시보드에서 빌드 로그 확인
2. 로컬에서 `pnpm build` 실행하여 에러 재현
3. 환경 변수 누락 여부 확인

### 성능 최적화
- 이미지는 Next.js Image 컴포넌트 사용
- 정적 생성(SSG) 활용
- ISR(Incremental Static Regeneration) 설정 확인

## 모니터링

Vercel 대시보드에서 제공:
- Analytics (방문자 통계)
- Web Vitals (성능 지표)
- Runtime Logs (실시간 로그)

## 업데이트 방법

1. 코드 수정 후 GitHub에 푸시
2. Vercel이 자동으로 빌드 및 배포
3. 배포 완료 알림 확인