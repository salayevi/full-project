"use client";

import type { CSSProperties, ReactNode } from "react";
import { createContext, useContext } from "react";
import type { PublicSiteSnapshot } from "@/lib/backend/domain";
import { selectThemeCssVariables } from "@/lib/backend/selectors";

const PublicSiteContentContext = createContext<PublicSiteSnapshot | null>(null);

type PublicSiteContentProviderProps = {
  snapshot: PublicSiteSnapshot;
  children: ReactNode;
};

type CssVariablesStyle = CSSProperties & Record<`--${string}`, string>;

export default function PublicSiteContentProvider({
  snapshot,
  children,
}: PublicSiteContentProviderProps) {
  const themeStyle = selectThemeCssVariables(snapshot) as CssVariablesStyle;

  return (
    <PublicSiteContentContext.Provider value={snapshot}>
      <div style={themeStyle}>{children}</div>
    </PublicSiteContentContext.Provider>
  );
}

export function usePublicSiteContent() {
  const context = useContext(PublicSiteContentContext);

  if (!context) {
    throw new Error(
      "usePublicSiteContent must be used inside PublicSiteContentProvider",
    );
  }

  return context;
}
