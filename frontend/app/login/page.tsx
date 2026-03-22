import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-5xl">
      <Suspense
        fallback={
          <div className="rounded-[28px] border border-[var(--color-line)] bg-[rgba(255,255,255,0.72)] p-8 text-sm text-[var(--color-ink-soft)] shadow-[0_18px_60px_rgba(16,24,47,0.08)]">
            로그인 화면을 준비하는 중입니다.
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </section>
  );
}
