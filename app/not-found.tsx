import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '24px',
      }}
      className="slide-up"
    >
      <div style={{ fontSize: '4rem', marginBottom: '12px' }} role="img" aria-label="Mosquito icon">
        🦟
      </div>

      <h1
        style={{
          fontSize: '3.5rem',
          fontWeight: 900,
          color: 'var(--color-primary)',
          fontFamily: 'var(--font-mono)',
          lineHeight: 1,
          marginBottom: '8px',
        }}
      >
        404
      </h1>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
        Página no encontrada
      </h2>

      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', maxWidth: '320px', marginBottom: '24px' }}>
        Parece que esta ruta voló lejos o la dirección ingresada no existe en DengueAlert.
      </p>

      <Link href="/" style={{ textDecoration: 'none' }}>
        <Button variante="primario" tamano="grande">
          <Home size={18} />
          <span>Volver al inicio</span>
        </Button>
      </Link>
    </div>
  );
}
