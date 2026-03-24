"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { saveSession } from "@/lib/session";

const sampleAccounts = [
  { email: "alice@example.com", password: "password123", label: "Alice" },
  { email: "bob@example.com", password: "password123", label: "Bob" },
  { email: "charlie@example.com", password: "password123", label: "Charlie" },
];

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("alice@example.com");
  const [password, setPassword] = useState("password123");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = useMemo(() => {
    const redirect = searchParams.get("redirect");
    return redirect && redirect.startsWith("/") ? redirect : "/";
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("이메일을 입력해 주세요.");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("비밀번호를 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const session = await login({
        email: email.trim(),
        password,
      });

      saveSession(session);
      router.replace(redirectPath);
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        const validationMessage = error.details[0];
        setErrorMessage(validationMessage ?? error.message);
      } else {
        setErrorMessage("로그인 요청 중 예상하지 못한 오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="overflow-hidden rounded-[36px] border border-[var(--color-line)] bg-white shadow-[0_32px_90px_var(--color-shadow)]">
        <div className="bg-[linear-gradient(135deg,#ffffff_0%,#f1f7ff_55%,#e7f0ff_100%)] px-8 py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            태스크를 위한 가벼운 협업 흐름
          </p>
          <h1 className="mt-3 max-w-2xl text-5xl font-semibold tracking-[-0.06em] text-[var(--color-ink)]">
            미팅을 예약하듯 차분하게 태스크를 정리합니다.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[var(--color-ink-soft)]">
            TeamFlow는 흐름을 가볍게 유지합니다. 로그인하고, 일을 기록하고, 담당자를 정하고, 맥락을 공유하고,
            업데이트를 한 화면에서 따라갑니다.
          </p>
        </div>

        <div className="grid gap-4 px-8 py-8 md:grid-cols-3">
          {sampleAccounts.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => {
                setEmail(account.email);
                setPassword(account.password);
                setErrorMessage("");
              }}
              className="rounded-[26px] border border-[var(--color-line)] bg-[var(--color-surface)] px-5 py-5 text-left transition hover:border-[var(--color-line-strong)] hover:bg-white"
            >
              <p className="text-sm font-semibold text-[var(--color-ink)]">{account.label}</p>
              <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{account.email}</p>
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-[36px] border border-[var(--color-line)] bg-white p-8 shadow-[0_32px_90px_var(--color-shadow)]"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
          로그인
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[var(--color-ink)]">
          샘플 계정으로 바로 워크스페이스를 시작합니다.
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-ink-soft)]">
          MVP 단계에서는 경량 세션 방식을 사용합니다. 로그인하면 보호 페이지와 협업 흐름 전체를 바로 확인할 수
          있습니다.
        </p>

        <div className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[var(--color-ink-soft)]">
              Email
            </label>
            <input
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="alice@example.com"
              autoComplete="email"
              className="w-full rounded-[22px] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3.5 text-sm outline-none transition focus:border-[var(--color-line-strong)] focus:bg-white"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[var(--color-ink-soft)]">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="password123"
              autoComplete="current-password"
              className="w-full rounded-[22px] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3.5 text-sm outline-none transition focus:border-[var(--color-line-strong)] focus:bg-white"
            />
          </div>

          {errorMessage ? (
            <div className="rounded-[22px] border border-[#ef9a9a] bg-[#fff1f2] px-4 py-3 text-sm text-[#9f1239]">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-[22px] bg-[var(--color-accent)] px-4 py-4 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(0,107,255,0.24)] transition hover:bg-[var(--color-accent-strong)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "로그인 중..." : "워크스페이스 들어가기"}
          </button>
        </div>
      </form>
    </div>
  );
}
