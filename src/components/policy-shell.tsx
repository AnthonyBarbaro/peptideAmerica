import type { ReactNode } from "react";

type PolicyShellProps = {
  title: string;
  eyebrow?: string;
  children: ReactNode;
};

export function PolicyShell({ title, eyebrow = "Policies", children }: PolicyShellProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-4xl font-black text-slate-950">{title}</h1>
      <div className="mt-8 space-y-5 rounded-lg border border-slate-200 bg-white p-6 leading-7 text-slate-600 shadow-sm">
        {children}
      </div>
    </div>
  );
}
