import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Next, Geist_Mono } from "next/font/google";
import "@fontsource/opendyslexic/400.css";
import "@fontsource/opendyslexic/700.css";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";

// Designed by the Braille Institute for maximum legibility.
const atkinson = Atkinson_Hyperlegible_Next({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Constela · by Astralis",
  description: "A step-by-step job search for neurodivergent people",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${atkinson.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies saved reading settings before first paint (see accessibility-panel.tsx) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=JSON.parse(localStorage.getItem("a11y")||"{}");for(var k in p)if(p[k])document.documentElement.classList.add(k)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <SiteNav />
        <div className="flex flex-1 flex-col pb-20 md:pb-0">{children}</div>
      </body>
    </html>
  );
}
