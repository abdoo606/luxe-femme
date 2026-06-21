'use client';

import { motion } from 'framer-motion';
import { useSettings } from '@/lib/store';
import { useTranslation } from '@/lib/translations';

export default function CategoryGrid() {
  const { language } = useSettings();
  const t = useTranslation(language);

  const categories = [
    { slug: 'dresses', en: 'Dresses', ar: 'فساتين', fr: 'Robes', es: 'Vestidos', emoji: '👗', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600' },
    { slug: 'abayas', en: 'Abayas', ar: 'عبايات', fr: 'Abayas', es: 'Abayas', emoji: '🥻', image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600' },
    { slug: 'bags', en: 'Bags', ar: 'حقائب', fr: 'Sacs', es: 'Bolsos', emoji: '👜', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600' },
    { slug: 'shoes', en: 'Shoes', ar: 'أحذية', fr: 'Chaussures', es: 'Zapatos', emoji: '👠', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600' },
    { slug: 'accessories', en: 'Accessories', ar: 'إكسسوارات', fr: 'Accessoires', es: 'Accesorios', emoji: '💎', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600' },
    { slug: 'perfumes', en: 'Perfumes', ar: 'عطور', fr: 'Parfums', es: 'Perfumes', emoji: '🌸', image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600' },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-3">{t.shopByCategory}</h2>
          <p className="text-gray-600 text-lg">{t.categoryDesc}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <a
                href={`/products?category=${category.slug}`}
                className="group relative block aspect-square rounded-3xl overflow-hidden shadow-lg"
              >
                <img
                  src={category.image}
                  alt={category[language as keyof typeof category]}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 right-6 left-6">
                  <span className="text-4xl mb-2 block">{category.emoji}</span>
                  <h3 className="text-white text-2xl font-bold">
                    {category[language as keyof typeof category]}
                  </h3>
                  <span className="text-amber-400 text-sm group-hover:translate-x-2 transition-transform inline-block">
                    {t.shopNow} →
                  </span>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}