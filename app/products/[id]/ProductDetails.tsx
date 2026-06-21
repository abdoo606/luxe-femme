'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { useCart, useSettings } from '@/lib/store';
import { useTranslation } from '@/lib/translations';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function ProductDetails({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart((state) => state.addItem);
  const { language } = useSettings();
  const t = useTranslation(language);

  const productName = language === 'ar' ? product.name_ar : product.name_en;
  const productDesc = language === 'ar' ? product.description_ar : product.description_en;

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
        price: product.price,
        image: product.image_url,
        quantity: 1,
        size: selectedSize,
      });
    }
    toast.success(t.addedToCart + ' ✅');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
          <img src={product.image_url} alt={productName} className="w-full h-full object-cover" />
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{productName}</h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold">{product.price} {t.currency}</span>
            {product.original_price && (
              <span className="text-xl text-gray-400 line-through">{product.original_price} {t.currency}</span>
            )}
          </div>

          <p className="text-gray-600 mb-6">{productDesc || productName}</p>

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold mb-3">{t.size}:</h3>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-full border-2 font-medium
                      ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-black'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-bold mb-3">{t.quantity}:</h3>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full border-2">-</button>
              <span className="w-12 text-center font-bold">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full border-2">+</button>
            </div>
          </div>

          <button onClick={handleAddToCart} className="btn-primary w-full mb-8">
            🛍️ {t.addToCart}
          </button>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t text-center">
            <div>
              <div className="text-2xl mb-2">🚚</div>
              <p className="text-xs">{t.freeShipping}</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🔄</div>
              <p className="text-xs">{t.returns}</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🔒</div>
              <p className="text-xs">{t.securePayment}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}