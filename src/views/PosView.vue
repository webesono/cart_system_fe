<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
// import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ProductCard from '@/components/ProductCard.vue'
import CartItem from '@/components/CartItem.vue'
import CheckoutModal from '@/components/CheckoutModal.vue'
import Badge from '@/components/ui/badge/Badge.vue'
import { productApi } from '@/api/product.api'
import { useCartStore } from '@/stores/cart.store'
import { useProducts } from '@/hooks/useProducts'
import { Icon } from '@iconify/vue'
import Swal from 'sweetalert2'

// State
const cartStore = useCartStore()
const { products, loading, error, hasMore, loadProducts } = useProducts()
const searchQuery = ref('')
const showCheckoutModal = ref(false)
const textMsg = ref('')

onMounted(() => {
  loadProducts(true)
})

let searchTimeout: ReturnType<typeof setTimeout>
watch(searchQuery, (newQuery) => {
  clearTimeout(searchTimeout)

  if (newQuery.trim() === '') {
    loadProducts(true)
    return
  }

  searchTimeout = setTimeout(async () => {
    try {
      loading.value = true
      const data = await productApi.searchProducts(newQuery)
      products.value = data.products
      hasMore.value = false
    } catch (err) {
      console.error(err)
    } finally {
      loading.value = false
    }
  }, 500)
})

const addToCart = (product: any) => {
  cartStore.addToCart(product)

}

const loadMore = () => {
  loadProducts(false)
}

const handleCheckoutSuccess = () => {
  Swal.fire({
    title: "Produk ditambahkan",
    text: textMsg.value,
    showConfirmButton: false,
    timer: 3000,
    icon: "success"
  });

}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <header class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Cart System</h1>
      </header>

      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Products -->
        <div class="lg:w-3/4">
          <div class="bg-white rounded-xl shadow-sm p-4 mb-4 flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-800">Products</h2>
            <div class="relative w-64">
              <Input v-model="searchQuery" placeholder="Search products..." class="pl-10" />
              <Icon
                icon="mdi:magnify"
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
              @add-to-cart="addToCart"
              class="animate-fade-in"
              :loading="loading"
            />

            <div v-if="loading" v-for="n in 10" :key="`skeleton-${n}`" class="bg-gray-200 rounded-lg animate-pulse aspect-square"></div>
          </div>

          <div v-if="hasMore" class="mt-6 text-center">
            <Button @click="loadMore" :disabled="loading" variant="outline" class="w-full max-w-md">
              <span v-if="loading" class="flex items-center justify-center">
                <Icon icon="eos-icons:loading" class="w-5 h-5 mr-2" /> Loading...
              </span>
              <span v-else>Load More Products</span>
            </Button>
          </div>

          <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center">
              <Icon icon="mdi:alert-circle" class="w-5 h-5 text-red-500 mr-2" />
              <p class="text-red-700">{{ error }}</p>
            </div>
            <Button @click="loadProducts(true)" variant="outline" size="sm" class="mt-2">Retry</Button>
          </div>
        </div>

        <!-- Cart -->
        <div class="lg:w-1/4">
          <div class="sticky top-6 bg-white rounded-xl shadow-sm p-5">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-800">Keranjang Kamu</h2>
              <Badge variant="secondary" class="text-sm">{{ cartStore.totalItems }} items</Badge>
            </div>

            <div v-if="cartStore.items.length > 0" class="space-y-2 mb-6 max-h-[400px] overflow-y-auto">
              <CartItem v-for="item in cartStore.items" :key="item.product.id" :item="item" />
            </div>

            <div v-else class="text-center py-8">
              <Icon icon="mdi:cart-outline" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p class="text-gray-500">Keranjang kamu masih kosong nih</p>
              <p class="text-sm text-gray-400 mt-1">Tambahin beberapa produk kuy!</p>
            </div>

            <div v-if="cartStore.items.length > 0" class="border-t pt-4 space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium">${{ cartStore.subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">PPN (11%)</span>
                <span class="font-medium">${{ cartStore.tax.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-base font-bold pt-3 border-t">
                <span>Total</span>
                <span>${{ cartStore.grandTotal.toFixed(2) }}</span>
              </div>
            </div>

            <div class="mt-6 space-y-3">
              <Button v-if="cartStore.items.length > 0" @click="showCheckoutModal = true" class="w-full" size="lg">Checkout</Button>
              <Button v-if="cartStore.items.length > 0" @click="cartStore.clearCart()" variant="outline" class="w-full" size="lg">Clear Cart</Button>
              <Button @click="loadProducts(true)" variant="ghost" class="w-full" size="sm">Refresh Products</Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CheckoutModal v-model:isOpen="showCheckoutModal" @success="handleCheckoutSuccess" v-model:textMsg="textMsg" />
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
