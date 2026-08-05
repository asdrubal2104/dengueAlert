'use client';

import React, { useState } from 'react';
import { probarConexionSupabase } from '@/lib/supabase/services';
import { Database, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from './Toast';

export const BotonProbarSupabase: React.FC = () => {
  const [probando, setProbando] = useState(false);
  const [estado, setEstado] = useState<{ ok: boolean; mensaje: string; count?: number } | null>(null);

  const handleProbar = async () => {
    setProbando(true);
    setEstado(null);

    const res = await probarConexionSupabase();
    setEstado(res);
    setProbando(false);

    if (res.ok) {
      toast.exito(`⚡ Conectado a Supabase (${res.count} síntomas en catálogo RLS)`, { duracion: 4000 });
    } else {
      toast.error(`❌ ${res.mensaje}`, { duracion: 5000 });
    }
  };

  return (
    <div
      style={{
        background: 'var(--color-surface-card)',
        border: '1px solid var(--color-border)',
        borderRadius: '14px',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={20} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Conexión Supabase Cloud</span>
        </div>

        <button
          onClick={handleProbar}
          disabled={probando}
          style={{
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary-dark)',
            border: 'none',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: probando ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <RefreshCw size={14} className={probando ? 'spin' : ''} style={{ animation: probando ? 'spin 1s linear infinite' : 'none' }} />
          {probando ? 'Probando...' : 'Probar Conexión'}
        </button>
      </div>

      {estado && (
        <div
          style={{
            padding: '10px 12px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: estado.ok ? 'var(--color-bajo-riesgo-bg)' : 'var(--color-dengue-grave-bg)',
            color: estado.ok ? 'var(--color-bajo-riesgo-dark)' : 'var(--color-dengue-grave-dark)',
            border: `1px solid ${estado.ok ? 'var(--color-bajo-riesgo)' : 'var(--color-dengue-grave)'}`,
          }}
        >
          {estado.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{estado.mensaje}</span>
        </div>
      )}
    </div>
  );
};
