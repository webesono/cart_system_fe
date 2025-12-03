<script setup lang="ts">
    import { ref, reactive, computed, watch } from 'vue';
    // import { toast } from 'vue-sonner'
    import { checkoutSchema, type CheckoutFormValues } from '@/utils/form-schemas';
    import { useCartStore } from '@/stores/cart.store';
    import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { checkoutApi } from '@/api/product.api';
    import { Icon } from '@iconify/vue';
    import Swal from 'sweetalert2'

    const props = withDefaults(defineProps<{
      isOpen: boolean;
      textMsg?: string;
    }>(), {
      textMsg: ''
    })

    const emit = defineEmits<{
        'update:isOpen': [value: boolean];
        'update:textMsg': [value: string];
        'success': [];
    }>();

    const cartStore = useCartStore();

    const isSubmitting = ref(false);
    const errors = reactive<Record<string, string>>({});

    const form = reactive<CheckoutFormValues>({
        customerName: '',
        phoneNumber: ''
    });

    const cartItems = computed(() => cartStore.items);
    const subtotal = computed(() => cartStore.subtotal);
    const tax = computed(() => cartStore.tax);
    const grandTotal = computed(() => cartStore.grandTotal);

    const handleSubmit = async () => {
        // Hapus error sebelumnya
    Object.keys(errors).forEach(key => delete errors[key]);
    
    // Validasi form pake schema
    const result = checkoutSchema.safeParse(form);
    
    if (!result.success) {
        result.error.errors.forEach(err => {
        if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
        }
        });
        return;
    }
    
    try {
        isSubmitting.value = true;
        
        const payload = {
            items: cartItems.value.map(item => ({
                productId: item.product.id,
                quantity: item.quantity,
                price: item.product.price
            })),
            customerName: result.data.customerName || undefined,
            phoneNumber: result.data.phoneNumber || undefined,
            subtotal: subtotal.value,
            tax: tax.value,
            grandTotal: grandTotal.value
        };
        
        const response = await checkoutApi.createOrder(payload);

        if(response && response.success){
          // Success
          cartStore.clearCart();
          
          emit('update:isOpen', false);
          emit('update:textMsg', `Order #${response.orderId} berhasil dibuat.`);
          emit('success');

        }else {
          Swal.fire({
            title: "Checkout Gagal",
            text: response?.message ?? "Gagal membuat pesanan. Coba lagi setelah beberapa saat.",
            showConfirmButton: false,
            timer: 3000,
            icon: "error"
          });
        }
        
    } catch (error) {
      Swal.fire({
        title: "Checkout Gagal",
        text: "Gagal membuat pesanan. Coba lagi setelah beberapa saat.",
        showConfirmButton: false,
        timer: 3000,
        icon: "error"
      });

      console.error('Checkout gagal:', error);
    } finally {
        isSubmitting.value = false;
    }
    };

    // Reset form ketika modal open/close
    watch(() => props.isOpen, (open) => {
        if (open) {
            Object.keys(errors).forEach(key => delete errors[key]);
            form.customerName = '';
            form.phoneNumber = '';
        }
    });
</script>

<template>
  <Dialog :open="props.isOpen" @update:open="$emit('update:isOpen', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Checkout</DialogTitle>
        <DialogDescription>
          Cek kembali pesanan anda
        </DialogDescription>
      </DialogHeader>
      
      <div class="space-y-4 py-4">
        <!-- Order Summary -->
        <div class="border rounded-lg p-4">
          <h4 class="font-semibold mb-3">Rangkuman Pesanan </h4>
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div 
              v-for="item in cartItems" 
              :key="item.product.id"
              class="flex justify-between text-sm"
            >
              <span class="text-gray-600">
                {{ item.product.title }} x{{ item.quantity }}
              </span>
              <span class="font-medium">
                ${{ (item.product.price * item.quantity).toFixed(2) }}
              </span>
            </div>
          </div>
          
          <div class="mt-4 pt-4 border-t space-y-1">
            <div class="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>Ppn (11%)</span>
              <span>${{ tax.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between font-bold text-base pt-2 border-t">
              <span>Total</span>
              <span>${{ grandTotal.toFixed(2) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Customer Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid gap-4">
            <div class="space-y-2">
              <Label for="customerName">Nama Customer</Label>
              <Input
                id="customerName"
                v-model="form.customerName"
                placeholder="John Doe"
              />
              <p v-if="errors.customerName" class="text-sm text-red-500">
                {{ errors.customerName }}
              </p>
            </div>
            
            <div class="space-y-2">
              <Label for="phoneNumber">Nomor Telepon(Optional)</Label>
              <Input
                id="phoneNumber"
                v-model="form.phoneNumber"
                placeholder="+62 81234567890"
              />
              <p v-if="errors.phoneNumber" class="text-sm text-red-500">
                {{ errors.phoneNumber }}
              </p>
            </div>
          </div>
        </form>
      </div>
      
      <DialogFooter class="sm:justify-between">
        <Button
          type="button"
          variant="outline"
          @click="$emit('update:isOpen', false)"
          :disabled="isSubmitting"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          @click="handleSubmit"
          :disabled="isSubmitting || cartItems.length === 0"
        >
          <span v-if="isSubmitting" class="flex items-center">
            <Icon icon="eos-icons:loading" class="w-4 h-4 mr-2" />
            Processing...
          </span>
          <span v-else>
            Place Order
          </span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
