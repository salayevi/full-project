"use client";

import { useEffect, useState } from "react";

export default function useMobileCollapsedNav(threshold = 110) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsCollapsed(window.scrollY > threshold);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [threshold]);

  return isCollapsed;
}