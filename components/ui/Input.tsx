import React from 'react';

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
  className = '',
  style,
  ...props
}) => {
  const labelText = etiqueta || label;
  const helpText = textoAyuda || ayuda;
  const inputId = id || (labelText ? labelText.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="campo-formulario">
      {labelText && (
        <label htmlFor={inputId} className="etiqueta">
          {labelText}
        </label>
      )}
      <input
        id={inputId}
        className={`input ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${inputId}-error` : helpText ? `${inputId}-ayuda` : undefined
        }
        style={{
          border: error ? '1px solid var(--color-danger)' : undefined,
          ...style,
        }}
        {...props}
      />
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
