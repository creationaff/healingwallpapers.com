import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export const metadata: Metadata = {
  metadataBase: new URL('https://healingwallpapers.com'),
  title: {
    default: "HealingWallpapers.com | Natural Healing & Custom Wallpapers",
    template: "%s | HealingWallpapers.com"
  },
  description: "Discover natural healing modalities tailored to your symptoms. Get custom, AI-generated wallpapers with healing affirmations and remedies for iPhone, Android, and Desktop.",
  keywords: ["natural healing", "symptom checker", "healing wallpapers", "holistic health", "herbal remedies", "essential oils", "wellness", "affirmations"],
  authors: [{ name: "HealingWallpapers.com" }],
  creator: "HealingWallpapers.com",
  publisher: "HealingWallpapers.com",
  openGraph: {
    title: "HealingWallpapers.com | Natural Healing Journey",
    description: "Turn your symptoms into healing art. Get personalized natural remedies and a beautiful wallpaper to guide your recovery.",
    url: 'https://healingwallpapers.com',
    siteName: 'HealingWallpapers.com',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png', // We should create a default OG image
        width: 1200,
        height: 630,
        alt: 'HealingWallpapers.com Preview',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "HealingWallpapers.com",
    description: "Natural healing tailored to you. Get your custom recovery wallpaper today.",
    images: ['/og-image.png'], // Same as OG image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased text-stone-800 bg-stone-50`}>
        {children}
      </body>
    </html>
  );
}
