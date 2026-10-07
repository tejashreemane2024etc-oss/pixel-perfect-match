import type { ReactNode } from "react";

export function Section({ title, kicker, action, children }: { title: string; kicker?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="mx-auto mt-16 max-w-7xl px-4">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="min-w-0">
          {kicker && <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{kicker}</p>}
          <h2 className="text-4xl sm:text-5xl">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function PageHero({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="border-b border-border bg-[radial-gradient(ellipse_at_top,var(--accent),transparent_70%)]">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="text-5xl sm:text-6xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-12 text-center">
      <p className="font-display text-3xl">{title}</p>
      <div className="mt-2 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}
