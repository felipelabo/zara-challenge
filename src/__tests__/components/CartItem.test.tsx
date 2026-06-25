import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartItem from '../../components/cart/CartItem';
import * as CartContext from '../../context/CartContext';

vi.mock('../../context/CartContext');

describe('CartItem', () => {
  const mockRemoveFromCart = vi.fn();
  const mockCartItem = {
    id: '1',
    brand: 'Apple',
    name: 'iPhone 15',
    description: 'Latest iPhone',
    basePrice: 999,
    rating: 4.5,
    idCart: 'cart-1',
    colorOptions: { name: 'Black', hexCode: '#000000', imageUrl: 'black.jpg' },
    storageOptions: { capacity: '256GB', price: 999 },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(CartContext.useCart).mockReturnValue({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      addToCart: vi.fn(),
      removeFromCart: mockRemoveFromCart,
      clearCart: vi.fn(),
      isInCart: vi.fn(),
    });
  });

  describe('Renderizado', () => {
    it('debería mostrar la imagen del producto con el color seleccionado', () => {
      render(<CartItem item={mockCartItem} />);

      const image = screen.getByAltText('iPhone 15');
      expect(image).toHaveAttribute('src', 'black.jpg');
    });

    it('debería mostrar el nombre del producto', () => {
      render(<CartItem item={mockCartItem} />);

      expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    });

    it('debería mostrar las especificaciones seleccionadas', () => {
      render(<CartItem item={mockCartItem} />);

      // Muestra: "256GB | Black"
      expect(screen.getByText('256GB | Black')).toBeInTheDocument();
    });

    it('debería mostrar el precio del item', () => {
      render(<CartItem item={mockCartItem} />);

      expect(screen.getByText('999 EUR')).toBeInTheDocument();
    });

    it('debería mostrar especificaciones diferentes según el storage', () => {
      const largeStorageItem = {
        ...mockCartItem,
        storageOptions: { capacity: '512GB', price: 1199 },
      };

      render(<CartItem item={largeStorageItem} />);

      expect(screen.getByText('512GB | Black')).toBeInTheDocument();
      expect(screen.getByText('1199 EUR')).toBeInTheDocument();
    });

    it('debería mostrar diferentes colores en las especificaciones', () => {
      const whiteItem = {
        ...mockCartItem,
        colorOptions: { name: 'White', hexCode: '#FFFFFF', imageUrl: 'white.jpg' },
      };

      render(<CartItem item={whiteItem} />);

      expect(screen.getByText('256GB | White')).toBeInTheDocument();
    });
  });

  describe('Interacción - Eliminar del carrito', () => {
    it('debería renderizar botón de eliminar', () => {
      render(<CartItem item={mockCartItem} />);

      const deleteButton = screen.getByText('ELIMINAR');
      expect(deleteButton).toBeInTheDocument();
    });

    it('debería llamar a removeFromCart al hacer clic en eliminar', async () => {
      const user = userEvent.setup();
      render(<CartItem item={mockCartItem} />);

      const deleteButton = screen.getByText('ELIMINAR');
      await user.click(deleteButton);

      // Verifica que se llama con el idCart correcto
      expect(mockRemoveFromCart).toHaveBeenCalledWith('cart-1');
    });

    it('debería llamar removeFromCart una sola vez por clic', async () => {
      const user = userEvent.setup();
      render(<CartItem item={mockCartItem} />);

      const deleteButton = screen.getByText('ELIMINAR');
      await user.click(deleteButton);

      expect(mockRemoveFromCart).toHaveBeenCalledTimes(1);
    });
  });

  describe('Casos edge', () => {
    it('debería manejar productos con precios altos', () => {
      const expensiveItem = {
        ...mockCartItem,
        storageOptions: { capacity: '1TB', price: 2499 },
      };

      render(<CartItem item={expensiveItem} />);

      expect(screen.getByText('2499 EUR')).toBeInTheDocument();
    });

    it('debería manejar nombres de colores largo', () => {
      const longColorItem = {
        ...mockCartItem,
        colorOptions: { name: 'Midnight Black Metallic', hexCode: '#1a1a1a', imageUrl: 'url' },
      };

      render(<CartItem item={longColorItem} />);

      expect(screen.getByText('256GB | Midnight Black Metallic')).toBeInTheDocument();
    });
  });
});
