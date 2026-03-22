import Link from "next/link";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/login", label: "Login" },
  { href: "/my-tasks", label: "My Tasks" },
  { href: "/shared", label: "Shared" },
];

type TopNavProps = {
  apiBaseUrl: string;
};

export function TopNav({ apiBaseUrl }: TopNavProps) {
  return (
    <header className="rounded-[32px] border border-[var(--color-line)] bg-[rgba(255,255,255,0.7)] px-5 py-4 shadow-[0_18px_60px_rgba(16,24,47,0.08)] backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link href="/" className="text-2xl font-semibold tracking-[-0.04em]">
            TeamFlow
          </Link>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            Personal-first task flow with lightweight team sharing
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-[var(--color-ink-soft)] transition hover:border-[var(--color-line)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-[var(--color-line)] pt-4 text-sm text-[var(--color-ink-soft)] md:flex-row md:items-center md:justify-between">
        <span>Frontend baseline is ready for API integration.</span>
        <span className="rounded-full bg-[var(--color-surface)] px-3 py-1 font-medium">
          API Base URL: {apiBaseUrl}
        </span>
      </div>
    </header>
  );
}
