# Clerk Authentication

Clerk handles account login, registration, OAuth, and user profile UI.

## Files

- `src/proxy.ts` installs Clerk middleware when Clerk keys are configured.
- `src/app/layout.tsx` wraps the app in `ClerkProvider` when `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set.
- `src/components/header.tsx` shows Clerk sign-in and user controls.
- `src/components/account/account-portal.tsx` embeds Clerk sign-in, sign-up, and user profile components.

## Environment

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

OAuth providers such as Google should be enabled in the Clerk dashboard. Do not build or store passwords in this app.

## Checkout

Clerk identifies the user account. It does not approve payment and does not replace the Vial order safety gate.
