import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import useDashboard from '../../hooks/useDashboard';
import { ProductsService } from '../../services/productsService';

vi.mock('../../services/productsService');

describe('useDashboard', () => {
  const mockProducts = [
    { id: '1', brand: 'Apple', name: 'iPhone 15', basePrice: 999, imageUrl: 'url1' },
    { id: '2', brand: 'Samsung', name: 'Galaxy S24', basePrice: 899, imageUrl: 'url2' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ProductsService.getProducts).mockResolvedValue(mockProducts);
  });

  describe('Cargar productos inicialmente', () => {
    it('debería cargar los primeros 20 productos al montar', async () => {
      const { result } = renderHook(() => useDashboard());

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.products).toEqual(mockProducts);
      expect(ProductsService.getProducts).toHaveBeenCalledWith(20, 0, '');
    });

    it('debería establecer error si falla la carga inicial', async () => {
      const error = new Error('Network error');
      vi.mocked(ProductsService.getProducts).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useDashboard());

      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
      });

      expect(result.current.products).toEqual([]);
    });
  });

  describe('Búsqueda en tiempo real', () => {
    it('debería actualizar searchQuery cuando se llama handleSearch', () => {
      const { result } = renderHook(() => useDashboard());

      act(() => {
        result.current.handleSearch('iPhone');
      });

      expect(result.current.searchQuery).toBe('iPhone');
    });

    it('debería hacer debounce de 350ms antes de buscar', async () => {
      const { result } = renderHook(() => useDashboard());

      const mockSearchProducts = [mockProducts[0]];
      vi.mocked(ProductsService.getProducts).mockResolvedValueOnce(mockSearchProducts);

      act(() => {
        result.current.handleSearch('iPhone');
      });

      // El ProductsService NO debe ser llamado inmediatamente
      expect(ProductsService.getProducts).toHaveBeenCalledTimes(1); // Solo la carga inicial

      // Esperar el debounce de 350ms
      await waitFor(
        () => {
          expect(ProductsService.getProducts).toHaveBeenCalledWith(20, 0, 'iPhone');
        },
        { timeout: 500 }
      );
    });

    it('debería cancelar búsquedas previas si el usuario sigue escribiendo', async () => {
      const { result } = renderHook(() => useDashboard());

      act(() => {
        result.current.handleSearch('i');
      });

      act(() => {
        result.current.handleSearch('ip');
      });

      act(() => {
        result.current.handleSearch('iPhone');
      });

      // Solo debe hacer 2 llamadas: 1 inicial + 1 final (debounce cancela las intermedias)
      await waitFor(() => {
        expect(ProductsService.getProducts).toHaveBeenCalledTimes(2);
      });
    });

    it('debería filtrar productos por búsqueda', async () => {
      const mockSearchProducts = [mockProducts[0]];
      vi.mocked(ProductsService.getProducts).mockResolvedValueOnce(mockSearchProducts);

      const { result } = renderHook(() => useDashboard());

      act(() => {
        result.current.handleSearch('Apple');
      });

      await waitFor(() => {
        expect(result.current.products).toEqual(mockSearchProducts);
      });
    });

    it('debería limpiar búsqueda cuando se pasa query vacía', async () => {
      const { result } = renderHook(() => useDashboard());

      act(() => {
        result.current.handleSearch('iPhone');
      });

      await waitFor(() => {
        expect(result.current.searchQuery).toBe('iPhone');
      });

      act(() => {
        result.current.handleSearch('');
      });

      await waitFor(() => {
        expect(result.current.searchQuery).toBe('');
        expect(ProductsService.getProducts).toHaveBeenCalledWith(20, 0, '');
      });
    });
  });

  describe('Estados de carga y error', () => {
    it('debería mostrar loading mientras busca', async () => {
      let resolveGetProducts: (value: typeof mockProducts) => void;
      const promise = new Promise<typeof mockProducts>(resolve => {
        resolveGetProducts = resolve;
      });
      vi.mocked(ProductsService.getProducts).mockReturnValueOnce(promise);

      const { result } = renderHook(() => useDashboard());

      act(() => {
        result.current.handleSearch('iPhone');
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });

      act(() => {
        resolveGetProducts!(mockProducts);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('debería mantener error anterior si nueva búsqueda falla', async () => {
      vi.mocked(ProductsService.getProducts).mockRejectedValueOnce(new Error('Error 1'));

      const { result } = renderHook(() => useDashboard());

      await waitFor(() => {
        expect(result.current.error).toBe('Error 1');
      });

      act(() => {
        result.current.handleSearch('iPhone');
      });

      vi.mocked(ProductsService.getProducts).mockRejectedValueOnce(new Error('Error 2'));

      await waitFor(() => {
        expect(result.current.error).toBe('Error 2');
      });
    });
  });
});
