import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { isFramed } from "./DesktopShowcase";

// Vercel Web Analytics + Speed Insights for the web build. The desktop
// showcase runs the app again inside an iframe, so only the top-level page
// reports — otherwise every desktop visit would count twice.
export default function WebAnalytics() {
  if (isFramed()) return null;
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
