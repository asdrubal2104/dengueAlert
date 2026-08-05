'use client';

import React, { useState, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, X, Search } from 'lucide-react';

interface Option {
  valor?: string;
  etiqueta?: string;
  value?: string;
  label?: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  etiqueta?: string;
  label?: string;
  opciones?: readonly (Option | string)[];
  options?: readonly (Option | string)[];
  error?: string;
  placeholder?: string;
  value?: string | number | readonly string[];
  onChange?: (e: { target: { value: string; name?: string } }) => void;
}

export const Select: React.FC<SelectProps> = ({
  etiqueta,
  label,
  opciones,
  options,
  error,
  id,
  value,
  onChange,
  name,
  className = '',
  placeholder = 'Seleccionar opción...',
  disabled,
  ...props
}) => {
  const [abierto, setAbierto] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [tempValue, setTempValue] = useState<string | number | readonly string[] | undefined>(value);

  // Gesture state for swipe-down to dismiss
  const [dragY, setDragY] = useState(0);
  const touchStartY = useRef<number | null>(null);

  const reactId = useId();
  const labelText = etiqueta || label;
  const rawOptions = opciones || options || [];
  const selectId = id || (labelText ? labelText.toLowerCase().replace(/\s+/g, '-') : reactId);

  // Sync tempValue when value prop changes or modal opens
  useEffect(() => {
    if (abierto) {
      setTempValue(value);
      setDragY(0);
    }
  }, [value, abierto]);

  // Wait for client mount before rendering portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Normalize options array into { value, label }
  const normalizedOptions = rawOptions.map((opt) => {
    const isObj = typeof opt === 'object' && opt !== null;
    const val = isObj ? (opt.valor ?? opt.value ?? '') : String(opt);
    const txt = isObj ? (opt.etiqueta ?? opt.label ?? val) : String(opt);
    return { value: val, label: txt };
  });

  const selectedOption = normalizedOptions.find((opt) => String(opt.value) === String(value));
  const currentLabel = selectedOption ? selectedOption.label : placeholder;

  // Filter options if user types search term
  const opcionesFiltradas = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Option selection ONLY updates internal tempValue state (User must confirm)
  const handleSelectOption = (optionValue: string) => {
    setTempValue(optionValue);
  };

  // Confirm button fires onChange and closes the bottom sheet
  const handleConfirmar = () => {
    const finalValue = tempValue !== undefined ? String(tempValue) : String(value ?? '');
    if (onChange && finalValue !== undefined) {
      onChange({ target: { value: finalValue, name } });
    }
    setAbierto(false);
    setBusqueda('');
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && abierto) {
        setAbierto(false);
        setBusqueda('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [abierto]);

  // Lock scroll on html element when bottom sheet is open
  useEffect(() => {
    if (abierto) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [abierto]);

  // Touch gesture handlers to allow drag-down to close
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const deltaY = e.touches[0].clientY - touchStartY.current;
    if (deltaY > 0) {
      setDragY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (dragY > 100) {
      setAbierto(false);
      setBusqueda('');
    }
    setDragY(0);
    touchStartY.current = null;
  };

  // Modern Bottom Sheet rendered via React Portal
  const bottomSheet = mounted && abierto
    ? createPortal(
        <div
          className="bottom-sheet-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: 'rgba(11, 17, 32, 0.72)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
          onClick={() => {
            setAbierto(false);
            setBusqueda('');
          }}
        >
          {/* Bottom Sheet Panel */}
          <div
            className="bottom-sheet-panel"
            style={{
              width: '100%',
              maxWidth: '560px',
              maxHeight: '82vh',
              backgroundColor: '#172136',
              borderTopLeftRadius: '28px',
              borderTopRightRadius: '28px',
              borderTop: '1px solid rgba(148, 163, 184, 0.25)',
              borderLeft: '1px solid rgba(148, 163, 184, 0.12)',
              borderRight: '1px solid rgba(148, 163, 184, 0.12)',
              boxShadow: '0 -16px 48px rgba(0, 0, 0, 0.75)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'relative',
              margin: '0 auto',
              transform: dragY > 0 ? `translateY(${dragY}px)` : 'none',
              transition: dragY === 0 ? 'transform 200ms ease' : 'none',
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={labelText || 'Seleccionar opción'}
          >
            {/* Drag Handle Bar with Touch Gesture */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '14px',
                paddingBottom: '8px',
                cursor: 'grab',
                touchAction: 'none',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '5px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(148, 163, 184, 0.4)',
                }}
              />
            </div>

            {/* Header: Title + Close Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 22px 14px 22px',
                borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
              }}
            >
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
                {labelText || 'Seleccionar opción'}
              </h3>
              <button
                type="button"
                aria-label="Cerrar modal"
                onClick={() => {
                  setAbierto(false);
                  setBusqueda('');
                }}
                className="touch-feedback"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(148, 163, 184, 0.14)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  color: 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Search Bar for long lists (> 6 options) */}
            {normalizedOptions.length > 6 && (
              <div style={{ padding: '12px 22px 4px 22px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                  }}
                >
                  <Search size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar opción..."
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: 'var(--color-text)',
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                    }}
                  />
                  {busqueda && (
                    <button
                      type="button"
                      onClick={() => setBusqueda('')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Scrollable Options List */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
                padding: '4px 0 12px 0',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {opcionesFiltradas.length === 0 ? (
                <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  No se encontraron opciones
                </div>
              ) : (
                opcionesFiltradas.map((opt, i) => {
                  const esSeleccionado = String(opt.value) === String(tempValue);

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectOption(opt.value)}
                      className="touch-feedback"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        minHeight: '54px',
                        padding: '14px 22px',
                        backgroundColor: esSeleccionado
                          ? 'rgba(14, 165, 233, 0.14)'
                          : 'transparent',
                        border: 'none',
                        borderBottom: i < opcionesFiltradas.length - 1 ? '1px solid rgba(148, 163, 184, 0.08)' : 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'background-color 150ms ease',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.9375rem',
                          fontWeight: esSeleccionado ? 700 : 500,
                          color: esSeleccionado ? 'var(--color-primary)' : 'var(--color-text)',
                        }}
                      >
                        {opt.label}
                      </span>

                      {/* Right Indicator (Radio circle style matching design image) */}
                      <div
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          border: esSeleccionado
                            ? '2px solid var(--color-primary)'
                            : '2px solid rgba(148, 163, 184, 0.35)',
                          backgroundColor: esSeleccionado ? 'var(--color-primary)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 150ms ease',
                          flexShrink: 0,
                          marginLeft: '12px',
                        }}
                      >
                        {esSeleccionado && (
                          <Check size={13} color="#FFFFFF" strokeWidth={3} />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Bottom Action Footer with extra padding for mobile gesture navigation bar */}
            <div
              style={{
                padding: '16px 22px calc(28px + env(safe-area-inset-bottom, 20px)) 22px',
                borderTop: '1px solid rgba(148, 163, 184, 0.12)',
                backgroundColor: '#172136',
              }}
            >
              <button
                type="button"
                onClick={handleConfirmar}
                className="btn btn-primario touch-feedback"
                style={{
                  width: '100%',
                  minHeight: '50px',
                  borderRadius: '16px',
                  fontSize: '0.9375rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 20px rgba(14, 165, 233, 0.4)',
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <div className="campo-formulario" style={{ position: 'relative' }}>
      {labelText && (
        <label htmlFor={selectId} className="etiqueta">
          {labelText}
        </label>
      )}

      {/* Trigger Button */}
      <button
        id={selectId}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setAbierto(true)}
        aria-haspopup="dialog"
        aria-expanded={abierto}
        className={`input touch-feedback ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          textAlign: 'left',
          cursor: disabled ? 'not-allowed' : 'pointer',
          backgroundColor: 'var(--color-surface-1)',
          border: error ? '1px solid var(--color-danger)' : '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          minHeight: '50px',
          padding: '0 16px',
          color: selectedOption ? 'var(--color-text)' : 'var(--color-text-muted)',
          fontSize: '0.9375rem',
          fontWeight: 500,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {currentLabel}
        </span>
        <ChevronDown
          size={18}
          style={{
            color: 'var(--color-text-muted)',
            transition: 'transform 150ms ease',
            transform: abierto ? 'rotate(180deg)' : 'rotate(0deg)',
            flexShrink: 0,
          }}
        />
      </button>

      {error && <span className="texto-error" role="alert">{error}</span>}

      {/* Hidden native select for accessibility & form submission */}
      <select
        name={name}
        value={value ?? ''}
        onChange={(e) => onChange?.({ target: { value: e.target.value, name } })}
        style={{ display: 'none' }}
        tabIndex={-1}
        aria-hidden="true"
        {...props}
      >
        {normalizedOptions.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Bottom Sheet rendered in portal */}
      {bottomSheet}
    </div>
  );
};
