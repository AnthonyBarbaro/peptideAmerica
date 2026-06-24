"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { SignIn, SignOutButton, SignUp, useClerk, useUser } from "@clerk/nextjs";
import { Settings } from "lucide-react";

type AccountPortalProps = {
  clerkEnabled: boolean;
};

const appearance = {
  variables: {
    colorPrimary: "#dc2626",
    colorText: "#020617",
    colorTextSecondary: "#475569",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none border-0",
    card: "w-full shadow-none border-0 p-0",
    headerTitle: "text-slate-950",
    footerActionLink: "text-red-700 hover:text-red-600",
    formButtonPrimary: "bg-red-600 hover:bg-red-500",
  },
};

export function AccountPortal({ clerkEnabled }: AccountPortalProps) {
  if (!clerkEnabled) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">Account access is unavailable</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Sign-in and account management are temporarily unavailable. Please check back soon.
        </p>
      </div>
    );
  }

  return <ClerkAccountPortal />;
}

function ClerkAccountPortal() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm font-medium text-slate-600 shadow-sm">
        Loading account...
      </div>
    );
  }

  if (isSignedIn) {
    return <SignedInAccountSummary />;
  }

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
          <SignIn routing="hash" appearance={appearance} />
        </Tabs.Content>
        <Tabs.Content value="register" className="pt-6">
          <SignUp routing="hash" appearance={appearance} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

function SignedInAccountSummary() {
  const { user } = useUser();
  const clerk = useClerk();
  const primaryEmail = user?.primaryEmailAddress?.emailAddress;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-red-700">
            Account
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">
            {user?.fullName || "Signed in"}
          </h2>
          {primaryEmail ? (
            <p className="mt-1 text-sm font-medium text-slate-500">{primaryEmail}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => clerk.openUserProfile()}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        >
          <Settings aria-hidden="true" size={18} />
          Profile settings
        </button>
        <SignOutButton>
          <button
            type="button"
            className="inline-flex min-h-10 items-center justify-center rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Sign out
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
