import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Relay — Make good work inevitable",
  description: "Relay gives ambitious teams the clarity, rhythm, and space to do the work that matters most.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
