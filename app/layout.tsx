import type { Metadata } from "next";
import { Prompt, Montserrat } from "next/font/google";
import MuiProvider from "./components/MuiProvider";
import "./globals.css";

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-prompt",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
// ... existing metadata
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://e-card.seteventthailand.com'),
  title: "E-Card Wedding | seteventthailand การ์ดงานแต่งออนไลน์",
  description: "สร้างสรรค์การ์ดงานแต่งงานออนไลน์ระดับพรีเมียม ดีไซน์หรูหรา ทันสมัย พร้อมระบบลงทะเบียน RSVP และแผนที่นำทาง ครบจบในลิงก์เดียว โดย seteventthailand.com",
  keywords: ["e-card wedding", "seteventthailand", "การ์ดงานแต่งออนไลน์", "การ์ดแต่งงานดิจิทัล", "Digital Wedding Card", "Wedding Invitation", "ลงทะเบียนงานแต่ง", "RSVP ออนไลน์", "การ์ดงานแต่งพรีเมียม", "Mobile Wedding Card", "Wedding Card Link", "การ์ดเชิญออนไลน์"],
  authors: [{ name: "seteventthailand.com" }],
  openGraph: {
    title: "E-Card Wedding | seteventthailand การ์ดงานแต่งออนไลน์",
    description: "สร้างสรรค์การ์ดงานแต่งงานออนไลน์ระดับพรีเมียม ดีไซน์หรูหรา ทันสมัย พร้อมระบบลงทะเบียน RSVP ครบจบในลิงก์เดียว",
    url: "https://e-card.seteventthailand.com",
    siteName: "seteventthailand",
    images: [
      {
        url: "/images/logo_black1.png",
        width: 1200,
        height: 630,
        alt: "E-Card Wedding Seteventthailand",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Card Wedding | seteventthailand การ์ดงานแต่งออนไลน์",
    description: "สร้างสรรค์การ์ดงานแต่งงานออนไลน์ระดับพรีเมียม ดีไซน์หรูหรา ทันสมัย พร้อมระบบลงทะเบียน RSVP ครบจบในลิงก์เดียว",
    images: ["/images/logo_black1.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" translate="no" suppressHydrationWarning>
      <head>
        <meta name="google" content="notranslate" />
        {/* Only Script fonts via CDN, others via next/font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Bebas+Neue&family=Italianno&family=Pinyon+Script&family=Carattere&family=Great+Vibes&family=Parisienne&display=swap" rel="stylesheet" />
      </head>
      <body className={`${prompt.variable} ${montserrat.variable}`} suppressHydrationWarning>
        <MuiProvider>
          {children}
        </MuiProvider>
      </body>
    </html>
  );
}
