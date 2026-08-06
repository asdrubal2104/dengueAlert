'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { CheckCircle, AlertTriangle, X, Info } from 'lucide-react';

export type ToastTipo = 'exito' | 'error' | 'info' | 'advertencia';

export interface ToastData {
  id: string;
  mensaje: string;
  tipo: ToastTipo;
  duracion?: number;
  accion?: { etiqueta: string; onClick: () => void };
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const ICONOS: Record<ToastTipo, React.ReactNode> = {
  exito: <CheckCircle size={18} />,
  error: <AlertTriangle size={18} />,
  info: <Info size={18} />,
  advertencia: <AlertTriangle size={18} />,
};

const COLORES: Record<ToastTipo, { bg: string; color: string; border: string }> = {
  exito: {
    bg: 'var(--color-success-soft)',
    color: 'var(--color-success)',
    border: 'var(--color-success)',
  },
  error: {
    bg: 'var(--color-danger-soft)',
    color: 'var(--color-danger)',
    border: 'var(--color-danger)',
  },
  info: {
    bg: 'var(--color-primary-soft)',
    color: 'var(--color-primary)',
    border: 'var(--color-primary)',
  },
  advertencia: {
    bg: 'var(--color-orange-soft)',
    color: 'var(--color-orange)',
    border: 'var(--color-orange)',
  },
};

const ToastItem: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [visible, setVisible] = useState(false);
  const colores = COLORES[toast.tipo];

  useEffect(() => {
    // Animación entrada
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    }, toast.duracion ?? 3500);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duracion, onDismiss]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'var(--color-surface-0)',
        color: colores.color,
        border: `1px solid ${colores.border}`,
        borderRadius: '14px',
        padding: '12px 16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        fontSize: '0.875rem',
        fontWeight: 700,
        maxWidth: '440px',
        width: 'calc(100vw - 32px)',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.95)',
        opacity: visible ? 1 : 0,
      }}
    >
      <span style={{ flexShrink: 0 }}>{ICONOS[toast.tipo]}</span>

      <span style={{ flex: 1, lineHeight: 1.3 }}>{toast.mensaje}</span>

      {toast.accion && (
        <button
          onClick={() => {
            toast.accion!.onClick();
            onDismiss(toast.id);
          }}
          style={{
            background: colores.border,
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '0.75rem',
            fontWeight: 800,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          {toast.accion.etiqueta}
        </button>
      )}

      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-text-secondary)',
          opacity: 0.8,
          flexShrink: 0,
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

// ─── CONTENEDOR GLOBAL DE TOASTS ─────────────────────────────────────────────

type ToastListener = (toast: ToastData) => void;
const listeners: ToastListener[] = [];

export const toast = {
  exito: (mensaje: string, opts?: Partial<Omit<ToastData, 'id' | 'tipo' | 'mensaje'>>) =>
    toast._emit({ mensaje, tipo: 'exito', ...opts }),
  error: (mensaje: string, opts?: Partial<Omit<ToastData, 'id' | 'tipo' | 'mensaje'>>) =>
    toast._emit({ mensaje, tipo: 'error', ...opts }),
  info: (mensaje: string, opts?: Partial<Omit<ToastData, 'id' | 'tipo' | 'mensaje'>>) =>
    toast._emit({ mensaje, tipo: 'info', ...opts }),
  advertencia: (mensaje: string, opts?: Partial<Omit<ToastData, 'id' | 'tipo' | 'mensaje'>>) =>
    toast._emit({ mensaje, tipo: 'advertencia', ...opts }),
  _emit: (data: Omit<ToastData, 'id'>) => {
    const toastData: ToastData = { ...data, id: `toast-${Date.now()}` };
    listeners.forEach((l) => l(toastData));
  },
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((t: ToastData) => {
    setToasts((prev) => [...prev, t]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    listeners.push(addToast);
    return () => {
      const idx = listeners.indexOf(addToast);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem toast={t} onDismiss={dismissToast} />
        </div>
      ))}
    </div>
  );
};
