import type { Metadata, Viewport } from "next";
import { Google_Sans_Flex } from "next/font/google";
import { SITE_URL } from "@/lib/text";
import "./globals.css";

const sans = Google_Sans_Flex({
  variable: "--font-sans-body",
  subsets: ["latin", "latin-ext"],
  axes: ["ROND"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Teapository · A community dictionary of tea puns",
  description: "The open-source dictionary of tea puns. Search, upvote and pour in your own. From Até Chá, the Lisbon tea festival.",
  openGraph: { siteName: "Teapository", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#f1ebe0",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} antialiased`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
