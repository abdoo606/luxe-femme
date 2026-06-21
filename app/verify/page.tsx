'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { sendPhoneOTP, verifyPhoneOTP } from '@/lib/otp';
import toast from 'react-hot-toast';

export default function VerifyPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [loading, setLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [devCode, setDevCode] = useState('');

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUser(user);
    setEmailVerified(user.email_confirmed_at !== null);

    const { data: profile } = await supabase
      .from('profiles')
      .select('phone_verified, phone')
      .eq('id', user.id)
      .single();
    
    if (profile?.phone_verified) setPhoneVerified(true);
    if (profile?.phone) setPhone(profile.phone);
  };

  const handleSendOTP = async () => {
    if (phone.length < 8) {
      toast.error('رقم هاتف غير صحيح');
      return;
    }

    setLoading(true);
    await supabase.from('profiles').update({ phone }).eq('id', user.id);
    const result = await sendPhoneOTP(user.id, phone);
    setLoading(false);

    if (result.success) {
      toast.success('تم إرسال كود التحقق 📱');
      setStep('code');
      if (result.devCode) {
        setDevCode(result.devCode);
        toast(`كود التطوير: ${result.devCode}`, { duration: 10000, icon: '🔑' });
      }
    } else {
      toast.error(result.error || 'حدث خطأ');
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('الكود يجب أن يكون 6 أرقام');
      return;
    }

    setLoading(true);
    const result = await verifyPhoneOTP(user.id, otp);
    setLoading(false);

    if (result.success) {
      toast.success('تم التحقق من رقمك بنجاح ✅');
      setPhoneVerified(true);
    } else {
      toast.error(result.error || 'كود غير صحيح');
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
    });
    setLoading(false);

    if (error) {
      toast.error('حدث خطأ');
    } else {
      toast.success('تم إرسال رابط التحقق لبريدك 📧');
    }
  };

  const handleComplete = () => {
    if (emailVerified && phoneVerified) {
      toast.success('تم التحقق بالكامل! 🎉');
      router.push('/products');
    } else {
      toast.error('الرجاء إكمال جميع خطوات التحقق');
    }
  };

  if (!user) return <div className="text-center py-20">جاري التحميل...</div>;

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2 text-center">تأكيد الحساب</h1>
        <p className="text-center text-gray-500 mb-8">
          للأمان، نحتاج للتحقق من بريدك ورقمك
        </p>

        {/* التحقق من الإيميل */}
        <div className={`p-4 rounded-xl border-2 mb-4 ${emailVerified ? 'border-green-500 bg-green-50' : 'border-amber-300 bg-amber-50'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📧</span>
              <span className="font-bold">البريد الإلكتروني</span>
            </div>
            {emailVerified ? (
              <span className="text-green-600 font-bold">✓ مؤكد</span>
            ) : (
              <span className="text-amber-600 font-bold">⏳ قيد الانتظار</span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">{user.email}</p>
          {!emailVerified && (
            <button
              onClick={handleResendEmail}
              disabled={loading}
              className="text-sm text-amber-600 font-bold hover:underline"
            >
              إعادة إرسال رابط التحقق
            </button>
          )}
        </div>

        {/* التحقق من الهاتف */}
        <div className={`p-4 rounded-xl border-2 ${phoneVerified ? 'border-green-500 bg-green-50' : 'border-amber-300 bg-amber-50'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📱</span>
              <span className="font-bold">رقم الهاتف</span>
            </div>
            {phoneVerified ? (
              <span className="text-green-600 font-bold">✓ مؤكد</span>
            ) : (
              <span className="text-amber-600 font-bold">⏳ قيد الانتظار</span>
            )}
          </div>

          {!phoneVerified && (
            <>
              {step === 'phone' ? (
                <div className="space-y-3">
                  <input
                    type="tel"
                    placeholder="رقم الجوال (مثال: 0501234567)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border rounded-lg p-3 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="btn-primary w-full text-sm py-2"
                  >
                    {loading ? 'جاري الإرسال...' : 'إرسال كود التحقق'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="أدخل الكود (6 أرقام)"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full border rounded-lg p-3 text-center text-2xl tracking-widest focus:outline-none focus:border-amber-500"
                  />
                  {devCode && (
                    <p className="text-xs text-center text-blue-600">
                      🔑 كود التطوير: {devCode}
                    </p>
                  )}
                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading}
                    className="btn-primary w-full text-sm py-2"
                  >
                    {loading ? 'جاري التحقق...' : 'تأكيد الكود'}
                  </button>
                  <button
                    onClick={() => setStep('phone')}
                    className="text-sm text-gray-500 hover:underline w-full"
                  >
                    تغيير الرقم
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* زر الإكمال */}
        <button
          onClick={handleComplete}
          disabled={!emailVerified || !phoneVerified}
          className="btn-primary w-full mt-6 disabled:opacity-50"
        >
          {emailVerified && phoneVerified ? 'ابدأ التسوق 🛍️' : 'أكمل التحقق أولاً'}
        </button>

        <button
          onClick={checkUser}
          className="text-sm text-amber-600 hover:underline w-full mt-3"
        >
          🔄 تحديث الحالة
        </button>
      </div>
    </div>
  );
}