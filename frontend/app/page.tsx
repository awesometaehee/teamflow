const highlights = [
  "빠른 입력 중심의 개인 태스크 관리",
  "가벼운 공유 흐름과 최소 협업 기능",
  "Spring Boot API와 연결되는 Next.js App Router 베이스라인",
];

export default function HomePage() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
      <div className="rounded-[32px] border border-[var(--color-line)] bg-[var(--color-surface-strong)]/90 p-8 shadow-[0_24px_80px_rgba(16,24,47,0.08)] backdrop-blur">
        <p className="mb-3 inline-flex rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-sm font-semibold text-[var(--color-accent)]">
          Phase 0 Frontend Baseline
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.03em] md:text-5xl">
          TeamFlow는 몇 초 안에 할 일을 적고, 필요한 사람과만 자연스럽게 공유하는 MVP를 목표로 한다.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--color-ink-soft)]">
          현재 화면은 Next.js App Router, 공통 레이아웃, 환경 변수 구조가 연결된 초기 홈 화면이다.
        </p>
      </div>

      <div className="rounded-[32px] border border-[var(--color-line)] bg-[rgba(255,255,255,0.72)] p-6 shadow-[0_20px_70px_rgba(16,24,47,0.08)] backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-ink-soft)]">
          Foundation
        </p>
        <ul className="mt-4 space-y-3">
          {highlights.map((highlight) => (
            <li
              key={highlight}
              className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm leading-6"
            >
              {highlight}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
