'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PatientTriageList } from '@/components/ui/PatientTriageList';
import { useAppStore } from '@/stores/app-store';
import {
  Stethoscope,
  Bell,
  Key,
  ArrowRight,
  Plus,
  Activity,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Users,
  PieChart,
} from 'lucide-react';

export default function DoctorDashboardPage() {
  const usuarioActual = useAppStore((state) => state.usuarioActual);
  const pacientesVinc = useAppStore((state) => state.pacientesVinculados);
  const alertas = useAppStore((state) => state.alertas);
  const registros = useAppStore((state) => state.registros);
  const codigoVinculacionActual = useAppStore((state) => state.codigoVinculacionActual);
  const generarCodigoVinculacion = useAppStore((state) => state.generarCodigoVinculacion);

  const totalPacientes = pacientesVinc.length;
  const alertasCriticas = alertas.filter((a) => a.tipo === 'EMERGENCY' || a.tipo === 'WARNING');

  // Clinical Phase Calculations (WHO 2009)
  const enFaseFebril = registros.filter(
    (r) => r.faseDengue === 'FEBRIL' || r.diasConSintomas <= 2
  ).length;
  const enFaseCritica = registros.filter(
    (r) => r.faseDengue === 'CRITICA' || (r.diasConSintomas >= 3 && r.diasConSintomas <= 6)
  ).length;
  const enFaseRecuperacion = registros.filter(
    (r) => r.faseDengue === 'RECUPERACION' || r.diasConSintomas >= 7
  ).length;

  // Risk Classification Calculations
  const pacientesGrave = registros.filter((r) => r.clasificacion === 'DENGUE_GRAVE').length;
  const pacientesAlarma = registros.filter((r) => r.clasificacion === 'DENGUE_ALARMA').length;
  const pacientesPosible = registros.filter(
    (r) => r.clasificacion === 'DENGUE_POSIBLE' || r.clasificacion === 'CONSULTA_MEDICA'
  ).length;
  const pacientesBajoRiesgo = registros.filter((r) => r.clasificacion === 'BAJO_RIESGO').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }} className="slide-up">
      {/* Credential Header Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 40%, #0284C7 100%)',
          borderRadius: '24px',
          padding: 'clamp(20px, 4vw, 28px)',
          color: '#FFFFFF',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#38BDF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
                flexShrink: 0,
              }}
            >
              <Stethoscope size={28} />
            </div>
            <div style={{ flex: '1 1 auto', minWidth: '220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.4rem)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.25 }}>
                  {usuarioActual?.nombreCompleto || 'Dr. Juan Carlos Pérez López'}
                </h2>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      backgroundColor: 'rgba(56, 189, 248, 0.2)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      color: '#E0F2FE'
                    }}
                  >
                    <ShieldCheck size={13} style={{ color: '#38BDF8' }} />
                    <span>Verificado</span>
                  </span>

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#FFFFFF'
                    }}
                  >
                    <span style={{ opacity: 0.8, fontWeight: 600 }}>MINSA</span>
                    <span>#{usuarioActual?.codigoMinsa ? usuarioActual.codigoMinsa.replace(/^MINSA-?/i, '').replace(/^#/i, '') : '48291'}</span>
                  </span>
                </div>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#E0F2FE', opacity: 0.95, marginTop: '8px', lineHeight: 1.45 }}>
                <span style={{ fontWeight: 700 }}>{usuarioActual?.especialidad || 'Medicina Interna'}</span>
                <span style={{ margin: '0 6px', opacity: 0.6 }}>•</span>
                <span style={{ opacity: 0.85 }}>{usuarioActual?.unidadDeSalud || 'Hospital Escuela Manolo Morales'}</span>
                <span style={{ opacity: 0.7 }}> (SILAIS {usuarioActual?.silais || 'Managua'})</span>
              </div>
            </div>
          </div>
        </div>

        <Stethoscope
          size={180}
          style={{
            position: 'absolute',
            right: '-30px',
            bottom: '-45px',
            opacity: 0.08,
            pointerEvents: 'none',
            color: '#FFFFFF',
          }}
          aria-hidden="true"
        />
      </div>

      {/* KPI Stats Grid (4 Cards Row on Tablet, 2x2 on Mobile) */}
      <div className="grid-responsive-4col">
        <div className="kpi-card kpi-card--primary">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#38BDF8', letterSpacing: '0.05em' }}>
              Pacientes
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: 'rgba(14, 165, 233, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38BDF8' }}>
              <Users size={18} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>
              {totalPacientes}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px', fontWeight: 600 }}>
              En expediente activo
            </div>
          </div>
        </div>

        <div className="kpi-card kpi-card--orange">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-orange)', letterSpacing: '0.05em' }}>
              Alertas
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: 'rgba(249, 115, 22, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-orange)' }}>
              <Bell size={18} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-orange)', fontFamily: 'var(--font-mono)' }}>
              {alertasCriticas.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px', fontWeight: 600 }}>
              Requieren atención
            </div>
          </div>
        </div>

        <div className="kpi-card kpi-card--warning">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-warning)', letterSpacing: '0.05em' }}>
              Fase Crítica
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-warning)' }}>
              <Clock size={18} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-warning)', fontFamily: 'var(--font-mono)' }}>
              {enFaseCritica}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px', fontWeight: 600 }}>
              Días 3-6 de evolución
            </div>
          </div>
        </div>

        <div className="kpi-card kpi-card--danger">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-danger)', letterSpacing: '0.05em' }}>
              Casos Graves
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-danger)' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-danger)', fontFamily: 'var(--font-mono)' }}>
              {pacientesGrave}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px', fontWeight: 600 }}>
              Prioridad de Triaje
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Epidemiological Breakdown (Single Card, Stacked) */}
      <Card style={{ backgroundColor: 'var(--color-surface-0)', padding: '28px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Triage Risk Classification Widget (KPIs) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(14, 165, 233, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                <PieChart size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)' }}>
                  Clasificación Epidemiológica MINSA
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Categorización según guía nacional
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '14px', borderRadius: '14px', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-danger)' }} />
                  DENGUE GRAVE
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-danger)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                  {pacientesGrave}
                </div>
              </div>

              <div style={{ padding: '14px', borderRadius: '14px', backgroundColor: 'rgba(249, 115, 22, 0.08)', border: '1px solid rgba(249, 115, 22, 0.25)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-orange)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-orange)' }} />
                  SIGNOS ALARMA
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-orange)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                  {pacientesAlarma}
                </div>
              </div>

              <div style={{ padding: '14px', borderRadius: '14px', backgroundColor: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.25)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-warning)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-warning)' }} />
                  DENGUE POSIBLE
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-warning)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                  {pacientesPosible}
                </div>
              </div>

              <div style={{ padding: '14px', borderRadius: '14px', backgroundColor: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }} />
                  BAJO RIESGO
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-success)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                  {pacientesBajoRiesgo}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: 'var(--color-border)', width: '100%' }} />

          {/* WHO Clinical Phases Widget */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(14, 165, 233, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                <Activity size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)' }}>
                  Distribución por Fases OMS
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Evolución de síntomas por cohorte
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '6px' }}>
                  <span style={{ color: '#38BDF8' }}>Fase Febril (Días 1-2)</span>
                  <span style={{ color: 'var(--color-text)' }}>{enFaseFebril} <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>pacientes</span></span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-surface-1)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${totalPacientes ? (enFaseFebril / totalPacientes) * 100 : 0}%`, height: '100%', backgroundColor: '#38BDF8', transition: 'width 300ms ease', borderRadius: '999px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '6px' }}>
                  <span style={{ color: 'var(--color-orange)' }}>⚠️ Fase Crítica (Días 3-6)</span>
                  <span style={{ color: 'var(--color-text)' }}>{enFaseCritica} <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>pacientes</span></span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-surface-1)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${totalPacientes ? (enFaseCritica / totalPacientes) * 100 : 0}%`, height: '100%', backgroundColor: 'var(--color-orange)', transition: 'width 300ms ease', borderRadius: '999px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '6px' }}>
                  <span style={{ color: 'var(--color-success)' }}>Fase Recuperación (Día 7+)</span>
                  <span style={{ color: 'var(--color-text)' }}>{enFaseRecuperacion} <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>pacientes</span></span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-surface-1)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${totalPacientes ? (enFaseRecuperacion / totalPacientes) * 100 : 0}%`, height: '100%', backgroundColor: 'var(--color-success)', transition: 'width 300ms ease', borderRadius: '999px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Critical Alerts Feed */}
      {alertasCriticas.length > 0 && (
        <Card style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-danger)' }}>
              <Bell size={20} className="pulso-alerta" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>
                Alertas Médicas Activas ({alertasCriticas.length})
              </h3>
            </div>

            <Link href="/alertas" style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none' }}>
              Ver todas →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {alertasCriticas.slice(0, 2).map((alerta) => (
              <div
                key={alerta.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  backgroundColor: 'var(--color-surface-0)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '14px',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '3px' }}>
                    {alerta.pacienteNombre}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-danger)', fontWeight: 600 }}>
                    {alerta.sintomasCriticos.slice(0, 2).join(', ')}
                  </div>
                </div>

                <Link href={`/pacientes/${alerta.pacienteId}`} style={{ textDecoration: 'none', marginLeft: 'auto' }}>
                  <Button variante="peligro" style={{ minHeight: '38px', padding: '0 14px', fontSize: '0.8125rem' }}>
                    <span>Atender</span>
                    <ArrowRight size={15} />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Doctor-Patient Linkage Code Quick Action Banner */}
      <Card style={{ backgroundColor: 'var(--color-surface-0)', padding: '22px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '220px', flex: '1 1 auto' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                backgroundColor: 'var(--color-primary-soft)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Key size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)' }}>
                Código para Vincular Paciente
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '3px' }}>
                Dictá este código de 6 dígitos al paciente en tu consulta para vincular su expediente.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {(codigoVinculacionActual || 'A3F7K2').split('').map((char, index) => (
                <span key={index} className="digit-box">
                  {char}
                </span>
              ))}
            </div>

            <Button variante="secundario" onClick={generarCodigoVinculacion} style={{ minHeight: '44px', padding: '0 16px', flexShrink: 0 }}>
              <Plus size={16} />
              <span>Nuevo</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Patient Triage Section (Full Width Grid) */}
      <div style={{ marginTop: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text)' }}>
              <Activity size={22} style={{ color: 'var(--color-primary)' }} />
              <span>Triaje Clínico de Pacientes</span>
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Pacientes ordenados por prioridad de atención médica
            </p>
          </div>

          <Link href="/pacientes" style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Directorio completo</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <PatientTriageList pacientes={pacientesVinc} registros={registros} />
      </div>
    </div>
  );
}
