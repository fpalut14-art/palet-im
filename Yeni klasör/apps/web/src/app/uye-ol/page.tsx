"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createUserWithEmailAndPassword, reload, sendEmailVerification } from "firebase/auth";
import { auth, firebaseReady } from "@/lib/firebase";

export default function JoinPage() {
  const [error, setError] = useState("");
  const [created, setCreated] = useState(false);
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (!auth) return setError("Üyelik sistemi henüz yapılandırılmadı.");
    const data = new FormData(event.currentTarget);
    setBusy(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, String(data.get("email")), String(data.get("password")));
      await sendEmailVerification(credential.user);
      setCreated(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Kayıt sırasında bir sorun oluştu.");
    } finally { setBusy(false); }
  }
  async function checkVerification() {
    if (!auth?.currentUser) return;
    await reload(auth.currentUser);
    await auth.currentUser.getIdToken(true);
    if (auth.currentUser.emailVerified) window.location.href = "/odeme";
    else setError("Doğrulama henüz görünmüyor. E-postadaki bağlantıya tıklayıp yeniden deneyin.");
  }
  return <main className="auth-wrap"><Link className="brand" href="/">PALET<span>ÇİM</span></Link><section className="auth-card">
    {!created ? <><p className="eyebrow">PALETÇİM'E KATILIN</p><h1>İşinizi büyütmeye başlayın</h1><p className="muted">İlanları incelemek ücretsiz. Satıcı profillerine erişmek ve mesajlaşmak için doğrulanmış, aktif üyelik gerekir.</p>
      <form onSubmit={submit} className="form-stack"><label>E-posta<input name="email" type="email" autoComplete="email" required placeholder="ornek@firma.com" /></label><label>Şifre<input name="password" type="password" autoComplete="new-password" minLength={8} required placeholder="En az 8 karakter" /></label>
        <div className="fee-box"><div><strong>PALETÇİM erişim ücreti</strong><span>Tek seferlik kayıt ücreti</span></div><b>350 TL</b></div>
        <p className="small-note">350 TL planlanan kayıt bedelidir. Vergiler dahil kesin toplam tutar ve sözleşme bilgileri, ödeme açılmadan önce burada gösterilecektir. Ücret ancak sağlayıcı bildirimi sunucuda doğrulanırsa tahsil edilmiş sayılır.</p>
        {!firebaseReady && <p className="notice">Firebase bağlantısı için `.env.local` dosyasına Firebase Web App ayarlarını ekleyin.</p>}
        {error && <p className="error">{error}</p>}<button className="button primary full" disabled={busy || !firebaseReady}>{busy ? "Hesabınız oluşturuluyor…" : "Hesap oluştur ve devam et"}</button>
      </form><p className="small-note center"><Link href="/sozlesmeler">Kullanım koşulları</Link> ve <Link href="/gizlilik">KVKK bilgilendirmesi</Link> ödeme açılmadan önce tamamlanıp onayınıza sunulmalıdır.</p><p className="center">Zaten hesabınız var mı? <Link href="/giris">Giriş yap</Link></p>
    </> : <><p className="eyebrow">E-POSTA DOĞRULAMASI</p><h1>Gelen kutunuzu kontrol edin</h1><p className="muted">Hesabınız oluşturuldu. E-posta adresinizi doğrulayın; ardından kayıt ücretini ödeyerek mesajlaşma ve firma profili erişimini açabilirsiniz.</p>{error && <p className="error">{error}</p>}<button className="button primary full" onClick={checkVerification}>E-postamı doğruladım, devam et</button><p className="small-note">Ödeme sağlayıcısı kurulana kadar ücret tahsil edilmez ve üyelik aktifleşmez.</p></>}
  </section></main>;
}
