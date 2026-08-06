import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import ResultadoEvaluacionPage from '../resultado/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock simple de Link
vi.mock('next/link', () => {
  return {
    default: ({ children, href }: any) => <a href={href}>{children}</a>,
  };
});

// Helper para mockear el store con diferentes resultados
const mockStore = (evaluacionMock: any) => {
  vi.doMock('@/stores/app-store', () => ({
    useAppStore: (selector: any) => selector({
      registros: evaluacionMock ? [evaluacionMock] : [],
      usuarioActual: null,
    }),
  }));
};

describe('ResultadoEvaluacionPage', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('muestra botón de alerta de emergencia para DENGUE_GRAVE', async () => {
    mockStore({
      sintomasIds: ['S21'], // Dificultad para respirar (SEVERE)
      diasConSintomas: 2,
      fiebreBajoRecientemente: false,
      fechaRegistro: new Date().toISOString()
    });

    const { default: ResultadoPage } = await import('../resultado/page');
    render(<ResultadoPage />);

    expect(screen.getByText('ABRIR ALERTA Y BUSCAR HOSPITAL MINSA')).toBeInTheDocument();
    expect(screen.getByText(/Emergencia médica: buscá ayuda ahora/i)).toBeInTheDocument();
  });

  it('muestra botón de búsqueda de mapa para ATENCION_HOY', async () => {
    mockStore({
      sintomasIds: ['S11'], // Dolor abdominal intenso (WARNING)
      diasConSintomas: 2,
      fiebreBajoRecientemente: false,
      fechaRegistro: new Date().toISOString()
    });

    const { default: ResultadoPage } = await import('../resultado/page');
    render(<ResultadoPage />);

    expect(screen.getByText(/buscar centro de salud/i)).toBeInTheDocument();
    expect(screen.getByText(/Atención hoy: síntoma que requiere valoración/i)).toBeInTheDocument();
  });

  it('muestra el disclaimer en la página de resultado', async () => {
    mockStore({
      sintomasIds: ['S01', 'S02'], // Fiebre + Dolor cabeza
      diasConSintomas: 2,
      fiebreBajoRecientemente: false,
      fechaRegistro: new Date().toISOString()
    });

    const { default: ResultadoPage } = await import('../resultado/page');
    render(<ResultadoPage />);

    expect(screen.getByText(/Esta evaluación es orientativa y no sustituye el diagnóstico de un médico/i)).toBeInTheDocument();
  });
});
