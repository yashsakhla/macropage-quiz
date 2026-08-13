import type { Metadata } from "next";
import { Inter, Bitter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { Header } from "@/components/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bitter = Bitter({
  variable: "--font-headline",
  weight: ["700", "800", "900"],
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MACROPAGE Business Quiz",
  description: "How tech-ready is your business? Find out live.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bitter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <Providers>
          <LanguageProvider>
            <Header />
            {children}
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
