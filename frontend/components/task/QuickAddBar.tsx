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
      className="rounded-[32px] border border-[var(--color-line)] bg-white p-6 shadow-[0_26px_70px_var(--color-shadow)]"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            빠른 등록
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--color-ink)]">
            한 줄로 먼저 적고, 나중에 세부 내용을 다듬습니다.
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-ink-soft)]">
            워크스페이스 전반에 같은 원칙을 적용합니다. 먼저 기록하고, 그 다음 담당자와 공유 흐름을 정리합니다.
          </p>
        </div>

        <div className="flex w-full max-w-2xl flex-col gap-3 md:flex-row">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="할 일 제목을 입력하고 Enter를 누르세요"
            className="min-w-0 flex-1 rounded-[22px] border border-[var(--color-line)] bg-[var(--color-surface)] px-5 py-4 text-sm outline-none transition focus:border-[var(--color-line-strong)] focus:bg-white"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-[22px] bg-[var(--color-accent)] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(0,107,255,0.24)] transition hover:bg-[var(--color-accent-strong)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "추가 중..." : "태스크 만들기"}
          </button>
        </div>
      </div>

      {errorMessage ? (
        <p className="mt-3 text-sm text-[#9f1239]">{errorMessage}</p>
      ) : (
        <p className="mt-4 text-sm text-[var(--color-ink-soft)]">
          제목만 입력하면 바로 TODO 상태로 생성되고, 상세 패널에서 담당자·공유·댓글을 이어서 정리할 수 있습니다.
        </p>
      )}
    </form>
  );
}
