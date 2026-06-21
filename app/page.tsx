'use client';

import { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import CategoryGrid from '@/components/CategoryGrid';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';
import { useSettings } from '@/lib/store';
import { useTranslation } from '@/lib/translations';
import { Product } from '@/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { language } = useSettings();
  const t = useTranslation(language);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .limit(8);
    setProducts(data || []);
  };

  return (
    <>
      <Hero />
      <CategoryGrid />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3">{t.featured}</h2>
            <p className="text-gray-600">{t.featuredDesc}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-l from-amber-100 to-pink-100 dark:from-gray-800 dark:to-gray-900 py-16">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-3 dark:text-white">{t.newsletter}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{t.newsletterDesc}</p>
          <form className="flex gap-2 flex-col sm:flex-row">
            <input
              type="email"
              placeholder={t.yourEmail}
              className="flex-1 px-6 py-3 rounded-full border focus:outline-none focus:border-amber-500"
            />
            <button type="submit" className="btn-primary">{t.subscribe}</button>
          </form>
        </div>
      </section>
    </>
  );
}