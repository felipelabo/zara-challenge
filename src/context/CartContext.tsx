import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import type { CartItem, CartContextValue } from '../types/cart';
import { getCart, saveCart } from '../utils/cartStorage';


export const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {

    const [items, setItems] = useState<CartItem[]>([]);

    console.log('CartProvider rendered with items:', items);

    useEffect(() => {
        const storedCart = getCart();
        setItems(storedCart);
    }, []);

    const addToCart = useCallback((newItem: Omit<CartItem, "idCart">) => {
        const itemWithId: CartItem = {
            ...newItem,
            idCart: crypto.randomUUID(),
        };

        setItems((currentItems) => {
            const updatedItems = [...currentItems, itemWithId];
            saveCart(updatedItems);

            return updatedItems;
        });
    }, []);

    const removeFromCart = useCallback((itemIdCart: string) => {
        setItems((currentItems) => {
            const updatedItems = currentItems.filter((item) => item.idCart !== itemIdCart);
            saveCart(updatedItems);

            return updatedItems;
        });
    }, []);

    const clearCart = useCallback(() => {
        saveCart([]);
        setItems([]);
    }, []);

    const isInCart = useCallback(
        (itemId: string) =>
            items.some((item) => item.id === itemId),
        [items],
    );

    const totalItems = useMemo(
        () =>
            items.length,
        [items],
    );

    const totalPrice = useMemo(
        () =>
            items.reduce(
                (total, item) =>
                    total + item.storageOptions.price,
                0,
            ),
        [items],
    );

    const value = useMemo<CartContextValue>(
        () => ({
            items,
            totalItems,
            totalPrice,

            addToCart,
            removeFromCart,
            clearCart,

            isInCart,
        }),
        [
            items,
            totalItems,
            totalPrice,
            addToCart,
            removeFromCart,
            clearCart,
            isInCart,
        ],
    );

    return (
        <CartContext.Provider value={value} >
            {children}
        </CartContext.Provider>
    );

};

export const useCart = () => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error(
            'useCart must be used within CartProvider',
        );
    }

    return context;
};