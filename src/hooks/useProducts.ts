import { ref } from 'vue';
import type { Product } from '@/types';
import { productApi } from '@/api/product.api';

export function useProducts() {
  const products = ref<Product[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const skip = ref(0);
  const limit = 20;
  const hasMore = ref(true);

  const loadProducts = async (reset: boolean = false) => {
    if (loading.value || (!hasMore.value && !reset)) return;
    
    try {
      loading.value = true;
      error.value = null;
      
      if (reset) {
        skip.value = 0;
        products.value = [];
        hasMore.value = true;
      }
      
      const data = await productApi.getProducts(skip.value, limit);
      
      if (reset) {
        products.value = data.products;
      } else {
        products.value = [...products.value, ...data.products];
      }
      
      skip.value += limit;
      hasMore.value = products.value.length < data.total;
    } catch (err) {
      error.value = 'Failed to load products';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  return {
    products,
    loading,
    error,
    hasMore,
    loadProducts
  };
}