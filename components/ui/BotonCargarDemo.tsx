'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/stores/app-store';
import { FlaskConical, Trash2, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from './Toast';

export const BotonCargarDemo: React.FC = () => {
  const { cargarDatosDemo, limpiarDatosDemo, esModoDemo, pacientesVinculados } = useAppStore();
  const [expandido, setExpandido] = useState(false);

  const handleCargarDemo = () => {
    cargarDatosDemo();
    toast.exito('🎭 Datos de demo cargados: 5 pacientes y 3 alertas activas', {
      duracion: 4000,
    });
    setExpandido(false);
  };

  const handleLimpiar = () => {
    limpiarDatosDemo();
    toast.info('🗑️ Datos demo eliminados. Solo queda el paciente base.', { duracion: 3000 });
    setExpandido(false);
  };

  return (
    <div
      style={{
        background: esModoDemo
          ? 'linear-gradient(135deg, hsl(270,60%,12%), hsl(270,50%,20%))'
          : 'linear-gradient(135deg, hsl(270,60%,18%), hsl(270,50%,28%))',
        border: `1px solid ${esModoDemo ? 'hsl(270,60%,60%)' : 'hsl(270,50%,40%)'}`,
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header siempre visible */}
      <button
        onClick={() => setExpandido(!expandido)}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 16px',
          color: '#fff',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <FlaskConical size={18} />
        </div>

        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>
            {esModoDemo ? '🎭 Modo Demo Activo' : '🎭 Datos de Presentación'}
          </div>
          <div style={{ fontSize: '0.72rem', opacity: 0.75, marginTop: '1px' }}>
            {esModoDemo
              ? `${pacientesVinculados.length} pacientes ficticios cargados`
              : '5 pacientes ficticios nicaragüenses'}
          </div>
        </div>

        <div style={{ color: 'rgba(255,255,255,0.7)' }}>
          {expandido ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* Contenido expandible */}
      {expandido && (
        <div
          style={{
            padding: '0 16px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            animation: 'fade-in 0.2s ease',
          }}
        >
          {/* Info de pacientes */}
          <div
            style={{
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '10px',
              padding: '10px 12px',
              fontSize: '0.78rem',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.5,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: '4px' }}>Pacientes incluidos:</div>
            <div>• Natalia Elena López — Dengue Grave (Diabetes)</div>
            <div>• Carlos Alberto Ruiz — Dengue Alarma</div>
            <div>• Ana Sofía García — Dengue Posible (HTA)</div>
            <div>• Pedro José Jiménez — Bajo Riesgo</div>
            <div>• Rosa Emilia Vega — Dengue Alarma (HTA+DM)</div>
          </div>

          {/* Botones */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              id="btn-cargar-demo"
              onClick={handleCargarDemo}
              style={{
                background: 'hsl(270,60%,55%)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 12px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'background 0.2s',
              }}
            >
              <Users size={14} />
              Cargar Demo
            </button>

            <button
              id="btn-limpiar-demo"
              onClick={handleLimpiar}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '10px',
                padding: '10px 12px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'background 0.2s',
              }}
            >
              <Trash2 size={14} />
              Limpiar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
