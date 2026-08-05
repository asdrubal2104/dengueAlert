'use client';

import React from 'react';
import Link from 'next/link';
import { WifiOff, RefreshCw, Activity, PhoneCall } from 'lucide-react';
import { NUMEROS_EMERGENCIA_NICARAGUA } from '@/types/nicaragua';

export default function OfflinePage() {
  const reintentarConexion = () => {
    window.location.reload();
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center',
        gap: '16px',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'var(--color-dengue-alarma-bg)',
          color: 'var(--color-dengue-alarma-dark)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <WifiOff size={36} />
      </div>

      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Modo Sin Conexión</h2>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)',
            marginTop: '6px',
            maxWidth: '320px',
            lineHeight: 1.4,
          }}
        >
          No tenés conexión a internet activa, pero podés seguir evaluando tus síntomas offline.
        </p>
      </div>

      <div
        style={{
          background: 'var(--color-surface-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '16px',
          width: '100%',
          maxWidth: '360px',
          textAlign: 'left',
          fontSize: '0.85rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>
          ✅ Funciones disponibles offline:
        </div>
        <div>• Clasificación de síntomas según OMS 2009</div>
        <div>• Recomendaciones de cuidado inmediato</div>
        <div>• Números telefónicos de emergencia Nicaragua</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '360px' }}>
        <Link href="/sintomas" className="btn btn-primario">
          <Activity size={18} />
          <span>Evaluar síntomas offline</span>
        </Link>

        <a
          href={`tel:${NUMEROS_EMERGENCIA_NICARAGUA[0].numero}`}
          className="btn btn-peligro"
          style={{ textDecoration: 'none' }}
        >
          <PhoneCall size={18} />
          <span>Llamar Emergencias MINSA (102)</span>
        </a>

        <button onClick={reintentarConexion} className="btn btn-secundario">
          <RefreshCw size={16} />
          <span>Reintentar conexión</span>
        </button>
      </div>
    </div>
  );
}
