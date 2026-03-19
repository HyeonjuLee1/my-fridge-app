# 🧊 My Fridge App

냉장고 재료를 관리하고, 보유한 재료로 만들 수 있는 레시피를 추천해주는 웹 애플리케이션입니다.

## 주요 기능

- 냉장고 재료 추가 / 수정 / 삭제 (이모지 피커 포함)
- 유통기한 관리 및 만료 임박 알림
- 카테고리별 필터링 및 재료 검색
- 보유 재료 기반 레시피 추천 (Spoonacular API)
- 레시피 상세 정보 및 조리 순서 제공

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | React 19, TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| 클라이언트 상태 | Zustand + localStorage 영속성 |
| 서버 상태 | TanStack React Query v5 |
| 폼 | React Hook Form + Zod |
| 라우팅 | React Router v7 |
| 테스트 | Vitest, React Testing Library |
| 빌드 | Vite |

## 기술적 결정

### 상태 관리 분리 전략
서버 상태와 클라이언트 상태를 명확히 분리했습니다.
- **Zustand** — 재료 목록 (클라이언트 상태, localStorage 영속성)
- **React Query** — 레시피 데이터 (서버 상태, 5분 캐시, 중복 요청 방지)

단일 전역 스토어로 통합하는 대신 역할에 맞는 도구를 선택해 불필요한 복잡도를 줄였습니다.

### API 보안
Spoonacular API Key를 Vite 개발 서버 프록시로 서버사이드에서 주입합니다.
`VITE_` 접두사를 사용하지 않아 클라이언트 번들에 키가 노출되지 않습니다.

### 성능 최적화
- `React.lazy` + `Suspense`로 라우트 단위 코드 스플리팅
- `React.memo`로 리스트 아이템 불필요한 리렌더 방지
- `useCallback`으로 핸들러 참조 안정화

### API 호출 보호
무료 플랜의 호출 한도를 고려해 클라이언트 수준의 중복 호출을 방지했습니다.
- 에러 시 다시 시도 버튼: fetching 중 비활성화
- 레시피 카드: 상세 정보 로딩 중 추가 클릭 무시

### 접근성 (A11y)
- `useFocusTrap` 커스텀 훅으로 모달 내 키보드 포커스 트랩
- 모달 열림 시 배경 스크롤 방지
- `aria-live="polite"`로 로딩 / 에러 / 완료 상태를 스크린 리더에 알림
- `role="dialog"`, `aria-modal`, `aria-labelledby` 적용

### 에러 처리
`ErrorBoundary`를 페이지 단위로 적용해 한 페이지의 런타임 에러가 전체 앱에 영향을 주지 않도록 격리했습니다.

## 테스트 전략

계층별로 관심사를 분리해 테스트를 작성했습니다.

| 계층 | 파일 | 내용 |
|------|------|------|
| 순수 함수 | `constants.test.ts`, `recipes.test.ts` | 입출력 검증, mock 없음 |
| 스토어 | `useIngredientStore.test.ts` | 상태 변화 검증 |
| 컴포넌트 | `AddModal.test.tsx`, `IngredientCard.test.tsx`, `ErrorBoundary.test.tsx` | 사용자 인터랙션 + UI 결과 |
| 커스텀 훅 | `useRecipesByIngredients.test.tsx` | API mock + 비동기 상태 |
| 페이지 | `RecipePage.test.tsx` | 훅 mock + UI 분기 검증 |

## 시작하기

```bash
git clone https://github.com/YOUR_USERNAME/my-fridge-app.git
cd my-fridge-app
npm install

# 환경변수 설정
cp .env.example .env
# .env 파일에 Spoonacular API 키 입력
# 발급: https://spoonacular.com/food-api

npm run dev
```

## 테스트 실행

```bash
npm run test:run   # 전체 실행 (CI용)
npm run test       # watch 모드 (개발 중)
npm run test:ui    # 브라우저 UI로 확인
```
