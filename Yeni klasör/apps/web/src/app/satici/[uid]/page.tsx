"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, reload } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type Profile = { companyName?: string; description?: string; city?: string; district?: string; logoUrl?: string; verified?: boolean };
export default function SellerProfilePage() {
  const { uid } = useParams<{ uid: string }>(); const [signedIn, setSignedIn] = useState(false); const [paid, setPaid] = useState(false); const [loading, setLoading] = useState(true); const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => { if (!auth || !db) { setLoading(false); return; } return onAuthStateChanged(auth, async (user) => { setSignedIn(Boolean(user)); if (!user) { setPaid(false); setLoading(false); return; } try { await reload(user); await user.getIdToken(true); const member = await getDoc(doc(db!, "users", user.uid)); const active = user.emailVerified && member.data()?.membershipStatus === "active"; setPaid(Boolean(active)); if (active) { const seller = await getDoc(doc(db!, "sellerProfiles", uid)); setProfile(seller.exists() ? seller.data() as Profile : null); } } catch { setProfile(null); } finally { setLoading(false); } }); }, [uid]);
  return <main className="auth-wrap"><Link className="brand" href="/">PALET<span>ÇİM</span></Link><section className="auth-card">{loading ? <p className="muted">Firma profili kontrol ediliyor…</p> : !signedIn || !paid ? <><p className="eyebrow">TEDARİKÇİ AĞI</p><h1>Satıcı profilini görüntüle</h1><p className="muted">Firma profilleri ve satıcı iletişim bilgileri doğrulanmış, aktif PALETÇİM üyelerine açıktır. İlanları incelemeye devam etmek ücretsizdir.</p><div className="fee-box"><div><strong>Tek seferlik erişim</strong><span>Üyelik ve mesajlaşma erişimi</span></div><b>350 TL</b></div><Link className="button primary full" href={!signedIn ? "/uye-ol" : "/odeme"}>{!signedIn ? "Üyelik oluştur" : "Üyeliği etkinleştir"}</Link></> : profile ? <><p className="eyebrow">TEDARİKÇİ PROFİLİ {profile.verified && "· DOĞRULANMIŞ"}</p><h1>{profile.companyName || "Firma profili"}</h1><p className="muted">{[profile.district, profile.city].filter(Boolean).join(", ")}</p><p>{profile.description || "Firma açıklaması eklenmemiş."}</p><Link className="back-link" href="/ilanlar">← İlanlara dön</Link></> : <><h1>Firma profili henüz hazır değil</h1><p className="muted">Satıcı profilini tamamladığında burada görüntüleyebilirsiniz.</p><Link className="back-link" href="/ilanlar">← İlanlara dön</Link></>}</section></main>;
}
