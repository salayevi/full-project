"use client"

import { useEffect, useState } from "react"
import { useAuthModal } from "./AuthModalProvider"
import { colors, radius, shadows, sizes, zIndex } from "@/config/design-system"

export default function AuthModal() {
  const {
    isOpen,
    view,
    closeModal,
    setView,
    authenticate,
    isSubmitting,
    errorMessage,
  } =
    useAuthModal()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal()
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, closeModal])

  useEffect(() => {
    if (!isOpen) {
      setEmail("")
      setPassword("")
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ zIndex: zIndex.modal }}
    >
      <button
        type="button"
        onClick={closeModal}
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: colors.overlay.modal }}
        aria-label="Modalni yopish"
      />

      <div
        className="relative z-10 w-full p-5 text-white"
        style={{
          maxWidth: sizes.auth.modalMaxWidth,
          borderRadius: radius["3xl"],
          border: `1px solid ${colors.border.whiteSoft}`,
          backgroundColor: colors.surface.modal,
          boxShadow: shadows.modal,
        }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {view === "login" ? "Kirish" : "Ro‘yxatdan o‘tish"}
          </h2>

          <button
            type="button"
            onClick={closeModal}
            className="px-3 py-1 text-sm transition"
            style={{
              borderRadius: radius.full,
              border: `1px solid ${colors.border.whiteSoft}`,
              color: colors.text.whiteSoft,
            }}
          >
            Yopish
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setView("login")}
            className="px-4 py-3 text-sm font-medium transition"
            style={{
              borderRadius: radius.full,
              backgroundColor:
                view === "login" ? colors.surface.white : "rgba(255,255,255,0.05)",
              color: view === "login" ? "#111111" : colors.text.whiteSoft,
            }}
          >
            Kirish
          </button>

          <button
            type="button"
            onClick={() => setView("register")}
            className="px-4 py-3 text-sm font-medium transition"
            style={{
              borderRadius: radius.full,
              backgroundColor:
                view === "register"
                  ? colors.brand.primary
                  : "rgba(255,255,255,0.05)",
              color: colors.text.white,
            }}
          >
            Ro‘yxatdan o‘tish
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full px-4 py-3 outline-none placeholder:text-white/30"
            style={{
              borderRadius: radius.xl,
              border: `1px solid ${colors.border.whiteSoft}`,
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          />

          <input
            type="password"
            placeholder="Parol"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full px-4 py-3 outline-none placeholder:text-white/30"
            style={{
              borderRadius: radius.xl,
              border: `1px solid ${colors.border.whiteSoft}`,
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          />

          <button
            type="button"
            onClick={() =>
              void authenticate({
                mode: view,
                email,
                password,
              })
            }
            className="w-full px-4 py-3 font-medium text-black transition hover:scale-[1.01]"
            style={{
              borderRadius: radius.xl,
              backgroundColor: colors.surface.white,
            }}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Yuklanmoqda..."
              : view === "login"
                ? "Kirish"
                : "Ro‘yxatdan o‘tish"}
          </button>

          {errorMessage ? (
            <p
              className="text-sm leading-6"
              style={{ color: colors.text.whiteSoft }}
            >
              {errorMessage}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
