import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next.js Health App',
  description: 'Minimal Next.js application with a health endpoint',
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
