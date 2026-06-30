"use client";

import { useEffect } from "react";
import type { AnalyticsEvent, AnalyticsPayload } from "@/lib/analytics";
import { trackEvent } from "@/lib/analytics";

type PageViewProps = {
  event: AnalyticsEvent;
  payload?: AnalyticsPayload;
};

/** Fires a single analytics event once when the page mounts. */
export function PageView({ event, payload }: PageViewProps) {
  useEffect(() => {
    trackEvent(event, payload);
    // Fire once per mount; payload is a static literal at call sites.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  return null;
}
