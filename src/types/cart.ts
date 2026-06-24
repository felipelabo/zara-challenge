import type { ProductDetails, ColorOptions, StorageOptions } from './products';

export type CartItem = Omit<ProductDetails, 'specs' | 'similarProducts' | 'colorOptions' | 'storageOptions'> & {
    idCart: string;
    colorOptions: ColorOptions;
    storageOptions: StorageOptions;
}

export interface CartContextValue {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;

    addToCart: (newItem: Omit<CartItem, "idCart">) => void;
    removeFromCart: (itemId: string) => void;
    clearCart: () => void;

    isInCart: (itemId: string) => boolean;
}