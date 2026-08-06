import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SelectorSintomasPage from '../sintomas/page';

const push = vi.fn();
const guardarEvaluacion = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

vi.mock('@/stores/app-store', () => ({
  useAppStore: (selector: (state: { guardarEvaluacion: typeof guardarEvaluacion }) => unknown) =>
    selector({ guardarEvaluacion }),
}));

describe('SelectorSintomasPage — fase crítica', () => {
  it('muestra la pregunta sobre descenso de fiebre únicamente entre los días 3 y 6', () => {
    render(<SelectorSintomasPage />);

    expect(screen.queryByText('¿La fiebre bajó o desapareció recientemente?')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '3d' }));
    expect(screen.getByText('¿La fiebre bajó o desapareció recientemente?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'No estoy seguro/a' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '7+' }));
    expect(screen.queryByText('¿La fiebre bajó o desapareció recientemente?')).not.toBeInTheDocument();
  });

  it('muestra el aviso de alarma cuando se selecciona un síntoma de alarma o grave', () => {
    render(<SelectorSintomasPage />);
    
    // Al inicio no debe mostrarse el banner
    expect(screen.queryByText(/Atención presencial hoy\./i)).not.toBeInTheDocument();
    expect(screen.queryByText(/¡Emergencia médica!/i)).not.toBeInTheDocument();

    // Seleccionamos un síntoma de alarma (S11 - Dolor abdominal intenso)
    // S11 es "Dolor abdominal intenso"
    const btnDolorAbdominal = screen.getByText('Dolor abdominal intenso').closest('button');
    if (btnDolorAbdominal) fireEvent.click(btnDolorAbdominal);
    
    expect(screen.getByText(/Atención presencial hoy\./i)).toBeInTheDocument();

    // Deseleccionamos
    if (btnDolorAbdominal) fireEvent.click(btnDolorAbdominal);

    // Seleccionamos un síntoma grave (S21 - Dificultad para respirar)
    const btnRespirar = screen.getByText('Dificultad para respirar').closest('button');
    if (btnRespirar) fireEvent.click(btnRespirar);

    expect(screen.getByText(/¡Emergencia médica!/i)).toBeInTheDocument();
  });
});
