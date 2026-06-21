'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart, useSettings } from '@/lib/store';
import { useTranslation } from '@/lib/translations';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const { language } = useSettings();
  const t = useTranslation(language);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [errors, setErrors] = useState<any>({});

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: '',
    card_number: '',
    card_expiry: '',
    card_cvv: '',
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error(t.login);
      router.push('/login');
      return;
    }

    const emailVerified = user.email_confirmed_at !== null;
    const { data: profile } = await supabase
      .from('profiles')
      .select('phone_verified')
      .eq('id', user.id)
      .single();
    const phoneVerified = profile?.phone_verified || false;

    if (!emailVerified || !phoneVerified) {
      toast.error(language === 'ar' ? 'الرجاء تأكيد حسابك' : 'Please verify your account');
      router.push('/verify');
      return;
    }

    setAuthChecked(true);
  };

  const labels = {
    en: { delivery: 'Delivery Details', payment: 'Payment Method', fullName: 'Full Name', phone: 'Phone', email: 'Email', city: 'City', address: 'Address', notes: 'Notes', confirm: 'Confirm Order', confirming: 'Confirming...', cod: 'Cash on Delivery', codDesc: 'Pay when you receive', card: 'Credit Card', apple: 'Apple Pay', stcpay: 'STC Pay', cardNum: 'Card Number', secure: 'Your info is encrypted' },
    ar: { delivery: 'بيانات التوصيل', payment: 'طريقة الدفع', fullName: 'الاسم الكامل', phone: 'رقم الجوال', email: 'البريد الإلكتروني', city: 'المدينة', address: 'العنوان التفصيلي', notes: 'ملاحظات', confirm: 'تأكيد الطلب', confirming: 'جاري التأكيد...', cod: 'الدفع عند الاستلام', codDesc: 'ادفع عند الوصول', card: 'بطاقة ائتمان', apple: 'Apple Pay', stcpay: 'STC Pay', cardNum: 'رقم البطاقة', secure: 'معلوماتك مشفرة' },
    fr: { delivery: 'Détails de livraison', payment: 'Mode de paiement', fullName: 'Nom complet', phone: 'Téléphone', email: 'Email', city: 'Ville', address: 'Adresse', notes: 'Notes', confirm: 'Confirmer', confirming: 'Confirmation...', cod: 'Paiement à la livraison', codDesc: 'Payez à réception', card: 'Carte', apple: 'Apple Pay', stcpay: 'STC Pay', cardNum: 'Numéro de carte', secure: 'Crypté' },
    es: { delivery: 'Detalles de entrega', payment: 'Método de pago', fullName: 'Nombre completo', phone: 'Teléfono', email: 'Email', city: 'Ciudad', address: 'Dirección', notes: 'Notas', confirm: 'Confirmar', confirming: 'Confirmando...', cod: 'Pago contra entrega', codDesc: 'Paga al recibir', card: 'Tarjeta', apple: 'Apple Pay', stcpay: 'STC Pay', cardNum: 'Número de tarjeta', secure: 'Cifrado' },
  };

  const l = labels[language];

  const validateForm = () => {
    const newErrors: any = {};
    if (form.full_name.trim().length < 3) newErrors.full_name = true;
    if (!/^[0-9+\-\s()]{8,15}$/.test(form.phone)) newErrors.phone = true;
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = true;
    if (form.address.trim().length < 5) newErrors.address = true;
    if (form.city.trim().length < 2) newErrors.city = true;

    if (paymentMethod === 'card') {
      if (!/^[0-9]{16}$/.test(form.card_number.replace(/\s/g, ''))) newErrors.card_number = true;
      if (!/^[0-9]{2}\/[0-9]{2}$/.test(form.card_expiry)) newErrors.card_expiry = true;
      if (!/^[0-9]{3,4}$/.test(form.card_cvv)) newErrors.card_cvv = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error(language === 'ar' ? 'الرجاء تصحيح الأخطاء' : 'Please fix errors');
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('orders').insert({
      user_id: user?.id || null,
      items: items,
      subtotal: getTotal(),
      total_amount: getTotal(),
      full_name: form.full_name,
      phone: form.phone,
      email: form.email,
      shipping_address: form.address,
      city: form.city,
      notes: form.notes,
      payment_method: paymentMethod,
    });

    setLoading(false);

    if (error) {
      toast.error(language === 'ar' ? 'حدث خطأ' : 'Error occurred');
    } else {
      toast.success(language === 'ar' ? 'تم استلام طلبك! 🎉' : 'Order received! 🎉');
      clearCart();
      router.push('/orders');
    }
  };

  if (!authChecked) return <div className="text-center py-20">...</div>;
  if (items.length === 0) return <div className="text-center py-20">{t.emptyCart}</div>;

  const paymentMethods = [
    { id: 'cod', name: l.cod, icon: '💵', desc: l.codDesc },
    { id: 'card', name: l.card, icon: '💳', desc: 'Visa / Mastercard' },
    { id: 'apple', name: l.apple, icon: '🍎', desc: 'Fast & secure' },
    { id: 'stcpay', name: l.stcpay, icon: '📱', desc: 'Wallet' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">{t.checkout}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">📍 {l.delivery}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <input type="text" placeholder={l.fullName + ' *'}
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className={`w-full border rounded-lg p-3 ${errors.full_name ? 'border-red-500' : ''}`}
                />
              </div>
              <div>
                <input type="tel" placeholder={l.phone + ' *'}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={`w-full border rounded-lg p-3 ${errors.phone ? 'border-red-500' : ''}`}
                />
              </div>
              <div className="md:col-span-2">
                <input type="email" placeholder={l.email}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full border rounded-lg p-3 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              <div>
                <input type="text" placeholder={l.city + ' *'}
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className={`w-full border rounded-lg p-3 ${errors.city ? 'border-red-500' : ''}`}
                />
              </div>
              <div>
                <input type="text" placeholder={l.address + ' *'}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className={`w-full border rounded-lg p-3 ${errors.address ? 'border-red-500' : ''}`}
                />
              </div>
              <textarea placeholder={l.notes}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="border rounded-lg p-3 md:col-span-2" rows={3}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">💳 {l.payment}</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <button key={method.id} type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-4 rounded-xl border-2 text-right transition-all ${
                    paymentMethod === method.id ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{method.icon}</span>
                    <div>
                      <p className="font-bold dark:text-white">{method.name}</p>
                      <p className="text-xs text-gray-500">{method.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {paymentMethod === 'card' && (
              <div className="mt-4 space-y-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <input type="text" placeholder={l.cardNum} maxLength={16}
                  value={form.card_number}
                  onChange={(e) => setForm({ ...form, card_number: e.target.value.replace(/\D/g, '') })}
                  className={`w-full border rounded-lg p-3 ${errors.card_number ? 'border-red-500' : ''}`}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MM/YY" maxLength={5}
                    value={form.card_expiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                      setForm({ ...form, card_expiry: val });
                    }}
                    className={`w-full border rounded-lg p-3 ${errors.card_expiry ? 'border-red-500' : ''}`}
                  />
                  <input type="text" placeholder="CVV" maxLength={4}
                    value={form.card_cvv}
                    onChange={(e) => setForm({ ...form, card_cvv: e.target.value.replace(/\D/g, '') })}
                    className={`w-full border rounded-lg p-3 ${errors.card_cvv ? 'border-red-500' : ''}`}
                  />
                </div>
                <p className="text-xs text-gray-500">🔒 {l.secure}</p>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50 text-lg">
            {loading ? l.confirming : `${l.confirm} • ${getTotal()} ${t.currency}`}
          </button>
        </form>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-4 dark:text-white">{t.total}</h2>
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center">
                <img src={item.image} alt={item.name} className="w-12 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  <p className="text-sm font-medium dark:text-white">{item.name}</p>
                  <p className="text-xs text-gray-500">×{item.quantity}</p>
                </div>
                <span className="text-sm font-bold dark:text-white">{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t dark:border-gray-700 pt-4 space-y-2">
            <div className="flex justify-between text-sm dark:text-gray-300">
              <span>{t.subtotal}</span>
              <span>{getTotal()} {t.currency}</span>
            </div>
            <div className="flex justify-between text-sm dark:text-gray-300">
              <span>{t.shipping}</span>
              <span className="text-green-600">{t.free}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t dark:border-gray-700 dark:text-white">
              <span>{t.total}</span>
              <span className="text-amber-600">{getTotal()} {t.currency}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}