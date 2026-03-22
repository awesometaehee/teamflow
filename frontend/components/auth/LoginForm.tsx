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
    <div className="grid gap-6 md:grid-cols-[1fr_420px]">
      <div className="rounded-[28px] border border-[var(--color-line)] bg-[rgba(255,255,255,0.7)] p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-soft)]">
          Simple Login
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em]">
          내부 샘플 계정으로 바로 로그인해 TeamFlow 흐름을 확인할 수 있다.
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--color-ink-soft)]">
          MVP 단계에서는 경량 세션 방식을 사용한다. 로그인에 성공하면 클라이언트에 세션 정보를 저장하고 보호 페이지 접근에 사용한다.
        </p>

        <div className="mt-8 space-y-3">
          {sampleAccounts.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => {
                setEmail(account.email);
                setPassword(account.password);
                setErrorMessage("");
              }}
              className="flex w-full items-center justify-between rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-left transition hover:border-[var(--color-accent)] hover:bg-white"
            >
              <span className="font-semibold">{account.label}</span>
              <span className="text-sm text-[var(--color-ink-soft)]">{account.email}</span>
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-[28px] border border-[var(--color-line)] bg-[var(--color-surface-strong)] p-8 shadow-[0_18px_60px_rgba(16,24,47,0.08)]"
      >
        <div className="space-y-4">
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
              className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent)]"
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
              className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent)]"
            />
          </div>

          {errorMessage ? (
            <div className="rounded-2xl border border-[#ef9a9a] bg-[#fff1f2] px-4 py-3 text-sm text-[#9f1239]">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </form>
    </div>
  );
}
