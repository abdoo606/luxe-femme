'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types';
import { useCart, useSettings } from '@/lib/store';
import { useTranslation } from '@/lib/translations';
import { getPrice, getOriginalPrice } from '@/lib/price';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart((state) => state.addItem);
  const { language } = useSettings();
  const t = useTranslation(language);

  if (!product) return null;

  const productName = language === 'ar' ? product.name_ar : product.name_en;
  const productDesc = language === 'ar' ? product.description_ar : product.description_en;
  const price = getPrice(product, language);
  const originalPrice = getOriginalPrice(product, language);

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleAddToCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error(t.login);
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error(t.selectSize);
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: productName,
        price: price,
        image: product.image_url,
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
      });
    }
    toast.success(t.addedToCart + ' ✅');
    onClose();
    setSelectedSize('');
    setSelectedColor('');
    setQuantity(1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative aspect-square md:aspect-auto bg-gray-100">
                  <img
                    src={product.image_url}
                    alt={productName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
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
                </div>

                <div className="p-6 md:p-8 relative">
                  <button
                    onClick={onClose}
                    className="absolute top-4 left-4 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 flex items-center justify-center text-xl"
                  >
                    ✕
                  </button>

                  <h2 className="text-2xl md:text-3xl font-bold mb-3 mt-8 dark:text-white">
                    {productName}
                  </h2>

                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-bold text-amber-600">
                      {price} {t.currency}
                    </span>
                    {originalPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        {originalPrice} {t.currency}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {productDesc || productName}
                  </p>

                  {product.colors && product.colors.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-bold mb-3 dark:text-white">
                        {language === 'ar' ? 'اللون' :
                         language === 'fr' ? 'Couleur' :
                         language === 'es' ? 'Color' : 'Color'}:
                      </h3>
                      <div className="flex gap-3 flex-wrap">
                        {product.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`w-10 h-10 rounded-full border-4 transition-all ${
                              selectedColor === color
                                ? 'border-amber-500 scale-110'
                                : 'border-gray-200 hover:border-gray-400'
                            }`}
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {product.sizes && product.sizes.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-bold mb-3 dark:text-white">{t.size}:</h3>
                      <div className="flex gap-2 flex-wrap">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`min-w-12 h-12 px-3 rounded-xl border-2 font-medium transition-all ${
                              selectedSize === size
                                ? 'border-black bg-black text-white dark:border-amber-500 dark:bg-amber-500'
                                : 'border-gray-300 hover:border-black dark:text-white'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="font-bold mb-3 dark:text-white">{t.quantity}:</h3>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full border-2 hover:border-black dark:text-white dark:border-gray-600"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-bold text-lg dark:text-white">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-full border-2 hover:border-black dark:text-white dark:border-gray-600"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      product.stock > 10 ? 'bg-green-100 text-green-700' :
                      product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {product.stock > 0 
                        ? `${product.stock} ${language === 'ar' ? 'قطعة متوفرة' : language === 'fr' ? 'en stock' : language === 'es' ? 'en stock' : 'in stock'}`
                        : (language === 'ar' ? 'نفذ المخزون' : language === 'fr' ? 'Épuisé' : language === 'es' ? 'Agotado' : 'Out of stock')}
                    </span>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="btn-primary w-full disabled:opacity-50 text-lg"
                  >
                    🛍️ {t.addToCart}
                  </button>

                  <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t dark:border-gray-700 text-center">
                    <div>
                      <div className="text-xl mb-1">🚚</div>
                      <p className="text-xs text-gray-500">{t.freeShipping}</p>
                    </div>
                    <div>
                      <div className="text-xl mb-1">🔄</div>
                      <p className="text-xs text-gray-500">{t.returns}</p>
                    </div>
                    <div>
                      <div className="text-xl mb-1">🔒</div>
                      <p className="text-xs text-gray-500">{t.securePayment}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}