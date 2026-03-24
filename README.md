# TeamFlow

개인 중심의 빠른 할 일 입력과 가벼운 협업 흐름을 제공하는 MVP 웹앱이다. 복잡한 프로젝트 관리 기능 대신, 빠른 등록, 오늘 기준 조회, 공유, 댓글, 알림을 최소 구성으로 제공한다.

## 기술 스택

- Backend: Spring Boot `4.0.4`, Java `20`, Spring Data JPA, H2, Validation
- Frontend: Next.js `14.2.35`, React `18.3.1`, TypeScript, Tailwind CSS
- 데이터: H2 in-memory, `data.sql` 샘플 데이터 주입

## 현재 구현 범위

- 로그인
- 내 태스크 필터 조회
- 태스크 생성/상세/수정/삭제/상태 변경
- 담당자/공유 대상 관리
- 댓글 등록/조회
- 알림 조회/읽음 처리

## 현재 비범위

- OAuth/SSO
- JWT/서버 세션 기반 정식 인증
- WebSocket 기반 실시간 푸시
- 프로젝트/에픽/서브태스크 구조
- 고급 권한 엔진

## 실행 환경

- Java 20
- Node.js 18.17+
- npm

## 실행 방법

### Backend

```bash
cd /Users/imtaehui/Documents/teamflow
./gradlew bootRun
```

- 기본 주소: `http://localhost:8080`
- H2 콘솔: `http://localhost:8080/h2-console`

### Frontend

```bash
cd /Users/imtaehui/Documents/teamflow/frontend
npm install
npm run dev
```

- 기본 주소: `http://localhost:3000`
- API 베이스 URL 기본값: `http://localhost:8080`
- 필요 시 `frontend/.env.local` 생성:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## 검증 명령

### Backend Test

```bash
cd /Users/imtaehui/Documents/teamflow
./gradlew test
```

### Frontend Build

```bash
cd /Users/imtaehui/Documents/teamflow/frontend
npm run build
npx tsc --noEmit
```

`npx tsc --noEmit`는 이 저장소에서 `.next/types` 생성 후 한 번 더 실행하면 안정적으로 통과한다.

## 샘플 계정

- Alice: `alice@example.com / password123`
- Bob: `bob@example.com / password123`
- Charlie: `charlie@example.com / password123`

## 샘플 데이터 기준

샘플 데이터는 [`data.sql`](/Users/imtaehui/Documents/teamflow/src/main/resources/data.sql)로 일원화되어 있다.

- 사용자 3명
- 개인 태스크
- 담당자 지정 태스크
- 공유 태스크
- 완료 태스크
- 댓글 샘플
- 알림 샘플

## 수동 검증 시나리오

### 시나리오 1. 로그인과 빠른 등록

1. `/login`에서 Alice 계정으로 로그인한다.
2. 홈 `/`에서 Quick Add로 제목만 입력해 태스크를 만든다.
3. `/my-tasks` 또는 홈 리스트에 새 태스크가 보이는지 확인한다.

### 시나리오 2. 공유와 댓글

1. Alice로 생성한 태스크 상세를 연다.
2. 담당자 또는 공유 대상에 Bob/Charlie를 추가한다.
3. Charlie로 로그인해 `/shared`에서 공유된 태스크를 확인한다.
4. 상세 패널에서 댓글을 남긴다.

### 시나리오 3. 알림

1. 담당자 지정 또는 변경 시 대상 사용자에게 `ASSIGNED` 알림이 생기는지 확인한다.
2. 공유 추가 시 대상 사용자에게 `SHARED` 알림이 생기는지 확인한다.
3. 댓글 작성 시 작성자를 제외한 관련 사용자에게 `COMMENTED` 알림이 생기는지 확인한다.
4. 상단 알림 패널에서 읽음 처리 후 상태가 바뀌는지 확인한다.

### 시나리오 4. 권한 차단

1. 관련 없는 사용자로 태스크 상세 조회를 시도한다.
2. 작성자가 아닌 사용자가 삭제 또는 공유 편집을 시도한다.
3. 권한 없는 경우 `403`이 반환되는지 확인한다.

## API 메모

- 로그인은 `POST /api/auth/login`으로 처리한다.
- 현재 MVP에서는 백엔드 태스크/공유/댓글/알림 API가 `X-User-Id` 헤더로 사용자 컨텍스트를 구분한다.
- 프론트는 로그인 세션의 `user.id`를 읽어 이 헤더를 자동으로 붙인다.
- 컨트롤러 변경 시 OpenAPI 문서는 [`openapi.yml`](/Users/imtaehui/Documents/teamflow/openapi.yml)에 함께 반영한다.
