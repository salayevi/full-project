"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { colors, motion, sizes, spacing, zIndex } from "@/config/design-system"
import AuthTriggerButton from "@/app/companent/shared/auth/AuthTriggerButton"
import { usePublicSiteContent } from "@/app/companent/shared/content/PublicSiteContentProvider"
import { createContentPlaceholderDataUri } from "@/lib/backend/placeholders"
import {
  selectLogoAsset,
  selectNavigationLinksForPlacement,
  selectSiteIdentity,
} from "@/lib/backend/selectors"

export default function Navbar() {
  const snapshot = usePublicSiteContent()
  const siteIdentity = selectSiteIdentity(snapshot)
  const logoAsset = selectLogoAsset(snapshot)
  const headerLinks = selectNavigationLinksForPlacement(
    snapshot,
    "desktopHeader",
  )
  const navRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    gsap.from(navRef.current, {
      y: -80,
      opacity: 0,
      duration: motion.duration.slower,
      ease: motion.ease.smooth,
    })
  }, [])

  return (
    <nav
      ref={navRef}
      className="fixed left-0 top-0 w-full text-white backdrop-blur-md"
      style={{
        zIndex: zIndex.navbar,
        backgroundColor: colors.overlay.navbar,
      }}
    >
      <div
        className="mx-auto flex w-full items-center justify-between"
        style={{
          maxWidth: sizes.layout.desktopWide,
          paddingInline: sizes.layout.gutter,
          paddingBlock: spacing[5],
        }}
      >
        <div className="flex items-center gap-2">
          <Image
            src={
              logoAsset?.url ??
              createContentPlaceholderDataUri({
                title: siteIdentity.brandText || siteIdentity.siteName,
                subtitle: "Logo",
                background: "#ffffff",
                foreground: "#101828",
                accent: "#d85ca7",
              })
            }
            alt={logoAsset?.alt ?? siteIdentity.siteName}
            width={40}
            height={40}
            unoptimized
          />
        </div>

        <div
          className="flex items-center text-sm font-medium"
          style={{ gap: "clamp(20px, 2vw, 36px)" }}
        >
          {headerLinks.slice(0, 2).map((link) => (
            <a
              key={link.id}
              href={link.href}
              target={link.openInNewTab ? "_blank" : undefined}
              rel={link.openInNewTab ? "noreferrer" : undefined}
            >
              {link.label}
            </a>
          ))}
          <AuthTriggerButton mode="login" className="transition hover:opacity-80">
            Kirish yoki Ro&apos;yxatdan o&apos;tish
          </AuthTriggerButton>
        </div>
      </div>
    </nav>
  )
}
