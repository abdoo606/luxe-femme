'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { useCart, useSettings } from '@/lib/store';
import { useTranslation } from '@/lib/translations';
import { getPrice, getOriginalPrice } from '@/lib/price';
import { supabase } from '@/lib/supabase';
import ProductModal from './ProductModal';
import toast from 'react-hot-toast';

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [showModal, setShowModal] = useState(false);
  const addItem = useCart((state) => state.addItem);
  const { language } = useSettings();
  const t = useTranslation(language);

  const productName = language === 'ar' ? product.name_ar : product.name_en;
  const price = getPrice(product, language);
  const originalPrice = getOriginalPrice(product, language);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error(t.login);
      return;
    }

    addItem({
      id: product.id,
      name: productName,
      price: price,
      image: product.image_url,
      quantity: 1,
    });
    toast.success(t.addedToCart + ' ✅');
  };

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={() => setShowModal(true)}
        className="cursor-pointer group"
      >
        <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden mb-3">
          <img
            src={product.image_url}
            alt={productName}
            className="w-full h-full object-cover product-image"
          />

          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {product.is_new && (
              <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
                {t.new}
              </span>
            )}
            {discount > 0 && (
              <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                {discount}% {t.discount}
              </span>
            )}
          </div>

          {product.colors && product.colors.length > 0 && (
            <div className="absolute bottom-16 right-3 flex gap-1">
              {product.colors.slice(0, 4).map((color) => (
                <div
                  key={color}
                  className="w-4 h-4 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}

          <button
            onClick={handleQuickAdd}
            className="absolute bottom-3 left-3 right-3 bg-white text-black 
                     py-2.5 rounded-full font-medium opacity-0 group-hover:opacity-100 
                     transform translate-y-4 group-hover:translate-y-0 
                     transition-all duration-300 flex items-center justify-center gap-2
                     hover:bg-black hover:text-white"
          >
            🛍️ {t.addToCart}
          </button>
        </div>

        <div className="px-1">
          <h3 className="font-medium text-gray-900 truncate mb-1">{productName}</h3>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{price} {t.currency}</span>
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {originalPrice} {t.currency}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      <ProductModal
        product={product}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}