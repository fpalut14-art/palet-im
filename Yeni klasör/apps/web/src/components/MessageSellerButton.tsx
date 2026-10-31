"use client";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { onAuthStateChanged, reload } from "firebase/auth";
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function MessageSellerButton({ sellerUid, listingId }: { sellerUid: string; listingId: string }) {
  const [uid, setUid] = useState(""); const [paid, setPaid] = useState(false); const [checking, setChecking] = useState(true); const [open, setOpen] = useState(false); const [sending, setSending] = useState(false); const [note, setNote] = useState("");
  useEffect(() => { if (!auth || !db) { setChecking(false); return; } return onAuthStateChanged(auth, async (user) => { setUid(user?.uid ?? ""); if (!user) { setPaid(false); setChecking(false); return; } try { await reload(user); await user.getIdToken(true); const member = await getDoc(doc(db!, "users", user.uid)); setPaid(member.data()?.membershipStatus === "active" && user.emailVerified); } catch { setPaid(false); } finally { setChecking(false); } }); }, []);
  if (!sellerUid) return <button className="button primary full" disabled>Satıcı iletişimi hazırlanıyor</button>;
  if (checking) return <button className="button primary full" disabled>Üyelik durumu kontrol ediliyor…</button>;
  if (!uid || !paid) return <Link className="button primary full" href={!uid ? "/uye-ol" : "/odeme"}>{!uid ? "Üye ol ve satıcıyla iletişime geç" : "Mesajlaşmayı aç · 350 TL"}</Link>;
  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; if (!db || !auth?.currentUser) return; const body = String(new FormData(form).get("body") ?? "").trim(); if (!body) return;
    setSending(true); setNote("");
    try {
      await auth.currentUser.getIdToken(true);
      const conversationId = [uid, sellerUid].sort().join("__"); const conversation = doc(db, "conversations", conversationId);
      if (!(await getDoc(conversation)).exists()) await setDoc(conversation, { participantUids: [uid, sellerUid].sort(), createdBy: uid, listingId, createdAt: serverTimestamp() });
      await addDoc(collection(conversation, "messages"), { senderUid: uid, body, createdAt: serverTimestamp() });
      setNote("Mesajınız satıcıya iletildi."); setOpen(false); form.reset();
    } catch { setNote("Mesaj gönderilemedi. Üyeliğinizin aktif ve e-posta adresinizin doğrulanmış olduğundan emin olun."); }
    finally { setSending(false); }
  }
  return <div>{!open ? <button className="button primary full" onClick={() => setOpen(true)}>Satıcıya mesaj gönder</button> : <form className="message-box" onSubmit={send}><label htmlFor="seller-message">Mesajınız</label><textarea id="seller-message" name="body" required minLength={1} maxLength={5000} placeholder="Palet hakkında sorunuzu yazın…"/><button className="button primary full" disabled={sending}>{sending ? "Gönderiliyor…" : "Mesajı gönder"}</button></form>}{note && <p className="small-note">{note}</p>}</div>;
}
