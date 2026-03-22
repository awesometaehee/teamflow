export default function LoginPage() {
  return (
    <section className="mx-auto grid max-w-4xl gap-6 md:grid-cols-[1fr_420px]">
      <div className="rounded-[28px] border border-[var(--color-line)] bg-[rgba(255,255,255,0.7)] p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-soft)]">
          Login Placeholder
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em]">
          내부 사용자 로그인 화면은 Phase 1에서 연결된다.
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--color-ink-soft)]">
          현재는 라우트와 레이아웃만 먼저 준비한 상태다. 다음 단계에서 실제 폼, 유효성 검사, 로그인 API 연동을 구현한다.
        </p>
      </div>

      <div className="rounded-[28px] border border-[var(--color-line)] bg-[var(--color-surface-strong)] p-8 shadow-[0_18px_60px_rgba(16,24,47,0.08)]">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--color-ink-soft)]">Email</label>
            <input
              disabled
              placeholder="alice@example.com"
              className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--color-ink-soft)]">Password</label>
            <input
              disabled
              placeholder="••••••••"
              className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none"
            />
          </div>
          <button
            disabled
            className="w-full rounded-2xl bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-white opacity-70"
          >
            Sign In
          </button>
        </div>
      </div>
    </section>
  );
}
