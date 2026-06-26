import { NextResponse } from "next/server";
import { isDirectusAssetAuthConfigured, isDirectusConfigured } from "@/lib/directus/config";
import { dbQuery, isDatabaseConfigured } from "@/lib/db/postgres";
import { getVialConfig, isVialCatalogConfigured, isVialOrdersConfigured } from "@/lib/vial/config";

const countableTables = [
  "catalog_product_overrides",
  "catalog_product_images",
  "commerce_orders",
] as const;

type CountableTable = (typeof countableTables)[number];

async function countTable(table: CountableTable) {
  try {
    const result = await dbQuery<{ count: string }>(`select count(*)::text as count from ${table}`);

    return Number(result.rows[0]?.count ?? 0);
  } catch {
    return null;
  }
}

export async function GET() {
  const vialConfig = getVialConfig();
  const databaseConfigured = isDatabaseConfigured();
  const counts = databaseConfigured
    ? await Promise.all(countableTables.map((table) => countTable(table)))
    : [null, null, null];

  return NextResponse.json({
    ok: true,
    service: "peptide-america-frontend",
    provider: "vial",
    checkoutMode: process.env.CHECKOUT_MODE ?? "disabled",
    vial: {
      catalogConfigured: isVialCatalogConfigured(vialConfig),
      ordersConfigured: isVialOrdersConfigured(vialConfig),
    },
    database: {
      configured: databaseConfigured,
      connected: databaseConfigured && counts.some((count) => count !== null),
      catalogProductOverrides: counts[0],
      catalogProductImages: counts[1],
      commerceOrders: counts[2],
    },
    directus: {
      configured: isDirectusConfigured(),
      assetAuthConfigured: isDirectusAssetAuthConfigured(),
    },
  });
}
