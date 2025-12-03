export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    image: string[];
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface CheckoutForm {
    customerName?: string;
    phoneNumber?: string;
}

export interface CheckoutPayload {
    items: Array<{
        productId: number;
        quantity: number;
        price:  number;
    }>
    customerName?: string;
    phoneNumber?: string;
    total: number;
    tax: number;
    grandTotal: number;
}

export interface responseCheckout {
    success: boolean;
    message: string;
    orderId?: string;
}
