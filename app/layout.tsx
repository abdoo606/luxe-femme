import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'LUXE FEMME | Premium Women\'s Fashion',
  description: 'Discover the latest fashion trends',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen pt-20">{children}</main>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}