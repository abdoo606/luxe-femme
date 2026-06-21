import { Product } from '@/types';

type Language = 'en' | 'ar' | 'fr' | 'es';

// الحصول على السعر حسب اللغة
export function getPrice(product: Product, language: Language): number {
  switch (language) {
    case 'ar':
      return (product as any).price_sar || product.price;
    case 'fr':
    case 'es':
      return (product as any).price_eur || product.price;
    case 'en':
    default:
      return product.price; // USD رئيسي
  }
}

// الحصول على السعر قبل الخصم حسب اللغة
export function getOriginalPrice(product: Product, language: Language): number | null {
  switch (language) {
    case 'ar':
      return (product as any).original_price_sar || product.original_price || null;
    case 'fr':
    case 'es':
      return (product as any).original_price_eur || product.original_price || null;
    case 'en':
    default:
      return product.original_price || null;
  }
}