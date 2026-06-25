import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SmartphoneCard from '../../components/dashboard/SmartphoneCard';
import { useNavigate } from 'react-router';

vi.mock('react-router');

describe('SmartphoneCard', () => {
  const mockNavigate = vi.fn();
  const mockProduct = {
    id: '1',
    brand: 'Apple',
    name: 'iPhone 15',
    basePrice: 999,
    imageUrl: 'https://example.com/iphone15.jpg',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  describe('Renderizado', () => {
    it('debería renderizar el componente con los datos del producto', () => {
      render(<SmartphoneCard {...mockProduct} />);

      expect(screen.getByText('APPLE')).toBeInTheDocument();
      expect(screen.getByText('IPHONE 15')).toBeInTheDocument();
      expect(screen.getByText('999 EUR')).toBeInTheDocument();
    });

    it('debería mostrar la imagen del producto', () => {
      render(<SmartphoneCard {...mockProduct} />);

      const image = screen.getByAltText('iPhone 15');
      expect(image).toHaveAttribute('src', mockProduct.imageUrl);
    });

    it('debería convertir marca y nombre a mayúsculas', () => {
      render(<SmartphoneCard {...mockProduct} />);

      // Verifica que se muestren en mayúsculas (toLocaleUpperCase)
      expect(screen.getByText('APPLE')).toBeInTheDocument();
      expect(screen.getByText('IPHONE 15')).toBeInTheDocument();
    });
  });

  describe('Interacción', () => {
    it('debería navegar al detalle del producto al hacer clic', async () => {
      const user = userEvent.setup();
      render(<SmartphoneCard {...mockProduct} />);

      const card = screen.getByText('IPHONE 15').closest('div');
      if (card?.parentElement) {
        await user.click(card.parentElement);
      }

      expect(mockNavigate).toHaveBeenCalledWith('/product/1');
    });

    it('debería aceptar className personalizado', () => {
      const { container } = render(
        <SmartphoneCard {...mockProduct} className="custom-class" />
      );

      // Verifica que el className fue pasado (usa un selector que encuentre cualquier elemento con la clase)
      const customElement = container.querySelector('[class*="custom-class"]');
      expect(customElement).toBeInTheDocument();
    });
  });

  describe('Props diferentes', () => {
    it('debería manejar precios diferentes', () => {
      const expensiveProduct = { ...mockProduct, basePrice: 1299 };
      render(<SmartphoneCard {...expensiveProduct} />);

      expect(screen.getByText('1299 EUR')).toBeInTheDocument();
    });

    it('debería manejar marcas diferentes', () => {
      const samsungProduct = { ...mockProduct, brand: 'Samsung', name: 'Galaxy S24' };
      render(<SmartphoneCard {...samsungProduct} />);

      expect(screen.getByText('SAMSUNG')).toBeInTheDocument();
      expect(screen.getByText('GALAXY S24')).toBeInTheDocument();
    });
  });
});
