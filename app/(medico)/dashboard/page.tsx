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
  Sparkles,
  RotateCcw,
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
  const cargarDatosDemo = useAppStore((state) => state.cargarDatosDemo);
  const limpiarDatosDemo = useAppStore((state) => state.limpiarDatosDemo);
  const esModoDemo = useAppStore((state) => state.esModoDemo);

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="slide-up">
      {/* Credential Header Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 50%, #075985 100%)',
          borderRadius: '24px',
          padding: 'clamp(18px, 4vw, 24px)',
          color: '#FFFFFF',
          boxShadow: '0 10px 32px rgba(2, 132, 199, 0.35)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(8px)',
                flexShrink: 0,
              }}
            >
              <Stethoscope size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: 'clamp(1.125rem, 3.5vw, 1.25rem)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>
                  {usuarioActual?.nombreCompleto || 'Dr. Juan Carlos Pérez López'}
                </h2>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#E0F2FE'
                    }}
                  >
                    <ShieldCheck size={12} style={{ color: '#38BDF8' }} />
                    <span>Verificado</span>
                  </span>

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(14, 165, 233, 0.3)',
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(14, 165, 233, 0.4)',
                      color: '#FFFFFF'
                    }}
                  >
                    <span style={{ opacity: 0.8, fontWeight: 600 }}>MINSA</span>
                    <span>#{usuarioActual?.codigoMinsa ? usuarioActual.codigoMinsa.replace(/^MINSA-?/i, '').replace(/^#/i, '') : '48291'}</span>
                  </span>
                </div>
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#E0F2FE', opacity: 0.9, marginTop: '8px', lineHeight: 1.4 }}>
                {usuarioActual?.especialidad || 'Medicina Interna'} <br/>
                <span style={{ opacity: 0.7 }}>{usuarioActual?.unidadDeSalud || 'Hospital Escuela Manolo Morales'} — SILAIS {usuarioActual?.silais || 'Managua'}</span>
              </div>
            </div>
          </div>
        </div>

        <Stethoscope
          size={160}
          style={{
            position: 'absolute',
            right: '-25px',
            bottom: '-35px',
            opacity: 0.12,
            pointerEvents: 'none',
            color: '#FFFFFF',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Demo Cohort Simulation Quick Loader Banner */}
      {!esModoDemo && totalPacientes <= 1 && (
        <Card
          style={{
            backgroundColor: 'rgba(14, 165, 233, 0.08)',
            border: '1px solid rgba(14, 165, 233, 0.3)',
            marginBottom: 0,
            padding: '16px 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '220px', flex: '1 1 auto' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(14, 165, 233, 0.2)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Sparkles size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-text)' }}>
                  Modo de Evaluación Clínica Institucional
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  Cargá una cohorte de 5 pacientes de prueba con curvas febriles y alertas activas para demostración.
                </p>
              </div>
            </div>

            <Button variante="primario" onClick={cargarDatosDemo} style={{ minHeight: '40px', flexShrink: 0 }}>
              <Sparkles size={16} />
              <span>Cargar Datos Demo</span>
            </Button>
          </div>
        </Card>
      )}

      {esModoDemo && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', backgroundColor: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.2)', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={15} /> Simulación activa: 5 Pacientes ficticios cargados
          </span>
          <button
            type="button"
            onClick={limpiarDatosDemo}
            style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <RotateCcw size={12} /> Restablecer
          </button>
        </div>
      )}

      {/* KPI Stats Grid (4 Cards Row on Tablet, 2x2 on Mobile) */}
      <div className="grid-responsive-4col">
        <Card style={{ padding: '14px 12px', textAlign: 'center', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--color-primary)', marginBottom: '4px' }}>
            <Users size={16} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Pacientes</span>
          </div>
          <div style={{ fontSize: '1.625rem', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
            {totalPacientes}
          </div>
        </Card>

        <Card style={{ padding: '14px 12px', textAlign: 'center', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--color-orange)', marginBottom: '4px' }}>
            <Bell size={16} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Alertas</span>
          </div>
          <div style={{ fontSize: '1.625rem', fontWeight: 900, color: 'var(--color-orange)', fontFamily: 'var(--font-mono)' }}>
            {alertasCriticas.length}
          </div>
        </Card>

        <Card style={{ padding: '14px 12px', textAlign: 'center', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--color-warning)', marginBottom: '4px' }}>
            <Clock size={16} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Fase Crítica</span>
          </div>
          <div style={{ fontSize: '1.625rem', fontWeight: 900, color: 'var(--color-warning)', fontFamily: 'var(--font-mono)' }}>
            {enFaseCritica}
          </div>
        </Card>

        <Card style={{ padding: '14px 12px', textAlign: 'center', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--color-danger)', marginBottom: '4px' }}>
            <AlertTriangle size={16} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Casos Graves</span>
          </div>
          <div style={{ fontSize: '1.625rem', fontWeight: 900, color: 'var(--color-danger)', fontFamily: 'var(--font-mono)' }}>
            {pacientesGrave}
          </div>
        </Card>
      </div>

      {/* Clinical Epidemiological Breakdown (2 Columns on Tablet) */}
      <div className="grid-responsive-2col">
        {/* WHO Clinical Phases Widget */}
        <Card style={{ marginBottom: 0, backgroundColor: 'var(--color-surface-1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Activity size={18} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800 }}>
              Distribución por Fases Clínicas OMS
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>
                <span style={{ color: '#38BDF8' }}>Fase Febril (Días 1-2)</span>
                <span>{enFaseFebril} pacientes</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-surface-0)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${totalPacientes ? (enFaseFebril / totalPacientes) * 100 : 0}%`, height: '100%', backgroundColor: '#38BDF8', transition: 'width 300ms ease' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>
                <span style={{ color: 'var(--color-orange)' }}>⚠️ Fase Crítica (Días 3-6)</span>
                <span>{enFaseCritica} pacientes</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-surface-0)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${totalPacientes ? (enFaseCritica / totalPacientes) * 100 : 0}%`, height: '100%', backgroundColor: 'var(--color-orange)', transition: 'width 300ms ease' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>
                <span style={{ color: 'var(--color-success)' }}>Fase Recuperación (Día 7+)</span>
                <span>{enFaseRecuperacion} pacientes</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-surface-0)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${totalPacientes ? (enFaseRecuperacion / totalPacientes) * 100 : 0}%`, height: '100%', backgroundColor: 'var(--color-success)', transition: 'width 300ms ease' }} />
              </div>
            </div>
          </div>
        </Card>

        {/* Triage Risk Classification Widget */}
        <Card style={{ marginBottom: 0, backgroundColor: 'var(--color-surface-1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <PieChart size={18} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800 }}>
              Clasificación Epidemiológica MINSA
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--color-danger)' }}>
                DENGUE GRAVE
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-danger)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                {pacientesGrave}
              </div>
            </div>

            <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(249, 115, 22, 0.08)', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--color-orange)' }}>
                SIGNOS ALARMA
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-orange)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                {pacientesAlarma}
              </div>
            </div>

            <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.2)' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--color-warning)' }}>
                DENGUE POSIBLE
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-warning)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                {pacientesPosible}
              </div>
            </div>

            <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--color-success)' }}>
                BAJO RIESGO
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-success)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                {pacientesBajoRiesgo}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Critical Alerts Feed */}
      {alertasCriticas.length > 0 && (
        <Card style={{ backgroundColor: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.25)', marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-danger)' }}>
              <Bell size={18} className="pulso-alerta" />
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 800 }}>
                Alertas Médicas Activas ({alertasCriticas.length})
              </h3>
            </div>

            <Link href="/alertas" style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none' }}>
              Ver todas
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {alertasCriticas.slice(0, 2).map((alerta) => (
              <div
                key={alerta.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  backgroundColor: 'var(--color-surface-1)',
                  borderRadius: '12px',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '2px' }}>
                    {alerta.pacienteNombre}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-danger)', fontWeight: 600 }}>
                    {alerta.sintomasCriticos.slice(0, 2).join(', ')}
                  </div>
                </div>

                <Link href={`/pacientes/${alerta.pacienteId}`} style={{ textDecoration: 'none', marginLeft: 'auto' }}>
                  <Button variante="peligro" style={{ minHeight: '36px', padding: '0 12px', fontSize: '0.8125rem' }}>
                    <span>Atender</span>
                    <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Doctor-Patient Linkage Code Quick Action Banner */}
      <Card style={{ backgroundColor: 'var(--color-surface-1)', marginBottom: 0, padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '200px', flex: '1 1 auto' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-primary-soft)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Key size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-text)' }}>
                Código para Vincular Paciente
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                Dictá este código de 6 dígitos al paciente en tu consulta para vincular su expediente.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto', flexWrap: 'wrap' }}>
            <div
              style={{
                padding: '10px 18px',
                backgroundColor: 'var(--color-surface-0)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                fontSize: 'clamp(1.125rem, 3.5vw, 1.375rem)',
                fontWeight: 900,
                letterSpacing: '0.25em',
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-primary)',
              }}
            >
              {codigoVinculacionActual || 'A3F7K2'}
            </div>

            <Button variante="secundario" onClick={generarCodigoVinculacion} style={{ minHeight: '44px', flexShrink: 0 }}>
              <Plus size={16} />
              <span>Nuevo</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Patient Triage Section (Full Width Grid) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)' }}>
            <Activity size={20} style={{ color: 'var(--color-primary)' }} />
            <span>Triaje Clínico de Pacientes</span>
          </h3>
          <Link href="/pacientes" style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>
            Directorio completo →
          </Link>
        </div>

        <PatientTriageList pacientes={pacientesVinc} registros={registros} />
      </div>
    </div>
  );
}
