import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'RoyLux | Premium Fashion & Winter Essentials',
  description:
    'Official online store of RoyLux. Discover heavyweight fleece hoodies, varsity sweatshirts, and tailored winter streetwear crafted from 340+ GSM combed cotton with nationwide delivery across Bangladesh.',
  metadataBase: new URL('https://roylux.vercel.app'),
  openGraph: {
    title: 'RoyLux | Premium Fashion & Winter Essentials',
    description:
      'Heavyweight fleece hoodies, varsity sweatshirts, and tailored winter streetwear.',
    images: ['/images/hero/hero-1.jpg'],
  },
  icons: {
    icon: '/images/logo/roylux-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#0c0c0c] text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-[#164e32] selection:text-white">
        <Header />
        <main className="flex-1 pt-20 sm:pt-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
