function cleanEnv(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : "";
}

export function getDirectusPublicUrl() {
  const value =
    cleanEnv(process.env.DIRECTUS_PUBLIC_URL) ||
    cleanEnv(process.env.DIRECTUS_ADMIN_URL);

  if (!value) {
    return "";
  }

  try {
    return new URL(value).origin;
  } catch {
    return value.replace(/\/+$/, "");
  }
}

export function getDirectusAssetToken() {
  return (
    cleanEnv(process.env.DIRECTUS_ASSET_TOKEN) ||
    cleanEnv(process.env.DIRECTUS_TOKEN) ||
    cleanEnv(process.env.DIRECTUS_STATIC_TOKEN)
  );
}

export function isDirectusConfigured() {
  return Boolean(getDirectusPublicUrl());
}

export function isDirectusAssetAuthConfigured() {
  return Boolean(getDirectusAssetToken());
}
