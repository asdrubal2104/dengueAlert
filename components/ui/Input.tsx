import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  etiqueta?: string;
  label?: string;
  error?: string;
  textoAyuda?: string;
  ayuda?: string;
}

export const Input: React.FC<InputProps> = ({
  etiqueta,
  label,
  error,
  textoAyuda,
  ayuda,
  id,
  type,
  className = '',
  style,
  ...props
}) => {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const labelText = etiqueta || label;
  const helpText = textoAyuda || ayuda;
  const inputId = id || (labelText ? labelText.toLowerCase().replace(/\s+/g, '-') : undefined);

  const isPassword = type === 'password';
  const inputType = isPassword ? (mostrarPassword ? 'text' : 'password') : type;

  return (
    <div className="campo-formulario">
      {labelText && (
        <label htmlFor={inputId} className="etiqueta">
          {labelText}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          id={inputId}
          type={inputType}
          className={`input ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${inputId}-error` : helpText ? `${inputId}-ayuda` : undefined
          }
          style={{
            border: error ? '1px solid var(--color-danger)' : undefined,
            paddingRight: isPassword ? '44px' : undefined,
            width: '100%',
            ...style,
          }}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setMostrarPassword(!mostrarPassword)}
            aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            tabIndex={-1}
            style={{
              position: 'absolute',
              right: '12px',
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
            }}
          >
            {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <span id={`${inputId}-error`} className="texto-error" role="alert">
          {error}
        </span>
      )}
      {!error && helpText && (
        <span id={`${inputId}-ayuda`} style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
          {helpText}
        </span>
      )}
    </div>
  );
};

