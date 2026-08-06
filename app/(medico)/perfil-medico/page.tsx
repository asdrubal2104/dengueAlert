'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/stores/app-store';
import { cerrarSesionSupabase } from '@/lib/supabase/services';
import { DEPARTAMENTOS_NICARAGUA } from '@/lib/validators/auth';
import {
  Stethoscope,
  Save,
  CheckCircle2,
  LogOut,
  Building2,
  Award,
  Phone,
  ShieldCheck,
} from 'lucide-react';

const ESPECIALIDADES_MINSA = [
  { valor: 'Medicina Interna', etiqueta: 'Medicina Interna' },
  { valor: 'Medicina General / Familiar', etiqueta: 'Medicina General / Familiar' },
  { valor: 'Pediatría', etiqueta: 'Pediatría' },
  { valor: 'Infectología', etiqueta: 'Infectología' },
  { valor: 'Epidemiología', etiqueta: 'Epidemiología' },
  { valor: 'Cuidados Intensivos (UCI)', etiqueta: 'Cuidados Intensivos (UCI)' },
  { valor: 'Emergentología', etiqueta: 'Emergentología' },
];

export default function PerfilMedicoPage() {
  const router = useRouter();
  const usuarioActual = useAppStore((state) => state.usuarioActual);
  const actualizarPerfilMedico = useAppStore((state) => state.actualizarPerfilMedico);
  const cerrarSesionStore = useAppStore((state) => state.cerrarSesion);

  const handleCerrarSesion = async () => {
    await cerrarSesionSupabase();
    cerrarSesionStore();
    router.push('/login');
  };

  const [nombre, setNombre] = useState(usuarioActual?.nombreCompleto || 'Dr. Juan Carlos Pérez López');
  const [codigoMinsa, setCodigoMinsa] = useState(usuarioActual?.codigoMinsa || 'MINSA-48291');
  const [especialidad, setEspecialidad] = useState<string>(usuarioActual?.especialidad || 'Medicina Interna');
  const [unidadDeSalud, setUnidadDeSalud] = useState(usuarioActual?.unidadDeSalud || 'Hospital Escuela Manolo Morales');
  const [silais, setSilais] = useState<string>(usuarioActual?.silais || usuarioActual?.departamento || 'Managua');
  const [telefono, setTelefono] = useState(usuarioActual?.telefono || '+505 8999 5678');
  const [email, setEmail] = useState(usuarioActual?.email || 'dr.perez@minsa.gob.ni');
  const [guardadoExito, setGuardadoExito] = useState(false);

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    actualizarPerfilMedico({
      nombreCompleto: nombre,
      codigoMinsa,
      especialidad: especialidad as any,
      unidadDeSalud,
      silais: silais as any,
      telefono,
      email,
    });
    setGuardadoExito(true);
    setTimeout(() => setGuardadoExito(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="slide-up">
      {/* Header Banner */}
      <div
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9, marginBottom: '8px' }}>
            <ShieldCheck size={16} />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Credencial Médica Autorizada
            </span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2, marginBottom: '4px' }}>
            {nombre}
          </h1>

          <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
            {especialidad} • {unidadDeSalud}
          </p>

          <div style={{ marginTop: '12px', display: 'inline-flex', padding: '4px 12px', borderRadius: '999px', backgroundColor: 'rgba(255, 255, 255, 0.2)', fontSize: '0.75rem', fontWeight: 800 }}>
            Código MINSA: #{codigoMinsa.replace(/^MINSA-?/i, '').replace(/^#/i, '')}
          </div>
        </div>

        <Stethoscope
          size={140}
          style={{
            position: 'absolute',
            right: '-20px',
            bottom: '-30px',
            opacity: 0.15,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />
      </div>

      {guardadoExito && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 18px',
            backgroundColor: 'var(--color-success-soft)',
            border: '1px solid var(--color-success)',
            borderRadius: '14px',
            color: 'var(--color-success)',
            fontSize: '0.875rem',
            fontWeight: 700,
          }}
          className="slide-up"
        >
          <CheckCircle2 size={20} />
          <span>¡Perfil médico actualizado exitosamente!</span>
        </div>
      )}

      <form onSubmit={handleGuardar} className="grid-responsive-2col">
        {/* Personal & Credential Info */}
        <Card>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} style={{ color: 'var(--color-primary)' }} />
            <span>Datos Profesionales y Registro MINSA</span>
          </h3>

          <Input
            etiqueta="Nombre y Apellidos del Médico"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Dr. Juan Carlos Pérez López"
            required
          />

          <Input
            etiqueta="Código de Registro Sanitario MINSA"
            value={codigoMinsa}
            onChange={(e) => setCodigoMinsa(e.target.value)}
            placeholder="Ej. MINSA-48291"
            required
          />

          <Select
            etiqueta="Especialidad Médica"
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
            opciones={ESPECIALIDADES_MINSA}
          />
        </Card>

        {/* Health Unit Info */}
        <Card>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={18} style={{ color: 'var(--color-primary)' }} />
            <span>Unidad de Salud y Asignación</span>
          </h3>

          <Input
            etiqueta="Unidad de Salud / Hospital / Centro"
            value={unidadDeSalud}
            onChange={(e) => setUnidadDeSalud(e.target.value)}
            placeholder="Ej. Hospital Escuela Manolo Morales"
            required
          />

          <Select
            etiqueta="SILAIS / Departamento (Nicaragua)"
            value={silais}
            onChange={(e) => setSilais(e.target.value)}
            opciones={DEPARTAMENTOS_NICARAGUA.map((dep) => ({ valor: dep, etiqueta: `SILAIS ${dep}` }))}
          />
        </Card>

        {/* Contact Info */}
        <Card className="grid-col-full">
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={18} style={{ color: 'var(--color-primary)' }} />
            <span>Contacto Institucional</span>
          </h3>

          <Input
            etiqueta="Teléfono Institucional / Móvil"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ej. +505 8999 5678"
          />

          <Input
            etiqueta="Correo Electrónico Institucional"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ej. dr.perez@minsa.gob.ni"
          />
        </Card>

        <div className="grid-col-full" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Button variante="primario" tamano="grande" type="submit" style={{ width: '100%' }}>
            <Save size={18} />
            <span>Guardar Cambios de Perfil</span>
          </Button>

          <Button
            variante="fantasma"
            type="button"
            onClick={handleCerrarSesion}
            style={{ width: '100%', color: 'var(--color-danger)' }}
          >
            <LogOut size={18} />
            <span>Cerrar Sesión del Médico</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
