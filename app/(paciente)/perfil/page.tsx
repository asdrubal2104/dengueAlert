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
import { User, Save, Heart, Check, CheckCircle2, LogOut } from 'lucide-react';

const COMORBILIDADES_OPCIONES = [
  { id: 'Diabetes Mellitus', nombre: 'Diabetes Mellitus' },
  { id: 'Hipertensión arterial', nombre: 'Hipertensión Arterial' },
  { id: 'Embarazo en curso', nombre: 'Embarazo en curso' },
  { id: 'Asma / EPOC', nombre: 'Asma / EPOC' },
  { id: 'Enfermedad renal crónica', nombre: 'Enfermedad Renal' },
  { id: 'Obesidad / Sobrepeso', nombre: 'Obesidad / Sobrepeso' },
  { id: 'Mayor de 65 años', nombre: 'Mayor de 65 años' },
  { id: 'Lactante (< 2 años)', nombre: 'Menor de 2 años' },
];

export default function PerfilPacientePage() {
  const router = useRouter();
  const usuarioActual = useAppStore((state) => state.usuarioActual);
  const actualizarPerfilPaciente = useAppStore((state) => state.actualizarPerfilPaciente);
  const cerrarSesionStore = useAppStore((state) => state.cerrarSesion);

  const handleCerrarSesion = async () => {
    await cerrarSesionSupabase();
    cerrarSesionStore();
    router.push('/login');
  };

  const [nombre, setNombre] = useState(usuarioActual?.nombreCompleto || '');
  const [telefono, setTelefono] = useState(usuarioActual?.telefono || '');
  const [departamento, setDepartamento] = useState(usuarioActual?.departamento || 'Managua');
  const [grupoSanguineo, setGrupoSanguineo] = useState(usuarioActual?.tipoSangre || 'O+');
  const [pesoKg, setPesoKg] = useState<number | ''>(usuarioActual?.pesoKg || '');
  const [comorbilidades, setComorbilidades] = useState<string[]>(usuarioActual?.enfermedadesCronicas || []);
  const [medicamentos, setMedicamentos] = useState(usuarioActual?.medicamentosActuales || '');
  const [guardadoExito, setGuardadoExito] = useState(false);

  const toggleComorbilidad = (id: string) => {
    setComorbilidades((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    actualizarPerfilPaciente({
      nombreCompleto: nombre,
      telefono,
      departamento,
      tipoSangre: grupoSanguineo as any,
      pesoKg: typeof pesoKg === 'number' ? pesoKg : undefined,
      enfermedadesCronicas: comorbilidades as any,
      medicamentosActuales: medicamentos,
    });
    setGuardadoExito(true);
    setTimeout(() => setGuardadoExito(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="slide-up">
      <div>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '4px' }}>
          Perfil de Salud del Paciente
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          Mantener tus datos actualizados ayuda al médico MINSA en caso de emergencia.
        </p>
      </div>

      {guardadoExito && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px',
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
          <span>¡Perfil guardado correctamente!</span>
        </div>
      )}

      <form onSubmit={handleGuardar} className="grid-responsive-2col">
        {/* Personal Details */}
        <Card>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} style={{ color: 'var(--color-primary)' }} />
            <span>Datos Personales</span>
          </h3>

          <Input
            etiqueta="Nombre Completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. María López Flores"
            required
          />

          <Input
            etiqueta="Teléfono de Contacto"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ej. 8888-9999"
          />

          <Select
            etiqueta="Departamento / Municipio (Nicaragua)"
            value={departamento}
            onChange={(e) => setDepartamento(e.target.value as any)}
            opciones={DEPARTAMENTOS_NICARAGUA.map((dep) => ({ valor: dep, etiqueta: dep }))}
          />
        </Card>

        {/* Clinical History */}
        <Card>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={18} style={{ color: 'var(--color-danger)' }} />
            <span>Información Médica de Riesgo</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <Select
              etiqueta="Tipo de Sangre"
              value={grupoSanguineo}
              onChange={(e) => setGrupoSanguineo(e.target.value)}
              opciones={[
                { valor: 'O+', etiqueta: 'O Positivo (O+)' },
                { valor: 'O-', etiqueta: 'O Negativo (O-)' },
                { valor: 'A+', etiqueta: 'A Positivo (A+)' },
                { valor: 'A-', etiqueta: 'A Negativo (A-)' },
                { valor: 'B+', etiqueta: 'B Positivo (B+)' },
                { valor: 'B-', etiqueta: 'B Negativo (B-)' },
                { valor: 'AB+', etiqueta: 'AB Positivo (AB+)' },
                { valor: 'AB-', etiqueta: 'AB Negativo (AB-)' },
              ]}
            />

            <Input
              etiqueta="Peso Aproximado (kg)"
              type="number"
              value={pesoKg}
              onChange={(e) => setPesoKg(e.target.value ? Number(e.target.value) : '')}
              placeholder="Ej. 65"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="etiqueta" style={{ display: 'block', marginBottom: '8px' }}>
              Comorbilidades / Condiciones Preexistentes
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: '10px' }}>
              {COMORBILIDADES_OPCIONES.map((c) => {
                const activo = comorbilidades.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleComorbilidad(c.id)}
                    aria-pressed={activo}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      minHeight: '48px',
                      borderRadius: '12px',
                      backgroundColor: activo ? 'var(--color-primary-soft)' : 'var(--color-surface-1)',
                      border: activo ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      color: activo ? 'var(--color-text)' : 'var(--color-text-secondary)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                    className="touch-feedback"
                  >
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        border: activo ? 'none' : '1.5px solid var(--color-text-muted)',
                        backgroundColor: activo ? 'var(--color-primary)' : 'transparent',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {activo && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span>{c.nombre}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <Input
            etiqueta="Medicamentos de uso diario"
            value={medicamentos}
            onChange={(e) => setMedicamentos(e.target.value)}
            placeholder="Ej. Losartán 50mg, Metformina..."
          />
        </Card>

        <div className="grid-col-full" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Button variante="primario" tamano="grande" type="submit" style={{ width: '100%' }}>
            <Save size={18} />
            <span>Guardar Cambios</span>
          </Button>

          <Button
            variante="fantasma"
            type="button"
            onClick={handleCerrarSesion}
            style={{ width: '100%', color: 'var(--color-danger)' }}
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
