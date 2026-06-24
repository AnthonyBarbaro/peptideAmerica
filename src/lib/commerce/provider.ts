import type { CommerceProvider } from "./types";
import { vialCommerceProvider } from "@/lib/vial/provider";

export function getCommerceProvider(): CommerceProvider {
  return vialCommerceProvider;
}
