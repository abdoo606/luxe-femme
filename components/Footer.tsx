'use client';

import Link from 'next/link';
import { useSettings } from '@/lib/store';
import { useTranslation } from '@/lib/translations';

export default function Footer() {
  const { language } = useSettings();
  const t = useTranslation(language);

  return (
    <footer className="bg-gradient-to-b from-black to-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-white">LUXE</span>
              <span className="gradient-text"> FEMME</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t.heroDesc}
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-amber-400">{t.quickLinks}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/products" className="hover:text-amber-500 transition-colors">{t.products}</Link></li>
              <li><Link href="/about" className="hover:text-amber-500 transition-colors">{t.aboutUs}</Link></li>
              <li><Link href="/contact" className="hover:text-amber-500 transition-colors">{t.contactUs}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-amber-400">{t.customerService}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/shipping" className="hover:text-amber-500 transition-colors">{t.shippingPolicy}</Link></li>
              <li><Link href="/returns" className="hover:text-amber-500 transition-colors">{t.returns}</Link></li>
              <li><Link href="/faq" className="hover:text-amber-500 transition-colors">{t.faq}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-amber-400">{t.followUs}</h4>
            <div className="flex gap-3 mb-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full hover:bg-amber-500 transition-all hover:scale-110 flex items-center justify-center text-xl">📷</a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full hover:bg-amber-500 transition-all hover:scale-110 flex items-center justify-center text-xl">👍</a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full hover:bg-amber-500 transition-all hover:scale-110 flex items-center justify-center text-xl">✉️</a>
            </div>
            <div className="flex gap-2">
              <span className="text-2xl">💳</span>
              <span className="text-2xl">🍎</span>
              <span className="text-2xl">📱</span>
              <span className="text-2xl">💵</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-gray-400">
          © 2026 LUXE FEMME. {t.rights} ✨
        </div>
      </div>
    </footer>
  );
}