import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "@/styles/tokens.css";
import "@/styles/typography.css";
import "@/styles/globals.css";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ReasonMaster India — Reasoning Mastery for 64+ Indian Exams",
  description:
    "The authoritative reasoning prep platform for SSC, Banking, Railways, Defence, Police & State PSC exams. 39 master topics, 207 worked examples, 844 practice questions, and 19,500 high-yield MCQs.",
  keywords: [
    "Reasoning for SSC CGL",
    "Banking Reasoning IBPS PO",
    "Railway RRB NTPC Reasoning",
    "UPSC CSAT Reasoning",
    "Verbal Reasoning",
    "Non-Verbal Reasoning",
    "Syllogism",
    "Coding Decoding",
    "Cubes and Dice",
    "ReasonMaster India",
  ],
  authors: [{ name: "ReasonMaster India" }],
  creator: "ReasonMaster India",
  metadataBase: new URL("https://reasonmasterindia.vercel.app"),
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "ReasonMaster India — Reasoning Mastery for 64+ Indian Exams",
    description:
      "Comprehensive reasoning preparation platform with 39 master topics, 64 exam profiles, and 19,500 practice MCQs.",
    url: "https://reasonmasterindia.vercel.app",
    siteName: "ReasonMaster India",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/assets/og/og-image.svg",
        width: 1200,
        height: 630,
        alt: "ReasonMaster India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ReasonMaster India — 64+ Exams • 19,500 MCQs",
    description: "Reasoning preparation for SSC, Banking, Railways, Defence & State PSC exams.",
    images: ["/assets/og/og-image.svg"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1e40af" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1120" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* Anti-FOUC inline script for instant theme synchronization */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('rm_theme_mode') || 'auto';
                  var resolved = 'light';
                  if (mode === 'dark') {
                    resolved = 'dark';
                  } else if (mode === 'light') {
                    resolved = 'light';
                  } else {
                    var hr = new Date().getHours();
                    resolved = (hr >= 6 && hr < 18) ? 'light' : 'dark';
                  }
                  document.documentElement.setAttribute('data-theme', resolved);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <div className="site-wrapper">
            <Header />
            <main className="main-content">{children}</main>
            <Footer />
            <MobileNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
