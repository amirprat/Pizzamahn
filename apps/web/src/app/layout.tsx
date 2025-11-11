import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const madefor = localFont({
  variable: "--font-madefor",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/WixMadeforText-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/WixMadeforText-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/WixMadeforText-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/WixMadeforText-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/WixMadeforText-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "PIZZAMAHN - Pizza Under the Trees",
  description:
    "Pizzamahn serves wood-fired pizza with island soul. Join our pop-up events for fresh 72-hour fermented dough, local ingredients, and good vibes.",
  metadataBase: new URL("https://pizzamahn.com"),
  openGraph: {
    title: "PIZZAMAHN - Pizza Under the Trees",
    description:
      "Wood-fired pizza with island soul. Discover upcoming events, menus, and reservation details.",
    url: "https://pizzamahn.com",
    siteName: "PIZZAMAHN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PIZZAMAHN - Pizza Under the Trees",
    description:
      "Wood-fired pizza pop-ups with island flavor. Reserve your slice under the trees.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${madefor.variable} antialiased bg-white text-brand-charcoal`}>
        {children}
      </body>
    </html>
  );
}
