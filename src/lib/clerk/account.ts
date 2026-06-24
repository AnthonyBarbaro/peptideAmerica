import { currentUser } from "@clerk/nextjs/server";

export type ClerkAccountIdentity = {
  clerkEnabled: boolean;
  signedIn: boolean;
  userId: string | null;
  displayName: string;
  emails: string[];
};

const clerkEnabled = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
);

function uniqueEmails(emails: string[]) {
  return Array.from(
    new Set(emails.map((email) => email.trim().toLowerCase()).filter(Boolean)),
  );
}

export async function getClerkAccountIdentity(): Promise<ClerkAccountIdentity> {
  if (!clerkEnabled) {
    return {
      clerkEnabled: false,
      signedIn: false,
      userId: null,
      displayName: "",
      emails: [],
    };
  }

  const user = await currentUser().catch(() => null);

  if (!user) {
    return {
      clerkEnabled: true,
      signedIn: false,
      userId: null,
      displayName: "",
      emails: [],
    };
  }

  const primaryEmail = user.primaryEmailAddress?.emailAddress ?? "";
  const emails = uniqueEmails([
    primaryEmail,
    ...user.emailAddresses.map((email) => email.emailAddress),
  ]);

  return {
    clerkEnabled: true,
    signedIn: true,
    userId: user.id,
    displayName:
      user.fullName ||
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      primaryEmail,
    emails,
  };
}
