## 2026-10-07 | mock → 실제 services 교체

- 작업자: SUNGHO
- 브랜치: dev/sungho
- 관련 이슈 / PR: 없음
- 에이전트 사용: O (Claude Code)

### 요청한 작업
- develop에 올라온 `src/services/`, `src/types/app.ts`로 장바구니·주문·마이페이지의 mock 교체

### 한 일
- `src/hooks/useCart.ts`: `@/services/cart` 사용. `useAuth()`로 사용자 변경(로그인·로그아웃)을 감지해 장바구니 다시 불러오기. 첫 로드 실패 시 빈 장바구니
- `checkout`: `AuthProvider` 프로필로 받는 분·연락처 기본값, 비로그인 시 로그인 안내, 결제 후 장바구니 새로고침
- `orders`, `orders/[id]`(`OrderDetail`): 비로그인 시 로그인 안내, 조회 실패 메시지 처리, 목록에 "외 N건" 표시(services는 첫 상품명만 반환), 결제·취소 후 장바구니 새로고침
- `mypage`: `AuthProvider` 프로필 사용, `updateProfile`(빈 연락처는 null), 로그아웃 버튼(모바일에서는 헤더 로그아웃이 숨겨짐)
- `src/components/order/LoginRequired.tsx` 추가 (`/login?next=` 이동)
- 장바구니 개발용 "샘플 담기" 버튼과 `src/mocks/` 삭제
- `npm run build`, `tsc`, `eslint` 통과 / 비회원 장바구니(실제 DB 상품) 표시·수량 변경·삭제, 비로그인 시 주문서·주문 내역·주문 상세·마이페이지 로그인 안내 확인

### 결정 사항 / 이유
- 로그인 시 비회원 장바구니 병합은 `onAuthChange`가 `mergeGuestCart` 후 프로필을 넘기므로, `useCart`는 프로필 id가 바뀔 때 `refresh()`만 하면 됨 (`layout.tsx` 수정 불필요)
- 프로필 기본값은 effect에서 setState하지 않고 "사용자가 고친 값 ?? 프로필 값"으로 계산

### 멈춘 지점 / 보고한 내용
- 로그인 상태 흐름(병합·주문·결제·취소·프로필 수정)은 테스트 계정이 필요해서 에이전트가 확인하지 못함 → 사람이 확인 필요
- `services/cart.ts`(jin 담당): 비회원 장바구니에서 수량을 바꾸면 `setQuantity`가 항목을 지우고 끝에 다시 붙여서 목록 순서가 바뀜
- 헤더 카트 뱃지는 여전히 `0` 고정 (`Header.tsx`, jina 담당)

### 남은 일 / TODO
- 로그인 상태 전체 흐름 수동 테스트
- 헤더 뱃지 연동 (jina와 협의)

## 2026-10-07 | 주문서·주문 상세·주문 내역·마이페이지 + 에러 메시지 상수

- 작업자: SUNGHO
- 브랜치: dev/sungho
- 관련 이슈 / PR: 없음
- 에이전트 사용: O (Claude Code)

### 요청한 작업
- 담당 페이지(장바구니, 주문서, 결제 완료, 주문 내역, 마이페이지) 완성

### 한 일
- `src/app/(shop)/checkout/page.tsx`: 배송 정보 입력(프로필로 이름·연락처 기본값), 검증, `createOrder` → `payOrder` → `/orders/{id}` 이동
- `src/app/(shop)/orders/page.tsx`: 주문 내역 목록 (상태 배지, 날짜, "상품명 외 N건")
- `src/app/(shop)/orders/[id]/page.tsx` + `src/components/order/OrderDetail.tsx`: 결제 완료/대기/취소 상태별 화면, 다시 결제·주문 취소
- `src/app/(shop)/mypage/page.tsx`: 프로필 확인·수정, 주문 내역 링크
- `src/components/order/OrderStatusBadge.tsx` 추가
- `src/constants/error-messages.ts`: API_SPEC 6장 에러 코드별 메시지, 장바구니 페이지도 이 상수 사용
- `src/mocks/orders.ts`, `src/mocks/errors.ts`: `services/orders.ts`·`auth.ts`(프로필)·`errors.ts`의 임시 구현 (localStorage)
- `npm run build`, `tsc`, `eslint` 통과 / 브라우저에서 장바구니 → 주문서 검증 → 결제 → 주문 상세 → 취소 → 주문 내역, 없는 주문 ID 접근 확인

### 결정 사항 / 이유
- 이 프로젝트는 `cacheComponents: true`라서 라우트 파라미터를 읽는 컴포넌트는 `<Suspense>` 안에 있어야 빌드됨
- 서버 컴포넌트에서 `await params` 후 클라이언트 컴포넌트에 넘기는 방식은 빌드는 되지만 직접 URL 접속·새로고침 시 Suspense 안쪽이 하이드레이션되지 않고 스켈레톤에 머무는 문제가 있었음 → 페이지는 동기 컴포넌트로 `<Suspense>`만 두고, 클라이언트 컴포넌트에서 `useParams()`를 쓰는 방식으로 변경
- 결제 실패 시 주문은 결제 대기로 두고 주문 상세로 이동 (API_SPEC 5장: 주문 상세에서 다시 결제/취소)
- 비로그인(`NOT_AUTHENTICATED`) 처리는 `/login?next=` 이동으로 연결만 해 둠 (로그인 페이지는 jina 담당)

### 멈춘 지점 / 보고한 내용
- 헤더 카트 뱃지가 `0`으로 하드코딩되어 있음 (`src/components/layout/Header.tsx`, jina 담당). `CartBadge`(client) 분리 후 `useCart().totalQuantity` 연결 협의 필요
- 로그인 시 비회원 장바구니 병합: services의 `mergeGuestCart`는 백엔드 자동 처리지만, 로그인 후 `useCart().refresh()` 호출과 `onAuthChange` Provider는 services 머지 후 jina와 협의

### 남은 일 / TODO
- `services/cart.ts`, `orders.ts`, `auth.ts`, `src/types/app.ts` 머지 후 mock 제거 및 import 교체 (`useCart.ts`, checkout/orders/mypage 페이지, `error-messages.ts`)
- 로그아웃 버튼(마이페이지)은 `signOut` 연결 후 추가
- 상품 이미지 연결 (현재 thumbnailUrl 없음 → "이미지 없음" 표시)
- 모바일 화면 확인
