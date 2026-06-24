import type { CartItem } from "../types/cart";

const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY || 'zara_cart';

export const getCart = (): CartItem[] => {
    try {
        const storedCart = localStorage.getItem(STORAGE_KEY);
        if (!storedCart) return [];
        console.log('Loaded cart from localStorage:', JSON.parse(storedCart));
        return JSON.parse(storedCart);
    } catch (error) {
        console.error('Error loading cart', error);
        return [];
    }
}

export const saveCart = (items: CartItem[]): void => {
    try {
        console.log('Persisting cart to localStorage:', items);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
        console.error('Error saving cart', error);
    }
}