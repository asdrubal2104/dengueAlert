import React from 'react';
import { ClasificacionDengue } from '@/types/dengue';

interface RiskGaugeProps {
  score: number;
  clasificacion: ClasificacionDengue;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, clasificacion }) => {
  const getGradientAndColor = () => {
    switch (clasificacion) {
      case 'DENGUE_GRAVE':
        return { gradient: 'linear-gradient(90deg, #EF4444, #DC2626)', text: '#EF4444' };
      case 'DENGUE_ALARMA':
        return { gradient: 'linear-gradient(90deg, #F97316, #EF4444)', text: '#F97316' };
      case 'CONSULTA_MEDICA':
        return { gradient: 'linear-gradient(90deg, #F59E0B, #F97316)', text: '#F59E0B' };
      case 'DENGUE_POSIBLE':
        return { gradient: 'linear-gradient(90deg, #F59E0B, #F97316)', text: '#F59E0B' };
      default:
        return { gradient: 'linear-gradient(90deg, #10B981, #0EA5E9)', text: '#10B981' };
    }
  };

  const { gradient, text } = getGradientAndColor();
  const clampedScore = Math.min(100, Math.max(0, score));

  return (
    <div style={{ width: '100%', margin: '16px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          Índice de Riesgo Clínico
        </span>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: text, fontFamily: 'var(--font-mono)' }}>
          {clampedScore}%
        </span>
      </div>

      <div
        style={{
          width: '100%',
          height: '10px',
          backgroundColor: 'var(--color-surface-1)',
          borderRadius: '999px',
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
        }}
      >
        <div
          style={{
            width: `${clampedScore}%`,
            height: '100%',
            background: gradient,
            borderRadius: '999px',
            transition: 'width 800ms cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: `0 0 12px ${text}`,
          }}
        />
      </div>
    </div>
  );
};
