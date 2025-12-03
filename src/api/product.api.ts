import type { Product, responseCheckout } from "@/types";
import { api } from "@/utils/api";
import { BaseCRUD } from "@/utils/base-crud";

class ProductAPI extends BaseCRUD<Product> {
    constructor() {
        super("/products");
    }

    async getProducts(skip = 0, limit = 20){
        const res = await api.get('products/', {
            params: {skip, limit}
        });
        return res.data
    }

    async searchProducts(query: string) {
        const res = await api.get(`/products/search`, {
        params: { q: query }
        });
        return res.data;
    }
}

export const productApi = new ProductAPI();

// export const checkoutApi = {
//   async createOrder(payload: any) {
//     const res = await api.post('/orders', payload);
//     return res.data;
//   }
// };

// Checkout API (mock)
export const checkoutApi = {
  createOrder: async (payload: any) : Promise<responseCheckout> => {

    console.log(payload)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock response
    return {
      success: false,
      message: 'Gagal menambahkan data',
    };
    // return {
    //   success: true,
    //   message: 'Order created successfully',
    //   orderId: `ORD-${Date.now()}`,
    //   timestamp: new Date().toISOString()
    // };
  }
};