import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "天机算命 - 传统八字命理分析平台",
  description: "基于传统八字理论和真太阳时计算的专业命理分析平台，融合AI智能技术，为您提供精准的命运解读和人生指导。",
  keywords: "八字算命,命理分析,真太阳时,AI算命,传统文化,易学",
  authors: [{ name: "天机算命团队" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "天机算命 - 传统八字命理分析平台",
    description: "传承千年易学智慧，融合现代AI技术，为您揭示命运奥秘",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#2D1B69" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Toaster 
          position="top-right"
          richColors
          closeButton
          duration={3000}
        />
      </body>
    </html>
  );
}
