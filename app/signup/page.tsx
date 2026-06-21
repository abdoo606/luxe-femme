'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const e: any = {};
    
    if (form.full_name.trim().length < 3) {
      e.full_name = 'الاسم قصير جداً';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      e.email = 'بريد إلكتروني غير صحيح';
    }

    if (form.password.length < 8) {
      e.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    }

    if (!/[A-Z]/.test(form.password)) {
      e.password = 'يجب أن تحتوي على حرف كبير واحد على الأقل';
    }

    if (!/[0-9]/.test(form.password)) {
      e.password = 'يجب أن تحتوي على رقم واحد على الأقل';
    }

    if (form.password !== form.confirm) {
      e.confirm = 'كلمتا المرور غير متطابقتين';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('الرجاء تصحيح الأخطاء');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name } },
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
            toast.success('تم إنشاء حسابك! تحققي من بريدك الإلكتروني ✅', { duration: 5000 });
      router.push('/verify');
    }
  };

  // قوة كلمة المرور
  const getPasswordStrength = () => {
    let strength = 0;
    if (form.password.length >= 8) strength++;
    if (/[A-Z]/.test(form.password)) strength++;
    if (/[0-9]/.test(form.password)) strength++;
    if (/[^A-Za-z0-9]/.test(form.password)) strength++;
    return strength;
  };

  const strength = getPasswordStrength();
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  const strengthText = ['ضعيفة', 'متوسطة', 'جيدة', 'قوية'];

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2 text-center">إنشاء حساب</h1>
        <p className="text-center text-gray-500 mb-6">انضمي لعائلة LUXE FEMME</p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="الاسم الكامل"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className={`w-full border rounded-lg p-3 focus:outline-none focus:border-amber-500 ${errors.full_name ? 'border-red-500' : ''}`}
            />
            {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
          </div>

          <div>
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`w-full border rounded-lg p-3 focus:outline-none focus:border-amber-500 ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="كلمة المرور"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`w-full border rounded-lg p-3 focus:outline-none focus:border-amber-500 ${errors.password ? 'border-red-500' : ''}`}
            />
            {form.password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded ${i < strength ? strengthColors[strength - 1] : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
                <p className="text-xs mt-1 text-gray-500">
                  قوة كلمة المرور: {strengthText[strength - 1] || 'ضعيفة جداً'}
                </p>
              </div>
            )}
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="تأكيد كلمة المرور"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className={`w-full border rounded-lg p-3 focus:outline-none focus:border-amber-500 ${errors.confirm ? 'border-red-500' : ''}`}
            />
            {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'جاري التسجيل...' : 'إنشاء حساب'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          لديك حساب بالفعل؟{' '}
          <Link href="/login" className="text-amber-600 font-bold">سجلي الدخول</Link>
        </p>
      </div>
    </div>
  );
}