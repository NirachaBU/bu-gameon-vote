"use client";

import { useEffect, useState } from "react";

export function PosterViewer({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button type="button" className="poster" onClick={() => setOpen(true)} aria-label="ดูโปสเตอร์เต็ม">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} />
        <span className="poster-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
            />
          </svg>
          แตะเพื่อดูภาพเต็ม
        </span>
      </button>

      {open && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} />
          <button type="button" className="lightbox-close" aria-label="ปิด">
            ✕
          </button>
        </div>
      )}
    </>
  );
}
