"use client";
import Link from "next/link";
import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { auth, firebaseReady, functions } from "@/lib/firebase";
export default function PaymentPage() {
  const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  async function continueToCheckout() {
    if (!auth?.currentUser) { setMessage("Önce PALETÇİM hesabınıza giriş yapın."); return; }
    if (!auth.currentUser.emailVerified) { setMessage("Ödeme öncesinde e-posta adresinizi doğrulayın."); return; }
    if (!functions) { setMessage("Firebase bağlantısı yapılandırılmadı."); return; }
    setBusy(true); setMessage("");
    try {
      const result = await httpsCallable(functions, "createRegistrationCheckout")();
      const data = result.data as { checkoutUrl?: string; status?: string };
      if (data.checkoutUrl) window.location.assign(data.checkoutUrl);
      else if (data.status === "active") setMessage("Üyeliğiniz zaten aktif.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Ödeme oturumu başlatılamadı.");
    } finally { setBusy(false); }
  }
  return <main className="auth-wrap"><Link className="brand" href="/">PALET<span>ÇİM</span></Link><section className="auth-card"><p className="eyebrow">ÜYELİĞİ ETKİNLEŞTİR</p><h1>PALETÇİM erişimi</h1><div className="fee-box"><div><strong>Tek seferlik kayıt ücreti</strong><span>Mesajlaşma ve satıcı profillerine erişim</span></div><b>350 TL</b></div><p className="muted">350 TL planlanan kayıt bedelidir; vergi dahil kesin toplam ve sözleşmeler ödeme açılmadan önce netleştirilmelidir. Ödeme sağlayıcısı henüz bağlı olmadığından tahsilat yapılmaz. Üyelik sadece doğrulanmış ödeme sonrası etkinleşir.</p>{message && <p className="notice">{message}</p>}<button className="button primary full" onClick={continueToCheckout} disabled={busy || !firebaseReady}>{busy ? "Güvenli ödeme hazırlanıyor…" : "Güvenli ödemeye devam et · 350 TL"}</button><Link className="back-link" href="/">← İlanları incelemeye devam et</Link></section></main>;
}
