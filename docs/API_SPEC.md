# API 명세 (services 레이어)

> 프론트가 호출하는 유일한 데이터 인터페이스는 `src/services/`입니다. 이 문서는 그 함수들의 입력·출력·에러를 정의합니다.
> 별도 REST API는 없습니다. 내부적으로는 Supabase(`from().select()`, `rpc()`)를 호출합니다.
> 스키마·RPC 원본은 `docs/DB_DESIGN.md`, 백엔드 규칙은 `docs/BACKEND.md`를 따릅니다.
> 상태: **초안 (v0.2)** — 이메일 인증·신규 파일·Auth 에러 코드 확정, 나머지는 프론트 리뷰 후 확정. 확정 전까지 프론트는 이 타입대로 `src/mocks/`를 만들어 개발합니다.

## 0. 공통 규칙

- 반환 객체의 필드는 **camelCase**입니다 (DB의 snake_case는 services에서 변환).
- 이미지는 Storage 경로가 아니라 **공개 URL**(`string | null`)로 반환합니다.
- 가격은 원 단위 정수(`number`)입니다. 화면 표시용 합계는 services가 계산해 주지만, **실제 결제 금액은 DB(`create_order`)가 계산**합니다.
- 실패 시 `AppError`를 던집니다 (`error.code`로 분기, 메시지 변환은 `src/constants/error-messages.ts`).
- 조회 함수에서 대상이 없으면 에러가 아니라 `null`을 반환합니다.
- "호출 위치" — `서버`: 서버 컴포넌트에서 호출 가능, `클라이언트`: `'use client'` 컴포넌트에서 호출.

## 1. 공용 타입

```ts
// src/types/app.ts (백엔드가 작성, 프론트는 import만)

type ProductStatus = 'on_sale' | 'sold_out';          // hidden은 조회되지 않음
type OrderStatus = 'pending' | 'paid' | 'cancelled';

type Artist = {
  id: number;
  name: string;          // 'ORBIT:ON'
  nameKo: string;        // '오르빗온'
  slug: string;          // 'orbit-on'
  logoUrl: string | null;
  themeColor: string | null;
};

type Category = {
  id: number;
  name: string;          // '앨범'
  slug: string;          // 'album'
};

type ProductSummary = {
  id: number;
  name: string;
  price: number;                 // 기본가 (옵션 추가금 제외)
  status: ProductStatus;
  isSoldOut: boolean;            // status === 'sold_out' 이거나 모든 옵션 재고 0
  thumbnailUrl: string | null;
  artist: Pick<Artist, 'slug' | 'name' | 'nameKo'>;
  category: Pick<Category, 'slug' | 'name'>;
};

type Variant = {
  id: number;
  optionName: string;            // '리온', 'M', 'A버전', '기본'
  extraPrice: number;
  price: number;                 // 상품 기본가 + extraPrice
  stock: number;
  maxPerUser: number | null;     // null = 무제한
  isSoldOut: boolean;            // stock === 0
};

type ProductDetail = ProductSummary & {
  description: string | null;
  imageUrls: string[];           // 상세 이미지 (sort_order 순)
  variants: Variant[];           // 1개 이상. 옵션 없는 상품은 optionName '기본' 1개
  hasOptions: boolean;           // variants가 '기본' 1개뿐이면 false → 옵션 선택 UI 숨김
};

type CartItem = {
  variantId: number;
  quantity: number;
  product: Pick<ProductSummary, 'id' | 'name' | 'thumbnailUrl'>;
  optionName: string;
  unitPrice: number;             // 현재 가격 (기본가 + 추가금)
  stock: number;
  maxPerUser: number | null;
  isAvailable: boolean;          // 판매 중이고 재고 >= quantity
};

type Cart = {
  items: CartItem[];
  totalQuantity: number;         // 헤더 뱃지용
  totalPrice: number;            // 표시용 (isAvailable 항목만 합산)
};

type OrderItem = {
  variantId: number;
  productName: string;           // 주문 당시 스냅샷
  optionName: string;            // 주문 당시 스냅샷
  unitPrice: number;             // 주문 당시 스냅샷
  quantity: number;
};

type OrderSummary = {
  id: string;                    // uuid
  status: OrderStatus;
  totalPrice: number;
  itemCount: number;
  firstItemName: string;         // 목록 표시용: "아크릴 키링 외 2건"
  createdAt: string;             // ISO
};

type Order = OrderSummary & {
  recipientName: string;
  recipientPhone: string;
  address: string;
  paidAt: string | null;
  cancelledAt: string | null;
  items: OrderItem[];
};

type Profile = {
  id: string;
  email: string;
  nickname: string;
  phone: string | null;
};
```

## 2. 카탈로그 — `services/products.ts`

| 함수 | 입력 | 반환 | 호출 위치 | 에러 |
|---|---|---|---|---|
| `getArtists()` | - | `Artist[]` (sort_order 순) | 서버 | - |
| `getArtist(slug)` | `string` | `Artist \| null` | 서버 | - |
| `getCategories()` | - | `Category[]` (sort_order 순, 7개) | 서버 | - |
| `getProducts(params?)` | `ProductQuery` | `{ items: ProductSummary[]; total: number }` | 서버 | - |
| `getProduct(id)` | `number` | `ProductDetail \| null` | 서버 | - |

```ts
type ProductQuery = {
  artistSlug?: string;
  categorySlug?: string;
  sort?: 'latest' | 'price_asc' | 'price_desc';   // 기본 'latest'
  limit?: number;                                 // 기본 20
  offset?: number;                                // 기본 0
};
```

- 화면 매핑: 메인(`getArtists`, `getProducts({ limit: 8 })`), 아티스트 페이지(`getArtist` + `getProducts({ artistSlug })`), 카테고리 페이지(`getProducts({ categorySlug })`), 상품 상세(`getProduct`).
- hidden 상품, 없는 id → `null` (상세 페이지는 `notFound()` 처리).

## 3. 인증·회원 — `services/auth.ts`

| 함수 | 입력 | 반환 | 호출 위치 | 에러 |
|---|---|---|---|---|
| `signUp(input)` | `{ email; password; nickname }` | `void` | 클라이언트 | `EMAIL_ALREADY_EXISTS`, `WEAK_PASSWORD` |
| `signIn(input)` | `{ email; password }` | `void` | 클라이언트 | `INVALID_CREDENTIALS` |
| `signOut()` | - | `void` | 클라이언트 | - |
| `getProfile()` | - | `Profile \| null` (비로그인 시 null) | 서버/클라이언트 | - |
| `updateProfile(input)` | `{ nickname?; phone? }` | `Profile` | 클라이언트 | `NOT_AUTHENTICATED` |
| `onAuthChange(cb)` | `(profile: Profile \| null) => void` | `() => void` (구독 해제) | 클라이언트 | - |

- 로그인 직후 비회원 장바구니 병합(`mergeGuestCart`)은 **services 내부에서 자동 처리**합니다. 프론트는 앱 최상단 클라이언트 Provider에서 `onAuthChange`를 한 번 구독만 하면 됩니다.
- 세션 갱신은 `src/proxy.ts`(Next.js 16의 Proxy, 구 middleware)에서 처리 — 백엔드 담당.
- **이메일 인증 OFF**: 가입 즉시 로그인 상태가 됩니다 (`signUp` 성공 = 로그인 완료). 운영 전 재검토.

## 4. 장바구니 — `services/cart.ts`

로그인 여부와 관계없이 **같은 함수**를 호출합니다. 비로그인이면 localStorage(`guest_cart`), 로그인이면 `cart_items` 테이블을 사용합니다. 모든 항목은 `variantId`로 식별합니다.

| 함수 | 입력 | 반환 | 호출 위치 | 에러 |
|---|---|---|---|---|
| `getCart()` | - | `Cart` | 클라이언트 | - |
| `addToCart(variantId, quantity)` | `number, number` | `Cart` | 클라이언트 | `OUT_OF_STOCK`, `PURCHASE_LIMIT_EXCEEDED`, `UNAVAILABLE_ITEM` |
| `updateQuantity(variantId, quantity)` | `number, number` (1 이상) | `Cart` | 클라이언트 | `OUT_OF_STOCK`, `PURCHASE_LIMIT_EXCEEDED` |
| `removeFromCart(variantId)` | `number` | `Cart` | 클라이언트 | - |
| `mergeGuestCart()` | - | `void` | (내부용) | - |

- `addToCart`: 이미 담긴 옵션이면 수량을 **더합니다**.
- 담기·수량 변경 시 재고/구매 제한 체크는 **안내용**입니다. 비회원은 `maxPerUser`와 장바구니 수량만 비교하고, 회원은 지난 결제 수량까지 포함합니다. 최종 검증은 `payOrder`가 합니다.
- 변경 함수는 갱신된 `Cart` 전체를 반환하므로, 별도로 `getCart()`를 다시 부를 필요가 없습니다.
- 숨김 처리된 상품이 비회원 장바구니에 남아 있으면 `getCart()`에서 자동으로 제외합니다.
- `mergeGuestCart`: `merge_cart` RPC 호출. 성공 시 localStorage 비움, 실패 시 유지 (다음 로그인 때 재시도).

## 5. 주문·결제 — `services/orders.ts`

| 함수 | 입력 | 반환 | 호출 위치 | 에러 |
|---|---|---|---|---|
| `createOrder(input)` | `{ recipientName; recipientPhone; address }` | `string` (orderId) | 클라이언트 | `NOT_AUTHENTICATED`, `CART_EMPTY`, `UNAVAILABLE_ITEM`, `PURCHASE_LIMIT_EXCEEDED` |
| `payOrder(orderId)` | `string` | `void` | 클라이언트 | `NOT_AUTHENTICATED`, `INVALID_ORDER`, `PURCHASE_LIMIT_EXCEEDED`, `OUT_OF_STOCK` |
| `cancelOrder(orderId)` | `string` | `void` | 클라이언트 | `NOT_AUTHENTICATED`, `INVALID_ORDER`, `ALREADY_CANCELLED` |
| `getOrders()` | - | `OrderSummary[]` (최신순) | 서버/클라이언트 | `NOT_AUTHENTICATED` |
| `getOrder(orderId)` | `string` | `Order \| null` (남의 주문이면 null) | 서버/클라이언트 | `NOT_AUTHENTICATED` |

- `createOrder`는 **현재 장바구니 전체**를 주문합니다 (선택 주문 없음).
- 주문서 "결제하기" 흐름: `createOrder` → `payOrder` → `/orders/{id}` (결제 완료) 이동.
- `payOrder`가 실패하면 주문은 `pending`으로 남고, 장바구니도 그대로 유지됩니다. 주문 상세에서 "다시 결제" 또는 "취소"를 할 수 있습니다.
- 결제 성공 시 결제된 옵션만 장바구니에서 빠집니다.
- 취소: `pending` → 상태만 변경, `paid` → 재고 복구. 버튼 노출 조건은 `status !== 'cancelled'`.

## 6. 에러 코드 — `services/errors.ts`

```ts
class AppError extends Error {
  code: AppErrorCode;
  detail?: string;    // OUT_OF_STOCK, PURCHASE_LIMIT_EXCEEDED → 문제된 variantId
}
```

| 코드 | 발생 함수 | 화면 처리 |
|---|---|---|
| `NOT_AUTHENTICATED` | 주문·프로필 전체 | 로그인 페이지로 이동 (`?next=` 현재 경로) |
| `CART_EMPTY` | createOrder | "장바구니가 비어 있어요" → 장바구니로 |
| `UNAVAILABLE_ITEM` | createOrder, addToCart | 판매 중지·재고 부족 상품 포함 → 장바구니 확인 유도 |
| `PURCHASE_LIMIT_EXCEEDED` | createOrder, payOrder, addToCart, updateQuantity | 옵션당 구매 한도 초과 (`detail` = variantId) |
| `OUT_OF_STOCK` | payOrder, addToCart, updateQuantity | 품절 (`detail` = variantId) |
| `INVALID_ORDER` | payOrder, cancelOrder | 결제/취소할 수 없는 주문 |
| `ALREADY_CANCELLED` | cancelOrder | 이미 취소된 주문 |
| `INVALID_CREDENTIALS` | signIn | 이메일 또는 비밀번호 오류 |
| `EMAIL_ALREADY_EXISTS` | signUp | 이미 가입된 이메일 |
| `WEAK_PASSWORD` | signUp | 비밀번호 규칙 미달 |
| `UNKNOWN` | 전체 | "잠시 후 다시 시도해주세요" |

`INVALID_CREDENTIALS`, `EMAIL_ALREADY_EXISTS`, `WEAK_PASSWORD`는 RPC가 아니라 Supabase Auth 에러를 변환한 코드입니다.

## 7. 페이지별 사용 함수

| 페이지 | 담당 | 사용 함수 |
|---|---|---|
| 공통 헤더 | jina | `getProfile`, `onAuthChange`, `getCart().totalQuantity`, `getArtists`, `getCategories` |
| 로그인 / 회원가입 | jina | `signIn`, `signUp` |
| 메인 | chungman | `getArtists`, `getProducts` |
| 아티스트 `/artists/[slug]` | chungman | `getArtist`, `getProducts({ artistSlug })` |
| 카테고리 `/category/[slug]` | chungman | `getCategories`, `getProducts({ categorySlug })` |
| 상품 상세 `/products/[id]` | chungman | `getProduct`, `addToCart` (`useCart` 경유) |
| 장바구니 | sungho | `getCart`, `updateQuantity`, `removeFromCart` |
| 주문서 | sungho | `getCart`, `getProfile`, `createOrder`, `payOrder` |
| 결제 완료 / 주문 상세 | sungho | `getOrder`, `payOrder`, `cancelOrder` |
| 주문 내역 | sungho | `getOrders` |
| 마이페이지 | sungho | `getProfile`, `updateProfile` |

## 8. 미확정 사항 (프론트·팀 확인 필요)

1. **`UNAVAILABLE_ITEM`의 detail**: 현재 RPC는 어떤 상품이 문제인지 알려주지 않습니다. 필요하면 `create_order`에 `detail = variant_id` 추가.
2. **주문서 배송 정보 기본값**: `profiles.phone`만 있고 주소는 저장하지 않습니다. 주소 저장이 필요하면 배송지 테이블 추가 (현재 범위 밖).
3. **목록 페이지네이션**: limit/offset 방식(더보기 버튼)으로 충분한지.
4. **`sold_out` 표시**: `status`는 대시보드에서 수동 관리. 재고가 0이 되어도 자동 변경되지 않으므로 `isSoldOut`(재고 기반)을 화면 기준으로 사용.
