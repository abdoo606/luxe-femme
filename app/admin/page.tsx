'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useSettings } from '@/lib/store';
import { useTranslation } from '@/lib/translations';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filter, setFilter] = useState('all');
  const { language } = useSettings();
  const t = useTranslation(language);

  const labels: any = {
    en: {
      dashboard: 'Admin Dashboard', manageProducts: 'Manage Products',
      totalOrders: 'Total Orders', pending: 'Pending', confirmed: 'Confirmed',
      shipped: 'Shipped', delivered: 'Delivered', revenue: 'Total Revenue',
      all: 'All', orderNum: 'Order Number', customer: 'Customer',
      name: 'Name', phone: 'Phone', email: 'Email', city: 'City',
      address: 'Address', payment: 'Payment', cod: 'Cash on Delivery',
      products: 'Products', notes: 'Notes', total: 'Total',
      confirm: 'Confirm', ship: 'Ship', deliver: 'Delivered', cancel: 'Cancel',
      noOrders: 'No orders', updated: 'Status updated ✅', error: 'Error',
      unauthorized: 'Unauthorized', loading: 'Loading...'
    },
    ar: {
      dashboard: 'لوحة تحكم الإدارة', manageProducts: 'إدارة المنتجات',
      totalOrders: 'إجمالي الطلبات', pending: 'قيد المراجعة', confirmed: 'مؤكد',
      shipped: 'تم الشحن', delivered: 'تم التوصيل', revenue: 'إجمالي المبيعات',
      all: 'الكل', orderNum: 'رقم الطلب', customer: 'العميل',
      name: 'الاسم', phone: 'الجوال', email: 'الإيميل', city: 'المدينة',
      address: 'العنوان', payment: 'الدفع', cod: 'عند الاستلام',
      products: 'المنتجات', notes: 'ملاحظات', total: 'الإجمالي',
      confirm: 'تأكيد', ship: 'شحن', deliver: 'تم التوصيل', cancel: 'إلغاء',
      noOrders: 'لا توجد طلبات', updated: 'تم التحديث ✅', error: 'خطأ',
      unauthorized: 'غير مصرح', loading: 'جاري التحميل...'
    },
    fr: {
      dashboard: 'Tableau de bord', manageProducts: 'Gérer les produits',
      totalOrders: 'Total commandes', pending: 'En attente', confirmed: 'Confirmé',
      shipped: 'Expédié', delivered: 'Livré', revenue: 'Revenu total',
      all: 'Tout', orderNum: 'N° Commande', customer: 'Client',
      name: 'Nom', phone: 'Téléphone', email: 'Email', city: 'Ville',
      address: 'Adresse', payment: 'Paiement', cod: 'À la livraison',
      products: 'Produits', notes: 'Notes', total: 'Total',
      confirm: 'Confirmer', ship: 'Expédier', deliver: 'Livré', cancel: 'Annuler',
      noOrders: 'Aucune commande', updated: 'Mis à jour ✅', error: 'Erreur',
      unauthorized: 'Non autorisé', loading: 'Chargement...'
    },
    es: {
      dashboard: 'Panel de Admin', manageProducts: 'Gestionar productos',
      totalOrders: 'Total pedidos', pending: 'Pendiente', confirmed: 'Confirmado',
      shipped: 'Enviado', delivered: 'Entregado', revenue: 'Ingresos totales',
      all: 'Todo', orderNum: 'N° Pedido', customer: 'Cliente',
      name: 'Nombre', phone: 'Teléfono', email: 'Email', city: 'Ciudad',
      address: 'Dirección', payment: 'Pago', cod: 'Contra entrega',
      products: 'Productos', notes: 'Notas', total: 'Total',
      confirm: 'Confirmar', ship: 'Enviar', deliver: 'Entregado', cancel: 'Cancelar',
      noOrders: 'Sin pedidos', updated: 'Actualizado ✅', error: 'Error',
      unauthorized: 'No autorizado', loading: 'Cargando...'
    },
  };
  const l = labels[language];

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      toast.error(l.unauthorized);
      router.push('/');
      return;
    }

    setIsAdmin(true);
    fetchOrders();
  };

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) toast.error(l.error);
    else { toast.success(l.updated); fetchOrders(); }
  };

  const getStatusInfo = (status: string) => {
    const statuses: any = {
      pending: { color: 'bg-yellow-100 text-yellow-700', icon: '⏳' },
      confirmed: { color: 'bg-blue-100 text-blue-700', icon: '✅' },
      shipped: { color: 'bg-purple-100 text-purple-700', icon: '🚚' },
      delivered: { color: 'bg-green-100 text-green-700', icon: '📦' },
      cancelled: { color: 'bg-red-100 text-red-700', icon: '❌' },
    };
    const statusInfo = statuses[status] || statuses.pending;
    return { ...statusInfo, text: l[status] || l.pending };
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue: orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + Number(o.total_amount), 0),
  };

  if (loading) return <div className="text-center py-20">{l.loading}</div>;
  if (!isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-bold dark:text-white">🎛️ {l.dashboard}</h1>
        <Link href="/admin/products" className="btn-primary">
          🛍️ {l.manageProducts}
        </Link>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm text-center">
          <p className="text-3xl font-bold dark:text-white">{stats.total}</p>
          <p className="text-sm text-gray-500">{l.totalOrders}</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-2xl shadow-sm text-center">
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-gray-500">{l.pending}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl shadow-sm text-center">
          <p className="text-3xl font-bold text-blue-600">{stats.confirmed}</p>
          <p className="text-sm text-gray-500">{l.confirmed}</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-2xl shadow-sm text-center">
          <p className="text-3xl font-bold text-purple-600">{stats.shipped}</p>
          <p className="text-sm text-gray-500">{l.shipped}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl shadow-sm text-center">
          <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
          <p className="text-sm text-gray-500">{l.delivered}</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl shadow-sm text-center">
          <p className="text-2xl font-bold text-amber-600">{stats.revenue} {t.currency}</p>
          <p className="text-sm text-gray-500">{l.revenue}</p>
        </div>
      </div>

      {/* الفلاتر */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { value: 'all', label: l.all },
          { value: 'pending', label: l.pending },
          { value: 'confirmed', label: l.confirmed },
          { value: 'shipped', label: l.shipped },
          { value: 'delivered', label: l.delivered },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-black text-white dark:bg-amber-500'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* الطلبات */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 text-gray-500">{l.noOrders}</div>
        ) : (
          filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            return (
              <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">{l.orderNum}</p>
                    <p className="font-bold text-lg dark:text-white">{order.order_number}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.created_at).toLocaleString(language)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                    {statusInfo.icon} {statusInfo.text}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <div className="text-sm space-y-1 dark:text-gray-300">
                    <p><strong>👤 {l.name}:</strong> {order.full_name}</p>
                    <p><strong>📱 {l.phone}:</strong> {order.phone}</p>
                    {order.email && <p><strong>📧 {l.email}:</strong> {order.email}</p>}
                  </div>
                  <div className="text-sm space-y-1 dark:text-gray-300">
                    <p><strong>🏙️ {l.city}:</strong> {order.city}</p>
                    <p><strong>📍 {l.address}:</strong> {order.shipping_address}</p>
                    <p><strong>💳 {l.payment}:</strong> {order.payment_method === 'cod' ? l.cod : order.payment_method}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="font-bold text-sm mb-2 dark:text-white">🛍️ {l.products}:</p>
                  <div className="flex gap-2 flex-wrap">
                    {order.items?.map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-2 rounded-lg">
                        <img src={item.image} alt={item.name} className="w-8 h-10 object-cover rounded" />
                        <span className="text-xs dark:text-gray-300">{item.name} ×{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.notes && (
                  <p className="text-sm bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg mb-4 dark:text-gray-300">
                    📝 <strong>{l.notes}:</strong> {order.notes}
                  </p>
                )}

                <div className="flex justify-between items-center mb-4 pt-4 border-t dark:border-gray-700">
                  <span className="font-bold dark:text-white">{l.total}:</span>
                  <span className="text-2xl font-bold text-amber-600">{order.total_amount} {t.currency}</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => updateStatus(order.id, 'confirmed')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">
                    ✅ {l.confirm}
                  </button>
                  <button onClick={() => updateStatus(order.id, 'shipped')}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600">
                    🚚 {l.ship}
                  </button>
                  <button onClick={() => updateStatus(order.id, 'delivered')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">
                    📦 {l.deliver}
                  </button>
                  <button onClick={() => updateStatus(order.id, 'cancelled')}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">
                    ❌ {l.cancel}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}