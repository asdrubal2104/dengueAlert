import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AlertOverlay } from '../AlertOverlay';

// Mock Web Audio API alert sounds
vi.mock('@/lib/audio/alert-sounds', () => ({
  reproducirAlertaWarning: vi.fn(),
  reproducirAlertaEmergency: vi.fn(),
  detenerAlerta: vi.fn(),
}));

describe('AlertOverlay — Componente de Emergencia UI', () => {
  it('renderiza correctamente con clasificación DENGUE_GRAVE', () => {
    render(
      <AlertOverlay
        clasificacion="DENGUE_GRAVE"
        sintomasCriticos={['Dificultad para respirar', 'Sangrado de encías']}
        onCerrar={vi.fn()}
        onVerMapa={vi.fn()}
      />
    );

    expect(screen.getByText('¡EMERGENCIA MÉDICA: SÍNTOMAS GRAVES!')).toBeInTheDocument();
    expect(screen.getByText('Dificultad para respirar')).toBeInTheDocument();
    expect(screen.getByText('Sangrado de encías')).toBeInTheDocument();
  });

  it('muestra los botones de llamadas a números de emergencia de Nicaragua (MINSA 102 y Cruz Blanca 128)', () => {
    render(
      <AlertOverlay
        clasificacion="DENGUE_ALARMA"
        sintomasCriticos={['Dolor abdominal intenso']}
        onCerrar={vi.fn()}
        onVerMapa={vi.fn()}
      />
    );

    const boton102 = screen.getByText('MINSA 102').closest('a');
    expect(boton102).toHaveAttribute('href', 'tel:102');

    const boton128 = screen.getByText('Cruz Blanca 128').closest('a');
    expect(boton128).toHaveAttribute('href', 'tel:128');
  });
});
