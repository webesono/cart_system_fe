import type { CartItem, Product } from '@/types';
import {defineStore } from 'pinia';
import { computed, ref } from 'vue';


export const useCartStore = defineStore('cart', () => {
    const items = ref<CartItem[]>([]);

    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('steel-pos-cart');
        if (saved) {
        items.value = JSON.parse(saved);
        }
    }

    // Hitung-hitung
    const totalItems = computed(() =>
        items.value.reduce((sum, item) => sum + item.quantity, 0)
    )

    const subtotal = computed(() => 
        items.value.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    );

    const tax = computed(() => subtotal.value * 0.11);

    const grandTotal = computed(() => subtotal.value + tax.value);

    
    // Actions
    const saveToLocalStorage = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('steel-pos-cart', JSON.stringify(items.value));
        }
    };

    const getQuantity = (productId: string) => {
        const item = items.value.find(item => item.product.id === productId);
        return item ? item.quantity : 0;
    };

    const addToCart = (product: Product) => {
        const existingItem = items.value.find(item => item.product.id === product.id)
        
        if (existingItem) {
            existingItem.quantity += 1;
        }else{
            items.value.push({
                product: product,
                quantity: 1
            });
        }

        saveToLocalStorage();
    };

    const removeFromCart = (productId: string) => {
        const index = items.value.findIndex(item => item.product.id === productId);
        if (index > -1) {
            items.value.splice(index, 1);
            saveToLocalStorage();
        }
    };

    const clearCart = () => {
        items.value = [];
        localStorage.removeItem('steel-pos-cart');
    };

    const updateQuantity = (productId: string, quantity: number) => {
        const item = items.value.find(item => item.product.id === productId);
        
        if (item) {
            if (quantity <= 0) {
                removeFromCart(productId);
            } else {
                item.quantity = quantity;
                saveToLocalStorage();
            }
        }
    };

    const incrementQuantity = (productId: string) => {
        updateQuantity(productId, getQuantity(productId) + 1);
    };

    const decrementQuantity = (productId: string) => {
        updateQuantity(productId, getQuantity(productId) - 1);
    };

    return {
        items,
        totalItems,
        subtotal,
        tax,
        grandTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        incrementQuantity,
        decrementQuantity,
        clearCart,
        getQuantity
    };
});