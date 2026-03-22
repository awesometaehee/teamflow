"use client";

import { FormEvent, useState } from "react";

type QuickAddBarProps = {
  onCreate: (title: string) => Promise<void>;
};

export function QuickAddBar({ onCreate }: QuickAddBarProps) {
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage("할 일 제목을 입력해 주세요.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await onCreate(trimmedTitle);
      setTitle("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "태스크를 만들지 못했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[28px] border border-[var(--color-line)] bg-[var(--color-surface-strong)] p-5 shadow-[0_18px_60px_rgba(16,24,47,0.08)]"
    >
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="빠르게 추가할 할 일을 입력하고 Enter를 누르세요"
          className="min-w-0 flex-1 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent)]"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Adding..." : "Quick Add"}
        </button>
      </div>

      {errorMessage ? (
        <p className="mt-3 text-sm text-[#9f1239]">{errorMessage}</p>
      ) : (
        <p className="mt-3 text-sm text-[var(--color-ink-soft)]">
          제목만 입력하면 바로 TODO 상태로 생성됩니다.
        </p>
      )}
    </form>
  );
}
