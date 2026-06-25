import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DetailsOptions from '../../components/details/DetailsOptions';

describe('DetailsOptions', () => {
  const mockOnColorChange = vi.fn();
  const mockOnStorageChange = vi.fn();

  const mockColorOptions = [
    { name: 'Black', hexCode: '#000000', imageUrl: 'black.jpg' },
    { name: 'White', hexCode: '#FFFFFF', imageUrl: 'white.jpg' },
    { name: 'Blue', hexCode: '#0000FF', imageUrl: 'blue.jpg' },
  ];

  const mockStorageOptions = [
    { capacity: '128GB', price: 999 },
    { capacity: '256GB', price: 1099 },
    { capacity: '512GB', price: 1299 },
  ];

  const mockSelectedColor = mockColorOptions[0];
  const mockSelectedStorage = mockStorageOptions[0];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderizado de colores', () => {
    it('debería renderizar todas las opciones de color', () => {
      render(
        <DetailsOptions
          colorOptions={mockColorOptions}
          storageOptions={mockStorageOptions}
          selectedColor={mockSelectedColor}
          selectedStorage={mockSelectedStorage}
          onColorChange={mockOnColorChange}
          onStorageChange={mockOnStorageChange}
        />
      );

      // Los colores se muestran como spans con backgroundColor, no como texto
      // Verifica que hay botones de color (uno por cada color)
      const colorButtons = document.querySelectorAll('button');
      expect(colorButtons.length).toBeGreaterThanOrEqual(mockColorOptions.length);
    });

    it('debería mostrar el nombre del color seleccionado', () => {
      render(
        <DetailsOptions
          colorOptions={mockColorOptions}
          storageOptions={mockStorageOptions}
          selectedColor={mockSelectedColor}
          selectedStorage={mockSelectedStorage}
          onColorChange={mockOnColorChange}
          onStorageChange={mockOnStorageChange}
        />
      );

      // El nombre del color seleccionado se muestra en un <p>
      expect(screen.getByText('Black')).toBeInTheDocument();
    });
  });

  describe('Renderizado de almacenamiento', () => {
    it('debería renderizar todas las opciones de almacenamiento', () => {
      render(
        <DetailsOptions
          colorOptions={mockColorOptions}
          storageOptions={mockStorageOptions}
          selectedColor={mockSelectedColor}
          selectedStorage={mockSelectedStorage}
          onColorChange={mockOnColorChange}
          onStorageChange={mockOnStorageChange}
        />
      );

      mockStorageOptions.forEach(storage => {
        expect(screen.getByText(storage.capacity)).toBeInTheDocument();
      });
    });

    it('debería renderizar opciones de almacenamiento como botones', () => {
      const { container } = render(
        <DetailsOptions
          colorOptions={mockColorOptions}
          storageOptions={mockStorageOptions}
          selectedColor={mockSelectedColor}
          selectedStorage={mockSelectedStorage}
          onColorChange={mockOnColorChange}
          onStorageChange={mockOnStorageChange}
        />
      );

      // Verifica que hay botones de almacenamiento (buttons con clase storage-button)
      const storageButtons = container.querySelectorAll('[class*="storage-button"]');
      expect(storageButtons.length).toBeGreaterThanOrEqual(mockStorageOptions.length);
    });
  });

  describe('Interacción - Cambio de color', () => {
    it('debería renderizar botones de color interactivos', () => {
      const { container } = render(
        <DetailsOptions
          colorOptions={mockColorOptions}
          storageOptions={mockStorageOptions}
          selectedColor={mockSelectedColor}
          selectedStorage={mockSelectedStorage}
          onColorChange={mockOnColorChange}
          onStorageChange={mockOnStorageChange}
        />
      );

      const colorButtons = container.querySelectorAll('[class*="color-button"]');
      expect(colorButtons.length).toBeGreaterThanOrEqual(mockColorOptions.length);
    });

  });

  describe('Interacción - Cambio de almacenamiento', () => {
    it('debería llamar onStorageChange al seleccionar almacenamiento diferente', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <DetailsOptions
          colorOptions={mockColorOptions}
          storageOptions={mockStorageOptions}
          selectedColor={mockSelectedColor}
          selectedStorage={mockSelectedStorage}
          onColorChange={mockOnColorChange}
          onStorageChange={mockOnStorageChange}
        />
      );

      // Obtén todos los botones de almacenamiento
      const storageButtons = container.querySelectorAll('[class*="storage-button"]');
      // Clickea el segundo botón (256GB)
      await user.click(storageButtons[1] as HTMLElement);

      expect(mockOnStorageChange).toHaveBeenCalledWith(mockStorageOptions[1]);
    });

    it('debería permitir cambiar entre todas las opciones de almacenamiento', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <DetailsOptions
          colorOptions={mockColorOptions}
          storageOptions={mockStorageOptions}
          selectedColor={mockSelectedColor}
          selectedStorage={mockSelectedStorage}
          onColorChange={mockOnColorChange}
          onStorageChange={mockOnStorageChange}
        />
      );

      const storageButtons = container.querySelectorAll('[class*="storage-button"]');

      for (let i = 1; i < storageButtons.length; i++) {
        await user.click(storageButtons[i] as HTMLElement);
        expect(mockOnStorageChange).toHaveBeenCalledWith(mockStorageOptions[i]);
      }
    });
  });

  describe('Casos edge', () => {
    it('debería manejar una sola opción de color', () => {
      render(
        <DetailsOptions
          colorOptions={[mockColorOptions[0]]}
          storageOptions={mockStorageOptions}
          selectedColor={mockColorOptions[0]}
          selectedStorage={mockSelectedStorage}
          onColorChange={mockOnColorChange}
          onStorageChange={mockOnStorageChange}
        />
      );

      expect(screen.getByText('Black')).toBeInTheDocument();
    });

    it('debería manejar muchas opciones de almacenamiento', () => {
      const manyStorageOptions = [
        { capacity: '64GB', price: 899 },
        { capacity: '128GB', price: 999 },
        { capacity: '256GB', price: 1099 },
        { capacity: '512GB', price: 1299 },
        { capacity: '1TB', price: 1599 },
      ];

      render(
        <DetailsOptions
          colorOptions={mockColorOptions}
          storageOptions={manyStorageOptions}
          selectedColor={mockSelectedColor}
          selectedStorage={manyStorageOptions[0]}
          onColorChange={mockOnColorChange}
          onStorageChange={mockOnStorageChange}
        />
      );

      manyStorageOptions.forEach(storage => {
        expect(screen.getByText(storage.capacity)).toBeInTheDocument();
      });
    });

    it('debería renderizar múltiples opciones de almacenamiento', () => {
      const expensiveStorage = [
        { capacity: '1TB', price: 2499 },
        { capacity: '2TB', price: 3499 },
      ];

      const { container } = render(
        <DetailsOptions
          colorOptions={mockColorOptions}
          storageOptions={expensiveStorage}
          selectedColor={mockSelectedColor}
          selectedStorage={expensiveStorage[0]}
          onColorChange={mockOnColorChange}
          onStorageChange={mockOnStorageChange}
        />
      );

      const storageButtons = container.querySelectorAll('[class*="storage-button"]');
      expect(storageButtons.length).toBe(expensiveStorage.length);
    });
  });

  describe('Actualización de selecciones', () => {
    it('debería actualizar cuando cambia selectedColor', () => {
      const { rerender } = render(
        <DetailsOptions
          colorOptions={mockColorOptions}
          storageOptions={mockStorageOptions}
          selectedColor={mockColorOptions[0]}
          selectedStorage={mockSelectedStorage}
          onColorChange={mockOnColorChange}
          onStorageChange={mockOnStorageChange}
        />
      );

      expect(screen.getByText('Black')).toBeInTheDocument();

      rerender(
        <DetailsOptions
          colorOptions={mockColorOptions}
          storageOptions={mockStorageOptions}
          selectedColor={mockColorOptions[1]}
          selectedStorage={mockSelectedStorage}
          onColorChange={mockOnColorChange}
          onStorageChange={mockOnStorageChange}
        />
      );

      // Después del rerender, debería mostrar White
      expect(screen.getByText('White')).toBeInTheDocument();
    });

    it('debería actualizar cuando cambia selectedStorage', () => {
      const { rerender } = render(
        <DetailsOptions
          colorOptions={mockColorOptions}
          storageOptions={mockStorageOptions}
          selectedColor={mockSelectedColor}
          selectedStorage={mockStorageOptions[0]}
          onColorChange={mockOnColorChange}
          onStorageChange={mockOnStorageChange}
        />
      );

      expect(screen.getByText('128GB')).toBeInTheDocument();

      rerender(
        <DetailsOptions
          colorOptions={mockColorOptions}
          storageOptions={mockStorageOptions}
          selectedColor={mockSelectedColor}
          selectedStorage={mockStorageOptions[2]}
          onColorChange={mockOnColorChange}
          onStorageChange={mockOnStorageChange}
        />
      );

      expect(screen.getByText('512GB')).toBeInTheDocument();
    });
  });
});
