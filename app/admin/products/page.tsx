'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useSettings } from '@/lib/store';
import { useTranslation } from '@/lib/translations';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { language } = useSettings();
  const t = useTranslation(language);

  const labels: any = {
    en: {
      manage: 'Manage Products', orders: 'Orders', addProduct: 'Add Product',
      close: 'Close', editProduct: 'Edit Product', addNew: 'Add New Product',
      nameAr: 'Name (Arabic)', nameEn: 'Name (English)', descAr: 'Description (Arabic)',
      descEn: 'Description (English)', prices: 'Prices (USD primary)',
      priceUsd: 'USD Price', priceSar: 'SAR Price', priceEur: 'EUR Price',
      beforeDiscount: 'Before discount', category: 'Category', stock: 'Stock',
      imageUrl: 'Image URL', sizes: 'Sizes', colors: 'Colors',
      new: 'New', featured: 'Featured', sale: 'Sale',
      save: 'Save Changes', add: 'Add Product', priceNote: 'If SAR/EUR empty, USD will be used',
      image: 'Image', name: 'Name', price: 'Price', status: 'Status', actions: 'Actions',
      pieces: 'pcs', noProducts: 'No products', totalProducts: 'Total Products',
      available: 'Available', outOfStock: 'Out of Stock', totalPieces: 'Total Pieces',
      confirmDelete: 'Are you sure?', edited: 'Edited ✅', added: 'Added ✅',
      deleted: 'Deleted ✅', error: 'Error', unauthorized: 'Unauthorized',
      dresses: 'Dresses', abayas: 'Abayas', bags: 'Bags', shoes: 'Shoes',
      accessories: 'Accessories', perfumes: 'Perfumes'
    },
    ar: {
      manage: 'إدارة المنتجات', orders: 'الطلبات', addProduct: 'إضافة منتج',
      close: 'إغلاق', editProduct: 'تعديل منتج', addNew: 'إضافة منتج جديد',
      nameAr: 'الاسم بالعربي', nameEn: 'الاسم بالإنجليزي', descAr: 'الوصف بالعربي',
      descEn: 'الوصف بالإنجليزي', prices: 'الأسعار (الدولار رئيسي)',
      priceUsd: 'السعر بالدولار', priceSar: 'السعر بالريال', priceEur: 'السعر باليورو',
      beforeDiscount: 'قبل الخصم', category: 'الفئة', stock: 'الكمية',
      imageUrl: 'رابط الصورة', sizes: 'المقاسات', colors: 'الألوان',
      new: 'جديد', featured: 'مميز', sale: 'عرض',
      save: 'حفظ التعديلات', add: 'إضافة المنتج', priceNote: 'لو تركت الريال/اليورو فارغين، سيُستخدم الدولار',
      image: 'الصورة', name: 'الاسم', price: 'السعر', status: 'الحالة', actions: 'إجراءات',
      pieces: 'قطعة', noProducts: 'لا توجد منتجات', totalProducts: 'إجمالي المنتجات',
      available: 'متوفر', outOfStock: 'نفذ المخزون', totalPieces: 'إجمالي القطع',
      confirmDelete: 'هل أنت متأكد؟', edited: 'تم التعديل ✅', added: 'تمت الإضافة ✅',
      deleted: 'تم الحذف ✅', error: 'خطأ', unauthorized: 'غير مصرح',
      dresses: 'فساتين', abayas: 'عبايات', bags: 'حقائب', shoes: 'أحذية',
      accessories: 'إكسسوارات', perfumes: 'عطور'
    },
    fr: {
      manage: 'Gérer les produits', orders: 'Commandes', addProduct: 'Ajouter',
      close: 'Fermer', editProduct: 'Modifier', addNew: 'Nouveau produit',
      nameAr: 'Nom (Arabe)', nameEn: 'Nom (Anglais)', descAr: 'Description (Arabe)',
      descEn: 'Description (Anglais)', prices: 'Prix (USD principal)',
      priceUsd: 'Prix USD', priceSar: 'Prix SAR', priceEur: 'Prix EUR',
      beforeDiscount: 'Avant remise', category: 'Catégorie', stock: 'Stock',
      imageUrl: "URL d'image", sizes: 'Tailles', colors: 'Couleurs',
      new: 'Nouveau', featured: 'Vedette', sale: 'Solde',
      save: 'Enregistrer', add: 'Ajouter', priceNote: 'Si SAR/EUR vide, USD utilisé',
      image: 'Image', name: 'Nom', price: 'Prix', status: 'Statut', actions: 'Actions',
      pieces: 'pcs', noProducts: 'Aucun produit', totalProducts: 'Total produits',
      available: 'Disponible', outOfStock: 'Épuisé', totalPieces: 'Total pièces',
      confirmDelete: 'Êtes-vous sûr?', edited: 'Modifié ✅', added: 'Ajouté ✅',
      deleted: 'Supprimé ✅', error: 'Erreur', unauthorized: 'Non autorisé',
      dresses: 'Robes', abayas: 'Abayas', bags: 'Sacs', shoes: 'Chaussures',
      accessories: 'Accessoires', perfumes: 'Parfums'
    },
    es: {
      manage: 'Gestionar productos', orders: 'Pedidos', addProduct: 'Añadir',
      close: 'Cerrar', editProduct: 'Editar', addNew: 'Nuevo producto',
      nameAr: 'Nombre (Árabe)', nameEn: 'Nombre (Inglés)', descAr: 'Descripción (Árabe)',
      descEn: 'Descripción (Inglés)', prices: 'Precios (USD principal)',
      priceUsd: 'Precio USD', priceSar: 'Precio SAR', priceEur: 'Precio EUR',
      beforeDiscount: 'Antes descuento', category: 'Categoría', stock: 'Stock',
      imageUrl: 'URL imagen', sizes: 'Tallas', colors: 'Colores',
      new: 'Nuevo', featured: 'Destacado', sale: 'Oferta',
      save: 'Guardar', add: 'Añadir', priceNote: 'Si SAR/EUR vacío, USD usado',
      image: 'Imagen', name: 'Nombre', price: 'Precio', status: 'Estado', actions: 'Acciones',
      pieces: 'pcs', noProducts: 'Sin productos', totalProducts: 'Total productos',
      available: 'Disponible', outOfStock: 'Agotado', totalPieces: 'Total piezas',
      confirmDelete: '¿Estás seguro?', edited: 'Editado ✅', added: 'Añadido ✅',
      deleted: 'Eliminado ✅', error: 'Error', unauthorized: 'No autorizado',
      dresses: 'Vestidos', abayas: 'Abayas', bags: 'Bolsos', shoes: 'Zapatos',
      accessories: 'Accesorios', perfumes: 'Perfumes'
    },
  };
  const l = labels[language];

  const [form, setForm] = useState({
    name_ar: '', name_en: '', description_ar: '', description_en: '',
    price: '', price_sar: '', price_eur: '', original_price: '', original_price_sar: '', original_price_eur: '',
    category: 'dresses', image_url: '', sizes: 'S,M,L,XL', colors: '#000000,#FFFFFF,#D4AF37',
    stock: '', is_new: false, is_featured: false, is_on_sale: false,
  });

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    if (!profile?.is_admin) { toast.error(l.unauthorized); router.push('/'); return; }
    setIsAdmin(true);
    fetchProducts();
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  const resetForm = () => {
    setForm({
      name_ar: '', name_en: '', description_ar: '', description_en: '',
      price: '', price_sar: '', price_eur: '', original_price: '', original_price_sar: '', original_price_eur: '',
      category: 'dresses', image_url: '', sizes: 'S,M,L,XL', colors: '#000000,#FFFFFF,#D4AF37',
      stock: '', is_new: false, is_featured: false, is_on_sale: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product: any) => {
    setForm({
      name_ar: product.name_ar || '', name_en: product.name_en || '',
      description_ar: product.description_ar || '', description_en: product.description_en || '',
      price: product.price?.toString() || '', price_sar: product.price_sar?.toString() || '',
      price_eur: product.price_eur?.toString() || '', original_price: product.original_price?.toString() || '',
      original_price_sar: product.original_price_sar?.toString() || '', original_price_eur: product.original_price_eur?.toString() || '',
      category: product.category || 'dresses', image_url: product.image_url || '',
      sizes: Array.isArray(product.sizes) ? product.sizes.join(',') : 'S,M,L,XL',
      colors: Array.isArray(product.colors) ? product.colors.join(',') : '#000000,#FFFFFF',
      stock: product.stock?.toString() || '', is_new: product.is_new || false,
      is_featured: product.is_featured || false, is_on_sale: product.is_on_sale || false,
    });
    setEditingId(product.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name_ar: form.name_ar, name_en: form.name_en,
      description_ar: form.description_ar, description_en: form.description_en,
      price: Number(form.price), price_sar: form.price_sar ? Number(form.price_sar) : null,
      price_eur: form.price_eur ? Number(form.price_eur) : null,
      original_price: form.original_price ? Number(form.original_price) : null,
      original_price_sar: form.original_price_sar ? Number(form.original_price_sar) : null,
      original_price_eur: form.original_price_eur ? Number(form.original_price_eur) : null,
      category: form.category, image_url: form.image_url,
      sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
      colors: form.colors.split(',').map(c => c.trim()).filter(Boolean),
      stock: Number(form.stock), is_new: form.is_new,
      is_featured: form.is_featured, is_on_sale: form.is_on_sale,
    };

    if (editingId) {
      const { error } = await supabase.from('products').update(productData).eq('id', editingId);
      if (error) toast.error(l.error);
      else { toast.success(l.edited); resetForm(); fetchProducts(); }
    } else {
      const { error } = await supabase.from('products').insert(productData);
      if (error) toast.error(l.error);
      else { toast.success(l.added); resetForm(); fetchProducts(); }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(l.confirmDelete)) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) toast.error(l.error);
    else { toast.success(l.deleted); fetchProducts(); }
  };

  const getCategoryName = (cat: string) => {
    const emojis: any = { dresses: '👗', abayas: '🥻', bags: '👜', shoes: '👠', accessories: '💎', perfumes: '🌸' };
    return `${emojis[cat] || ''} ${l[cat] || cat}`;
  };

  if (loading) return <div className="text-center py-20">...</div>;
  if (!isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-bold dark:text-white">🛍️ {l.manage}</h1>
        <div className="flex gap-2">
          <Link href="/admin" className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300">
            📦 {l.orders}
          </Link>
          <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="btn-primary">
            {showForm ? `✕ ${l.close}` : `+ ${l.addProduct}`}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 dark:text-white">
            {editingId ? `✏️ ${l.editProduct}` : `➕ ${l.addNew}`}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder={l.nameAr + ' *'} required
              value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
              className="border rounded-lg p-3" />
            <input type="text" placeholder={l.nameEn + ' *'} required
              value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })}
              className="border rounded-lg p-3" />
            <input type="text" placeholder={l.descAr}
              value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })}
              className="border rounded-lg p-3" />
            <input type="text" placeholder={l.descEn}
              value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })}
              className="border rounded-lg p-3" />

            <div className="md:col-span-2 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
              <h3 className="font-bold mb-3 dark:text-white">💰 {l.prices}</h3>
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-500">🇬🇧 {l.priceUsd} ($) *</label>
                  <input type="number" step="0.01" placeholder={l.priceUsd} required
                    value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="border rounded-lg p-3 w-full" />
                  <input type="number" step="0.01" placeholder={l.beforeDiscount}
                    value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })}
                    className="border rounded-lg p-2 w-full mt-1 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">🇸🇦 {l.priceSar} (ر.س)</label>
                  <input type="number" step="0.01" placeholder={l.priceSar}
                    value={form.price_sar} onChange={(e) => setForm({ ...form, price_sar: e.target.value })}
                    className="border rounded-lg p-3 w-full" />
                  <input type="number" step="0.01" placeholder={l.beforeDiscount}
                    value={form.original_price_sar} onChange={(e) => setForm({ ...form, original_price_sar: e.target.value })}
                    className="border rounded-lg p-2 w-full mt-1 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">🇪🇺 {l.priceEur} (€)</label>
                  <input type="number" step="0.01" placeholder={l.priceEur}
                    value={form.price_eur} onChange={(e) => setForm({ ...form, price_eur: e.target.value })}
                    className="border rounded-lg p-3 w-full" />
                  <input type="number" step="0.01" placeholder={l.beforeDiscount}
                    value={form.original_price_eur} onChange={(e) => setForm({ ...form, original_price_eur: e.target.value })}
                    className="border rounded-lg p-2 w-full mt-1 text-sm" />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">💡 {l.priceNote}</p>
            </div>

            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border rounded-lg p-3">
              <option value="dresses">{l.dresses}</option>
              <option value="abayas">{l.abayas}</option>
              <option value="bags">{l.bags}</option>
              <option value="shoes">{l.shoes}</option>
              <option value="accessories">{l.accessories}</option>
              <option value="perfumes">{l.perfumes}</option>
            </select>
            <input type="number" placeholder={l.stock + ' *'} required
              value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="border rounded-lg p-3" />
            <input type="text" placeholder={l.imageUrl + ' *'} required
              value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className="border rounded-lg p-3 md:col-span-2" />
            <input type="text" placeholder={l.sizes + ' (S,M,L,XL)'}
              value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })}
              className="border rounded-lg p-3 md:col-span-2" />
            <div className="md:col-span-2">
              <input type="text" placeholder={l.colors + ' (#000000,#FFFFFF)'}
                value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })}
                className="border rounded-lg p-3 w-full" />
              <div className="flex gap-2 mt-2">
                {form.colors.split(',').map((color, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: color.trim() }} title={color.trim()} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-4 flex-wrap dark:text-white">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_new}
                onChange={(e) => setForm({ ...form, is_new: e.target.checked })} />
              <span>{l.new}</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
              <span>{l.featured}</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_on_sale}
                onChange={(e) => setForm({ ...form, is_on_sale: e.target.checked })} />
              <span>{l.sale}</span>
            </label>
          </div>

          <button type="submit" className="btn-primary mt-4">
            {editingId ? `💾 ${l.save}` : `➕ ${l.add}`}
          </button>
        </form>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700">
              <tr className="dark:text-white">
                <th className="p-3 text-right">{l.image}</th>
                <th className="p-3 text-right">{l.name}</th>
                <th className="p-3 text-right">{l.category}</th>
                <th className="p-3 text-right">{l.colors}</th>
                <th className="p-3 text-right">{l.price}</th>
                <th className="p-3 text-right">{l.stock}</th>
                <th className="p-3 text-right">{l.status}</th>
                <th className="p-3 text-right">{l.actions}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-3">
                    <img src={product.image_url} alt={product.name_ar} className="w-12 h-16 object-cover rounded" />
                  </td>
                  <td className="p-3">
                    <p className="font-medium dark:text-white">{language === 'ar' ? product.name_ar : product.name_en}</p>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                      {getCategoryName(product.category)}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      {Array.isArray(product.colors) && product.colors.slice(0, 4).map((color: string, i: number) => (
                        <div key={i} className="w-5 h-5 rounded-full border border-gray-300"
                          style={{ backgroundColor: color }} title={color} />
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="font-bold dark:text-white">${product.price}</p>
                    {product.price_sar && <p className="text-xs text-gray-500">{product.price_sar} ر.س</p>}
                    {product.price_eur && <p className="text-xs text-gray-500">€{product.price_eur}</p>}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.stock > 10 ? 'bg-green-100 text-green-700' :
                      product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {product.stock} {l.pieces}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1 flex-wrap">
                      {product.is_new && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{l.new}</span>}
                      {product.is_featured && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">{l.featured}</span>}
                      {product.is_on_sale && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">{l.sale}</span>}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(product)}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">✏️</button>
                      <button onClick={() => handleDelete(product.id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <div className="text-center py-12 text-gray-500">{l.noProducts}</div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl text-center">
          <p className="text-2xl font-bold dark:text-white">{products.length}</p>
          <p className="text-sm text-gray-500">{l.totalProducts}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl text-center">
          <p className="text-2xl font-bold text-green-600">{products.filter(p => p.stock > 0).length}</p>
          <p className="text-sm text-gray-500">{l.available}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl text-center">
          <p className="text-2xl font-bold text-red-600">{products.filter(p => p.stock === 0).length}</p>
          <p className="text-sm text-gray-500">{l.outOfStock}</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl text-center">
          <p className="text-2xl font-bold text-amber-600">{products.reduce((sum, p) => sum + p.stock, 0)}</p>
          <p className="text-sm text-gray-500">{l.totalPieces}</p>
        </div>
      </div>
    </div>
  );
}