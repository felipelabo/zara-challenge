import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Searchbar from '../../components/dashboard/Searchbar';

describe('Searchbar', () => {
  const mockOnSearch = vi.fn();
  const mockOnClearSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderizado', () => {
    it('debería renderizar el input de búsqueda', () => {
      render(
        <Searchbar
          quantity={10}
          onSearch={mockOnSearch}
          searchQuery=""
          onClearSearch={mockOnClearSearch}
        />
      );

      const input = screen.getByPlaceholderText('Search for smartphones');
      expect(input).toBeInTheDocument();
    });

    it('debería mostrar la cantidad de resultados encontrados', () => {
      render(
        <Searchbar
          quantity={42}
          onSearch={mockOnSearch}
          searchQuery=""
          onClearSearch={mockOnClearSearch}
        />
      );

      expect(screen.getByText('42 RESULTS')).toBeInTheDocument();
    });

    it('debería mostrar cantidad 0 cuando no hay resultados', () => {
      render(
        <Searchbar
          quantity={0}
          onSearch={mockOnSearch}
          searchQuery=""
          onClearSearch={mockOnClearSearch}
        />
      );

      expect(screen.getByText('0 RESULTS')).toBeInTheDocument();
    });
  });

  describe('Búsqueda', () => {
    it('debería llamar onSearch cuando el usuario escribe', async () => {
      const user = userEvent.setup();
      render(
        <Searchbar
          quantity={10}
          onSearch={mockOnSearch}
          searchQuery=""
          onClearSearch={mockOnClearSearch}
        />
      );

      const input = screen.getByPlaceholderText('Search for smartphones');
      await user.click(input);
      await user.keyboard('i');

      expect(mockOnSearch).toHaveBeenCalled();
    });

    it('debería mostrar el query de búsqueda actual en el input', () => {
      render(
        <Searchbar
          quantity={5}
          onSearch={mockOnSearch}
          searchQuery="Galaxy"
          onClearSearch={mockOnClearSearch}
        />
      );

      const input = screen.getByPlaceholderText('Search for smartphones') as HTMLInputElement;
      expect(input.value).toBe('Galaxy');
    });
  });

  describe('Limpiar búsqueda', () => {
    it('debería renderizar botón de limpiar cuando hay búsqueda', () => {
      render(
        <Searchbar
          quantity={5}
          onSearch={mockOnSearch}
          searchQuery="iPhone"
          onClearSearch={mockOnClearSearch}
        />
      );

      // El botón muestra ✕
      const clearButton = screen.getByText('✕');
      expect(clearButton).toBeInTheDocument();
    });

    it('no debería mostrar botón de limpiar cuando searchQuery está vacío', () => {
      const { container } = render(
        <Searchbar
          quantity={10}
          onSearch={mockOnSearch}
          searchQuery=""
          onClearSearch={mockOnClearSearch}
        />
      );

      const buttons = container.querySelectorAll('button');
      // No hay botón de limpiar cuando searchQuery está vacío
      expect(buttons.length).toBe(0);
    });

    it('debería llamar onClearSearch al hacer clic en limpiar', async () => {
      const user = userEvent.setup();
      render(
        <Searchbar
          quantity={5}
          onSearch={mockOnSearch}
          searchQuery="iPhone"
          onClearSearch={mockOnClearSearch}
        />
      );

      const clearButton = screen.getByText('✕');
      await user.click(clearButton);

      expect(mockOnClearSearch).toHaveBeenCalled();
    });
  });

  describe('Actualización de cantidad', () => {
    it('debería mostrar diferente cantidad cuando cambia', () => {
      const { rerender } = render(
        <Searchbar
          quantity={10}
          onSearch={mockOnSearch}
          searchQuery=""
          onClearSearch={mockOnClearSearch}
        />
      );

      expect(screen.getByText('10 RESULTS')).toBeInTheDocument();

      rerender(
        <Searchbar
          quantity={15}
          onSearch={mockOnSearch}
          searchQuery=""
          onClearSearch={mockOnClearSearch}
        />
      );

      expect(screen.getByText('15 RESULTS')).toBeInTheDocument();
    });
  });

  describe('Accesibilidad', () => {
    it('debería tener input de texto accesible', () => {
      render(
        <Searchbar
          quantity={10}
          onSearch={mockOnSearch}
          searchQuery=""
          onClearSearch={mockOnClearSearch}
        />
      );

      const input = screen.getByPlaceholderText('Search for smartphones');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('debería poder ser usado con teclado', async () => {
      const user = userEvent.setup();
      render(
        <Searchbar
          quantity={10}
          onSearch={mockOnSearch}
          searchQuery=""
          onClearSearch={mockOnClearSearch}
        />
      );

      const input = screen.getByPlaceholderText('Search for smartphones');
      await user.click(input);
      await user.keyboard('Galaxy');

      expect(mockOnSearch).toHaveBeenCalled();
    });
  });
});
