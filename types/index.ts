export interface Product {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  price: number;
  original_price?: number;
  category_id?: string;
  image_url: string;
  images?: string[];
  sizes?: string[];
  colors?: string[];
  stock: number;
  is_new: boolean;
  is_featured: boolean;
  is_on_sale: boolean;
  rating: number;
  reviews_count: number;
}

export interface Category {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  image_url?: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  size?: string;
  color?: string;
  product?: Product;
}