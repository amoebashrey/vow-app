"use client";

import { useEffect, useState } from "react";

export function IOSInstallBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show on iOS Safari, not in standalone mode, and not already dismissed
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      || ("standalone" in navigator && (navigator as any).standalone);
    const dismissed = localStorage.getItem("vow_ios_install_dismissed") === "true";

    if (isIOS && !isStandalone && !dismissed) {
      setShow(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem("vow_ios_install_dismissed", "true");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 rounded-xl border border-[#48474A]/30 bg-[#19191c] p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="font-bebas text-sm tracking-widest text-white">Add VOW to your home screen</p>
          <p className="font-epilogue text-[11px] text-[#adaaad] mt-1 leading-relaxed">
            Tap <span className="inline-block align-middle mx-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline">
                <path d="M12 5v14M5 12l7-7 7 7" />
                <rect x="4" y="18" width="16" height="2" rx="1" />
              </svg>
            </span> Share → <span className="text-white font-semibold">Add to Home Screen</span>
          </p>
        </div>
        <button
          onClick={dismiss}
          className="text-[#767577] hover:text-white transition-colors p-1"
          aria-label="Dismiss"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
