import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCart, saveCart } from '../../utils/cartStorage';
import type { CartItem } from '../../types/cart';

describe('cartStorage', () => {
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

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('getCart', () => {
    it('deberia cargar el localstorage vacio', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);

      const result = getCart();

      expect(result).toEqual([]);
    });

    it('Parse correcto de datos', () => {
      const cartItems = [mockCartItem];
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(cartItems));

      const result = getCart();

      expect(result).toEqual(cartItems);
      expect(localStorage.getItem).toHaveBeenCalledWith('zara-cart');
    });

    it('Datos corruptos', () => {
      // Simula un caso edge: localStorage con datos no válidos JSON
      vi.mocked(localStorage.getItem).mockReturnValue('invalid json {');

      const result = getCart();

      expect(result).toEqual([]);
    });
  });

  describe('saveCart', () => {
    it('deberia guardar items en localStorage', () => {
      const cartItems = [mockCartItem];

      saveCart(cartItems);

      expect(localStorage.setItem).toHaveBeenCalledWith('zara-cart', JSON.stringify(cartItems));
    });

    it('should handle empty cart', () => {
      saveCart([]);

      expect(localStorage.setItem).toHaveBeenCalledWith('zara-cart', JSON.stringify([]));
    });

    it('deberia manejar los errores de localStorage', () => {
      // Simula localStorage full o permisos denegados
      vi.mocked(localStorage.setItem).mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => saveCart([mockCartItem])).not.toThrow();
    });
  });
});
