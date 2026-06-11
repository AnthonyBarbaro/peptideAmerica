"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { validateContactForm } from "@/lib/contact-validation";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState(false);

  const errors = useMemo(
    () => validateContactForm({ name, email, message }),
    [email, message, name],
  );

  const hasErrors = Object.keys(errors).length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    setSubmitted(false);

    if (hasErrors) {
      return;
    }

    setSubmitted(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-5">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={() => setTouched(true)}
            aria-invalid={touched && Boolean(errors.name)}
            aria-describedby={touched && errors.name ? "contact-name-error" : undefined}
            className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
          />
          {touched && errors.name ? (
            <p id="contact-name-error" className="mt-2 text-sm font-medium text-red-700">
              {errors.name}
            </p>
          ) : null}
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onBlur={() => setTouched(true)}
            aria-invalid={touched && Boolean(errors.email)}
            aria-describedby={touched && errors.email ? "contact-email-error" : undefined}
            className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
          />
          {touched && errors.email ? (
            <p id="contact-email-error" className="mt-2 text-sm font-medium text-red-700">
              {errors.email}
            </p>
          ) : null}
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Message</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onBlur={() => setTouched(true)}
            aria-invalid={touched && Boolean(errors.message)}
            aria-describedby={touched && errors.message ? "contact-message-error" : undefined}
            rows={6}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
          />
          {touched && errors.message ? (
            <p id="contact-message-error" className="mt-2 text-sm font-medium text-red-700">
              {errors.message}
            </p>
          ) : null}
        </label>
      </div>
      <button
        type="submit"
        className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500"
      >
        Preview support request
      </button>
      {submitted ? (
        <div className="mt-5 flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-900">
          <CheckCircle2 aria-hidden="true" size={20} />
          Form validated locally. Email delivery is not connected yet.
        </div>
      ) : null}
    </form>
  );
}
