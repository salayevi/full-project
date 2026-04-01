"use client"

import Image from "next/image"
import { colors, radius, sizes } from "@/config/design-system"
import AuthTriggerButton from "@/app/companent/shared/auth/AuthTriggerButton"
import { usePublicSiteContent } from "@/app/companent/shared/content/PublicSiteContentProvider"
import { createContentPlaceholderDataUri } from "@/lib/backend/placeholders"
import { selectFooterViewModel } from "@/lib/backend/selectors"

export default function Footer() {
  const snapshot = usePublicSiteContent()
  const footer = selectFooterViewModel(snapshot)

  return (
    <footer
      id="footer"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: colors.background.dark }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: sizes.layout.desktopWide,
          paddingInline: sizes.layout.gutter,
          paddingBlock: "clamp(72px, 10vh, 96px)",
        }}
      >
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <Image
                src={
                  footer.logo?.url ??
                  createContentPlaceholderDataUri({
                    title: footer.section.brandText,
                    subtitle: "Logo",
                    background: "#ffffff",
                    foreground: "#101828",
                    accent: "#d85ca7",
                  })
                }
                alt={footer.logo?.alt ?? footer.section.brandText}
                width={44}
                height={44}
                unoptimized
              />
              <span className="text-xl font-semibold text-white">
                {footer.section.brandText}
              </span>
            </div>

            <p
              className="mt-5 text-sm leading-7"
              style={{ color: colors.text.whiteSoft }}
            >
              {footer.section.description}
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                Bo‘limlar
              </h3>

              <div
                className="mt-4 flex flex-col gap-3 text-sm"
                style={{ color: colors.text.whiteSoft }}
              >
                {footer.navigationLinks.map((link) => (
                  <a key={link.id} href={link.href}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                Aloqa
              </h3>

              <div
                className="mt-4 flex flex-col gap-3 text-sm"
                style={{ color: colors.text.whiteSoft }}
              >
                {footer.section.contactItems.map((item) =>
                  item.href ? (
                    <a key={item.label} href={item.href}>
                      {item.value}
                    </a>
                  ) : (
                    <span key={item.label}>{item.value}</span>
                  ),
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                Hisob
              </h3>

              <div className="mt-4">
                <AuthTriggerButton
                  mode={footer.section.cta.primaryMode}
                  className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  style={{
                    borderRadius: radius.full,
                    backgroundColor: colors.brand.primary,
                  }}
                >
                  {footer.section.cta.primaryLabel}
                </AuthTriggerButton>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-14 border-t pt-6 text-sm"
          style={{
            borderColor: colors.border.whiteSoft,
            color: colors.text.whiteSoft,
          }}
        >
          {footer.section.legalText}
        </div>
      </div>
    </footer>
  )
}
