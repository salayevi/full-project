"use client";

import AuthTriggerButton from "../../shared/auth/AuthTriggerButton";
import { usePublicSiteContent } from "@/app/companent/shared/content/PublicSiteContentProvider";
import { selectFooterViewModel } from "@/lib/backend/selectors";
import { colors } from "@/config/design-system";

export default function MobileFooter() {
  const snapshot = usePublicSiteContent();
  const footer = selectFooterViewModel(snapshot);

  return (
    <section
      className="relative flex min-h-[100svh] w-full items-end justify-center px-5"
      style={{
        backgroundColor: colors.background.soft,
        paddingBottom: "120px",
        paddingTop: "100px",
      }}
    >
      {/* glow background */}
      <div
        className="pointer-events-none absolute top-[-120px] h-[300px] w-[300px] rounded-full blur-[120px]"
        style={{
          backgroundColor: colors.brand.soft,
          opacity: 0.5,
        }}
      />

      <div className="relative w-full max-w-[380px]">
        {/* main card */}
        <div
          className="rounded-[36px] border bg-white px-7 py-12 text-center shadow-[0_30px_80px_rgba(207,47,143,0.15)]"
          style={{
            borderColor: colors.brand.soft,
            backgroundColor: colors.surface.white,
          }}
        >
          {/* brand */}
          <p
            className="text-[12px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: colors.brand.secondary }}
          >
            {footer.section.brandText}
          </p>

          {/* main headline */}
          <h2
            className="mt-4 text-[40px] font-bold leading-[1.05] tracking-[-0.04em]"
            style={{ color: colors.brand.primaryStrong }}
          >
            {footer.section.cta.title}
          </h2>

          {/* description */}
          <p
            className="mx-auto mt-5 max-w-[280px] text-[15px] leading-[1.6]"
            style={{ color: colors.text.secondary }}
          >
            {footer.section.cta.description}
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col items-center gap-3">
            <AuthTriggerButton
              mode={footer.section.cta.primaryMode}
              className="w-full max-w-[240px] rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(207,47,143,0.35)] active:scale-[0.97]"
              style={{
                backgroundColor: colors.brand.primaryStrong,
                color: colors.text.white,
              }}
            >
              {footer.section.cta.primaryLabel}
            </AuthTriggerButton>

            <a
              href={footer.section.cta.secondaryHref}
              className="w-full max-w-[240px] rounded-full border px-6 py-3 text-sm font-semibold transition active:scale-[0.97]"
              style={{
                borderColor: colors.brand.primaryStrong,
                color: colors.brand.primaryStrong,
              }}
            >
              {footer.section.cta.secondaryLabel}
            </a>
          </div>

          {/* divider */}
          <div
            className="my-8 h-px w-full"
            style={{ backgroundColor: colors.brand.soft }}
          />

          {/* nav links */}
          <div
            className="flex items-center justify-center gap-5 text-[13px] font-medium"
            style={{ color: colors.text.secondary }}
          >
            {footer.navigationLinks.map((link) => (
              <a key={link.id} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>

          {/* bottom note */}
          <p
            className="mt-6 text-[12px]"
            style={{ color: colors.text.muted }}
          >
            {footer.section.legalText}
          </p>
        </div>
      </div>
    </section>
  );
}
