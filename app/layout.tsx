import type { Metadata } from "next";
import MuiProvider from "./components/MuiProvider";
import "./globals.css";

export const metadata: Metadata = {
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
      </head>
      <body suppressHydrationWarning>
        <MuiProvider>
          {children}
        </MuiProvider>
      </body>
    </html>
  );
}
