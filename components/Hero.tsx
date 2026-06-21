'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSettings } from '@/lib/store';
import { useTranslation } from '@/lib/translations';

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const { language } = useSettings();
  const t = useTranslation(language);
  const isRTL = language === 'ar';

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative h-[600px] bg-gradient-to-br from-amber-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* الصورة - تتغير حسب الاتجاه */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className={`hidden lg:block absolute top-0 w-1/2 h-full ${isRTL ? 'left-0' : 'right-0'}`}
      >
        <div className="relative w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800"
            alt="Fashion"
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-${isRTL ? 'r' : 'l'} from-amber-50 via-transparent to-transparent dark:from-gray-900`} />
        </div>
      </motion.div>

      {/* النص */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <span className="inline-block bg-amber-500/20 text-amber-700 dark:text-amber-400 px-4 py-1 rounded-full text-sm mb-4">
            ✨ {mounted ? t.newCollection : 'New Collection 2026'}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight dark:text-white">
            {mounted ? t.heroTitle : 'Your Elegance'}
            <br />
            <span className="text-amber-500">{mounted ? t.heroSubtitle : 'Tells Your Story'}</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            {mounted ? t.heroDesc : 'Discover the latest fashion trends'}
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/products" className="btn-primary">
              {mounted ? t.shopNow : 'Shop Now'}
            </Link>
            <Link href="/products?sale=true" className="btn-gold">
              {mounted ? t.exclusiveOffers : 'Exclusive Offers'}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}