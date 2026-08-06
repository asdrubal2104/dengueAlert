import React from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  if (!password) return null;

  const calcularFortaleza = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const score = calcularFortaleza(password);

  let label = 'Débil';
  let color = '#EF4444'; // Red
  let porcentaje = 20;

  if (score >= 4) {
    label = 'Muy Fuerte';
    color = '#10B981'; // Green
    porcentaje = 100;
  } else if (score >= 3) {
    label = 'Fuerte';
    color = '#10B981';
    porcentaje = 75;
  } else if (score >= 2) {
    label = 'Aceptable';
    color = '#F59E0B'; // Amber
    porcentaje = 50;
  } else {
    label = 'Débil (se recomiendan al menos 6-8 caracteres con números o letras)';
    color = '#EF4444';
    porcentaje = 25;
  }

  return (
    <div style={{ marginTop: '-8px', marginBottom: '4px' }}>
      <div
        style={{
          height: '4px',
          width: '100%',
          backgroundColor: 'var(--color-surface-2, #1E293B)',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${porcentaje}%`,
            backgroundColor: color,
            transition: 'all 300ms ease',
          }}
        />
      </div>
      <div style={{ fontSize: '0.75rem', color: color, marginTop: '4px', fontWeight: 600 }}>
        Nivel de seguridad: {label}
      </div>
    </div>
  );
};
