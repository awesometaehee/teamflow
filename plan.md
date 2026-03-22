# TeamFlow MVP 개발 계획 (Phase 기반)

## 개발 원칙
- 단순함 > 복잡함
- 명확함 > 추상화
- 사용성 > 기능 수
- 각 Phase는 "실행 가능한 상태"를 유지한 채 다음 단계로 진행

## 기술 스택/운영 기준
- Backend
  - Spring Boot 4.0.4, Java 20 (현재 프로젝트 설정 기준)
  - Spring Data JPA, H2
  - Validation, Global Exception Handler
- Frontend
  - Next.js 14.2.x (App Router), TypeScript
  - React + Tailwind CSS
- API
  - REST + JSON
  - 엔티티 직접 응답 금지, DTO 사용
- 데이터
  - 개발/데모는 H2 in-memory
  - 샘플 데이터로 즉시 테스트 가능 상태 유지
- 품질
  - 기능 단위 테스트(핵심 서비스) + 최소 API 검증
  - README를 실행 기준 문서로 유지

---

## Phase 0. 프로젝트 베이스라인
### 목표
- 백엔드/프론트엔드 실행 기반과 공통 개발 규칙 확정

### 구현 범위
- Backend 기본 구조 생성 (Controller/Service/Repository/DTO 패키지)
- Frontend Next.js App Router 기본 구조 생성
- 공통 코드 스타일/디렉터리 규칙 확정
- 환경 설정 정리 (`application.properties`, FE env)

### 기술 포인트
- Spring Boot 기본 설정 + H2 연결
- Next.js + TypeScript + Tailwind 초기화
- CORS 기본 설정 (개발 환경)

### 완료 기준
- 백엔드/프론트엔드 각각 단독 실행 성공
- 기본 헬스체크 API + 기본 페이지 렌더링 성공

---

## Phase 1. 인증 최소 기능 (로그인만)
### 목표
- 내부 사용자 기준 단순 로그인 완성

### 구현 범위
- `User` 엔티티/리포지토리 생성
- `POST /api/auth/login` 구현
- 로그인 페이지(`/login`) 구현
- 로그인 성공 시 클라이언트 세션 상태 저장(간단 방식)

### 기술 포인트
- 비밀번호 비교는 MVP 단순 방식(평문 또는 단순 해시 중 하나로 통일)
- 인증 방식은 복잡한 토큰 체계 대신 "내부 데모용 경량 세션" 채택
- Validation + 예외 처리(로그인 실패)

### 완료 기준
- 샘플 계정으로 로그인 가능
- 잘못된 계정/비밀번호 시 오류 메시지 표시

---

## Phase 2. 빠른 할 일 등록 + 내 할 일 기본 조회
### 목표
- 핵심 UX: "빠른 입력"과 "내 일 목록 조회" 먼저 완성

### 구현 범위
- `Task` 엔티티/리포지토리/서비스/컨트롤러
- API:
  - `POST /api/tasks`
  - `GET /api/tasks/my?filter=today|upcoming|all|done`
- 프론트:
  - 홈(`/`) 상단 Quick Add 입력창
  - 내 할 일 리스트 기본 UI

### 기술 포인트
- 상태 Enum: TODO, IN_PROGRESS, DONE
- `dueAt`, `completedAt`, `createdAt`, `updatedAt` 처리
- 조회 성능을 위해 "내 태스크" 쿼리 명확화

### 완료 기준
- 제목만으로 태스크 생성 가능
- today/upcoming/all/done 필터 동작
- 리스트에서 상태/제목/마감일 확인 가능

---

## Phase 3. 태스크 상세/수정/삭제 + 상태 변경
### 목표
- 태스크 라이프사이클 완성

### 구현 범위
- API:
  - `GET /api/tasks/{id}`
  - `PUT /api/tasks/{id}`
  - `PATCH /api/tasks/{id}/status`
  - `DELETE /api/tasks/{id}`
- 프론트:
  - 태스크 상세 사이드 패널(드로어)
  - 수정/삭제/상태 변경 UI

### 기술 포인트
- DTO 분리(요청/응답)
- 상태가 DONE으로 바뀌면 `completedAt` 세팅
- 권한 체크 시작(작성자/담당자/공유 대상)

### 완료 기준
- 상세 패널에서 조회/수정/상태 변경 가능
- 작성자만 삭제 가능
- 권한 없는 접근 시 403 반환

---

## Phase 4. 공유 기능 (담당자 + 공유 대상)
### 목표
- 개인 중심 앱에 팀 공유를 자연스럽게 추가

### 구현 범위
- `TaskShare` 엔티티/리포지토리/서비스
- API:
  - `POST /api/tasks/{id}/shares`
  - `DELETE /api/tasks/{id}/shares/{userId}`
  - `GET /api/tasks/shared`
- 프론트:
  - 공유됨 페이지(`/shared`)
  - 상세 패널에서 담당자/공유 대상 편집

### 기술 포인트
- 담당자 1명, 공유 대상 N명
- `unique(task,user)` 제약 적용
- 권한 정책 단순 유지

### 완료 기준
- 특정 사용자에게 공유 추가/삭제 가능
- 나에게 할당된 일, 나에게 공유된 일 조회 가능

---

## Phase 5. 댓글 기능
### 목표
- 협업 최소 단위(코멘트) 완성

### 구현 범위
- `TaskComment` 엔티티/리포지토리/서비스
- API:
  - `POST /api/tasks/{id}/comments`
  - `GET /api/tasks/{id}/comments`
- 프론트:
  - 상세 패널 댓글 리스트/입력 UI
  - 태스크 행에 댓글 수 표시

### 기술 포인트
- 스레드 없음(단일 리스트)
- 댓글 작성 권한: 작성자/담당자/공유 대상
- Validation (`content` 필수)

### 완료 기준
- 댓글 등록/조회 가능
- 권한 없는 사용자 댓글 작성 차단

---

## Phase 6. 기본 알림
### 목표
- 공유 협업 흐름의 피드백 제공

### 구현 범위
- `Notification` 엔티티/리포지토리/서비스
- API:
  - `GET /api/notifications`
  - `PATCH /api/notifications/{id}/read`
- 생성 트리거:
  - 담당자 지정/변경
  - 공유 추가
  - 댓글 작성
- 프론트:
  - 알림 패널 UI
  - 읽음 처리

### 기술 포인트
- 알림 타입 Enum: ASSIGNED, SHARED, COMMENTED
- 실시간(WebSocket) 없이 폴링/재조회 기반

### 완료 기준
- 이벤트 발생 시 알림 생성
- 사용자별 알림 조회/읽음 처리 가능

---

## Phase 7. 샘플 데이터/통합 검증/문서화
### 목표
- 실행 즉시 시연 가능한 MVP 패키지 완성

### 구현 범위
- 샘플 사용자/태스크/공유/댓글/알림 주입
- E2E 시나리오 수동 검증
  - 로그인 → 빠른 등록 → 공유 → 댓글 → 알림 확인
- README 최종화

### 기술 포인트
- `data.sql` 또는 `CommandLineRunner` 중 하나로 일원화
- 로컬 실행 명령어 정리

### 완료 기준
- 클린 실행 후 즉시 데모 가능
- README만으로 팀원이 재현 가능

---

## 프론트엔드 UI 기술 가이드
- 디자인 시스템: Tailwind CSS + CSS 변수
- 테마 컬러(고정)
  - primary: `#4F5BFF`
  - secondary: `#7C6CFF`
  - accent: `#3FA7FF`
  - bg: `#0F1430`
  - bgDeep: `#1B1F4A`
  - text: `#E6E9FF`
  - subtext: `#9AA3C7`
  - muted: `#5F6A9A`
- UI 규칙
  - 리스트 우선, 패널 기반 상세
  - 모달 최소화
  - 클릭 수 최소화(빠른 입력/체크 중심)

## 백엔드 기술 가이드
- 엔티티는 비즈니스 로직 최소 포함, 서비스 계층 중심
- 예외는 도메인별 커스텀 예외 + 전역 핸들러
- API 응답 스키마 일관성 유지 (`data`, `error` 등 포맷 선택 후 고정)
- N+1 우려 구간은 fetch join/쿼리 최적화 적용

## 리스크 및 대응
- 인증 단순화로 인한 확장 제약
  - 대응: 인터페이스 분리로 추후 JWT/세션 고도화 여지 확보
- 권한 체크 누락 위험
  - 대응: 서비스 계층 공통 권한 검증 메서드화
- UI 복잡도 증가 위험
  - 대응: MVP 외 기능 요청은 백로그로 분리
