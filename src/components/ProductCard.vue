<script setup lang="ts">
    import type { Product } from '@/types';
import { Icon } from '@iconify/vue';

    defineProps<{
        product: Product;
        loading: boolean;
    }>();

    defineEmits<{
        'add-to-cart': [product: Product];
    }>();
    
</script>

<template>
  <!-- Skeleton Mode -->
  <div 
    v-if="loading"
    class="bg-white rounded-lg shadow-md p-4 animate-pulse border border-gray-100"
  >
    <div class="w-full aspect-square bg-gray-300 rounded-md"></div>

    <div class="mt-4 space-y-2">
      <div class="h-4 bg-gray-300 rounded w-3/4"></div>
      <div class="h-3 bg-gray-200 rounded w-1/2"></div>
      <div class="h-5 bg-gray-300 rounded w-1/3 mt-3"></div>
    </div>
  </div>

  <!-- Real Product -->
  <div 
    v-else
    class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden border border-gray-100"
    @click="$emit('add-to-cart', product)"
  >
    <div class="aspect-square overflow-hidden">
      <img 
        :src="product.thumbnail" 
        :alt="product.title"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    </div>
    
    <div class="p-4">
      <h3 class="font-semibold text-gray-800 text-sm truncate mb-1">
        {{ product.title }}
      </h3>
      <p class="text-xs text-gray-500 truncate mb-2">
        {{ product.brand }}
      </p>
      
      <div class="flex items-center justify-between">
        <span class="font-bold text-lg text-gray-900">
          ${{ product.price.toFixed(2) }}
        </span>
        <span 
          v-if="product.stock < 10"
          class="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full"
        >
          Only {{ product.stock }} left
        </span>
      </div>
      
      <div class="mt-2 flex items-center">
        <div class="flex items-center text-yellow-400">
          <span v-for="n in 5" :key="n">
            <Icon 
              :icon="n <= Math.round(product.rating) ? 'material-symbols:star' : 'material-symbols:star-outline'" 
              class="w-4 h-4"
            />
          </span>
        </div>
        <span class="text-xs text-gray-500 ml-2">
          ({{ product.rating }})
        </span>
      </div>
    </div>
  </div>
</template>

