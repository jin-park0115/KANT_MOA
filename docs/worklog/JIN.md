## 2026-10-07 | 백엔드 B1~B6 (마이그레이션·seed·services)

- 작업자: jin
- 브랜치: dev/jin
- 관련 이슈 / PR: - / -
- 에이전트 사용: O (Claude Code)

### 요청한 작업
- 프론트가 mock 없이 실제 데이터로 작업할 수 있도록 백엔드 전체 완료

### 한 일
- `supabase/migrations/` 7개 (테이블, 트리거, RLS, merge_cart, 주문 RPC, 실행 권한, Storage 버킷) + `supabase/seed.sql` → `db push --include-seed` (jin 실행)
- `src/types/database.ts` 생성, `src/lib/supabase/client.ts`
- `src/services/` products, auth, cart, orders, storage 작성
- 실제 DB 검증: 카탈로그 13항목, BACKEND.md 10장 시나리오 포함 22항목 전부 통과

### 결정 사항 / 이유
- 카탈로그는 세션 없는 공개 클라이언트 → 서버/클라이언트 컴포넌트 모두 사용 가능
- 로그인 필요한 함수는 클라이언트 전용, server.ts·proxy.ts는 필요해질 때 추가 (API_SPEC 3장 반영)

### 멈춘 지점 / 보고한 내용
- 이메일 인증이 켜져 있어 테스트 가입 실패 → jin이 대시보드에서 끔

### 남은 일 / TODO
- 브라우저에서 비회원 장바구니(localStorage)·로그인 병합 흐름 확인 (프론트 연동 시)
- Storage 이미지 업로드, DAYLOG·SODAFM theme_color

## 2026-10-07 | 초기 세팅 · API 명세 · 공용 타입(B0)

- 작업자: jin
- 브랜치: dev/jin
- 관련 이슈 / PR: - / -
- 에이전트 사용: O (Claude Code)

### 요청한 작업
- Next.js + Supabase 초기 세팅, 팀원 이름·브랜치 문서 반영
- 백엔드 작업 계획 수립 및 API 명세서 작성
- chungman 요청: 아티스트 배경 이미지 필드 추가
- B0: services 반환 타입 작성

### 한 일
- 프로젝트 생성(Next.js 16.4), Supabase init/link, main·develop·dev/jin 브랜치 생성
- `docs/API_SPEC.md` 작성 (v1.0 확정)
- SETUP/BACKEND/FRONTEND/DB_DESIGN: proxy.ts, auth.ts, app.ts, Auth 에러 코드, 브랜치 규칙 반영
- `artists.hero_image_path` / `Artist.heroImageUrl` 추가, hero 이미지 1920×720 예외 규칙
- `src/types/app.ts`, `src/services/errors.ts` 작성

### 결정 사항 / 이유
- 이메일 인증 OFF (개발 편의, 운영 전 재검토)
- Next.js 16에서 middleware → proxy 이름 변경, `src/proxy.ts` 사용
- errors.ts는 의존성이 없어 B0에 같이 포함 (프론트 error-messages.ts가 AppErrorCode를 import)

### 멈춘 지점 / 보고한 내용
- 없음

### 남은 일 / TODO
- Supabase 대시보드에서 Confirm email 끄기
- DAYLOG, SODAFM theme_color 전달받기
- B1: 테이블·트리거 마이그레이션

이거