'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/stores/app-store';
import {
  Activity,
  Stethoscope,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  MapPin,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const iniciarSesionDemo = useAppStore((state) => state.iniciarSesionDemo);

  const handleIrPaciente = () => {
    router.push('/sintomas');
  };

  const handleIrMedico = () => {
    router.push('/login');
  };

  return (
    <main className="contenido-principal">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '32px' }} className="slide-up">
        {/* Top Header Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800, fontSize: '1.25rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)',
              }}
            >
              <Activity size={22} strokeWidth={2.5} />
            </div>
            <span style={{ letterSpacing: '-0.02em' }}>
              Dengue<span style={{ color: 'var(--color-primary)' }}>Alert</span>
            </span>
          </div>

          <Link href="/login" style={{ textDecoration: 'none' }}>
            <Button variante="secundario" style={{ minHeight: '40px', padding: '0 14px', fontSize: '0.8125rem', width: 'auto' }}>
              Iniciar Sesión
            </Button>
          </Link>
        </div>

        {/* Hero Section Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 50%, #075985 100%)',
            borderRadius: '24px',
            padding: '24px 20px',
            color: '#FFFFFF',
            boxShadow: '0 12px 36px rgba(2, 132, 199, 0.35)',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '999px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                fontSize: '0.75rem',
                fontWeight: 800,
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: '#FFFFFF',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              }}
            >
              <MapPin size={13} />
              <span>Sistema PWA Nicaragua 🇳🇮</span>
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, lineHeight: 1.2, marginBottom: '12px', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
              Monitoreo Clínico de Dengue en Tiempo Real
            </h1>

            <p style={{ fontSize: '0.9375rem', opacity: 0.95, lineHeight: 1.5, marginBottom: '24px', color: '#F0F9FF' }}>
              Evaluá tus síntomas febriles de forma inmediata y conectate directamente con médicos del sistema de salud MINSA.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Button
                variante="blanco"
                tamano="grande"
                onClick={handleIrPaciente}
              >
                <Activity size={20} />
                <span>Evaluar mis síntomas ahora</span>
                <ArrowRight size={18} />
              </Button>

              <Button
                variante="hero-outline"
                onClick={handleIrMedico}
              >
                <Stethoscope size={18} />
                <span>Acceso para Médicos MINSA</span>
              </Button>
            </div>
          </div>

          <Activity
            size={240}
            style={{
              position: 'absolute',
              right: '-50px',
              bottom: '-60px',
              opacity: 0.12,
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          />
        </div>

        {/* 3 Pillars Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Card style={{ backgroundColor: 'var(--color-surface-0)', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(14, 165, 233, 0.18)',
                  color: '#38BDF8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid rgba(14, 165, 233, 0.3)',
                }}
              >
                <Activity size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, marginBottom: '4px', color: 'var(--color-text)' }}>
                  Triaje de Síntomas Febriles
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                  Algoritmo de clasificación clínica según normas epidemiológicas oficiales del MINSA.
                </p>
              </div>
            </div>
          </Card>

          <Card style={{ backgroundColor: 'var(--color-surface-0)', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(239, 68, 68, 0.18)',
                  color: '#F87171',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              >
                <ShieldAlert size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, marginBottom: '4px', color: 'var(--color-text)' }}>
                  Alertas por Signos de Alarma
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                  Detección inmediata de sangrados, dolor abdominal severo o vómitos persistentes.
                </p>
              </div>
            </div>
          </Card>

          <Card style={{ backgroundColor: 'var(--color-surface-0)', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(16, 185, 129, 0.18)',
                  color: '#34D399',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <Stethoscope size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, marginBottom: '4px', color: 'var(--color-text)' }}>
                  Vinculación Médico - Paciente
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                  Permite al médico del SILAIS dar seguimiento continuo a tu evolución en tiempo real.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* MINSA Assurance Note */}
        <Card style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}>
            <ShieldCheck size={22} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
            <span>Diseñado conforme a protocolos de la Guía de Manejo del Dengue MINSA Nicaragua.</span>
          </div>
        </Card>
      </div>
    </main>
  );
}
