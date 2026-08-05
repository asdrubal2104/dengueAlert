import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Select } from '../Select';

describe('Select Component (Bottom Sheet UI)', () => {
  const opcionesEjemplo = [
    { valor: 'O+', etiqueta: 'O Positivo (O+)' },
    { valor: 'O-', etiqueta: 'O Negativo (O-)' },
    { valor: 'A+', etiqueta: 'A Positivo (A+)' },
    { valor: 'B+', etiqueta: 'B Positivo (B+)' },
  ];

  it('renderiza la etiqueta y el placeholder por defecto', () => {
    render(
      <Select
        etiqueta="Tipo de Sangre"
        opciones={opcionesEjemplo}
        value=""
        placeholder="Seleccionar..."
      />
    );

    expect(screen.getByText('Tipo de Sangre')).toBeInTheDocument();
    expect(screen.getByText('Seleccionar...')).toBeInTheDocument();
  });

  it('muestra el valor seleccionado en el trigger button', () => {
    render(
      <Select
        etiqueta="Tipo de Sangre"
        opciones={opcionesEjemplo}
        value="O+"
      />
    );

    expect(screen.getAllByText('O Positivo (O+)')[0]).toBeInTheDocument();
  });

  it('abre el bottom sheet al hacer clic en el trigger y muestra las opciones', () => {
    render(
      <Select
        etiqueta="Tipo de Sangre"
        opciones={opcionesEjemplo}
        value="O+"
      />
    );

    const trigger = screen.getByRole('button', { name: 'Tipo de Sangre' });
    fireEvent.click(trigger);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText('O Negativo (O-)')).toBeInTheDocument();
    expect(within(dialog).getByText('A Positivo (A+)')).toBeInTheDocument();
  });

  it('no cierra el modal ni emite onChange al tocar una opción hasta hacer clic en Confirmar', () => {
    const handleChange = vi.fn();
    render(
      <Select
        etiqueta="Tipo de Sangre"
        opciones={opcionesEjemplo}
        value="O+"
        onChange={handleChange}
      />
    );

    const trigger = screen.getByRole('button', { name: 'Tipo de Sangre' });
    fireEvent.click(trigger);

    const dialog = screen.getByRole('dialog');
    const opcionBPositivo = within(dialog).getByRole('button', { name: /B Positivo \(B\+\)/i });
    
    // Tap option -> Should NOT trigger onChange yet
    fireEvent.click(opcionBPositivo);
    expect(handleChange).not.toHaveBeenCalled();
    expect(dialog).toBeInTheDocument();

    // Tap Confirmar -> Now fires onChange and closes modal
    const botonConfirmar = within(dialog).getByRole('button', { name: /Confirmar/i });
    fireEvent.click(botonConfirmar);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: 'B+' }),
      })
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('cierra el modal al hacer clic en el botón de cerrar X', () => {
    render(
      <Select
        etiqueta="Tipo de Sangre"
        opciones={opcionesEjemplo}
        value="O+"
      />
    );

    const trigger = screen.getByRole('button', { name: 'Tipo de Sangre' });
    fireEvent.click(trigger);

    const dialog = screen.getByRole('dialog');
    const botonCerrar = within(dialog).getByRole('button', { name: /Cerrar modal/i });
    fireEvent.click(botonCerrar);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
