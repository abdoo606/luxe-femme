🗄️ Step 2: Create Supabase Project
Go to supabase.com
Click "New Project"
Enter project name
Choose region close to your customers
Set a strong database password
Wait 2 minutes
🔑 Step 3: Get API Keys
Go to Settings → API
Copy Project URL and anon public key
📊 Step 4: Setup Database
Go to SQL Editor
Click "New query"
Open database.sql from this project
Copy all content, paste, click "Run"
You should see "Success" ✅
📧 Step 5: Enable Email Auth
Go to Authentication → Providers
Make sure Email is enabled
Enable "Confirm email"
Save
⚙️ Step 6: Configure Environment
Bash

cp .env.example .env.local
Edit .env.local with your Supabase values:

text

NEXT_PUBLIC_SUPABASE_URL=your-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
▶️ Step 7: Run
Bash

npm run dev
Open http://localhost:3000 🎉

👑 Step 8: Become Admin
Sign up on your site first
Go to Supabase SQL Editor
Run this (replace with your email):
SQL

UPDATE profiles SET is_admin = true 
WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
Refresh - you'll see the admin icon 🎛️
🛍️ Managing Your Store
Once logged in as admin:

Add/edit products from the admin panel
Manage orders and update status
View sales statistics
🌐 Step 9: Deploy (Free)
Push code to GitHub
Go to netlify.com
Import your repository
Add environment variables
Deploy!
⚠️ After deployment, add your site URL in Supabase:
Authentication → URL Configuration

<a name="ar"></a>

🇸🇦 العربية
📋 المتطلبات
Node.js (v18+) - تحميل
VS Code - تحميل
حساب Supabase (مجاني) - تسجيل
🚀 الخطوة 1: تثبيت المكتبات
Bash

npm install
🗄️ الخطوة 2: إنشاء مشروع Supabase
روح على supabase.com
اضغط "New Project"
اكتب اسم المشروع
اختر منطقة قريبة من عملائك
ضع كلمة سر قوية
انتظر دقيقتين
🔑 الخطوة 3: الحصول على المفاتيح
روح Settings → API
انسخ Project URL و anon public key
📊 الخطوة 4: إعداد قاعدة البيانات
روح SQL Editor
اضغط "New query"
افتح database.sql من المشروع
انسخ الكل، الصق، اضغط "Run"
لازم تشوف "Success" ✅
📧 الخطوة 5: تفعيل المصادقة بالإيميل
روح Authentication → Providers
تأكد إن Email مفعّل
فعّل "Confirm email"
احفظ
⚙️ الخطوة 6: إعداد البيئة
Bash

cp .env.example .env.local
عدّل .env.local بقيم Supabase:

text

NEXT_PUBLIC_SUPABASE_URL=رابطك-هنا
NEXT_PUBLIC_SUPABASE_ANON_KEY=مفتاحك-هنا
▶️ الخطوة 7: التشغيل
Bash

npm run dev
افتح http://localhost:3000 🎉

👑 الخطوة 8: كن أدمن
سجّل حساب على موقعك أولاً
روح Supabase SQL Editor
شغّل هذا (غيّر الإيميل):
SQL

UPDATE profiles SET is_admin = true 
WHERE id = (SELECT id FROM auth.users WHERE email = 'إيميلك');
حدّث - راح تشوف أيقونة الأدمن 🎛️
🛍️ إدارة متجرك
بعد تسجيل الدخول كأدمن:

أضف/عدّل المنتجات من لوحة التحكم
أدر الطلبات وغيّر حالتها
شاهد إحصائيات المبيعات
🌐 الخطوة 9: النشر (مجاناً)
ارفع الكود على GitHub
روح netlify.com
استورد مستودعك
أضف متغيرات البيئة
انشر!
⚠️ بعد النشر، أضف رابط موقعك في Supabase:
Authentication → URL Configuration

<a name="fr"></a>

🇫🇷 FRANÇAIS
📋 Prérequis
Node.js (v18+)
VS Code
Compte Supabase (gratuit)
🚀 Étape 1: Installer
Bash

npm install
🗄️ Étape 2: Créer Projet Supabase
supabase.com → New Project
Nom, région, mot de passe
Attendez 2 minutes
🔑 Étape 3: Obtenir les Clés
Settings → API → Copiez URL et anon key

📊 Étape 4: Base de Données
SQL Editor → ouvrez database.sql → Run

📧 Étape 5: Activer Email
Authentication → Providers → Activez Email

⚙️ Étape 6: Configuration
Bash

cp .env.example .env.local
Ajoutez vos valeurs Supabase

▶️ Étape 7: Lancer
Bash

npm run dev
👑 Étape 8: Devenir Admin
SQL

UPDATE profiles SET is_admin = true 
WHERE id = (SELECT id FROM auth.users WHERE email = 'votre-email');
🛍️ Gérer Votre Boutique
Connecté en admin:

Ajoutez/modifiez les produits
Gérez les commandes
Voyez les statistiques
🌐 Étape 9: Déploiement
Netlify → Importez de GitHub → Variables → Deploy

<a name="es"></a>

🇪🇸 ESPAÑOL
📋 Requisitos
Node.js (v18+)
VS Code
Cuenta Supabase (gratis)
🚀 Paso 1: Instalar
Bash

npm install
🗄️ Paso 2: Crear Proyecto Supabase
supabase.com → New Project
Nombre, región, contraseña
Espera 2 minutos
🔑 Paso 3: Obtener Claves
Settings → API → Copia URL y anon key

📊 Paso 4: Base de Datos
SQL Editor → abre database.sql → Run

📧 Paso 5: Activar Email
Authentication → Providers → Activa Email

⚙️ Paso 6: Configuración
Bash

cp .env.example .env.local
Agrega tus valores de Supabase

▶️ Paso 7: Ejecutar
Bash

npm run dev
👑 Paso 8: Ser Admin
SQL

UPDATE profiles SET is_admin = true 
WHERE id = (SELECT id FROM auth.users WHERE email = 'tu-email');
🛍️ Gestionar Tu Tienda
Conectado como admin:

Añade/edita productos
Gestiona pedidos
Ve estadísticas
🌐 Paso 9: Despliegue
Netlify → Importa de GitHub → Variables → Deploy

🔧 Troubleshooting / حل المشاكل
Products not showing? → Run database.sql
Can't add products? → Make sure you're admin
Build errors? → Delete .next, run npm run dev

📞 Support
📧 abdu1rhmant2le@gmail.com | ⏱️ 24-48 hours