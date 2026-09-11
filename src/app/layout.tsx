import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import DynamicFavicon from "@/components/DynamicFavicon";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Carlson Kingoina — Developer & Creator",
    template: "%s | Carlson Kingoina",
  },
  description:
    "Personal website and portfolio of Carlson Kingoina — a developer and creator building things for the web.",
  metadataBase: new URL("https://carlsonkingoina.dev"),
  openGraph: {
    title: "Carlson Kingoina — Developer & Creator",
    description:
      "Personal website and portfolio of Carlson Kingoina.",
    url: "https://carlsonkingoina.dev",
    siteName: "Carlson Kingoina",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Carlson Kingoina — Developer & Creator",
    description:
      "Personal website and portfolio of Carlson Kingoina.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <DynamicFavicon />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
