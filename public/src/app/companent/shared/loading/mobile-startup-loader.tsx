"use client";

type MobileStartupLoaderProps = {
  visible: boolean;
};

export default function MobileStartupLoader({
  visible,
}: MobileStartupLoaderProps) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-500 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
      aria-hidden={!visible}
    >
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div className="h-16 w-16 rounded-full border-[5px] border-[#f3c2df]" />
        <div className="absolute h-16 w-16 animate-spin rounded-full border-[5px] border-transparent border-t-[#cf2f8f] border-r-[#cf2f8f]" />
        <div className="absolute h-4 w-4 rounded-full bg-[#cf2f8f]/12" />
      </div>
    </div>
  );
}