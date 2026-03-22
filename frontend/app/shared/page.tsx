export default function SharedPage() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[32px] border border-[var(--color-line)] bg-[var(--color-surface-strong)] p-8 shadow-[0_20px_70px_rgba(16,24,47,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-soft)]">
          Shared
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em]">
          공유 태스크 화면은 담당자와 공유 대상을 보여주는 허브가 된다.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-[var(--color-ink-soft)]">
          Phase 4에서 나에게 할당된 일과 공유된 일을 구분해 보여주는 실제 리스트를 이 라우트에 연결한다.
        </p>
      </div>

      <div className="rounded-[32px] border border-[var(--color-line)] bg-[rgba(255,255,255,0.72)] p-8">
        <div className="rounded-3xl border border-dashed border-[var(--color-line)] px-6 py-10 text-sm leading-7 text-[var(--color-ink-soft)]">
          현재는 기본 페이지 렌더링과 네비게이션 연결만 완료된 상태다.
        </div>
      </div>
    </section>
  );
}
