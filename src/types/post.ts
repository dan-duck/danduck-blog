/**
 * 포스트 메타데이터 인터페이스
 * 포스트의 기본 정보를 담습니다.
 */
export interface PostMetadata {
  /** 포스트 제목 */
  title: string;
  /** 포스트 날짜 (ISO 8601 형식) */
  date: string;
  /** 태그 목록 */
  tags?: string[];
  /** 포스트 설명 (SEO 및 미리보기용) */
  description?: string;
  /** 작성자 이름 */
  author?: string;
  /** URL slug (파일명 기반) */
  slug: string;
}

/**
 * 전체 포스트 인터페이스
 * 메타데이터와 마크다운 콘텐츠를 포함합니다.
 */
export interface Post extends PostMetadata {
  /** 마크다운 원본 콘텐츠 */
  content: string;
}

/**
 * 처리된 포스트 인터페이스
 * 메타데이터와 HTML로 변환된 콘텐츠를 포함합니다.
 */
export interface ProcessedPost extends PostMetadata {
  /** HTML로 변환된 콘텐츠 */
  contentHtml: string;
  /** 포스트 발췌문 (선택적) */
  excerpt?: string;
}