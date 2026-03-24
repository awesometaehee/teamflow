"use client";

import type { TaskFilter } from "@/types/task";

const filterOptions: Array<{ value: TaskFilter; label: string }> = [
  { value: "today", label: "오늘" },
  { value: "upcoming", label: "예정" },
  { value: "all", label: "전체" },
  { value: "done", label: "완료" },
];

type FilterTabsProps = {
  activeFilter: TaskFilter;
  onChange: (filter: TaskFilter) => void;
};

export function FilterTabs({ activeFilter, onChange }: FilterTabsProps) {
  return (
    <div className="inline-flex rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] p-1.5 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
      {filterOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={
            option.value === activeFilter
              ? "rounded-full bg-[var(--color-surface-strong)] px-4 py-2.5 font-semibold text-[var(--color-accent-strong)] shadow-[0_10px_22px_rgba(0,107,255,0.16)]"
              : "px-4 py-2.5 text-[var(--color-ink-soft)] transition hover:text-[var(--color-ink)]"
          }
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
