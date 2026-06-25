import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../../components/shared/Navbar';
import * as CartContext from '../../context/CartContext';
import { useNavigate } from 'react-router';

vi.mock('../../context/CartContext');
vi.mock('react-router');

describe('Navbar', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  describe('Renderizado', () => {
    it('debería mostrar el título de la aplicación', () => {
      vi.mocked(CartContext.useCart).mockReturnValue({
        items: [],
        totalItems: 0,
        totalPrice: 0,
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        clearCart: vi.fn(),
        isInCart: vi.fn(),
      });

      render(<Navbar />);

      expect(screen.getByText('SMARTHPHONE')).toBeInTheDocument();
    });

    it('debería mostrar la cantidad de items en el carrito', () => {
      vi.mocked(CartContext.useCart).mockReturnValue({
        items: [
          {
            id: '1',
            idCart: 'cart-1',
            brand: 'Apple',
            name: 'iPhone 15',
            description: '',
            basePrice: 999,
            rating: 4.5,
            colorOptions: { name: 'Black', hexCode: '#000', imageUrl: 'url' },
            storageOptions: { capacity: '256GB', price: 999 },
          },
          {
            id: '2',
            idCart: 'cart-2',
            brand: 'Samsung',
            name: 'Galaxy S24',
            description: '',
            basePrice: 899,
            rating: 4.3,
            colorOptions: { name: 'Silver', hexCode: '#ccc', imageUrl: 'url' },
            storageOptions: { capacity: '256GB', price: 899 },
          },
        ],
        totalItems: 2,
        totalPrice: 1898,
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        clearCart: vi.fn(),
        isInCart: vi.fn(),
      });

      render(<Navbar />);

      expect(screen.getByText(/CART: 2/)).toBeInTheDocument();
    });

    it('debería mostrar 0 items cuando el carrito está vacío', () => {
      vi.mocked(CartContext.useCart).mockReturnValue({
        items: [],
        totalItems: 0,
        totalPrice: 0,
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        clearCart: vi.fn(),
        isInCart: vi.fn(),
      });

      render(<Navbar />);

      expect(screen.getByText(/CART: 0/)).toBeInTheDocument();
    });
  });

  describe('Interacción con el carrito', () => {
    beforeEach(() => {
      vi.mocked(CartContext.useCart).mockReturnValue({
        items: [],
        totalItems: 3,
        totalPrice: 0,
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        clearCart: vi.fn(),
        isInCart: vi.fn(),
      });
    });

    it('debería navegar al carrito al hacer clic en el botón', async () => {
      const user = userEvent.setup();
      render(<Navbar />);

      const cartButton = screen.getByRole('button', { name: /CART: 3/ });
      await user.click(cartButton);

      expect(mockNavigate).toHaveBeenCalledWith('/cart');
    });

    it('debería actualizar el contador cuando totalItems cambia', () => {
      const { rerender } = render(<Navbar />);

      expect(screen.getByText(/CART: 3/)).toBeInTheDocument();

      // Simula cambio en totalItems
      vi.mocked(CartContext.useCart).mockReturnValue({
        items: [],
        totalItems: 5,
        totalPrice: 0,
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        clearCart: vi.fn(),
        isInCart: vi.fn(),
      });

      rerender(<Navbar />);

      expect(screen.getByText(/CART: 5/)).toBeInTheDocument();
    });
  });

  describe('Accesibilidad', () => {
    beforeEach(() => {
      vi.mocked(CartContext.useCart).mockReturnValue({
        items: [],
        totalItems: 2,
        totalPrice: 0,
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        clearCart: vi.fn(),
        isInCart: vi.fn(),
      });
    });

    it('debería tener un botón accesible para el carrito', () => {
      render(<Navbar />);

      const cartButton = screen.getByRole('button');
      expect(cartButton).toBeInTheDocument();
    });

    it('debería ser navegable por teclado', async () => {
      const user = userEvent.setup();
      render(<Navbar />);

      await user.tab();
      await user.keyboard('{Enter}');

      expect(mockNavigate).toHaveBeenCalledWith('/cart');
    });
  });

  describe('Casos de muchos items', () => {
    it('debería mostrar correctamente cuando hay muchos items en el carrito', () => {
      vi.mocked(CartContext.useCart).mockReturnValue({
        items: [],
        totalItems: 99,
        totalPrice: 0,
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        clearCart: vi.fn(),
        isInCart: vi.fn(),
      });

      render(<Navbar />);

      expect(screen.getByText(/CART: 99/)).toBeInTheDocument();
    });
  });
});
