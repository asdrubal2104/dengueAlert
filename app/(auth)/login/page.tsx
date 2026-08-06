'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/stores/app-store';
import { iniciarSesionSupabase } from '@/lib/supabase/services';
import {
  Activity,
  Stethoscope,
  User,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const iniciarSesionDemo = useAppStore((state) => state.iniciarSesionDemo);
  const setUsuarioActual = useAppStore((state) => state.setUsuarioActual);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const handleLoginPaciente = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Ingresá tu correo y contraseña');
      return;
    }

    setCargando(true);
    const res = await iniciarSesionSupabase(email, password);
    setCargando(false);

    if (res.ok && res.usuario) {
      setUsuarioActual(res.usuario);
      if (res.usuario.rol === 'MEDICO') {
        router.push('/dashboard');
      } else {
        router.push('/inicio');
      }
    } else {
      setError(res.error || 'Credenciales inválidas o error de conexión');
    }
  };

  const handleDemoPaciente = () => {
    iniciarSesionDemo('PACIENTE');
    router.push('/inicio');
  };

  const handleDemoMedico = () => {
    iniciarSesionDemo('MEDICO');
    router.push('/dashboard');
  };

  return (
    <main className="contenido-principal">
      <div
        style={{
          minHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px 0',
        }}
        className="slide-up"
      >
        <div style={{ maxWidth: '440px', width: '100%' }}>
          {/* Brand Header */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
                boxShadow: '0 6px 24px rgba(14, 165, 233, 0.4)',
              }}
            >
              <Activity size={28} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
              Dengue<span style={{ color: 'var(--color-primary)' }}>Alert</span>
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              Sistema de Monitoreo Clínico de Dengue (MINSA Nicaragua)
            </p>
          </div>

          {/* Quick No-Login Banner for Sick Patients */}
          <Card
            style={{
              padding: '14px 16px',
              marginBottom: '16px',
              backgroundColor: 'rgba(14, 165, 233, 0.1)',
              border: '1px solid rgba(14, 165, 233, 0.3)',
              borderRadius: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldAlert size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--color-text)' }}>
                    ¿Tenés síntomas febriles ahora?
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    No necesitás iniciar sesión para evaluarte
                  </div>
                </div>
              </div>
              <Link href="/sintomas" style={{ textDecoration: 'none' }}>
                <Button variante="primario" style={{ minHeight: '36px', padding: '0 12px', fontSize: '0.78125rem' }}>
                  <span>Evaluar</span>
                  <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </Card>

          {/* Main Login Card */}
          <Card style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '16px', color: 'var(--color-text)' }}>
              Ingreso a tu cuenta
            </h2>

            {error && (
              <div
                style={{
                  backgroundColor: 'var(--color-danger-soft)',
                  color: 'var(--color-danger)',
                  padding: '12px',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  marginBottom: '16px',
                  border: '1px solid var(--color-danger)',
                }}
              >
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleLoginPaciente} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input
                etiqueta="Correo Electrónico"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                etiqueta="Contraseña"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                variante="primario"
                tamano="grande"
                type="submit"
                disabled={cargando}
                style={{ width: '100%', marginTop: '4px' }}
              >
                <span>{cargando ? 'Ingresando...' : 'Ingresar al Sistema'}</span>
                <ArrowRight size={18} />
              </Button>
            </form>

            {/* Clear Registration Callouts */}
            <div
              style={{
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ¿No tenés una cuenta?
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Link href="/registro" style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--color-surface-1)',
                      border: '1px solid var(--color-border)',
                      textAlign: 'center',
                      transition: 'all 150ms ease',
                      cursor: 'pointer',
                    }}
                    className="touch-feedback"
                  >
                    <User size={18} style={{ color: 'var(--color-primary)', margin: '0 auto 4px auto' }} />
                    <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--color-text)' }}>
                      Soy Paciente
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--color-primary)', fontWeight: 700, marginTop: '2px' }}>
                      Crear cuenta →
                    </div>
                  </div>
                </Link>

                <Link href="/registro-medico" style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--color-surface-1)',
                      border: '1px solid var(--color-border)',
                      textAlign: 'center',
                      transition: 'all 150ms ease',
                      cursor: 'pointer',
                    }}
                    className="touch-feedback"
                  >
                    <Stethoscope size={18} style={{ color: '#38BDF8', margin: '0 auto 4px auto' }} />
                    <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--color-text)' }}>
                      Soy Médico
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#38BDF8', fontWeight: 700, marginTop: '2px' }}>
                      Registro MINSA →
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </Card>

          {/* Clean Demo Access Section (Developer/Testing) */}
          <div style={{ marginTop: '20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '10px',
                padding: '0 4px',
              }}
            >
              <Sparkles size={14} style={{ color: 'var(--color-text-muted)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Acceso de Demostración Rápido (Pruebas)
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <Button variante="secundario" onClick={handleDemoPaciente} style={{ fontSize: '0.8125rem', padding: '10px' }}>
                <User size={16} style={{ color: 'var(--color-primary)' }} />
                <span>Demo Paciente</span>
              </Button>

              <Button variante="secundario" onClick={handleDemoMedico} style={{ fontSize: '0.8125rem', padding: '10px' }}>
                <Stethoscope size={16} style={{ color: '#38BDF8' }} />
                <span>Demo Médico</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
