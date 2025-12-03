<script setup lang="ts">
    import { useCartStore } from '@/stores/cart.store';
    import type { CartItem } from '@/types';

    const props = defineProps<{
        item: CartItem;
    }>();

    const cartStore = useCartStore();

    const increment = () => {
        cartStore.incrementQuantity(props.item.product.id);
    };

    const decrement = () => {
        cartStore.decrementQuantity(props.item.product.id);
    };

    const remove = () => {
        cartStore.removeFromCart(props.item.product.id);
    };
</script>

<template>
  <div class="flex items-center justify-between py-3 border-b border-gray-100 text-sm">
    <div class="flex-1 min-w-0">
      <h4 class="font-medium text-gray-900 truncate">
        {{ item.product.title }}
      </h4>
      <p class="text-sm text-gray-500">
        ${{ item.product.price.toFixed(2) }} each
      </p>
    </div>
    
    <div class="flex items-center space-x-3">
      <button
        @click="decrement"
        class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        :disabled="item.quantity <= 1"
      >
        <Icon icon="mdi:minus" class="w-4 h-4" />
      </button>
      
      <span class="font-semibold text-gray-900 min-w-6 text-center">
        {{ item.quantity }}
      </span>
      
      <button
        @click="increment"
        class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        :disabled="item.quantity >= item.product.stock"
      >
        <Icon icon="mdi:plus" class="w-4 h-4" />
      </button>
      
      <span class="font-bold text-gray-900 min-w-4 text-right">
        ${{ (item.product.price * item.quantity).toFixed(2) }}
      </span>
      
      <button
        @click="remove"
        class="ml-2 text-red-500 hover:text-red-700 transition-colors"
      >
        <Icon icon="mdi:trash-can-outline" class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>