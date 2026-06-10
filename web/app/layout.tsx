import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AeroPlanner — Multi-Agent AI Travel System",
  description:
    "Four specialized AI agents work in concert to find flights, book hotels, build itineraries, and deliver your perfect trip plan.",
  openGraph: {
    title: "AeroPlanner — Multi-Agent AI Travel System",
    description:
      "Four specialized AI agents work together to plan your perfect trip.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
