import type { Metadata } from "next";
import MuiProvider from "./components/MuiProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elegant Wedding E-Cards | Modern & Minimalist Invitations",
  description: "Create premium digital wedding invitations with our elegant e-card service. Minimalist, parallax-driven, and purely sophisticated.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <MuiProvider>
          {children}
        </MuiProvider>
      </body>
    </html>
  );
}
