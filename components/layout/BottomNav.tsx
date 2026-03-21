"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();
  const tabs = [
    { href: "/dashboard", label: "DASHBOARD", icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    )},
    { href: "/contracts/new", label: "NEW VOW", icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    )},
    { href: "/profile", label: "PROFILE", icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    )},
  ];
  return (
    <nav className="fixed bottom-0 left-0 w-full h-20 flex justify-around items-center px-8 bg-[#09090B]/90 backdrop-blur-2xl border-t border-[#48474A]/20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50">
      {tabs.map(tab => {
        const active = pathname === tab.href;
        return (
          <Link key={tab.href} href={tab.href}
            className={`flex flex-col items-center justify-center pt-2 h-full transition-colors ${active ? "text-[#F9F9F9] border-t-2 border-[#EFFF00]" : "text-[#48474A] hover:text-[#F9F9F9]"}`}>
            {tab.icon}
            <span className="font-epilogue font-bold text-[10px] tracking-widest uppercase mt-1">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
