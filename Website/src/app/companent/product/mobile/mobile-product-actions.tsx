"use client";

import { useEffect, useState } from "react";

type MobileProductActionsProps = {
  price?: string;
  accentColor: string;
  textColor: string;
  mutedColor: string;
  borderColor: string;
  backgroundColor: string;
  dark?: boolean;
};

export default function MobileProductActions({
  price,
  accentColor,
  textColor,
  mutedColor,
  borderColor,
  backgroundColor,
  dark = false,
}: MobileProductActionsProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setReady(true);
    }, 40);

    return () => window.clearTimeout(id);
  }, []);

  return (
    <div
      className="mt-5 rounded-[24px] border shadow-[0_10px_26px_rgba(0,0,0,0.08)] transition-all duration-500 ease-out"
      style={{
        paddingInline: "16px",
        paddingBlock: "16px",
        background: backgroundColor,
        borderColor,
        opacity: ready ? 1 : 0,
        transform: ready ? "translateY(0px)" : "translateY(10px)",
      }}
    >
      <div
        className="flex items-start justify-between gap-4 transition-all duration-500 ease-out"
        style={{
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0px)" : "translateY(8px)",
        }}
      >
        <div>
          <p
            className="text-[13px] font-medium"
            style={{ color: mutedColor }}
          >
            Narx
          </p>

          <p
            className="mt-1 text-[clamp(24px,6vw,30px)] font-bold leading-none"
            style={{ color: textColor }}
          >
            {price ?? "Narx mavjud emas"}
          </p>
        </div>

        <button
          type="button"
          className="rounded-full px-5 py-3 text-[15px] font-semibold transition-all duration-500 ease-out"
          style={{
            background: accentColor,
            color: dark ? "#111" : "#fff",
            opacity: ready ? 1 : 0,
            transform: ready ? "translateY(0px)" : "translateY(12px)",
            transitionDelay: "80ms",
          }}
        >
          Sotib olish
        </button>
      </div>

      <button
        type="button"
        className="mt-3 w-full rounded-full border px-5 py-3 text-[15px] font-semibold transition-all duration-500 ease-out hover:opacity-90"
        style={{
          borderColor,
          color: textColor,
          background: "transparent",
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0px)" : "translateY(14px)",
          transitionDelay: "140ms",
        }}
      >
        Savatga qo'shish
      </button>
    </div>
  );
}