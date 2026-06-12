import type { Metadata } from "next";
import { PackageSearch } from "lucide-react";
import { MotionReveal } from "@/components/motion-reveal";

export const metadata: Metadata = {
  title: "Track Order",
  description: "Placeholder order tracking page for future fulfillment integration.",
};

export default function TrackOrderPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <MotionReveal y={14}>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <PackageSearch aria-hidden="true" className="text-red-600" size={34} />
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
            Track order
          </p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">Order tracking</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Tracking will connect after order and fulfillment integrations are active.
            For now, this page reserves the customer workflow.
          </p>
          <form className="mt-8 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Order number</span>
              <input
                placeholder="PA-10001"
                className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Email</span>
              <input
                type="email"
                placeholder="orders@example.com"
                className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
              />
            </label>
            <button
              type="button"
              className="subtle-shine inline-flex min-h-11 items-center justify-center rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500 sm:col-span-2"
            >
              Tracking integration pending
            </button>
          </form>
        </div>
      </MotionReveal>
    </div>
  );
}
