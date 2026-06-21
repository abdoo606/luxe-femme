-- ═══════════════════════════════════════════════
-- 🌸 LUXE FEMME - Database Schema
-- ═══════════════════════════════════════════════
-- 🇬🇧 Run this entire file in Supabase SQL Editor
-- 🇸🇦 شغّل هذا الملف كاملاً في Supabase SQL Editor
-- 🇫🇷 Exécutez tout ce fichier dans Supabase SQL Editor
-- 🇪🇸 Ejecuta todo este archivo en Supabase SQL Editor
-- ═══════════════════════════════════════════════

-- ───────────────────────────────────────────────
-- TABLES / الجداول / TABLES / TABLAS
-- ───────────────────────────────────────────────

-- Categories / الفئات / Catégories / Categorías
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    image_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products / المنتجات / Produits / Productos
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    price NUMERIC(10,2) NOT NULL,
    original_price NUMERIC(10,2),
    category TEXT,
    image_url TEXT NOT NULL,
    images JSONB DEFAULT '[]',
    sizes JSONB DEFAULT '["S","M","L","XL"]',
    colors JSONB DEFAULT '[]',
    stock INT DEFAULT 0,
    is_new BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_on_sale BOOLEAN DEFAULT false,
    rating NUMERIC(2,1) DEFAULT 0,
    reviews_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles / الملفات الشخصية / Profils / Perfiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    country TEXT DEFAULT 'SA',
    preferred_lang TEXT DEFAULT 'en',
    avatar_url TEXT,
    phone_verified BOOLEAN DEFAULT false,
    email_verified BOOLEAN DEFAULT false,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cart / السلة / Panier / Carrito
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    size TEXT,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id, size, color)
);

-- Wishlist / المفضلة / Favoris / Favoritos
CREATE TABLE wishlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Orders / الطلبات / Commandes / Pedidos
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL DEFAULT 'ORD-' || EXTRACT(EPOCH FROM NOW())::TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    shipping_cost NUMERIC(10,2) DEFAULT 0,
    total_amount NUMERIC(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    shipping_address TEXT NOT NULL,
    city TEXT NOT NULL,
    notes TEXT,
    payment_method TEXT DEFAULT 'cod',
    tracking_number TEXT,
    tracking_status JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews / التقييمات / Avis / Reseñas
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, user_id)
);

-- Verification Codes / أكواد التحقق / Codes / Códigos
CREATE TABLE verification_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    phone TEXT,
    code TEXT NOT NULL,
    type TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ───────────────────────────────────────────────
-- SECURITY / الأمان / SÉCURITÉ / SEGURIDAD
-- ───────────────────────────────────────────────

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

-- Public read / قراءة عامة / Lecture publique / Lectura pública
CREATE POLICY "categories_select_all" ON categories FOR SELECT USING (true);
CREATE POLICY "products_select_all" ON products FOR SELECT USING (true);
CREATE POLICY "reviews_select_all" ON reviews FOR SELECT USING (true);

-- Profiles / الملفات / Profils / Perfiles
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Cart / السلة / Panier / Carrito
CREATE POLICY "cart_select_own" ON cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "cart_insert_own" ON cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cart_update_own" ON cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "cart_delete_own" ON cart_items FOR DELETE USING (auth.uid() = user_id);

-- Wishlist / المفضلة / Favoris / Favoritos
CREATE POLICY "wishlist_select_own" ON wishlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "wishlist_insert_own" ON wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wishlist_delete_own" ON wishlist FOR DELETE USING (auth.uid() = user_id);

-- Orders / الطلبات / Commandes / Pedidos
CREATE POLICY "orders_select_own" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_insert_any" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_view_all_orders" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);
CREATE POLICY "admin_update_orders" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- Reviews / التقييمات / Avis / Reseñas
CREATE POLICY "reviews_insert_own" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update_own" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reviews_delete_own" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Verification / التحقق / Vérification / Verificación
CREATE POLICY "verification_own" ON verification_codes FOR ALL USING (auth.uid() = user_id);

-- ───────────────────────────────────────────────
-- TRIGGERS / المحفزات / DÉCLENCHEURS / DISPARADORES
-- ───────────────────────────────────────────────

-- Auto-create profile / إنشاء ملف تلقائي / Auto-profil / Auto-perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ───────────────────────────────────────────────
-- SAMPLE DATA / بيانات تجريبية / DONNÉES / DATOS
-- ───────────────────────────────────────────────

INSERT INTO categories (name_ar, name_en, slug) VALUES
('فساتين', 'Dresses', 'dresses'),
('عبايات', 'Abayas', 'abayas'),
('حقائب', 'Bags', 'bags'),
('أحذية', 'Shoes', 'shoes'),
('إكسسوارات', 'Accessories', 'accessories'),
('عطور', 'Perfumes', 'perfumes');

INSERT INTO products (name_ar, name_en, description_ar, description_en, price, original_price, image_url, category, sizes, stock, is_new, is_featured, is_on_sale) VALUES
('فستان سهرة ذهبي', 'Golden Evening Gown', 'فستان سهرة فاخر', 'Luxury evening gown', 899, 1200,  'dresses', '["S","M","L","XL"]', 50, true, true, true),
('عباية مطرزة ملكية', 'Royal Embroidered Abaya', 'عباية بتطريز يدوي', 'Hand-embroidered abaya', 650, 850, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600', 'abayas', '["S","M","L","XL"]', 30, true, true, true),
('حقيبة يد جلدية', 'Luxury Leather Handbag', 'حقيبة جلد طبيعي', 'Genuine leather bag', 420, 550, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600', 'bags', '[]', 25, true, true, true),
('حذاء كعب عالي', 'Golden High Heels', 'حذاء كعب فاخر', 'Luxury heels', 380, 480, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600', 'shoes', '["36","37","38","39","40"]', 40, true, true, true),
('قلادة ذهبية', 'Luxury Gold Necklace', 'قلادة ذهب', 'Gold necklace', 220, 290, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600', 'accessories', '[]', 30, true, true, true),
('عطر فرنسي فاخر', 'Luxury French Perfume', 'عطر فرنسي', 'French perfume', 320, 420, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600', 'perfumes', '[]', 40, true, true, true),
('فستان كوكتيل', 'Cocktail Dress', 'فستان كوكتيل عصري', 'Modern cocktail dress', 549, 699,  'dresses', '["S","M","L"]', 40, true, true, true),
('ساعة نسائية', 'Women Watch', 'ساعة أنيقة', 'Elegant watch', 580, 750, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', 'accessories', '[]', 20, true, true, true);

-- ═══════════════════════════════════════════════
-- ✅ COMPLETE! / اكتمل! / TERMINÉ! / ¡COMPLETO!
-- ═══════════════════════════════════════════════
-- To become admin / لتصبح أدمن / Pour devenir admin / Para ser admin:
-- UPDATE profiles SET is_admin = true 
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL');
-- ═══════════════════════════════════════════════