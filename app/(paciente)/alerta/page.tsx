'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/stores/app-store';
import { clasificarDengue } from '@/lib/dengue/clasificador';
import { HospitalMap } from '@/components/maps/HospitalMap';
import { AlertOverlay } from '@/components/ui/AlertOverlay';
import { ShieldAlert, ArrowLeft, Volume2 } from 'lucide-react';
import Link from 'next/link';

export default function AlertaPage() {
  const { registros } = useAppStore();
  const ultimoRegistro = registros[0];

  const resultado = ultimoRegistro
    ? clasificarDengue(ultimoRegistro.sintomasIds)
    : clasificarDengue(['S11']); // Fallback warning for demo

  const [mostrarOverlay, setMostrarOverlay] = useState(false);

  const sintomasCriticos = resultado.sintomasSeleccionados
    .filter((s) => s.esSignoAlarma)
    .map((s) => s.nombre);

  const esGrave = resultado.clasificacion === 'DENGUE_GRAVE';

  return (
    <div style={{ minHeight: mostrarOverlay ? '100vh' : 'auto' }}>
      {/* Full-Screen Immersive Overlay if triggered */}
      {mostrarOverlay && (
        <AlertOverlay
          clasificacion={resultado.clasificacion}
          sintomasCriticos={sintomasCriticos}
          onCerrar={() => setMostrarOverlay(false)}
          onVerMapa={() => setMostrarOverlay(false)}
        />
      )}

      {/* Main page content only rendered when overlay is closed */}
      {!mostrarOverlay && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} className="slide-up">
          {/* Header back link */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              href="/inicio"
              style={{
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              <ArrowLeft size={18} />
              <span>Volver al inicio</span>
            </Link>
          </div>

          {/* Alert Header Status Banner */}
          <div
            style={{
              backgroundColor: esGrave ? 'var(--color-danger-soft)' : 'var(--color-orange-soft)',
              border: `1px solid ${esGrave ? 'var(--color-danger)' : 'var(--color-orange)'}`,
              borderRadius: '20px',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: esGrave ? 'var(--color-danger)' : 'var(--color-orange)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ShieldAlert size={26} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '2px' }}>
                  Centro de Asistencia Médica MINSA
                </h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                  Localizá unidades de salud del MINSA en Nicaragua para atención presencial.
                </p>
              </div>
            </div>

            <button
              onClick={() => setMostrarOverlay(true)}
              style={{
                marginTop: '14px',
                fontSize: '0.8125rem',
                color: esGrave ? 'var(--color-danger)' : 'var(--color-orange)',
                fontWeight: 800,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Volume2 size={16} />
              <span>Abrir Alerta de Emergencia con Audio</span>
            </button>
          </div>

          {/* Hospital Map Component */}
          <HospitalMap />
        </div>
      )}
    </div>
  );
}
