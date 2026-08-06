'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/stores/app-store';
import { NUMEROS_EMERGENCIA_NICARAGUA } from '@/types/nicaragua';
import {
  Activity,
  Clock,
  Stethoscope,
  ShieldAlert,
  MapPin,
  Siren,
  Phone,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function InicioPacientePage() {
  const usuarioActual = useAppStore((state) => state.usuarioActual);
  const registros = useAppStore((state) => state.registros);

  const ultimaEvaluacion = registros[0];

  return (
    <div className="grid-responsive-2col slide-up">
      {/* Hero Welcome Banner */}
      <div
        className="grid-col-full"
        style={{
          background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 50%, #075985 100%)',
          borderRadius: '24px',
          padding: '24px',
          color: '#FFFFFF',
          boxShadow: '0 10px 32px rgba(2, 132, 199, 0.35)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', opacity: 0.9 }}>
            <MapPin size={16} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
              {usuarioActual?.departamento || 'Managua'}, Nicaragua
            </span>
          </div>

          <h2 style={{ fontSize: '1.625rem', fontWeight: 800, marginBottom: '6px', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            Hola, {usuarioActual?.nombreCompleto || 'Paciente'} 👋
          </h2>

          <p style={{ fontSize: '0.9375rem', opacity: 0.92, marginBottom: '20px', lineHeight: 1.45, color: '#F0F9FF' }}>
            Monitoreá tus síntomas a tiempo para detectar signos de alarma de dengue en Nicaragua.
          </p>

          <Link href="/sintomas" style={{ textDecoration: 'none', display: 'block' }}>
            <Button variante="blanco" tamano="grande">
              <Activity size={20} />
              <span>EVALUAR SÍNTOMAS AHORA</span>
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>

        {/* Decorative Background Icon */}
        <Activity
          size={180}
          style={{
            position: 'absolute',
            right: '-30px',
            bottom: '-40px',
            opacity: 0.12,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Last Evaluation Summary */}
      {ultimaEvaluacion ? (
        <Card interactive className="grid-col-full" style={{ position: 'relative', padding: '18px' }}>
          <Link href="/resultado" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                  Última evaluación registrada
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }} suppressHydrationWarning>
                {new Date(ultimaEvaluacion.fechaRegistro).toLocaleDateString('es-NI', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <Badge tipo={ultimaEvaluacion.clasificacion} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>
                <span>Ver resultado</span>
                <ArrowRight size={16} />
              </div>
            </div>
          </Link>
        </Card>
      ) : (
        <Card style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                backgroundColor: 'var(--color-primary-soft)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '1px solid rgba(14, 165, 233, 0.3)',
              }}
            >
              <Sparkles size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, marginBottom: '2px', color: 'var(--color-text)' }}>
                Sin evaluaciones registradas
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                Realizá tu primera autoevaluación para llevar control de tu salud.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Action Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <Link href="/historial" style={{ textDecoration: 'none' }}>
          <Card interactive style={{ height: '100%', padding: '18px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                backgroundColor: 'rgba(16, 185, 129, 0.18)',
                color: '#34D399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              <Clock size={22} />
            </div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, marginBottom: '4px', color: 'var(--color-text)' }}>
              Mi Historial
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.35 }}>
              Revisá tus evaluaciones pasadas
            </p>
          </Card>
        </Link>

        <Link href="/mi-medico" style={{ textDecoration: 'none' }}>
          <Card interactive style={{ height: '100%', padding: '18px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                backgroundColor: 'rgba(14, 165, 233, 0.18)',
                color: '#38BDF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                border: '1px solid rgba(14, 165, 233, 0.3)',
              }}
            >
              <Stethoscope size={22} />
            </div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, marginBottom: '4px', color: 'var(--color-text)' }}>
              Mi Médico
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.35 }}>
              Vinculate con tu doctor MINSA
            </p>
          </Card>
        </Link>
      </div>

      {/* Emergency Contacts Card */}
      <Card style={{ border: '1px solid rgba(239, 68, 68, 0.35)', backgroundColor: 'rgba(239, 68, 68, 0.08)', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              color: '#F87171',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(239, 68, 68, 0.4)',
            }}
          >
            <Siren size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#F87171' }}>
              Contactos de Emergencia (Nicaragua)
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              En caso de vómitos, sangrado o dolor severo
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <a
            href={`tel:${NUMEROS_EMERGENCIA_NICARAGUA[0].numero}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 10px',
              backgroundColor: 'var(--color-surface-1)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              color: 'var(--color-text)',
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '0.875rem',
            }}
            className="touch-feedback"
          >
            <Phone size={16} style={{ color: '#F87171' }} />
            <span>MINSA {NUMEROS_EMERGENCIA_NICARAGUA[0].numero}</span>
          </a>

          <a
            href={`tel:${NUMEROS_EMERGENCIA_NICARAGUA[1].numero}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 10px',
              backgroundColor: 'var(--color-surface-1)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              color: 'var(--color-text)',
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '0.875rem',
            }}
            className="touch-feedback"
          >
            <ShieldAlert size={16} style={{ color: '#F87171' }} />
            <span>Cruz Roja {NUMEROS_EMERGENCIA_NICARAGUA[1].numero}</span>
          </a>
        </div>
      </Card>
    </div>
  );
}
