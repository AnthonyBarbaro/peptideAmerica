"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import type { AccountIntegration } from "@/lib/account/types";
import {
  validateLogin,
  validateRegister,
} from "@/lib/account/validation";

type AccountPortalProps = {
  integration: AccountIntegration;
};

export function AccountPortal({ integration }: AccountPortalProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <Tabs.Root defaultValue="login">
        <Tabs.List
          className="grid rounded-md bg-slate-100 p-1 sm:grid-cols-2"
          aria-label="Account actions"
        >
          <Tabs.Trigger
            value="login"
            className="rounded px-4 py-3 text-sm font-bold text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
          >
            Login
          </Tabs.Trigger>
          <Tabs.Trigger
            value="register"
            className="rounded px-4 py-3 text-sm font-bold text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
          >
            Register
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="login" className="pt-6">
          <LoginForm integration={integration} />
        </Tabs.Content>
        <Tabs.Content value="register" className="pt-6">
          <RegisterForm integration={integration} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

function LoginForm({ integration }: AccountPortalProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const errors = useMemo(
    () => validateLogin({ identifier, password }),
    [identifier, password],
  );
  const hasErrors = Object.keys(errors).length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    setStatus(null);

    if (hasErrors) {
      return;
    }

    const response = await requestAccountAction("login");

    if (response.redirectUrl) {
      window.location.href = response.redirectUrl;
      return;
    }

    setStatus(response.message);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="text-3xl font-black text-slate-950">Login</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Account access is prepared for WordPress/WooCommerce handoff. Configure the
        account portal URL to enable live login.
      </p>
      <label className="mt-6 block">
        <span className="text-sm font-semibold text-slate-700">Username or email</span>
        <input
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          onBlur={() => setTouched(true)}
          autoComplete="username"
          aria-invalid={touched && Boolean(errors.identifier)}
          aria-describedby={touched && errors.identifier ? "account-login-id-error" : undefined}
          className="mt-2 min-h-12 w-full rounded-md border border-slate-300 px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
        />
        {touched && errors.identifier ? (
          <p id="account-login-id-error" className="mt-2 text-sm font-medium text-red-700">
            {errors.identifier}
          </p>
        ) : null}
      </label>
      <label className="mt-5 block">
        <span className="text-sm font-semibold text-slate-700">Password</span>
        <span className="mt-2 flex rounded-md border border-slate-300 focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-600/20">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onBlur={() => setTouched(true)}
            autoComplete="current-password"
            aria-invalid={touched && Boolean(errors.password)}
            aria-describedby={touched && errors.password ? "account-login-password-error" : undefined}
            className="min-h-12 min-w-0 flex-1 rounded-l-md px-3 text-base text-slate-950 outline-none"
          />
          <button
            type="button"
            className="grid min-h-12 w-12 place-items-center rounded-r-md text-slate-600 hover:bg-slate-50"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
          </button>
        </span>
        {touched && errors.password ? (
          <p id="account-login-password-error" className="mt-2 text-sm font-medium text-red-700">
            {errors.password}
          </p>
        ) : null}
      </label>
      <label className="mt-5 flex items-center gap-3">
        <input
          type="checkbox"
          checked={remember}
          onChange={(event) => setRemember(event.target.checked)}
          className="h-5 w-5 rounded border-slate-300 text-red-600 focus:ring-red-600"
        />
        <span className="text-sm font-semibold text-slate-800">Remember me</span>
      </label>
      <button
        type="submit"
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-500"
      >
        <LogIn aria-hidden="true" size={18} />
        Log in
      </button>
      <AccountLinks integration={integration} action="login" />
      {status ? (
        <p className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-700">
          {status}
        </p>
      ) : null}
    </form>
  );
}

function RegisterForm({ integration }: AccountPortalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const errors = useMemo(
    () => validateRegister({ email, password, confirmPassword }),
    [confirmPassword, email, password],
  );
  const hasErrors = Object.keys(errors).length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    setStatus(null);

    if (hasErrors) {
      return;
    }

    const response = await requestAccountAction("register");

    if (response.redirectUrl) {
      window.location.href = response.redirectUrl;
      return;
    }

    setStatus(response.message);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="text-3xl font-black text-slate-950">Register</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Registration will be handled by the connected WordPress/WooCommerce account
        portal when backend account services are ready.
      </p>
      <label className="mt-6 block">
        <span className="text-sm font-semibold text-slate-700">Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onBlur={() => setTouched(true)}
          autoComplete="email"
          aria-invalid={touched && Boolean(errors.email)}
          aria-describedby={touched && errors.email ? "account-register-email-error" : undefined}
          className="mt-2 min-h-12 w-full rounded-md border border-slate-300 px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
        />
        {touched && errors.email ? (
          <p id="account-register-email-error" className="mt-2 text-sm font-medium text-red-700">
            {errors.email}
          </p>
        ) : null}
      </label>
      <label className="mt-5 block">
        <span className="text-sm font-semibold text-slate-700">Password</span>
        <span className="mt-2 flex rounded-md border border-slate-300 focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-600/20">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onBlur={() => setTouched(true)}
            autoComplete="new-password"
            aria-invalid={touched && Boolean(errors.password)}
            aria-describedby={touched && errors.password ? "account-register-password-error" : undefined}
            className="min-h-12 min-w-0 flex-1 rounded-l-md px-3 text-base text-slate-950 outline-none"
          />
          <button
            type="button"
            className="grid min-h-12 w-12 place-items-center rounded-r-md text-slate-600 hover:bg-slate-50"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
          </button>
        </span>
        {touched && errors.password ? (
          <p id="account-register-password-error" className="mt-2 text-sm font-medium text-red-700">
            {errors.password}
          </p>
        ) : null}
      </label>
      <label className="mt-5 block">
        <span className="text-sm font-semibold text-slate-700">Confirm password</span>
        <input
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          onBlur={() => setTouched(true)}
          autoComplete="new-password"
          aria-invalid={touched && Boolean(errors.confirmPassword)}
          aria-describedby={
            touched && errors.confirmPassword ? "account-register-confirm-error" : undefined
          }
          className="mt-2 min-h-12 w-full rounded-md border border-slate-300 px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
        />
        {touched && errors.confirmPassword ? (
          <p id="account-register-confirm-error" className="mt-2 text-sm font-medium text-red-700">
            {errors.confirmPassword}
          </p>
        ) : null}
      </label>
      <button
        type="submit"
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-500"
      >
        <UserPlus aria-hidden="true" size={18} />
        Register
      </button>
      <AccountLinks integration={integration} action="register" />
      {status ? (
        <p className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-700">
          {status}
        </p>
      ) : null}
    </form>
  );
}

function AccountLinks({
  integration,
  action,
}: AccountPortalProps & { action: "login" | "register" }) {
  return (
    <div className="mt-5 flex flex-col items-center gap-3 text-sm">
      {integration.lostPasswordUrl ? (
        <a className="font-semibold text-red-700 hover:text-red-600" href={integration.lostPasswordUrl}>
          Lost your password?
        </a>
      ) : (
        <button
          type="button"
          className="font-semibold text-red-700 hover:text-red-600"
          onClick={async () => {
            const response = await requestAccountAction("lost-password");
            alert(response.message);
          }}
        >
          Lost your password?
        </button>
      )}
      {integration.accountUrl ? (
        <a className="font-semibold text-slate-700 hover:text-red-700" href={integration.accountUrl}>
          Continue to account portal
        </a>
      ) : (
        <span className="text-slate-500">
          {action === "login" ? "Need an account?" : "Already have an account?"} Connect
          WordPress/WooCommerce to enable live account actions.
        </span>
      )}
    </div>
  );
}

async function requestAccountAction(action: "login" | "register" | "lost-password") {
  const response = await fetch("/api/account/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });

  return (await response.json()) as {
    ok: boolean;
    message: string;
    redirectUrl?: string;
  };
}
