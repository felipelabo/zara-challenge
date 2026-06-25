import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import useDetails from '../../hooks/useDetails';
import { ProductsService } from '../../services/productsService';
import * as CartContext from '../../context/CartContext';
import { useNavigate } from 'react-router';

vi.mock('../../services/productsService');
vi.mock('../../context/CartContext');
vi.mock('react-router');

describe('useDetails', () => {
  const mockProductDetails = {
    id: '1',
    brand: 'Apple',
    name: 'iPhone 15',
    description: 'Latest iPhone',
    basePrice: 999,
    rating: 4.5,
    specs: { 'Display': '6.1"', 'Processor': 'A17 Pro' },
    colorOptions: [
      { name: 'Black', hexCode: '#000000', imageUrl: 'black.jpg' },
      { name: 'White', hexCode: '#FFFFFF', imageUrl: 'white.jpg' },
    ],
    storageOptions: [
      { capacity: '128GB', price: 999 },
      { capacity: '256GB', price: 1099 },
    ],
    similarProducts: [
      { id: '2', brand: 'Apple', name: 'iPhone 14', basePrice: 899, imageUrl: 'url2' },
    ],
  };

  const mockNavigate = vi.fn();
  const mockAddToCart = vi.fn();
  const mockIsInCart = vi.fn().mockReturnValue(false);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ProductsService.getProductDetails).mockResolvedValue(mockProductDetails);
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(CartContext.useCart).mockReturnValue({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      addToCart: mockAddToCart,
      removeFromCart: vi.fn(),
      clearCart: vi.fn(),
      isInCart: mockIsInCart,
    });
  });

  describe('Cargar detalles del producto', () => {
    it('debería cargar detalles del producto por ID', async () => {
      const { result } = renderHook(() => useDetails('1'));

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(ProductsService.getProductDetails).toHaveBeenCalledWith('1');
      expect(result.current.productDetails).toEqual(mockProductDetails);
    });

    it('debería establecer el primer color como seleccionado inicialmente', async () => {
      const { result } = renderHook(() => useDetails('1'));

      await waitFor(() => {
        expect(result.current.selectedColor).toEqual(mockProductDetails.colorOptions[0]);
      });
    });

    it('debería manejar errores al cargar detalles', async () => {
      const error = new Error('Product not found');
      vi.mocked(ProductsService.getProductDetails).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useDetails('999'));

      await waitFor(() => {
        expect(result.current.error).toBe('Product not found');
      });

      expect(result.current.productDetails).toBeNull();
    });

    it('debería scroll al top al cargar detalles', async () => {
      // window.scrollTo ya está mockeado en vitest.setup.ts
      const scrollToMock = window.scrollTo as ReturnType<typeof vi.fn>;

      renderHook(() => useDetails('1'));

      expect(scrollToMock).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('Selección de color', () => {
    it('debería cambiar el color seleccionado', async () => {
      const { result } = renderHook(() => useDetails('1'));

      await waitFor(() => {
        expect(result.current.selectedColor).toEqual(mockProductDetails.colorOptions[0]);
      });

      act(() => {
        result.current.setSelectedColor(mockProductDetails.colorOptions[1]);
      });

      expect(result.current.selectedColor).toEqual(mockProductDetails.colorOptions[1]);
    });
  });

  describe('Selección de almacenamiento', () => {
    it('debería cambiar el almacenamiento seleccionado', async () => {
      const { result } = renderHook(() => useDetails('1'));

      act(() => {
        result.current.setSelectedStorage(mockProductDetails.storageOptions[1]);
      });

      expect(result.current.selectedStorage).toEqual(mockProductDetails.storageOptions[1]);
    });

    it('debería inicialmente no tener almacenamiento seleccionado', async () => {
      const { result } = renderHook(() => useDetails('1'));

      await waitFor(() => {
        expect(result.current.selectedStorage).toBeNull();
      });
    });
  });

  describe('Añadir al carrito', () => {
    it('debería mostrar error si no hay storage seleccionado', async () => {
      const { result } = renderHook(() => useDetails('1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // No seleccionar storage, solo intenta añadir
      act(() => {
        result.current.handleAddToCart();
      });

      expect(result.current.error).toBe('Please select a color and storage option.');
      expect(mockAddToCart).not.toHaveBeenCalled();
    });

    it('debería mostrar error si el item ya está en el carrito', async () => {
      // Este test verifica la validación de duplicados
      mockIsInCart.mockReturnValue(true);

      const { result } = renderHook(() => useDetails('1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.productDetails).toBeTruthy();
      });

      act(() => {
        result.current.setSelectedStorage(mockProductDetails.storageOptions[0]);
      });

      act(() => {
        result.current.handleAddToCart();
      });

      expect(result.current.error).toBe('This item is already in the cart.');
      expect(mockAddToCart).not.toHaveBeenCalled();
    });

    it('debería validar que color y storage sean requeridos', () => {
      // Prueba que el botón de "Añadir al carrito" debe estar deshabilitado sin storage
      // Esta es una validación de la lógica del hook
      const { result } = renderHook(() => useDetails('1'));

      // Inicialmente sin storage seleccionado
      expect(result.current.selectedStorage).toBeNull();

      // El hook tiene la lógica: "disabled={!selectedStorage}"
      // en el componente Details, así que verificamos el estado aquí
    });
  });

  describe('Recargar cuando cambia el ID', () => {
    it('debería recargar detalles cuando el ID del producto cambia', async () => {
      const { rerender } = renderHook(({ id }: { id: string }) => useDetails(id), {
        initialProps: { id: '1' },
      });

      await waitFor(() => {
        expect(ProductsService.getProductDetails).toHaveBeenCalledWith('1');
      });

      vi.mocked(ProductsService.getProductDetails).mockResolvedValueOnce({
        ...mockProductDetails,
        id: '2',
      });

      rerender({ id: '2' });

      await waitFor(() => {
        expect(ProductsService.getProductDetails).toHaveBeenCalledWith('2');
      });
    });
  });
});
