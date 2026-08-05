import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario' | 'peligro' | 'fantasma' | 'blanco' | 'hero-outline' | string;
  variant?: 'primario' | 'secundario' | 'peligro' | 'fantasma' | 'blanco' | 'hero-outline' | string;
  tamano?: 'normal' | 'grande';
  size?: 'normal' | 'grande';
  cargando?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variante,
  variant,
  tamano,
  size,
  cargando = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const v = (variante || variant || 'primario') as string;
  const varianteClase = {
    primario: 'btn-primario',
    secundario: 'btn-secundario',
    peligro: 'btn-peligro',
    fantasma: 'btn-fantasma',
    blanco: 'btn-blanco',
    'hero-outline': 'btn-hero-outline',
  }[v] || 'btn-primario';

  const effectiveSize = tamano || size || 'normal';
  const tamanoClase = effectiveSize === 'grande' ? 'btn-grande' : '';

  return (
    <button
      className={`btn ${varianteClase} ${tamanoClase} touch-feedback ${className}`}
      disabled={disabled || cargando}
      {...props}
    >
      {cargando ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <svg className="pulso-alerta" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
          Procesando...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
