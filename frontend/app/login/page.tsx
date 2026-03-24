import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-6xl">
      <Suspense
        fallback={
          <div className="rounded-[32px] border border-[var(--color-line)] bg-white p-8 text-sm text-[var(--color-ink-soft)] shadow-[0_24px_70px_var(--color-shadow)]">
            로그인 화면을 준비하는 중입니다.
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </section>
  );
}
