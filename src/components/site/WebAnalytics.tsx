"use client";

import { Analytics } from "@vercel/analytics/next";
import { analyticsBeforeSend } from "@/lib/analytics";

export function WebAnalytics() {
  return <Analytics beforeSend={analyticsBeforeSend} />;
}
