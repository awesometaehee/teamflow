const placeholderItems = [
  "오늘 할 일 필터와 리스트 UI",
  "빠른 등록 후 즉시 반영되는 흐름",
  "상태, 제목, 마감일 중심의 한 줄 구성",
];

export default function MyTasksPage() {
  return (
    <section className="rounded-[32px] border border-[var(--color-line)] bg-[rgba(255,255,255,0.78)] p-8 shadow-[0_24px_80px_rgba(16,24,47,0.08)]">
      <div className="flex flex-col gap-3 border-b border-[var(--color-line)] pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-ink-soft)]">
            My Tasks
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">Phase 2에서 목록 화면을 채운다.</h1>
        </div>
        <div className="inline-flex rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] p-1 text-sm">
          <span className="rounded-full bg-[var(--color-surface-strong)] px-4 py-2">Today</span>
          <span className="px-4 py-2 text-[var(--color-ink-soft)]">Upcoming</span>
          <span className="px-4 py-2 text-[var(--color-ink-soft)]">All</span>
          <span className="px-4 py-2 text-[var(--color-ink-soft)]">Done</span>
        </div>
      </div>
      <ul className="mt-6 space-y-3">
        {placeholderItems.map((item) => (
          <li
            key={item}
            className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-5 py-4 text-sm leading-6 text-[var(--color-ink-soft)]"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
