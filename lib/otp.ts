import { supabase } from './supabase';

// توليد كود OTP من 6 أرقام
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// إرسال كود التحقق للهاتف
export async function sendPhoneOTP(userId: string, phone: string) {
  const code = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 دقائق

  // حفظ الكود في قاعدة البيانات
  const { error } = await supabase.from('verification_codes').insert({
    user_id: userId,
    phone: phone,
    code: code,
    type: 'phone',
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // ⚠️ للتطوير: نعرض الكود في console
  // 🔴 للإنتاج: استبدل هذا بخدمة SMS حقيقية (Twilio)
  console.log(`📱 كود التحقق للهاتف ${phone}: ${code}`);
  
  // للتجربة: نرجع الكود (احذف هذا في الإنتاج!)
  return { success: true, devCode: code };
}

// التحقق من كود الهاتف
export async function verifyPhoneOTP(userId: string, code: string) {
  const { data, error } = await supabase
    .from('verification_codes')
    .select('*')
    .eq('user_id', userId)
    .eq('code', code)
    .eq('type', 'phone')
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !data) {
    return { success: false, error: 'كود غير صحيح أو منتهي' };
  }

  // تحديث الكود كمستخدم
  await supabase
    .from('verification_codes')
    .update({ used: true })
    .eq('id', data.id);

  // تحديث حالة التحقق
  await supabase
    .from('profiles')
    .update({ phone_verified: true })
    .eq('id', userId);

  return { success: true };
}