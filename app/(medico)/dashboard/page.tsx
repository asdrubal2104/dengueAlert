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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="slide-up">
      {/* Credential Header Card */}
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
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>
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
                <span style={{ opacity: 0.7 }}>{usuarioActual?.unidadDeSalud || 'Hospital Escuela Manolo Morales'}</span>
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

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <Card style={{ padding: '14px 8px', textAlign: 'center', marginBottom: 0 }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
            {totalPacientes}
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Pacientes
          </div>
        </Card>

        <Card style={{ padding: '14px 8px', textAlign: 'center', marginBottom: 0 }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-orange)', fontFamily: 'var(--font-mono)' }}>
            {alertasCriticas.length}
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Alertas
          </div>
        </Card>

        <Card style={{ padding: '14px 8px', textAlign: 'center', marginBottom: 0 }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-danger)', fontFamily: 'var(--font-mono)' }}>
            {alertas.filter((a) => a.tipo === 'EMERGENCY').length}
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Graves
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

                <Link href={`/pacientes/${alerta.pacienteId}`} style={{ textDecoration: 'none' }}>
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

      {/* Main Responsive 2-Column Grid */}
      <div className="grid-responsive-2col">
        {/* Patient Triage List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} style={{ color: 'var(--color-primary)' }} />
              <span>Triaje Clínico de Pacientes</span>
            </h3>
            <Link href="/pacientes" style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>
              Directorio completo →
            </Link>
          </div>

          <PatientTriageList pacientes={pacientesVinc} registros={registros} />
        </div>

        {/* Doctor-Patient Linkage Code Generator */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Key size={20} style={{ color: 'var(--color-primary)' }} />
              <span>Vincular Paciente</span>
            </h3>
          </div>

          <Card style={{ backgroundColor: 'var(--color-surface-1)', marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--color-primary-soft)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Key size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>
                  Código de Consulta
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  Proporcioná este código de 6 dígitos al paciente para vincular su expediente.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: 'var(--color-surface-0)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  letterSpacing: '0.3em',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-primary)',
                }}
              >
                {codigoVinculacionActual || 'A3F7K2'}
              </div>

              <Button variante="secundario" onClick={generarCodigoVinculacion}>
                <Plus size={16} />
                <span>Nuevo</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
