"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Campaign = { id: string; title: string; subtitle?: string; imageUrl?: string; targetUrl?: string; buttonLabel?: string; startsAt?: { toDate(): Date }; endsAt?: { toDate(): Date }; placement?: string; kind?: "announcement" | "advertisement" };
export default function CampaignCarousel({ placement = "home-slider" }: { placement?: string }) {
  const [items, setItems] = useState<Campaign[]>([]); const [active, setActive] = useState(0);
  useEffect(() => {
    if (!db) return;
    getDocs(query(collection(db, "campaigns"), where("status", "==", "active"), orderBy("priority", "desc"), limit(8)))
      .then((snapshot) => {
        const now = Date.now();
        setItems(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Campaign)
          .filter((x) => (!x.placement || x.placement === placement) && (!x.startsAt || x.startsAt.toDate().getTime() <= now) && (!x.endsAt || x.endsAt.toDate().getTime() > now)));
      }).catch(() => setItems([]));
  }, [placement]);
  if (!items.length) return null;
  const campaign = items[active % items.length];
  const href = campaign.targetUrl && (campaign.targetUrl.startsWith("/") || campaign.targetUrl.startsWith("https://")) ? campaign.targetUrl : "/ilanlar";
  return <section className="campaign-wrap container" aria-label="Öne çıkan duyurular"><article className="campaign-slide" style={campaign.imageUrl ? { backgroundImage: `linear-gradient(90deg,#14283de8,#14283d80),url("${campaign.imageUrl.replaceAll('"', '')}")` } : undefined}>
    <div><span className="eyebrow">{campaign.kind === "advertisement" ? "SPONSORLU" : "PALETÇİM'DE ÖNE ÇIKANLAR"}</span><h2>{campaign.title}</h2><p>{campaign.subtitle}</p><Link className="button white-button" href={href}>{campaign.buttonLabel || "İncele"} <b>→</b></Link></div>
    {items.length > 1 && <div className="campaign-controls"><button aria-label="Önceki banner" onClick={() => setActive((active + items.length - 1) % items.length)}>‹</button><span>{active + 1} / {items.length}</span><button aria-label="Sonraki banner" onClick={() => setActive((active + 1) % items.length)}>›</button></div>}
  </article></section>;
}
