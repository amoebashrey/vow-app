"use client";

import { useEffect, useState } from "react";

export function InstallPromptBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    const isMobile = window.innerWidth < 768;
    const isDismissed = localStorage.getItem("vow_install_dismissed") === "true";
    if (!isStandalone && isMobile && !isDismissed) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  function dismiss() {
    localStorage.setItem("vow_install_dismissed", "true");
    setShow(false);
  }

  return (
    <div className="glass-card mx-4 mb-4 px-4 py-3 flex items-center justify-between rounded-[4px]">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-1.5 bg-[#deed00] rounded-full shrink-0" />
        <p className="font-epilogue text-xs text-[#adaaad]">Add VOW to your home screen for the best experience</p>
      </div>
      <button onClick={dismiss} className="text-[#adaaad] text-xs ml-2 shrink-0">✕</button>
    </div>
  );
}
