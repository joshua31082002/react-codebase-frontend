import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Health API",
  description: "A minimal Next.js application with a health endpoint.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
