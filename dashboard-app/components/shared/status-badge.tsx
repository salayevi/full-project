"use client";

import clsx from "clsx";

import type { PublishState } from "@/lib/types";

export function StatusBadge({ state }: { state: PublishState | "ready" | "inactive" }) {
  return <span className={clsx("status-badge", `status-${state}`)}>{state.replace("_", " ")}</span>;
}
