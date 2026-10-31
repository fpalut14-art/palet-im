import Link from "next/link";
export default function TermsPage() {
  return <main className="auth-wrap"><Link className="brand" href="/">PALET<span>ÇİM</span></Link><section className="auth-card"><p className="eyebrow">ÜYELİK BİLGİLENDİRMESİ</p><h1>Kullanım koşulları</h1><p className="muted">Üyelik ve elektronik ticaret sözleşmeleri bu aşamada yayınlanmamıştır. Ödeme alınmadan önce hizmet tanımı, taraf bilgileri, 350 TL ücretin vergiler dahil toplam tutarı, iptal/iade koşulları ve tüketici hakları için gerekli metinler hazırlanıp kullanıcıya gösterilecektir.</p><div className="notice">Ödeme sağlayıcısı ve sözleşme onayı tamamlanana kadar üyelik ücreti tahsil edilmez.</div><Link className="back-link" href="/uye-ol">← Üyeliğe dön</Link></section></main>;
}
