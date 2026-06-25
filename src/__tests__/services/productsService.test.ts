import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductsService } from '../../services/productsService';
import { apiClient } from '../../api/cliente';

// Mock del apiClient para aislar el servicio de llamadas HTTP reales
vi.mock('../../api/cliente');

describe('ProductsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProducts', () => {
    it('deberia cargar los productos con paginación por defecto', async () => {
      const mockProducts = [
        { id: '1', brand: 'Apple', name: 'iPhone 15', basePrice: 999, imageUrl: 'url1' },
        { id: '2', brand: 'Samsung', name: 'Galaxy S24', basePrice: 899, imageUrl: 'url2' },
      ];

      vi.mocked(apiClient.get).mockResolvedValue(mockProducts);

      const result = await ProductsService.getProducts(100, 0, '');

      expect(apiClient.get).toHaveBeenCalledWith('/products?limit=100&offset=0');
      expect(result).toEqual(mockProducts);
    });

    it('deberia cargar los elementos solo por busqueda', async () => {
      const mockProducts = [
        { id: '1', brand: 'Apple', name: 'iPhone 15', basePrice: 999, imageUrl: 'url1' },
      ];

      vi.mocked(apiClient.get).mockResolvedValue(mockProducts);

      const result = await ProductsService.getProducts(20, 0, 'iPhone');

      expect(apiClient.get).toHaveBeenCalledWith('/products?limit=20&offset=0&search=iPhone');
      expect(result).toEqual(mockProducts);
    });

    it('deberia remover productos duplicados', async () => {
      // Prueba que la deduplicación funciona correctamente (Map con id como key)
      // Esto es importante porque la API puede retornar duplicados en búsquedas
      const mockProducts = [
        { id: '1', brand: 'Apple', name: 'iPhone 15', basePrice: 999, imageUrl: 'url1' },
        { id: '1', brand: 'Apple', name: 'iPhone 15', basePrice: 999, imageUrl: 'url1' },
        { id: '2', brand: 'Samsung', name: 'Galaxy S24', basePrice: 899, imageUrl: 'url2' },
      ];

      vi.mocked(apiClient.get).mockResolvedValue(mockProducts);

      const result = await ProductsService.getProducts(100, 0, '');

      expect(result).toHaveLength(2);
      expect(result.map(p => p.id)).toEqual(['1', '2']);
    });

    it('deberia manejar los errores del API', async () => {
      const error = new Error('API Error');
      vi.mocked(apiClient.get).mockRejectedValue(error);

      await expect(ProductsService.getProducts(20, 0, '')).rejects.toThrow('API Error');
    });
  });

  describe('Fetch detalles del producto', () => {
    it('deberia cargar los detalles del producto', async () => {
      const mockDetails = {
        id: '1',
        brand: 'Apple',
        name: 'iPhone 15',
        description: 'Latest iPhone',
        basePrice: 999,
        rating: 4.5,
        specs: { storage: '256GB', color: 'Black' },
        colorOptions: [{ name: 'Black', hexCode: '#000000', imageUrl: 'url' }],
        storageOptions: [{ capacity: '256GB', price: 999 }],
        similarProducts: [],
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockDetails);

      const result = await ProductsService.getProductDetails('1');

      expect(apiClient.get).toHaveBeenCalledWith('/products/1');
      expect(result).toEqual(mockDetails);
    });

    it('deberia manejar los errores al traer detalles', async () => {
      const error = new Error('Product not found');
      vi.mocked(apiClient.get).mockRejectedValue(error);

      await expect(ProductsService.getProductDetails('999')).rejects.toThrow('Product not found');
    });
  });
});
