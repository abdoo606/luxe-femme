'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error('بيانات الدخول غير صحيحة');
    else { toast.success('تم تسجيل الدخول ✅'); router.push('/'); }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm">
        <h1 className="text-3xl font-bold mb-6 text-center">تسجيل الدخول</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="البريد الإلكتروني" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg p-3" />
          <input type="password" placeholder="كلمة المرور" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-lg p-3" />
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'جاري الدخول...' : 'دخول'}
          </button>
        </form>
        <p className="text-center mt-6">
          ليس لديك حساب؟ <Link href="/signup" className="text-amber-600 font-bold">سجلي الآن</Link>
        </p>
      </div>
    </div>
  );
}