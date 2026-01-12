import type { Metadata } from "next";
import "./globals.css";
import { Kantumruy_Pro } from "next/font/google";

export const metadata: Metadata = {
  title: "MoEYS EdTech Examination System",
  description: "ប្រឡងតេស្តស្ដង់ដារ MoEYS EdTech តាម online",
};

const kantumruy = Kantumruy_Pro({
  subsets: ["khmer"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kantumruy",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="km" className={kantumruy.variable} suppressHydrationWarning>
      <body className="font-khmer antialiased">{children}</body>
    </html>
  );
}
