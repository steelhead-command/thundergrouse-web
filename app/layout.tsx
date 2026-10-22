import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thundergrouse | iOS Apps from the Pacific Northwest",
  description: "Thundergrouse LLC builds thoughtful, beautifully designed iOS apps. Founded by brothers Luke and John Stanley in Washington State.",
  keywords: ["iOS apps", "iPhone apps", "Pacific Northwest", "indie developer", "mobile apps"],
  authors: [{ name: "Thundergrouse LLC" }],
  openGraph: {
    title: "Thundergrouse | iOS Apps from the Pacific Northwest",
    description: "Thoughtful, beautifully designed iOS apps from Washington State.",
    url: "https://thundergrouse.com",
    siteName: "Thundergrouse",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thundergrouse | iOS Apps",
    description: "Thoughtful, beautifully designed iOS apps from Washington State.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
