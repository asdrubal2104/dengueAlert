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
  User,
  Pill,
  Droplets,
  Scale,
  ShieldAlert,
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
    if (ultimaEval && notaMedica.trim()) {
      agregarNotaMedica(ultimaEval.id, notaMedica.trim());
      setNotaGuardada(true);
      setNotaMedica('');
      setTimeout(() => setNotaGuardada(false), 3500);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }} className="slide-up">
      {/* Top Header Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <Link
          href="/pacientes"
          style={{
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-surface-0)',
            border: '1px solid var(--color-border)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-text)' }}>
            Expediente Clínico del Paciente
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Historial de monitoreo y notas de evolución MINSA.
          </p>
        </div>
      </div>

      {/* Patient Header Card (Full Width) */}
      <Card style={{ padding: '24px', backgroundColor: 'var(--color-surface-0)' }}>
        {/* Card Top Row: ID & Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', backgroundColor: 'var(--color-primary-soft)', padding: '4px 10px', borderRadius: '8px' }}>
            Expediente MINSA #{paciente.id.slice(0, 8).toUpperCase()}
          </div>
          {ultimaEval && <Badge tipo={ultimaEval.clasificacion} />}
        </div>

        {/* Patient Profile Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px', marginBottom: '22px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.5rem',
              boxShadow: '0 6px 20px rgba(14, 165, 233, 0.35)',
              flexShrink: 0,
            }}
          >
            {paciente.nombreCompleto ? paciente.nombreCompleto.charAt(0).toUpperCase() : 'P'}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1.25, marginBottom: '6px' }}>
              {paciente.nombreCompleto}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.875rem', color: 'var(--color-text-secondary)', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <MapPin size={15} style={{ color: 'var(--color-primary)' }} />
                <span>{paciente.departamento || 'Nicaragua'}</span>
              </span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span style={{ color: 'var(--color-text-muted)' }}>{paciente.email || 'Expediente digital'}</span>
            </div>
          </div>
        </div>

        {/* Call Patient Button */}
        {paciente.telefono && (
          <a
            href={`tel:${paciente.telefono}`}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <Button variante="secundario" style={{ width: '100%', minHeight: '48px', borderRadius: '14px' }}>
              <Phone size={18} />
              <span>Llamar al Paciente ({paciente.telefono})</span>
            </Button>
          </a>
        )}
      </Card>

      {/* Clinical Metrics Grid (3 Columns with Spacious Design) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        <div
          style={{
            padding: '18px 14px',
            textAlign: 'center',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.22)',
            borderRadius: '18px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-danger)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <Droplets size={14} />
            <span>Sangre</span>
          </div>
          <div style={{ fontSize: '1.375rem', fontWeight: 900, color: 'var(--color-danger)', fontFamily: 'var(--font-mono)' }}>
            {paciente.tipoSangre || 'N/A'}
          </div>
        </div>

        <div
          style={{
            padding: '18px 14px',
            textAlign: 'center',
            backgroundColor: 'rgba(14, 165, 233, 0.08)',
            border: '1px solid rgba(14, 165, 233, 0.22)',
            borderRadius: '18px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <Scale size={14} />
            <span>Peso</span>
          </div>
          <div style={{ fontSize: '1.375rem', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
            {paciente.pesoKg ? `${paciente.pesoKg} kg` : 'N/A'}
          </div>
        </div>

        <div
          style={{
            padding: '18px 14px',
            textAlign: 'center',
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.22)',
            borderRadius: '18px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-warning)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <ShieldAlert size={14} />
            <span>Riesgo</span>
          </div>
          <div style={{ fontSize: '1.375rem', fontWeight: 900, color: 'var(--color-warning)', fontFamily: 'var(--font-mono)' }}>
            {paciente.enfermedadesCronicas?.length ? 'Alto' : 'Normal'}
          </div>
        </div>
      </div>

      {/* Clinical Operations Panel (2 Columns on Tablet, 1 on Mobile) */}
      <div className="grid-responsive-2col">
        {/* Patient Antecedents & Clinical Profile Card */}
        <Card style={{ backgroundColor: 'var(--color-surface-0)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text)' }}>
            <User size={20} style={{ color: 'var(--color-primary)' }} />
            <span>Ficha de Antecedentes Médicos</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '14px', borderRadius: '14px', backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-warning)', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <AlertTriangle size={15} /> Comorbilidades Reportadas
              </div>
              <div style={{ fontSize: '0.875rem', marginTop: '6px', color: 'var(--color-text)', fontWeight: 600 }}>
                {paciente.enfermedadesCronicas?.length ? paciente.enfermedadesCronicas.join(', ') : 'Sin comorbilidades reportadas'}
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: '14px', backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <Pill size={15} /> Medicamentos Actuales
              </div>
              <div style={{ fontSize: '0.875rem', marginTop: '6px', color: 'var(--color-text)', fontWeight: 600 }}>
                {paciente.medicamentosActuales || 'Sin medicamentos continuos registrados'}
              </div>
            </div>
          </div>
        </Card>

        {/* Clinical Evolution Notes Form Card */}
        <Card style={{ backgroundColor: 'var(--color-surface-0)', padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text)' }}>
            <Activity size={20} style={{ color: 'var(--color-primary)' }} />
            <span>Agregar Nota de Evolución Médica</span>
          </h3>

          {notaGuardada && (
            <div style={{ padding: '12px 14px', backgroundColor: 'var(--color-success-soft)', color: 'var(--color-success)', borderRadius: '12px', fontSize: '0.8125rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <CheckCircle2 size={18} />
              <span style={{ fontWeight: 700 }}>Nota guardada correctamente en el expediente MINSA.</span>
            </div>
          )}

          <form onSubmit={handleGuardarNota}>
            <textarea
              rows={3}
              value={notaMedica}
              onChange={(e) => setNotaMedica(e.target.value)}
              placeholder="Escribí indicaciones sobre hidratación, hemograma o referencia a hospital..."
              className="input"
              style={{ padding: '14px', height: 'auto', marginBottom: '16px', resize: 'none', borderRadius: '14px' }}
            />

            <Button variante="primario" type="submit" style={{ width: '100%', minHeight: '48px', borderRadius: '14px' }}>
              <Save size={18} />
              <span>Guardar Nota Médica</span>
            </Button>
          </form>
        </Card>
      </div>

      {/* Evaluations Timeline (Full Width Section) */}
      <div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text)' }}>
          <Clock size={20} style={{ color: 'var(--color-primary)' }} />
          <span>Historial de Evaluaciones ({registros.length})</span>
        </h3>

        <div className="grid-listas">
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
              <Card key={r.id || i} style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px', backgroundColor: 'var(--color-surface-0)', borderRadius: '20px' }}>
                {/* Header Row: Badge & Clean Date */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                  <Badge tipo={r.clasificacion} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 600, flexShrink: 0 }} suppressHydrationWarning>
                    <Clock size={13} style={{ color: 'var(--color-primary)' }} />
                    <span>{fechaFormateada}</span>
                  </span>
                </div>

                {/* Symptoms Reported Pills */}
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.04em' }}>
                    Síntomas Reportados ({sintomasObjetos.length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {sintomasObjetos.map((s) => (
                      <span
                        key={s?.id}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 12px',
                          borderRadius: '9999px',
                          backgroundColor: s?.esSignoAlarma ? 'rgba(239, 68, 68, 0.15)' : 'var(--color-surface-1)',
                          color: s?.esSignoAlarma ? '#F87171' : 'var(--color-text-secondary)',
                          border: s?.esSignoAlarma ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid var(--color-border)',
                          fontSize: '0.75rem',
                          fontWeight: s?.esSignoAlarma ? 700 : 600,
                        }}
                      >
                        <SintomaIcon nombreIcono={s?.icono || 'stethoscope'} size={14} />
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
                      borderRadius: '14px',
                      padding: '12px 14px',
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.5,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                    }}
                  >
                    <FileText size={18} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: 'var(--color-primary)', display: 'block', marginBottom: '2px', fontWeight: 800 }}>
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
