import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SetEventWedding | รับจัดงานแต่งงานระดับพรีเมียม",
  description: "SetEventWedding บริการจัดงานแต่งงานแบบครบวงจร ดูแลทุกรายละเอียดด้วยความเป็นมืออาชีพ ตกแต่งสถานที่หรูหรา สร้างสรรค์ช่วงเวลาสุดพิเศษที่คุณจะจดจำไปตลอดชีวิต",
  keywords: ["wedding planner", "จัดงานแต่งงาน", "wedding decoration", "set event wedding", "งานแต่งงาน"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
