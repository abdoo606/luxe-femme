'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useSettings } from '@/lib/store';
import { useTranslation } from '@/lib/translations';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { language } = useSettings();
  const t = useTranslation(language);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  const statusLabels: any = {
    en: { pending: 'Pending', confirmed: 'Confirmed', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled', orderNum: 'Order Number', products: 'products', tracking: 'Order Tracking', items: 'Items', delivery: 'Delivery Info', showDetails: 'Show details', hideDetails: 'Hide details' },
    ar: { pending: 'قيد المراجعة', confirmed: 'مؤكد', shipped: 'تم الشحن', delivered: 'تم التوصيل', cancelled: 'ملغي', orderNum: 'رقم الطلب', products: 'منتجات', tracking: 'تتبع الطلب', items: 'المنتجات', delivery: 'بيانات التوصيل', showDetails: 'عرض التفاصيل', hideDetails: 'إخفاء التفاصيل' },
    fr: { pending: 'En attente', confirmed: 'Confirmé', shipped: 'Expédié', delivered: 'Livré', cancelled: 'Annulé', orderNum: 'N° Commande', products: 'produits', tracking: 'Suivi', items: 'Articles', delivery: 'Livraison', showDetails: 'Détails', hideDetails: 'Masquer' },
    es: { pending: 'Pendiente', confirmed: 'Confirmado', shipped: 'Enviado', delivered: 'Entregado', cancelled: 'Cancelado', orderNum: 'N° Pedido', products: 'productos', tracking: 'Seguimiento', items: 'Artículos', delivery: 'Entrega', showDetails: 'Detalles', hideDetails: 'Ocultar' },
  };

  const sl = statusLabels[language];

  const getStatusInfo = (status: string) => {
    const colors: any = {
      pending: { color: 'bg-yellow-100 text-yellow-700', icon: '⏳', step: 1 },
      confirmed: { color: 'bg-blue-100 text-blue-700', icon: '✅', step: 2 },
      shipped: { color: 'bg-purple-100 text-purple-700', icon: '🚚', step: 3 },
      delivered: { color: 'bg-green-100 text-green-700', icon: '📦', step: 4 },
      cancelled: { color: 'bg-red-100 text-red-700', icon: '❌', step: 0 },
    };
    const statusInfo = colors[status] || colors.pending;
    return { ...statusInfo, text: sl[status] ?? statusInfo.text };
  };

  const trackingSteps = [
    { name: sl.pending, icon: '📝' },
    { name: sl.confirmed, icon: '✅' },
    { name: sl.shipped, icon: '🚚' },
    { name: sl.delivered, icon: '📦' },
  ];

  if (loading) return <div className="text-center py-20">...</div>;

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-bold mb-3 dark:text-white">{t.noOrders}</h2>
        <Link href="/products" className="btn-primary inline-block">{t.shopNow}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">{t.myOrders}</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const statusInfo = getStatusInfo(order.status);
          const isExpanded = selectedOrder === order.id;

          return (
            <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => setSelectedOrder(isExpanded ? null : order.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm text-gray-500">{sl.orderNum}</p>
                    <p className="font-bold text-lg dark:text-white">{order.order_number}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                    {statusInfo.icon} {statusInfo.text}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">
                    📅 {new Date(order.created_at).toLocaleDateString(language)}
                  </span>
                  <span className="font-bold text-lg text-amber-600">
                    {order.total_amount} {t.currency}
                  </span>
                </div>

                <button className="text-amber-600 text-sm mt-3 font-medium">
                  {isExpanded ? `▲ ${sl.hideDetails}` : `▼ ${sl.showDetails}`}
                </button>
              </div>

              {isExpanded && (
                <div className="border-t dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900">
                  {order.status !== 'cancelled' && (
                    <div className="mb-6">
                      <h3 className="font-bold mb-4 dark:text-white">📍 {sl.tracking}</h3>
                      <div className="flex justify-between items-center relative">
                        <div className="absolute top-5 right-0 left-0 h-1 bg-gray-200 dark:bg-gray-700">
                          <div className="h-full bg-amber-500 transition-all duration-500"
                            style={{ width: `${(statusInfo.step / 4) * 100}%` }} />
                        </div>
                        {trackingSteps.map((step, i) => (
                          <div key={i} className="flex flex-col items-center z-10">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                              i < statusInfo.step ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                            }`}>
                              {step.icon}
                            </div>
                            <span className={`text-xs mt-2 ${i < statusInfo.step ? 'font-bold dark:text-white' : 'text-gray-400'}`}>
                              {step.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="font-bold mb-3 dark:text-white">🛍️ {sl.items}</h3>
                    <div className="space-y-2">
                      {order.items?.map((item: any, i: number) => (
                        <div key={i} className="flex gap-3 items-center bg-white dark:bg-gray-800 p-3 rounded-lg">
                          <img src={item.image} alt={item.name} className="w-12 h-16 object-cover rounded" />
                          <div className="flex-1">
                            <p className="font-medium text-sm dark:text-white">{item.name}</p>
                            <p className="text-xs text-gray-500">×{item.quantity}</p>
                          </div>
                          <span className="font-bold text-sm dark:text-white">{item.price * item.quantity} {t.currency}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-bold mb-2 dark:text-white">📍 {sl.delivery}</h3>
                    <div className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                      <p>👤 {order.full_name}</p>
                      <p>📱 {order.phone}</p>
                      <p>🏙️ {order.city}</p>
                      <p>📍 {order.shipping_address}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}