import type { Metadata } from "next";
import { MotionReveal } from "@/components/motion-reveal";
import { TrackOrderClient } from "@/components/track-order-client";

export const metadata: Metadata = {
  title: "Track Order",
  description: "Look up payment, fulfillment, and shipment status from the live order ledger.",
};

export default function TrackOrderPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <MotionReveal y={14}>
        <TrackOrderClient />
      </MotionReveal>
    </div>
  );
}
