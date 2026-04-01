"use client";

import { useEffect, useState } from "react";
import { deviceConfig, type DeviceMode } from "./device-config";

function getDeviceMode(width: number): DeviceMode {
  return width <= deviceConfig.mobileMaxWidth ? "mobile" : "desktop";
}

export default function useDeviceMode(): DeviceMode {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");

  useEffect(() => {
    const updateDeviceMode = () => {
      setDeviceMode(getDeviceMode(window.innerWidth));
    };

    updateDeviceMode();
    window.addEventListener("resize", updateDeviceMode);

    return () => {
      window.removeEventListener("resize", updateDeviceMode);
    };
  }, []);

  return deviceMode;
}