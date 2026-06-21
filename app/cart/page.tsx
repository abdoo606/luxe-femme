'use client';

import Link from 'next/link';
import { useCart, useSettings } from '@/lib/store';
import { useTranslation } from '@/lib/translations';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCart();
  const { language } = useSettings();
  const t = useTranslation(language);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛍️</div>
        <h2 className="text-2xl font-bold mb-3 dark:text-white">{t.emptyCart}</h2>
        <Link href="/products" className="btn-primary inline-block">{t.shopNow}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">{t.cart} ({items.length})</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm">
              <img src={item.image} alt={item.name} className="w-24 h-32 object-cover rounded-xl" />
              <div className="flex-1">
                <h3 className="font-bold mb-1 dark:text-white">{item.name}</h3>
                {item.size && <p className="text-sm text-gray-500">{t.size}: {item.size}</p>}
                <p className="font-bold text-amber-600 mt-2">{item.price} {t.currency}</p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-8 h-8 rounded-full border flex items-center justify-center dark:text-white dark:border-gray-600">-</button>
                    <span className="w-8 text-center dark:text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full border flex items-center justify-center dark:text-white dark:border-gray-600">+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full">🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-4 dark:text-white">{t.total}</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between dark:text-gray-300">
              <span>{t.subtotal}</span>
              <span>{getTotal()} {t.currency}</span>
            </div>
            <div className="flex justify-between dark:text-gray-300">
              <span>{t.shipping}</span>
              <span className="text-green-600">{t.free}</span>
            </div>
          </div>
          <div className="border-t dark:border-gray-700 pt-4 flex justify-between font-bold text-lg mb-6 dark:text-white">
            <span>{t.total}</span>
            <span>{getTotal()} {t.currency}</span>
          </div>
          <Link href="/checkout" className="btn-primary w-full text-center block">{t.checkout}</Link>
        </div>
      </div>
    </div>
  );
}