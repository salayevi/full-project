"use client";

import { CSSProperties } from "react";
import { useAuthModal } from "./AuthModalProvider";

type Props = {
  mode?: "login" | "register";
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
};

export default function AuthTriggerButton({
  mode = "login",
  children,
  className = "",
  style,
}: Props) {
  const { openLogin, openRegister } = useAuthModal();

  const handleClick = () => {
    if (mode === "register") {
      openRegister();
      return;
    }

    openLogin();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      style={style}
    >
      {children}
    </button>
  );
}