'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SintomaIcon } from '@/components/ui/SintomaIcon';
import { useAppStore } from '@/stores/app-store';
import { CATALOGO_SINTOMAS } from '@/lib/dengue/sintomas';
import {
  ArrowLeft,
  Phone,
  MapPin,
  Clock,
  Save,
  CheckCircle2,
  AlertTriangle,
  Activity,
  FileText,
} from 'lucide-react';

export default function DetallePacientePage({ params }: { params: { id: string } }) {
  const pacienteId = params.id;

  const pacientes = useAppStore((state) => state.pacientesVinculados);
  const registrosStore = useAppStore((state) => state.registros);
  const agregarNotaMedica = useAppStore((state) => state.agregarNotaMedica);

  const paciente = pacientes.find((p) => p.id === pacienteId) || {
    id: pacienteId,
    email: 'paciente@ejemplo.com',
    nombreCompleto: 'Natalia Elizabeth López',
    rol: 'PACIENTE' as const,
    telefono: '8888-1234',
    departamento: 'Managua',
    tipoSangre: 'O+' as const,
    pesoKg: 62,
    enfermedadesCronicas: ['Hipertensión arterial'],
    medicamentosActuales: 'Losartán 50mg',
  };

  const registros = registrosStore.filter((r) => r.pacienteId === pacienteId || (!r.pacienteId && pacienteId === 'paciente-1'));
  const ultimaEval = registros[0];

  const [notaMedica, setNotaMedica] = useState('');
  const [notaGuardada, setNotaGuardada] = useState(false);

  const handleGuardarNota = (e: React.FormEvent) => {
    e.preventDefault();
    if (ultimaEval) {
      agregarNotaMedica(ultimaEval.id, notaMedica);
    }
    setNotaGuardada(true);
    setTimeout(() => setNotaGuardada(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="slide-up">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/pacientes" style={{ color: 'var(--color-text-secondary)' }}>
          <ArrowLeft size={22} />
        </Link>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800 }}>
            Expediente Clínico del Paciente
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            Historial de monitoreo y notas de evolución MINSA.
          </p>
        </div>
      </div>

      {/* Patient Header Card */}
      <Card style={{ padding: '20px' }}>
        {/* Card Top Row: ID & Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Expediente MINSA #{paciente.id.slice(0, 8).toUpperCase()}
          </div>
          {ultimaEval && <Badge tipo={ultimaEval.clasificacion} />}
        </div>

        {/* Patient Profile Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '18px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.375rem',
              boxShadow: '0 4px 16px rgba(14, 165, 233, 0.35)',
              flexShrink: 0,
            }}
          >
            {paciente.nombreCompleto ? paciente.nombreCompleto.charAt(0).toUpperCase() : 'P'}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1.25, marginBottom: '6px' }}>
              {paciente.nombreCompleto}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} style={{ color: 'var(--color-primary)' }} />
                <span>{paciente.departamento || 'Nicaragua'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Call Patient Button */}
        {paciente.telefono && (
          <a
            href={`tel:${paciente.telefono}`}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <Button variante="secundario" style={{ width: '100%', minHeight: '46px' }}>
              <Phone size={16} />
              <span>Llamar al Paciente ({paciente.telefono})</span>
            </Button>
          </a>
        )}
      </Card>

      {/* Clinical Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        <Card style={{ padding: '12px 6px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Sangre</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-danger)', fontFamily: 'var(--font-mono)' }}>
            {paciente.tipoSangre || 'N/A'}
          </div>
        </Card>

        <Card style={{ padding: '12px 6px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Peso</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
            {paciente.pesoKg ? `${paciente.pesoKg} kg` : 'N/A'}
          </div>
        </Card>

        <Card style={{ padding: '12px 6px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Riesgo</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-warning)', fontFamily: 'var(--font-mono)' }}>
            {paciente.enfermedadesCronicas?.length ? 'Alto' : 'Normal'}
          </div>
        </Card>
      </div>

      {/* Comorbidity Alert if Present */}
      {paciente.enfermedadesCronicas && paciente.enfermedadesCronicas.length > 0 && (
        <Card style={{ backgroundColor: 'var(--color-warning-soft)', border: '1px solid var(--color-warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-warning)' }}>
            <AlertTriangle size={20} />
            <div>
              <strong style={{ fontSize: '0.875rem' }}>Comorbilidades reportadas:</strong>
              <div style={{ fontSize: '0.8125rem', marginTop: '2px', color: 'var(--color-text)' }}>
                {paciente.enfermedadesCronicas.join(', ')}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Clinical Notes Form */}
      <Card>
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} style={{ color: 'var(--color-primary)' }} />
          <span>Agregar Nota de Evolución Médica</span>
        </h3>

        {notaGuardada && (
          <div style={{ padding: '10px', backgroundColor: 'var(--color-success-soft)', color: 'var(--color-success)', borderRadius: '10px', fontSize: '0.8125rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} />
            <span>Nota guardada correctamente en el expediente MINSA.</span>
          </div>
        )}

        <form onSubmit={handleGuardarNota}>
          <textarea
            rows={3}
            value={notaMedica}
            onChange={(e) => setNotaMedica(e.target.value)}
            placeholder="Escribí indicaciones sobre hidratación, hemograma o referencia a hospital..."
            className="input"
            style={{ padding: '12px', height: 'auto', marginBottom: '12px' }}
          />

          <Button variante="primario" type="submit" style={{ width: '100%' }}>
            <Save size={16} />
            <span>Guardar Nota Médica</span>
          </Button>
        </form>
      </Card>

      {/* Evaluations Timeline */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '12px' }}>
          Historial de Evaluaciones ({registros.length})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {registros.map((r, i) => {
            const fecha = new Date(r.fechaRegistro);
            const fechaFormateada = fecha.toLocaleDateString('es-NI', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            const sintomasObjetos = r.sintomasIds
              .map((id) => CATALOGO_SINTOMAS.find((s) => s.id === id))
              .filter(Boolean);

            return (
              <Card key={r.id || i} style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Header Row: Badge & Clean Date */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
                  <Badge tipo={r.clasificacion} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 600, flexShrink: 0 }}>
                    <Clock size={13} style={{ color: 'var(--color-primary)' }} />
                    <span suppressHydrationWarning>{fechaFormateada}</span>
                  </span>
                </div>

                {/* Symptoms Reported Pills */}
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.03em' }}>
                    Síntomas Reportados ({sintomasObjetos.length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {sintomasObjetos.map((s) => (
                      <span
                        key={s?.id}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          backgroundColor: s?.esSignoAlarma ? 'rgba(239, 68, 68, 0.15)' : 'var(--color-surface-1)',
                          color: s?.esSignoAlarma ? '#F87171' : 'var(--color-text-secondary)',
                          border: s?.esSignoAlarma ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid var(--color-border)',
                          fontSize: '0.75rem',
                          fontWeight: s?.esSignoAlarma ? 700 : 600,
                        }}
                      >
                        <SintomaIcon nombreIcono={s?.icono || 'stethoscope'} size={13} />
                        <span>{s?.nombre}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Medical Evolution Notes if Present */}
                {r.notas && (
                  <div
                    style={{
                      backgroundColor: 'rgba(14, 165, 233, 0.08)',
                      border: '1px solid rgba(14, 165, 233, 0.25)',
                      borderRadius: '12px',
                      padding: '10px 12px',
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.45,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                    }}
                  >
                    <FileText size={16} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: 'var(--color-primary)', display: 'block', marginBottom: '2px' }}>
                        Evolución Médica MINSA:
                      </strong>
                      {r.notas}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
