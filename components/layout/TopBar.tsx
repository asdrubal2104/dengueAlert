'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/stores/app-store';
import { Activity, Stethoscope, UserCheck } from 'lucide-react';

interface TopBarProps {
  titulo?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ titulo }) => {
  const usuarioActual = useAppStore((state) => state.usuarioActual);
  const rol = usuarioActual?.rol;

  return (
    <header className="topbar">
      <div style={{ maxWidth: '560px', width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href={rol === 'MEDICO' ? '/dashboard' : '/inicio'} className="topbar__logo touch-feedback">
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(14, 165, 233, 0.4)',
            }}
          >
            <Activity size={18} strokeWidth={2.5} />
          </div>
          <span>
            Dengue<span style={{ color: 'var(--color-primary)' }}>Alert</span>
          </span>
        </Link>

        {titulo && <h1 className="topbar__titulo">{titulo}</h1>}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {rol === 'MEDICO' ? (
            <span
              className="badge"
              data-tipo="DENGUE_POSIBLE"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'rgba(14, 165, 233, 0.15)',
                color: '#38BDF8',
                border: '1px solid rgba(14, 165, 233, 0.3)',
              }}
            >
              <Stethoscope size={13} />
              <span>
                MINSA {usuarioActual?.codigoMinsa ? `#${usuarioActual.codigoMinsa.replace(/^MINSA-?/i, '')}` : 'Médico'}
              </span>
            </span>
          ) : rol === 'PACIENTE' ? (
            <span
              className="badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'rgba(148, 163, 184, 0.1)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
              }}
            >
              <UserCheck size={13} />
              <span>Paciente</span>
            </span>
          ) : null}
        </div>
      </div>
    </header>
  );
};
