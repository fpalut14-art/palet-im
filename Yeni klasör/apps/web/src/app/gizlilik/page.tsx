import Link from "next/link";
export default function PrivacyPage() {
  return <main className="auth-wrap"><Link className="brand" href="/">PALET<span>ÇİM</span></Link><section className="auth-card"><p className="eyebrow">VERİ GİZLİLİĞİ</p><h1>KVKK bilgilendirmesi</h1><p className="muted">Kişisel veri envanteri, veri sorumlusu bilgileri, işleme amaçları ve hukuki sebepler, saklama süreleri, aktarım alıcıları ve ilgili kişi başvuru kanalları belirlenerek aydınlatma metni yayınlanacaktır. Bu ekran şu anda tamamlanmış bir KVKK metni değildir.</p><div className="notice">Yasal bilgilendirme ve gerekli açık rıza akışları tamamlanmadan ticari ödeme başlatılmaz.</div><Link className="back-link" href="/uye-ol">← Üyeliğe dön</Link></section></main>;
}
