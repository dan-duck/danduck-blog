# 기여 가이드

단덕 블로그 프로젝트에 기여해주셔서 감사합니다! 이 문서는 프로젝트에 기여하는 방법을 안내합니다.

## 행동 강령

이 프로젝트는 모든 참여자가 존중받고 환영받는 환경을 만들기 위해 노력합니다. 모든 기여자는 다음을 준수해야 합니다:

- 친절하고 포용적인 언어 사용
- 다른 관점과 경험 존중
- 건설적인 비판을 우아하게 수용
- 커뮤니티에 가장 좋은 것에 집중

## 기여 방법

### 이슈 보고

버그를 발견하거나 새로운 기능을 제안하려면:

1. [이슈 목록](https://github.com/dan-duck/danduck-blog/issues)에서 유사한 이슈가 있는지 확인
2. 없다면 새 이슈 생성
3. 명확한 제목과 설명 작성
4. 버그의 경우 재현 단계 포함
5. 가능하면 스크린샷이나 에러 로그 첨부

### Pull Request 제출

1. **Fork & Clone**
   ```bash
   git clone https://github.com/your-username/danduck-blog.git
   cd danduck-blog
   ```

2. **브랜치 생성**
   ```bash
   git checkout -b feature/기능명
   # 또는
   git checkout -b fix/버그명
   ```

3. **개발 환경 설정**
   ```bash
   pnpm install
   pnpm dev
   ```

4. **변경사항 작성**
   - 코드 스타일 가이드 준수
   - 테스트 추가/수정
   - 문서 업데이트

5. **테스트 실행**
   ```bash
   pnpm test
   pnpm build
   ```

6. **커밋**
   ```bash
   git add .
   git commit -m "type: 간단한 설명"
   ```

7. **푸시 & PR 생성**
   ```bash
   git push origin feature/기능명
   ```

## 커밋 메시지 규칙

### 형식
```
type: 제목

본문 (선택사항)

Footer (선택사항)
```

### Type
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅, 세미콜론 누락 등
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드 프로세스, 도구 설정 등

### 예시
```
feat: WikiLink 미리보기 기능 추가

마우스 호버 시 링크된 글의 미리보기를 표시하는 기능 구현
- 툴팁 컴포넌트 추가
- 글 내용 일부 가져오는 API 엔드포인트 추가

Closes #123
```

## 코드 스타일 가이드

### TypeScript/JavaScript
- 2 스페이스 들여쓰기
- 세미콜론 사용
- 작은따옴표 사용 (JSX 제외)
- 함수형 컴포넌트 선호

### 예시
```typescript
// Good
export default function PostCard({ post }: PostCardProps) {
  const formattedDate = formatDate(post.date);
  
  return (
    <article className="post-card">
      <h2>{post.title}</h2>
      <time>{formattedDate}</time>
    </article>
  );
}

// Bad
const PostCard = (props) => {
  return <article class="post-card">
    <h2>{props.post.title}</h2>
  </article>
}
```

### CSS/Tailwind
- Tailwind 클래스 사용 우선
- 커스텀 CSS는 globals.css에 추가
- 의미있는 클래스명 사용

## 테스트 작성

### 단위 테스트
```typescript
describe('formatDate', () => {
  it('should format date in Korean format', () => {
    const date = '2024-12-28';
    expect(formatDate(date)).toBe('2024년 12월 28일');
  });
});
```

### 컴포넌트 테스트
```typescript
describe('PostCard', () => {
  it('should render post information', () => {
    const mockPost = {
      title: '테스트 글',
      date: '2024-12-28',
      // ...
    };
    
    render(<PostCard post={mockPost} />);
    
    expect(screen.getByText('테스트 글')).toBeInTheDocument();
  });
});
```

## 문서 작성

- 모든 문서는 한글로 작성
- 마크다운 형식 사용
- 코드 예시 포함
- 명확하고 간결한 설명

## 개발 프로세스

1. **이슈 확인/생성**
   - 작업할 이슈 선택 또는 생성
   - 이슈에 댓글로 작업 시작 알림

2. **개발**
   - 위의 가이드라인 준수
   - 정기적으로 main 브랜치와 동기화

3. **리뷰**
   - PR 생성 시 관련 이슈 링크
   - 리뷰어의 피드백 반영
   - 모든 체크 통과 확인

4. **머지**
   - 승인 후 머지
   - 관련 이슈 자동 종료

## 도움이 필요하신가요?

- [이슈](https://github.com/dan-duck/danduck-blog/issues)에 질문 남기기
- [토론](https://github.com/dan-duck/danduck-blog/discussions) 참여
- 프로젝트 문서 확인

## 라이센스

기여하신 내용은 프로젝트의 MIT 라이센스에 따릅니다.

---

감사합니다! 🙏