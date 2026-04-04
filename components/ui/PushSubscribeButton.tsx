"use client";

import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export function PushSubscribeButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;
    if (Notification.permission !== "default") return;
    if (localStorage.getItem("vow_push_dismissed") === "true") return;
    setShow(true);
  }, []);

  if (!show) return null;

  async function handleEnable() {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setShow(false);
      return;
    }

    try {
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });

      await fetch("/api/push-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription }),
      });
    } catch {
      // Subscription failed — don't block UX
    }
    setShow(false);
  }

  function dismiss() {
    localStorage.setItem("vow_push_dismissed", "true");
    setShow(false);
  }

  return (
    <div className="glass-card mx-4 mb-4 px-4 py-3 flex items-center justify-between rounded-[4px]">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-1.5 h-1.5 bg-[#deed00] rounded-full shrink-0" />
        <p className="font-epilogue text-xs text-[#adaaad]">
          Get notified when someone names you as witness
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleEnable}
          className="font-epilogue text-xs text-[#deed00] hover:text-[#f9f9f9] transition-colors"
        >
          Enable
        </button>
        <button onClick={dismiss} className="text-[#adaaad] text-xs ml-1">
          ✕
        </button>
      </div>
    </div>
  );
}
