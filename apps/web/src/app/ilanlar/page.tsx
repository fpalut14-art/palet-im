"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { db, firebaseReady } from "@/lib/firebase";

type Listing = { id: string; title: string; category: string; dimensions?: string; city?: string; district?: string; condition?: string; pricePerUnit?: number; currency?: string; quantity?: number; sellerUid?: string; boostedUntil?: { toDate(): Date } };
const categories = ["Tümü", "Sıfır ahşap palet", "İkinci el ahşap palet", "Tamirli palet", "Euro palet", "EPAL palet", "Plastik palet", "Metal palet", "Palet tahtası"];
const cities = ["Tüm şehirler", "İstanbul", "Kocaeli", "Bursa", "İzmir", "Ankara", "Konya", "Gaziantep"];
export default function ListingsPage() {
  const [items, setItems] = useState<Listing[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const [term, setTerm] = useState(""); const [draft, setDraft] = useState(""); const [category, setCategory] = useState("Tümü"); const [city, setCity] = useState("Tüm şehirler"); const [sort, setSort] = useState("newest");
  useEffect(() => { const initial = new URLSearchParams(window.location.search).get("q") ?? ""; setTerm(initial); setDraft(initial); }, []);
  useEffect(() => {
    if (!db) { setLoading(false); return; }
    getDocs(query(collection(db, "listings"), where("status", "==", "active"), orderBy("createdAt", "desc"), limit(100)))
      .then((result) => setItems(result.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Listing)))
      .catch(() => setError("İlanlar yüklenemedi. Firebase Firestore kurallarını ve ilan dizinini kontrol edin."))
      .finally(() => setLoading(false));
  }, []);
  const filtered = useMemo(() => {
    const q = term.trim().toLocaleLowerCase("tr-TR");
    const list = items.filter((x) => (category === "Tümü" || x.category === category) && (city === "Tüm şehirler" || x.city === city) && (!q || `${x.title} ${x.dimensions ?? ""} ${x.city ?? ""} ${x.district ?? ""}`.toLocaleLowerCase("tr-TR").includes(q)));
    if (sort === "price-asc") list.sort((a, b) => (a.pricePerUnit ?? Infinity) - (b.pricePerUnit ?? Infinity));
    if (sort === "price-desc") list.sort((a, b) => (b.pricePerUnit ?? -1) - (a.pricePerUnit ?? -1));
    return list;
  }, [items, term, category, city, sort]);
  return <><header className="site-header"><div className="container header-inner"><Link className="brand" href="/">PALET<span>ÇİM</span></Link><nav className="main-nav"><Link href="/ilanlar">İlanlar</Link><Link href="/#kategoriler">Kategoriler</Link><Link href="/#nasil-calisir">Nasıl çalışır?</Link></nav><div className="header-actions"><Link className="login-link" href="/giris">Giriş yap</Link><Link className="button primary small-button" href="/uye-ol">Üye ol · 350 TL</Link></div></div></header>
    <main><section className="listing-top"><div className="container"><div className="eyebrow dark">PALETÇİM PAZARYERİ</div><h1>Palet ilanları</h1><p className="muted">Aktif ilanları ürün, ölçü ve teslimat konumuna göre karşılaştırın.</p><form className="listing-search" onSubmit={(e) => { e.preventDefault(); setTerm(draft.trim()); }}><input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Palet türü, ölçü veya şehir"/><button className="button primary">Ara</button></form></div></section>
      <section className="container listing-layout"><aside className="filters"><h3>Filtreler</h3><label>Palet türü<select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((x) => <option key={x}>{x}</option>)}</select></label><label>Şehir<select value={city} onChange={(e) => setCity(e.target.value)}>{cities.map((x) => <option key={x}>{x}</option>)}</select></label><label>Ölçü<input className="filter-input" placeholder="Örn. 80×120" value={draft} onChange={(e) => { setDraft(e.target.value); setTerm(e.target.value); }}/></label></aside>
        <div><div className="listing-results-head"><strong>{loading ? "İlanlar yükleniyor…" : `${filtered.length} ilan`}</strong><select aria-label="Sıralama" value={sort} onChange={(e) => setSort(e.target.value)}><option value="newest">En yeni</option><option value="price-asc">Fiyat: artan</option><option value="price-desc">Fiyat: azalan</option></select></div>
          {!firebaseReady ? <div className="listing-empty"><strong>İlan altyapısı hazırlanıyor</strong><p>Canlı ilanları görmek için Firebase bağlantı bilgileri ve Firestore veritabanı yapılandırılmalıdır.</p></div> : loading ? <div className="listing-empty">Aktif ilanlar getiriliyor…</div> : error ? <div className="listing-empty"><strong>Bağlantı sorunu</strong><p>{error}</p></div> : filtered.length === 0 ? <div className="listing-empty"><div><strong>Bu filtrelerde henüz aktif ilan yok</strong><p>Başka bir palet türü veya şehir deneyin. İlanlar sisteme eklendikçe burada listelenecek.</p><Link className="button outline" href="/">Ana sayfaya dön</Link></div></div> : <div className="listing-cards">{filtered.map((item) => { const boosted = item.boostedUntil && item.boostedUntil.toDate() > new Date(); return <article className="listing-card" key={item.id}><Link href={`/ilan/${item.id}`} className="listing-card-img">▤{boosted && <span className="boost-badge">ÖNE ÇIKAN İLAN</span>}</Link><div className="listing-card-body"><h3><Link href={`/ilan/${item.id}`}>{item.title}</Link></h3><p>{item.dimensions ?? "Ölçü belirtilmemiş"} · {item.condition ?? "Durum belirtilmemiş"}</p><p>{item.city ?? "Konum belirtilmemiş"}{item.district ? `, ${item.district}` : ""} · Stok: {item.quantity ?? "Sorunuz"}</p>{typeof item.pricePerUnit === "number" ? <strong>{new Intl.NumberFormat("tr-TR", { style: "currency", currency: item.currency ?? "TRY" }).format(item.pricePerUnit)} / adet</strong> : <strong>Fiyat için teklif isteyin</strong>}<Link className="button outline" href={`/ilan/${item.id}`}>İlanı incele</Link></div></article>; })}</div>}
        </div></section></main><footer className="site-footer"><div className="container footer-inner"><Link className="brand" href="/">PALET<span>ÇİM</span></Link><span>Palet Ticaretinin Dijital Merkezi</span><small>© 2026 PALETÇİM</small></div></footer></>;
}
