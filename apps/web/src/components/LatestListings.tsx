"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
type Listing = { id: string; title?: string; dimensions?: string; city?: string; condition?: string; pricePerUnit?: number; currency?: string; boostedUntil?: { toDate(): Date } };
export default function LatestListings() {
  const [list, setList] = useState<Listing[]>([]);
  useEffect(() => { if (!db) return; getDocs(query(collection(db, "listings"), where("status", "==", "active"), orderBy("createdAt", "desc"), limit(3))).then((s) => setList(s.docs.map((d) => ({ id: d.id, ...d.data() }) as Listing))).catch(() => setList([])); }, []);
  if (!list.length) return <div className="empty-listings"><div className="empty-symbol">⌕</div><strong>Henüz aktif ilan yok</strong><span>İlanlar yayınlandıkça bu alanda görünecek.</span><Link className="button outline" href="/ilanlar">Pazaryerine git</Link></div>;
  return <div className="listing-cards">{list.map((x) => <article className="listing-card" key={x.id}><Link href={`/ilan/${x.id}`} className="listing-card-img">▤{x.boostedUntil && x.boostedUntil.toDate() > new Date() && <span className="boost-badge">ÖNE ÇIKAN</span>}</Link><div className="listing-card-body"><Link href={`/ilan/${x.id}`}><h3>{x.title || "Palet ilanı"}</h3></Link><p>{x.dimensions || "Ölçü belirtilmemiş"} · {x.condition || "Durum belirtilmemiş"}</p><p>{x.city || "Türkiye"}</p>{typeof x.pricePerUnit === "number" && <strong>{new Intl.NumberFormat("tr-TR", { style: "currency", currency: x.currency || "TRY" }).format(x.pricePerUnit)} / adet</strong>}</div></article>)}</div>;
}
