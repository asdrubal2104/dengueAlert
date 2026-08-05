'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/stores/app-store';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Stethoscope, UserCheck, Key, MapPin, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function MiMedicoPage() {
  const medicosVinculados = useAppStore((state) => state.medicosVinculados);
  const vincularConMedicoPorCodigo = useAppStore((state) => state.vincularConMedicoPorCodigo);

  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  const handleVincular = (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    const exito = vincularConMedicoPorCodigo(codigo);
    if (exito) {
      setMensaje({
        tipo: 'exito',
        texto: '¡VINCULACIÓN EXITOSA! Tu médico ahora tiene acceso a tus evaluaciones.',
      });
      setCodigo('');
    } else {
      setMensaje({
        tipo: 'error',
        texto: 'Código no válido. Verificá los 6 dígitos con tu médico.',
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="slide-up">
      <div>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '4px', color: 'var(--color-text)' }}>
          Mi Médico Vinculado
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          Conectá con tu médico MINSA para que pueda dar seguimiento a tus síntomas en tiempo real.
        </p>
      </div>

      {/* Link Input Card */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-primary-soft)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Key size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Ingresar Código de Vinculación</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              Tu médico te entregará este código de 6 dígitos durante tu consulta.
            </p>
          </div>
        </div>

        {mensaje && (
          <div
            style={{
              padding: '12px',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor:
                mensaje.tipo === 'exito'
                  ? 'var(--color-success-soft)'
                  : 'var(--color-danger-soft)',
              color:
                mensaje.tipo === 'exito'
                  ? 'var(--color-success)'
                  : 'var(--color-danger)',
              border:
                mensaje.tipo === 'exito'
                  ? '1px solid var(--color-success)'
                  : '1px solid var(--color-danger)',
            }}
          >
            {mensaje.tipo === 'exito' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{mensaje.texto}</span>
          </div>
        )}

        <form onSubmit={handleVincular} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder="Ej: A3F7K2"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              maxLength={6}
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                fontSize: '1.125rem',
                textAlign: 'center',
              }}
              required
            />
          </div>
          <Button type="submit" variante="primario" style={{ width: 'auto', minWidth: '110px', minHeight: '50px' }}>
            Vincular
          </Button>
        </form>
      </Card>

      {/* List of Linked Doctors */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '12px' }}>
          Médicos autorizados ({medicosVinculados.length}):
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {medicosVinculados.map((m) => (
            <Card key={m.id} style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '16px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-soft)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid rgba(14, 165, 233, 0.3)',
                }}
              >
                <Stethoscope size={22} />
              </div>

              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, marginBottom: '2px', color: 'var(--color-text)' }}>
                  {m.nombre}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                  {m.especialidad}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  <MapPin size={12} />
                  <span>{m.hospital}</span>
                </div>
              </div>

              <div
                style={{
                  padding: '4px 10px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--color-success-soft)',
                  color: 'var(--color-success)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <UserCheck size={13} />
                <span>Activo</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
