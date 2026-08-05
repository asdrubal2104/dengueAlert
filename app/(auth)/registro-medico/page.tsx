'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/app-store';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  RegistroMedicoSchema,
  SILAIS_NICARAGUA,
  ESPECIALIDADES_MEDICAS,
} from '@/lib/validators/auth';
import { SilaisNicaragua, EspecialidadMedica } from '@/types/nicaragua';
import { registrarMedicoSupabase } from '@/lib/supabase/services';
import { obtenerTokenRecaptchaV3 } from '@/lib/security/recaptcha';
import { Stethoscope, CheckCircle2 } from 'lucide-react';

export default function RegistroMedicoPage() {
  const router = useRouter();
  const setUsuarioActual = useAppStore((state) => state.setUsuarioActual);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [codigoMinsa, setCodigoMinsa] = useState('');
  const [especialidad, setEspecialidad] = useState<EspecialidadMedica>('Medicina Interna');
  const [unidadDeSalud, setUnidadDeSalud] = useState('');
  const [silais, setSilais] = useState<SilaisNicaragua>('Managua');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validacion = RegistroMedicoSchema.safeParse({
      email,
      password,
      nombreCompleto:
        nombreCompleto.startsWith('Dr.') || nombreCompleto.startsWith('Dra.')
          ? nombreCompleto
          : `Dr. ${nombreCompleto}`,
      codigoMinsa,
      especialidad,
      unidadDeSalud,
      silais,
      telefono,
    });

    if (!validacion.success) {
      setError(validacion.error.errors[0].message);
      return;
    }

    setCargando(true);
    const captchaToken = await obtenerTokenRecaptchaV3('registro_medico');

    const res = await registrarMedicoSupabase({
      email,
      password,
      nombreCompleto: validacion.data.nombreCompleto,
      codigoMinsa,
      especialidad,
      unidadDeSalud,
      silais,
      telefono,
      captchaToken,
    });
    setCargando(false);

    if (res.ok && res.usuario) {
      setUsuarioActual(res.usuario);
      router.push('/dashboard');
    } else {
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
        <div style={{ maxWidth: '460px', width: '100%' }}>
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
              <Stethoscope size={26} />
            </div>

            <h1 style={{ fontSize: '1.625rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
              Registro de Profesional Médico
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              Acceso exclusivo para personal autorizado del Sistema de Salud MINSA
            </p>
          </div>

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

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input
                etiqueta="Correo Institucional / Personal"
                type="email"
                placeholder="dr.perez@minsa.gob.ni"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                etiqueta="Contraseña"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Input
                etiqueta="Nombre completo (con título Dr./Dra.)"
                placeholder="Ej: Dr. Juan Carlos Pérez"
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                required
              />

              <Input
                etiqueta="Código Sanitario MINSA"
                placeholder="Ej: MINSA-48291"
                value={codigoMinsa}
                onChange={(e) => setCodigoMinsa(e.target.value)}
                ayuda="Código sanitario de profesional activo"
                required
              />

              <Select
                etiqueta="Especialidad médica"
                opciones={ESPECIALIDADES_MEDICAS}
                value={especialidad}
                onChange={(e) => setEspecialidad(e.target.value as EspecialidadMedica)}
              />

              <Input
                etiqueta="Unidad de Salud / Hospital"
                placeholder="Ej: Hospital Manolo Morales"
                value={unidadDeSalud}
                onChange={(e) => setUnidadDeSalud(e.target.value)}
                required
              />

              <Select
                etiqueta="SILAIS de adscripción"
                opciones={SILAIS_NICARAGUA}
                value={silais}
                onChange={(e) => setSilais(e.target.value as SilaisNicaragua)}
              />

              <Input
                etiqueta="Teléfono de contacto laboral"
                placeholder="Ej: +505 8999 5678"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />

              <Button type="submit" variante="primario" tamano="grande" disabled={cargando} style={{ marginTop: '8px', width: '100%' }}>
                <span>{cargando ? 'Registrando...' : 'Registrarme como Médico'}</span>
                <CheckCircle2 size={18} />
              </Button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              ¿Eres paciente?{' '}
              <Link href="/registro" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>
                Registrate como Paciente
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
