"use client";

import DesktopPage from "../../sections/desktop-page";
import MobilePage from "../../sections/mobile-page";
import useDeviceMode from "./use-device-mode";

export default function ResponsivePage() {
  const deviceMode = useDeviceMode();

  if (deviceMode === "mobile") {
    return <MobilePage />;
  }

  return <DesktopPage />;
}