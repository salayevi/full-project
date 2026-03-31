export const deviceConfig = {
  mobileMaxWidth: 1024,
  desktopMinWidth: 1025,
} as const;

export type DeviceMode = "mobile" | "desktop";