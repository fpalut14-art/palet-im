"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firebaseReady } from "@/lib/firebase";
export default function LoginPage() {
  const [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); setError(""); if (!auth) return setError("Firebase bağlantısı yapılandırılmadı."); const d = new FormData(e.currentTarget); try { await signInWithEmailAndPassword(auth, String(d.get("email")), String(d.get("password"))); window.location.href = "/hesabim"; } catch (err) { setError(err instanceof Error ? err.message : "Giriş başarısız."); } }
  return <main className="auth-wrap"><Link className="brand" href="/">PALET<span>ÇİM</span></Link><section className="auth-card"><p className="eyebrow">TEKRAR HOŞ GELDİNİZ</p><h1>Hesabınıza giriş yapın</h1><form onSubmit={submit} className="form-stack"><label>E-posta<input name="email" type="email" required /></label><label>Şifre<input name="password" type="password" required /></label>{error && <p className="error">{error}</p>}<button className="button primary full" disabled={!firebaseReady}>Giriş yap</button></form><p className="center">Üyeliğiniz yok mu? <Link href="/uye-ol">Hesap oluştur</Link></p></section></main>;
}
