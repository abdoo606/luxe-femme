import { supabase } from '@/lib/supabase';
import ProductDetails from './ProductDetails';

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (!product) {
    return <div className="text-center py-20">Product not found</div>;
  }

  return <ProductDetails product={product} />;
}