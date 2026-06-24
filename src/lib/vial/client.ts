import { getVialConfig, type VialConfig } from "./config";

type RequestOptions = RequestInit & {
  idempotencyKey?: string;
};

export class VialApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "VialApiError";
  }
}

function joinUrl(baseUrl: string, path: string) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(cleanPath, baseUrl).toString();
}

function authValue(config: VialConfig) {
  const scheme = config.authScheme.trim();
  return scheme ? `${scheme} ${config.apiKey}` : config.apiKey;
}

export class VialClient {
  constructor(private readonly config = getVialConfig()) {}

  async requestJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
    if (!this.config.apiKey) {
      throw new VialApiError("Vial API key is not configured.");
    }

    const headers = new Headers(options.headers);
    headers.set("Accept", "application/json");
    headers.set(this.config.apiKeyHeader, authValue(this.config));

    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (options.idempotencyKey) {
      headers.set(this.config.idempotencyHeader, options.idempotencyKey);
    }

    const response = await fetch(joinUrl(this.config.baseUrl, path), {
      ...options,
      cache: "no-store",
      headers,
    });

    const text = await response.text();
    const payload = text ? JSON.parse(text) : null;

    if (!response.ok) {
      const message =
        typeof payload?.message === "string"
          ? payload.message
          : `Vial API request failed with ${response.status}.`;
      throw new VialApiError(message, response.status);
    }

    return payload as T;
  }
}
