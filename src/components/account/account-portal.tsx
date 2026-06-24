"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { SignIn, SignUp, UserProfile, useUser } from "@clerk/nextjs";

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
        <h2 className="text-2xl font-black text-slate-950">Clerk is not configured</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` to enable
          sign-in, sign-up, and account controls.
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
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <UserProfile routing="hash" appearance={appearance} />
      </div>
    );
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
