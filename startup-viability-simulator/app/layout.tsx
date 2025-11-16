import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Startup Viability Simulator",
  description: "AI-Powered Business Analysis for African & Global Markets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
