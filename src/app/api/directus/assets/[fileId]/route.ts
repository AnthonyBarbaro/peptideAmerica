import { NextResponse } from "next/server";
import { getDirectusAssetToken, getDirectusPublicUrl } from "@/lib/directus/config";

const ASSET_CACHE_CONTROL =
  "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";

function isSafeFileId(fileId: string) {
  return /^[a-zA-Z0-9_-]+$/.test(fileId);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ fileId: string }> },
) {
  const { fileId } = await params;
  const directusUrl = getDirectusPublicUrl();

  if (!directusUrl) {
    return NextResponse.json({ error: "Directus is not configured." }, { status: 503 });
  }

  if (!isSafeFileId(fileId)) {
    return NextResponse.json({ error: "Invalid asset id." }, { status: 400 });
  }

  const assetUrl = new URL(`/assets/${fileId}`, directusUrl);
  const assetToken = getDirectusAssetToken();

  if (assetToken) {
    assetUrl.searchParams.set("access_token", assetToken);
  }

  const response = await fetch(assetUrl, {
    headers: assetToken ? { Authorization: `Bearer ${assetToken}` } : undefined,
    next: { revalidate: 3600 },
  });

  if (!response.ok || !response.body) {
    return NextResponse.json(
      { error: "Directus asset is not available." },
      { status: response.status },
    );
  }

  const headers = new Headers();
  headers.set("Cache-Control", ASSET_CACHE_CONTROL);

  const contentType = response.headers.get("content-type");
  const contentLength = response.headers.get("content-length");

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  if (contentLength) {
    headers.set("Content-Length", contentLength);
  }

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}
