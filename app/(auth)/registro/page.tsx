'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/app-store';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DEPARTAMENTOS_NICARAGUA, RegistroPacienteSchema } from '@/lib/validators/auth';
import { DepartamentoNicaragua } from '@/types/nicaragua';
import { registrarPacienteSupabase } from '@/lib/supabase/services';
import { obtenerTokenTurnstile } from '@/lib/security/turnstile';
import { TurnstileWidget } from '@/components/ui/TurnstileWidget';
import { PasswordStrengthMeter } from '@/components/ui/PasswordStrengthMeter';
import { ArrowLeft, ArrowRight, CheckCircle2, User } from 'lucide-react';

export default function RegistroPacientePage() {
  const router = useRouter();
  const setUsuarioActual = useAppStore((state) => state.setUsuarioActual);

  const [paso, setPaso] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [departamento, setDepartamento] = useState<DepartamentoNicaragua>('Managua');
  const [error, setError] = useState<string | null>(null);
  const [captchaTokenState, setCaptchaTokenState] = useState<string | undefined>(undefined);

  const handleSiguientePaso1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Ingresá un correo electrónico válido');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setError(null);
    setPaso(2);
  };

  const [cargando, setCargando] = useState(false);

  const handleFinalizarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validacion = RegistroPacienteSchema.safeParse({
      email,
      password,
      nombreCompleto,
      fechaNacimiento,
      departamento,
    });

    if (!validacion.success) {
      setError(validacion.error.errors[0].message);
      return;
    }

    setCargando(true);
    const captchaToken = captchaTokenState;
    
    if (!captchaToken) {
      console.error('Fallo al obtener Token de Turnstile. Estado:', captchaTokenState);
      setError('Fallo la verificación de seguridad (Captcha). Por favor, intenta de nuevo.');
      setCargando(false);
      return;
    }

    const res = await registrarPacienteSupabase({
      email,
      password,
      nombreCompleto,
      fechaNacimiento,
      departamento,
      captchaToken,
    });
    setCargando(false);

    if (res.ok && res.usuario) {
      setUsuarioActual(res.usuario);
      router.push('/sintomas');
    } else {
      // Fallback si Supabase no responde o falla
      setError(res.error || 'Error al conectar con Supabase');
    }
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
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
                boxShadow: '0 4px 20px rgba(14, 165, 233, 0.4)',
              }}
            >
              <User size={26} />
            </div>

            <h1 style={{ fontSize: '1.625rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
              Registro de Paciente
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              {paso === 1 ? 'Paso 1 de 2: Credenciales de acceso' : 'Paso 2 de 2: Datos de salud y ubicación'}
            </p>
          </div>

          {/* Step Indicator */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <div
              style={{
                flex: 1,
                height: '6px',
                borderRadius: '999px',
                backgroundColor: 'var(--color-primary)',
              }}
            />
            <div
              style={{
                flex: 1,
                height: '6px',
                borderRadius: '999px',
                backgroundColor: paso === 2 ? 'var(--color-primary)' : 'var(--color-surface-1)',
                transition: 'all var(--transition-fast)',
              }}
            />
          </div>

          {/* Form Card */}
          <Card style={{ padding: '24px' }}>
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

            {paso === 1 ? (
              <form onSubmit={handleSiguientePaso1} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Input
                  etiqueta="Correo Electrónico"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Input
                  etiqueta="Contraseña"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <PasswordStrengthMeter password={password} />

                <Button variante="primario" tamano="grande" type="submit" style={{ width: '100%' }}>
                  <span>Continuar a datos de perfil</span>
                  <ArrowRight size={18} />
                </Button>
              </form>
            ) : (
              <form onSubmit={handleFinalizarRegistro} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Input
                  etiqueta="Nombre Completo"
                  placeholder="Ej. María López"
                  value={nombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                  required
                />

                <Input
                  etiqueta="Fecha de Nacimiento"
                  type="date"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  required
                />

                <Select
                  etiqueta="Departamento / Municipio (Nicaragua)"
                  value={departamento}
                  onChange={(e) => setDepartamento(e.target.value as DepartamentoNicaragua)}
                  opciones={DEPARTAMENTOS_NICARAGUA}
                />

                <TurnstileWidget
                  onSuccess={(token) => setCaptchaTokenState(token)}
                  onExpire={() => setCaptchaTokenState(undefined)}
                  onError={() => setCaptchaTokenState(undefined)}
                />

                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <Button
                    type="button"
                    variante="secundario"
                    onClick={() => setPaso(1)}
                    style={{ flex: 1 }}
                  >
                    <ArrowLeft size={16} />
                    <span>Atrás</span>
                  </Button>

                  <Button type="submit" variante="primario" disabled={cargando || !captchaTokenState} style={{ flex: 2 }}>
                    <span>{cargando ? 'Creando...' : 'Crear Cuenta'}</span>
                    <CheckCircle2 size={18} />
                  </Button>
                </div>
              </form>
            )}

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              ¿Ya tenés cuenta?{' '}
              <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>
                Iniciar Sesión
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
