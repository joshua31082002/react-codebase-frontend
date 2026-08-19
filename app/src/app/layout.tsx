import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Compass — Make the next move obvious",
  description: "A focused AI thinking partner for shaping ideas and making decisions.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
