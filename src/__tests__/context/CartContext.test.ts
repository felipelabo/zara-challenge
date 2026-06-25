import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../../context/CartContext';
import * as cartStorage from '../../utils/cartStorage';
import type { CartItem } from '../../types/cart';

vi.mock('../../utils/cartStorage');

describe('CartContext', () => {
  const mockCartItem: CartItem = {
    id: '1',
    brand: 'Apple',
    name: 'iPhone 15',
    description: 'Latest iPhone',
    basePrice: 999,
    rating: 4.5,
    idCart: 'cart-1',
    colorOptions: { name: 'Black', hexCode: '#000000', imageUrl: 'url' },
    storageOptions: { capacity: '256GB', price: 999 },
  };

  const mockCartItem2: CartItem = {
    ...mockCartItem,
    id: '2',
    name: 'iPhone 15 Pro',
    idCart: 'cart-2',
    storageOptions: { capacity: '512GB', price: 1099 },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock cartStorage.getCart para retornar vacío por defecto
    vi.mocked(cartStorage.getCart).mockReturnValue([]);
  });

  describe('Inicialización del contexto', () => {
    it('debería inicializar con carrito vacío desde localStorage', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      expect(result.current.items).toEqual([]);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.totalPrice).toBe(0);
    });

    it('debería cargar items existentes desde localStorage', () => {
      // Mock que retorna items guardados previamente
      vi.mocked(cartStorage.getCart).mockReturnValue([mockCartItem]);

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      expect(result.current.items).toEqual([mockCartItem]);
      expect(result.current.totalItems).toBe(1);
      expect(result.current.totalPrice).toBe(999);
    });

    it('debería lanzar error si se usa fuera del CartProvider', () => {
      // Espera un error al usar el hook sin provider
      expect(() => renderHook(() => useCart())).toThrow(
        'useCart must be used within CartProvider'
      );
    });
  });

  describe('Añadir al carrito', () => {
    it('debería añadir un item al carrito', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        const { idCart, ...itemWithoutId } = mockCartItem;
        result.current.addToCart(itemWithoutId);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].id).toBe(mockCartItem.id);
    });

    it('debería generar idCart único para cada item', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        const { idCart: _, ...item1 } = mockCartItem;
        const { idCart: __, ...item2 } = mockCartItem2;
        result.current.addToCart(item1);
        result.current.addToCart(item2);
      });

      const ids = result.current.items.map(item => item.idCart);
      expect(new Set(ids).size).toBe(2); // Todos los ids son únicos
    });

    it('debería persistir en localStorage cuando se añade item', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        const { idCart, ...itemWithoutId } = mockCartItem;
        result.current.addToCart(itemWithoutId);
      });

      expect(cartStorage.saveCart).toHaveBeenCalled();
      // Verifica que se guardó con el item correcto
      const savedItems = vi.mocked(cartStorage.saveCart).mock.calls[0][0];
      expect(savedItems).toHaveLength(1);
    });
  });

  describe('Eliminar del carrito', () => {
    it('debería eliminar un item por idCart', () => {
      vi.mocked(cartStorage.getCart).mockReturnValue([mockCartItem, mockCartItem2]);

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.removeFromCart('cart-1');
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].idCart).toBe('cart-2');
    });

    it('debería persistir cambios en localStorage al eliminar', () => {
      vi.mocked(cartStorage.getCart).mockReturnValue([mockCartItem, mockCartItem2]);

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.removeFromCart('cart-1');
      });

      expect(cartStorage.saveCart).toHaveBeenCalled();
    });
  });

  describe('Limpiar carrito', () => {
    it('debería vaciar todos los items del carrito', () => {
      vi.mocked(cartStorage.getCart).mockReturnValue([mockCartItem, mockCartItem2]);

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      expect(result.current.items).toHaveLength(2);

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.items).toHaveLength(0);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.totalPrice).toBe(0);
    });

    it('debería persistir carrito vacío en localStorage', () => {
      vi.mocked(cartStorage.getCart).mockReturnValue([mockCartItem]);

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.clearCart();
      });

      expect(cartStorage.saveCart).toHaveBeenCalledWith([]);
    });
  });

  describe('Validaciones del carrito', () => {
    it('debería verificar si un item está en el carrito', () => {
      vi.mocked(cartStorage.getCart).mockReturnValue([mockCartItem]);

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      expect(result.current.isInCart('1')).toBe(true);
      expect(result.current.isInCart('999')).toBe(false);
    });

    it('debería calcular el total de items correctamente', () => {
      vi.mocked(cartStorage.getCart).mockReturnValue([mockCartItem, mockCartItem2]);

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      expect(result.current.totalItems).toBe(2);
    });

    it('debería calcular el precio total correctamente', () => {
      // mockCartItem: 256GB = 999
      // mockCartItem2: 512GB = 1099
      // Total = 2098
      vi.mocked(cartStorage.getCart).mockReturnValue([mockCartItem, mockCartItem2]);

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      expect(result.current.totalPrice).toBe(2098);
    });
  });
});
