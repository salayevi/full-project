"use client";

import AuthTriggerButton from "../../shared/auth/AuthTriggerButton";

type MobileProductGuestCalloutProps = {
  compact?: boolean;
  accentColor: string;
  textColor: string;
  mutedColor: string;
  borderColor: string;
  backgroundColor: string;
  dark?: boolean;
};

export default function MobileProductGuestCallout({
  compact = false,
  accentColor,
  textColor,
  mutedColor,
  borderColor,
  backgroundColor,
  dark = false,
}: MobileProductGuestCalloutProps) {
  return (
    <div
      className="mt-5 rounded-[24px] border shadow-[0_10px_26px_rgba(0,0,0,0.08)]"
      style={{
        paddingInline: compact ? "14px" : "16px",
        paddingBlock: compact ? "14px" : "16px",
        background: backgroundColor,
        borderColor,
      }}
    >
      <p
        className="text-[clamp(14px,3.8vw,16px)] font-semibold leading-[1.35]"
        style={{ color: textColor }}
      >
        To‘liq imkoniyatlar uchun tizimga kiring
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[clamp(13px,3.7vw,15px)]">
        <AuthTriggerButton
          mode="register"
          className="font-semibold underline underline-offset-4"
          style={{ color: accentColor }}
        >
          Ro‘yxatdan o‘ting
        </AuthTriggerButton>

        <span style={{ color: mutedColor }}>yoki</span>

        <AuthTriggerButton
          mode="login"
          className="rounded-full px-4 py-2 font-semibold"
          style={{
            background: accentColor,
            color: dark ? "#111" : "#fff",
          }}
        >
          Kirish
        </AuthTriggerButton>
      </div>
    </div>
  );
}