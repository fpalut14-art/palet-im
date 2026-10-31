import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PALETÇİM | Palet Ticaretinin Dijital Merkezi",
  description: "Türkiye genelinde palet alım satımı, tedarik talepleri ve sektör çözümleri.",
  applicationName: "PALETÇİM",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr"><body>{children}</body></html>;
}
