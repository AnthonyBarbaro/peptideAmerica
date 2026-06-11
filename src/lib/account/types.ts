export type AccountIntegrationMode = "local_preview" | "wordpress_redirect";

export type AccountIntegration = {
  mode: AccountIntegrationMode;
  connected: boolean;
  accountUrl: string | null;
  loginUrl: string | null;
  registerUrl: string | null;
  lostPasswordUrl: string | null;
};

export type AccountAction = "login" | "register" | "lost-password";
