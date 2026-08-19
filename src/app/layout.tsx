import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Three in a Row",
  description: "A thoughtful little game of tic tac toe.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
