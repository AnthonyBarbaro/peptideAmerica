"use client";

import { FormEvent, useState } from "react";

export function CatalogUpdatesForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Enter a valid email address.");
      return;
    }

    setEmail("");
    setMessage("Thanks. Catalog update requests are being collected for launch.");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-4">
      <label className="block">
        <span className="text-sm font-semibold text-slate-700">Catalog updates</span>
        <span className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="research@example.com"
            className="min-h-10 flex-1 rounded-md border border-slate-300 px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
          />
          <button
            type="submit"
            className="inline-flex min-h-10 items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
          >
            Subscribe
          </button>
        </span>
      </label>
      {message ? <p className="mt-2 text-sm font-medium text-slate-600">{message}</p> : null}
    </form>
  );
}
