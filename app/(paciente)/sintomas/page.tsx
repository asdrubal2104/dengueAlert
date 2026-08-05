'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { SintomaIcon } from '@/components/ui/SintomaIcon';
import { CATALOGO_SINTOMAS } from '@/lib/dengue/sintomas';
import { SintomaId } from '@/types/dengue';
import { useAppStore } from '@/stores/app-store';
import {
  ArrowRight,
  Check,
  Calendar,
  Search,
  AlertTriangle,
} from 'lucide-react';

export default function SelectorSintomasPage() {
  const router = useRouter();
  const [sintomasSeleccionados, setSintomasSeleccionados] = useState<SintomaId[]>([]);
  const [diasFiebre, setDiasFiebre] = useState<number>(1);
  const [busqueda, setBusqueda] = useState<string>('');
  const [categoriaActiva, setCategoriaActiva] = useState<'TODOS' | 'GENERALES' | 'ALARMA'>('TODOS');

  const guardarEvaluacion = useAppStore((state) => state.guardarEvaluacion);

  const toggleSintoma = (id: SintomaId) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(30);
    }
    setSintomasSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const sintomasFiltrados = useMemo(() => {
    return CATALOGO_SINTOMAS.filter((s) => {
      const coincideBusqueda =
        s.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        s.descripcion.toLowerCase().includes(busqueda.toLowerCase());

      if (!coincideBusqueda) return false;

      if (categoriaActiva === 'ALARMA') return s.esSignoAlarma;
      if (categoriaActiva === 'GENERALES') return !s.esSignoAlarma;
      return true;
    });
  }, [busqueda, categoriaActiva]);

  const tieneSignosAlarma = useMemo(() => {
    return sintomasSeleccionados.some(
      (id) => CATALOGO_SINTOMAS.find((s) => s.id === id)?.esSignoAlarma
    );
  }, [sintomasSeleccionados]);

  const handleVerResultado = () => {
    if (sintomasSeleccionados.length === 0) return;
    guardarEvaluacion(sintomasSeleccionados, diasFiebre);
    router.push('/resultado');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} className="slide-up">
      {/* Header instructions */}
      <div>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '4px', letterSpacing: '-0.01em' }}>
          Evaluación de Síntomas Febriles
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          Seleccioná todos los síntomas que presentás actualmente para el triaje clínico.
        </p>
      </div>

      {/* Duration Selector */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-0)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          padding: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Calendar size={18} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>
            ¿Hace cuántos días iniciaron los síntomas?
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[1, 2, 3, 4, 5, 6, 7].map((dia) => {
            const esSeleccionado = diasFiebre === dia;
            return (
              <button
                key={dia}
                type="button"
                onClick={() => setDiasFiebre(dia)}
                aria-pressed={esSeleccionado}
                style={{
                  flex: '1 0 44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: esSeleccionado ? 'var(--color-primary-soft)' : 'var(--color-surface-1)',
                  border: esSeleccionado ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  color: esSeleccionado ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
                className="touch-feedback"
              >
                {dia === 7 ? '7+' : `${dia}d`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Pills & Search */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Buscar síntoma (ej. dolor de ojos, vómito)..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input"
            style={{ paddingLeft: '42px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setCategoriaActiva('TODOS')}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: categoriaActiva === 'TODOS' ? 'var(--color-primary)' : 'var(--color-surface-1)',
              color: categoriaActiva === 'TODOS' ? '#FFFFFF' : 'var(--color-text-secondary)',
              fontWeight: 800,
              fontSize: '0.8125rem',
              cursor: 'pointer',
            }}
            className="touch-feedback"
          >
            Todos ({CATALOGO_SINTOMAS.length})
          </button>

          <button
            type="button"
            onClick={() => setCategoriaActiva('GENERALES')}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: categoriaActiva === 'GENERALES' ? 'var(--color-primary)' : 'var(--color-surface-1)',
              color: categoriaActiva === 'GENERALES' ? '#FFFFFF' : 'var(--color-text-secondary)',
              fontWeight: 800,
              fontSize: '0.8125rem',
              cursor: 'pointer',
            }}
            className="touch-feedback"
          >
            Generales
          </button>

          <button
            type="button"
            onClick={() => setCategoriaActiva('ALARMA')}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: categoriaActiva === 'ALARMA' ? 'var(--color-danger)' : 'var(--color-surface-1)',
              color: categoriaActiva === 'ALARMA' ? '#FFFFFF' : 'var(--color-danger)',
              fontWeight: 800,
              fontSize: '0.8125rem',
              cursor: 'pointer',
            }}
            className="touch-feedback"
          >
            Alarma ⚠️
          </button>
        </div>
      </div>

      {/* Warning banner if alarm signs picked */}
      {tieneSignosAlarma && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 16px',
            backgroundColor: 'var(--color-danger-soft)',
            border: '1px solid var(--color-danger)',
            borderRadius: '16px',
            color: 'var(--color-danger)',
          }}
          className="slide-up"
        >
          <AlertTriangle size={24} style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.8125rem', lineHeight: 1.4, fontWeight: 600 }}>
            <strong>¡Atención médica urgente necesaria!</strong> Habéis seleccionado uno o más signos de alarma de Dengue Grave.
          </div>
        </div>
      )}

      {/* Symptom Tile Grid */}
      <div className="grid-sintomas">
        {sintomasFiltrados.map((sintoma) => {
          const seleccionado = sintomasSeleccionados.includes(sintoma.id);

          return (
            <button
              key={sintoma.id}
              type="button"
              onClick={() => toggleSintoma(sintoma.id)}
              className="tarjeta-sintoma touch-feedback"
              style={{
                justifyContent: 'flex-start',
                paddingTop: '16px',
                paddingBottom: '16px',
                minHeight: '124px',
              }}
              aria-pressed={seleccionado}
              data-seleccionado={seleccionado}
              data-categoria={sintoma.esSignoAlarma ? 'ALARMA' : 'GENERAL'}
            >


              {seleccionado && (
                <div
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: sintoma.esSignoAlarma ? 'var(--color-danger)' : 'var(--color-primary)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={13} strokeWidth={3} />
                </div>
              )}

              <div className="tarjeta-sintoma__icono">
                <SintomaIcon nombreIcono={sintoma.icono} size={22} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span className="tarjeta-sintoma__nombre">
                  {sintoma.nombre}
                </span>
                
                {sintoma.esSignoAlarma && (
                  <span
                    style={{
                      fontSize: '0.625rem',
                      fontWeight: 800,
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      color: '#F87171',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      lineHeight: 1,
                    }}
                  >
                    <AlertTriangle size={10} strokeWidth={3} />
                    Alarma
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Floating Action Sticky Bar */}
      {sintomasSeleccionados.length > 0 && (
        <div
          style={{
            position: 'sticky',
            bottom: '84px',
            zIndex: 45,
            backgroundColor: 'rgba(23, 33, 54, 0.95)',
            backdropFilter: 'blur(20px)',
            border: tieneSignosAlarma ? '1px solid var(--color-danger)' : '1px solid var(--color-primary)',
            borderRadius: '20px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 10px 32px rgba(0, 0, 0, 0.6)',
          }}
          className="slide-up"
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
              Seleccionados
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-text)' }}>
              {sintomasSeleccionados.length} síntoma(s)
            </div>
          </div>

          <Button
            variante={tieneSignosAlarma ? 'peligro' : 'primario'}
            onClick={handleVerResultado}
            style={{ padding: '0 20px', minHeight: '46px', width: 'auto' }}
          >
            <span>VER RESULTADO</span>
            <ArrowRight size={18} />
          </Button>
        </div>
      )}
    </div>
  );
}
