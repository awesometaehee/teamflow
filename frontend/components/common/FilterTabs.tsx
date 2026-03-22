"use client";

import type { TaskFilter } from "@/types/task";

const filterOptions: Array<{ value: TaskFilter; label: string }> = [
  { value: "today", label: "Today" },
  { value: "upcoming", label: "Upcoming" },
  { value: "all", label: "All" },
  { value: "done", label: "Done" },
];

type FilterTabsProps = {
  activeFilter: TaskFilter;
  onChange: (filter: TaskFilter) => void;
};

export function FilterTabs({ activeFilter, onChange }: FilterTabsProps) {
  return (
    <div className="inline-flex rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] p-1 text-sm">
      {filterOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={
            option.value === activeFilter
              ? "rounded-full bg-[var(--color-surface-strong)] px-4 py-2 font-semibold text-[var(--color-ink)]"
              : "px-4 py-2 text-[var(--color-ink-soft)] transition hover:text-[var(--color-ink)]"
          }
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
