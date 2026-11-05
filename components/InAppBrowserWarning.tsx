"use client";

import { useEffect, useState } from "react";

// Google ไม่ยอมให้ล็อกอินในเบราว์เซอร์ที่ฝังในแอป (LINE, Facebook, IG, TikTok ฯลฯ)
const IN_APP = /Line\/|FBAN|FBAV|FB_IAB|Instagram|Messenger|TikTok|musical_ly|Twitter|; wv\)/i;

export function InAppBrowserWarning() {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setShow(IN_APP.test(navigator.userAgent));
  }, []);

  if (!show) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      /* บางแอปไม่ให้ใช้ clipboard */
    }
  }

  return (
    <div className="warn">
      <strong>เปิดใน Chrome หรือ Safari ก่อนนะ</strong>
      <p>
        แอปนี้ล็อกอิน Google ไม่ได้ กดเมนู ⋯ แล้วเลือก “เปิดในเบราว์เซอร์” หรือสแกน QR
        ใหม่ด้วยกล้องมือถือ
      </p>
      <button className="btn btn-ghost btn-sm" onClick={copy}>
        {copied ? "คัดลอกลิงก์แล้ว" : "คัดลอกลิงก์"}
      </button>
    </div>
  );
}
