---
title: WikiLink 사용법
date: 2024-12-27
tags: [Obsidian, WikiLink, 마크다운]
description: Obsidian의 WikiLink 기능을 블로그에서 사용하는 방법
author: Dan Duck
---

# WikiLink 사용법

WikiLink는 Obsidian의 핵심 기능 중 하나로, 노트 간의 연결을 쉽게 만들 수 있게 해줍니다.

## WikiLink란?

WikiLink는 `[[노트 제목]]` 형식으로 작성하는 내부 링크입니다. 이 블로그에서도 동일한 방식으로 포스트 간 연결을 만들 수 있습니다.

## 사용 예제

### 기본 사용법
- `[[getting-started]]` → [[getting-started]]
- `[[마크다운 가이드]]` → [[마크다운 가이드]]

### 한글 제목 지원
이 블로그는 한글 제목의 WikiLink도 완벽하게 지원합니다:
- `[[블로그 시작하기]]` → [[블로그 시작하기]]

## 장점

1. **빠른 연결**: 파일명만 알면 쉽게 링크 생성
2. **자동 변환**: 공백과 특수문자를 자동으로 처리
3. **양방향 링크**: 추후 백링크 기능 추가 예정

## 구현 방식

이 블로그는 remark 플러그인을 사용하여 WikiLink를 일반 HTML 링크로 변환합니다:

```typescript
function generateSlugFromWikiLink(link: string): string {
  return link
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-가-힣]/g, '');
}
```

## 주의사항

- WikiLink 내부에는 대괄호 `]`를 사용할 수 없습니다
- 존재하지 않는 페이지로의 링크는 다른 스타일로 표시됩니다 (추후 구현 예정)

## 관련 문서

더 자세한 내용은 [[마크다운 가이드]]를 참고하세요!