import "./globals.css";
import { Noto_Sans } from "next/font/google";

const notoSans = Noto_Sans({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "Designações da Semana",
  description:
    "Página pública com as designações atualizadas da reunião Vida e Ministério Cristão.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={notoSans.className}>{children}</body>
    </html>
  );
}
