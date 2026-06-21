'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';
import { useSettings } from '@/lib/store';
import { useTranslation } from '@/lib/translations';
import { Product } from '@/types';

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useSettings();
  const t = useTranslation(language);
  const searchParams = useSearchParams();
  
  const category = searchParams.get('category');
  const sale = searchParams.get('sale');

  useEffect(() => {
    fetchProducts();
  }, [category, sale]);

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase.from('products').select('*');

    if (category) {
      query = query.eq('category', category);
    }

    if (sale === 'true') {
      query = query.eq('is_on_sale', true);
    }

    query = query.order('created_at', { ascending: false });

    const { data } = await query;
    setProducts(data || []);
    setLoading(false);
  };

  const getCategoryTitle = () => {
    if (sale === 'true') return t.sale;
    if (!category) return t.allProducts;

    const categoryNames: any = {
      dresses: { en: 'Dresses', ar: 'الفساتين', fr: 'Robes', es: 'Vestidos' },
      abayas: { en: 'Abayas', ar: 'العبايات', fr: 'Abayas', es: 'Abayas' },
      bags: { en: 'Bags', ar: 'الحقائب', fr: 'Sacs', es: 'Bolsos' },
      shoes: { en: 'Shoes', ar: 'الأحذية', fr: 'Chaussures', es: 'Zapatos' },
      accessories: { en: 'Accessories', ar: 'الإكسسوارات', fr: 'Accessoires', es: 'Accesorios' },
      perfumes: { en: 'Perfumes', ar: 'العطور', fr: 'Parfums', es: 'Perfumes' },
    };

    return categoryNames[category]?.[language] || category;
  };

  const categories = [
    { slug: '', en: 'All', ar: 'الكل', fr: 'Tout', es: 'Todo', emoji: '🛍️' },
    { slug: 'dresses', en: 'Dresses', ar: 'فساتين', fr: 'Robes', es: 'Vestidos', emoji: '👗' },
    { slug: 'abayas', en: 'Abayas', ar: 'عبايات', fr: 'Abayas', es: 'Abayas', emoji: '🥻' },
    { slug: 'bags', en: 'Bags', ar: 'حقائب', fr: 'Sacs', es: 'Bolsos', emoji: '👜' },
    { slug: 'shoes', en: 'Shoes', ar: 'أحذية', fr: 'Chaussures', es: 'Zapatos', emoji: '👠' },
    { slug: 'accessories', en: 'Accessories', ar: 'إكسسوارات', fr: 'Accessoires', es: 'Accesorios', emoji: '💎' },
    { slug: 'perfumes', en: 'Perfumes', ar: 'عطور', fr: 'Parfums', es: 'Perfumes', emoji: '🌸' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{getCategoryTitle()}</h1>
        <p className="text-gray-600">{products.length} {t.productsAvailable}</p>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {categories.map((cat) => {
          const isActive = (cat.slug === '' && !category && sale !== 'true') || 
                          (cat.slug === category);
          const href = cat.slug ? `/products?category=${cat.slug}` : '/products';
          
          return (
            <a
              key={cat.slug}
              href={href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-black text-white dark:bg-amber-500'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat[language as keyof typeof cat]}</span>
            </a>
          );
        })}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500 text-lg">
            {language === 'ar' ? 'لا توجد منتجات في هذا التصنيف' :
             language === 'fr' ? 'Aucun produit dans cette catégorie' :
             language === 'es' ? 'No hay productos en esta categoría' :
             'No products in this category'}
          </p>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">...</div>}>
      <ProductsContent />
    </Suspense>
  );
}