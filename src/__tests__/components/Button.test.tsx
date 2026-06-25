import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../../components/shared/Button';

describe('Button', () => {
  describe('Renderizado', () => {
    it('debería renderizar el botón con el texto correcto', () => {
      render(<Button>CLICK ME</Button>);

      expect(screen.getByRole('button', { name: 'CLICK ME' })).toBeInTheDocument();
    });

    it('debería renderizar con estilo primario por defecto', () => {
      const { container } = render(<Button>Primary</Button>);

      const button = container.querySelector('button');
      // Verifica que tiene clase primary
      expect(button?.className).toContain('primary');
    });

    it('debería renderizar con estilo secundario cuando se especifica', () => {
      const { container } = render(<Button style="secondary">Secondary</Button>);

      const button = container.querySelector('button');
      expect(button?.className).toContain('secondary');
    });
  });

  describe('Interacción', () => {
    it('debería ejecutar onClick cuando se hace clic', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('debería ser clickeable múltiples veces', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button');
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('Props', () => {
    it('debería aceptar type submit', () => {
      const { container } = render(<Button type="submit">Submit</Button>);

      const button = container.querySelector('button');
      expect(button?.type).toBe('submit');
    });

    it('debería renderizar children correctamente', () => {
      render(
        <Button>
          <span>Custom content</span>
        </Button>
      );

      expect(screen.getByText('Custom content')).toBeInTheDocument();
    });

    it('debería aceptar className personalizado', () => {
      const { container } = render(
        <Button className="custom-class">Custom</Button>
      );

      const button = container.querySelector('button');
      expect(button?.className).toContain('custom-class');
    });
  });

  describe('Accesibilidad', () => {
    it('debería tener role button', () => {
      render(<Button>Accessible</Button>);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('debería ser navegable por teclado', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Tab me</Button>);

      // Tab para enfocar el botón
      await user.tab();

      // Enter para activar
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
