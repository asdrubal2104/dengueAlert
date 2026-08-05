'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SparklineChart } from '@/components/ui/SparklineChart';
import { MapPin, ChevronRight } from 'lucide-react';
import { RegistroSintomas } from '@/types/dengue';
import { PerfilUsuario } from '@/types/user';

interface PatientTriageListProps {
  pacientes: PerfilUsuario[];
  registros: RegistroSintomas[];
}

export function PatientTriageList({ pacientes, registros }: PatientTriageListProps) {
  // Sort patients by urgency (EMERGENCY -> WARNING -> POSIBLE -> BAJO_RIESGO)
  const sortedPacientes = [...pacientes].sort((a, b) => {
    const regA = registros.find((r) => r.pacienteId === a.id);
    const regB = registros.find((r) => r.pacienteId === b.id);

    const pesoClasificacion: Record<string, number> = {
      DENGUE_GRAVE: 4,
      DENGUE_ALARMA: 3,
      DENGUE_POSIBLE: 2,
      CONSULTA_MEDICA: 1.5,
      BAJO_RIESGO: 1,
    };

    const valA = regA ? pesoClasificacion[regA.clasificacion] || 0 : 0;
    const valB = regB ? pesoClasificacion[regB.clasificacion] || 0 : 0;

    return valB - valA;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {sortedPacientes.map((paciente) => {
        const evaluacionReciente = registros.find((r) => r.pacienteId === paciente.id) || registros[0];
        const clasificacion = evaluacionReciente?.clasificacion || 'BAJO_RIESGO';

        // Mock trend data for fever curve
        const mockFiebreTrend =
          clasificacion === 'DENGUE_GRAVE'
            ? [37.2, 38.5, 39.4, 38.9, 39.6]
            : clasificacion === 'DENGUE_ALARMA'
              ? [38.0, 38.8, 39.1, 38.5, 38.2]
              : [37.5, 38.1, 37.8, 37.0, 36.6];

        const chartColor =
          clasificacion === 'DENGUE_GRAVE'
            ? 'var(--color-danger)'
            : clasificacion === 'DENGUE_ALARMA'
              ? 'var(--color-orange)'
              : clasificacion === 'DENGUE_POSIBLE'
                ? 'var(--color-warning)'
                : 'var(--color-success)';

        return (
          <Link
            key={paciente.id}
            href={`/pacientes/${paciente.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Card
              interactive
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '16px',
              }}
            >
              {/* Card Top Row: Badge & Temperature Trend */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {evaluacionReciente && <Badge tipo={clasificacion} />}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      Tendencia Temp.
                    </div>
                    <SparklineChart data={mockFiebreTrend} color={chartColor} width={65} height={22} />
                  </div>
                  <ChevronRight size={18} style={{ color: 'var(--color-text-muted)' }} />
                </div>
              </div>

              {/* Card Body: Avatar & Full Patient Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--color-surface-1)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                    border: '1px solid var(--color-border)',
                    flexShrink: 0,
                  }}
                >
                  {paciente.nombreCompleto ? paciente.nombreCompleto.charAt(0).toUpperCase() : 'P'}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1.25, marginBottom: '4px' }}>
                    {paciente.nombreCompleto}
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <MapPin size={12} style={{ color: 'var(--color-primary)' }} /> {paciente.departamento || 'Managua'}
                    </span>
                    <span>•</span>
                    <span>Sangre: {paciente.tipoSangre || 'O+'}</span>
                    {paciente.pesoKg && <span>• {paciente.pesoKg}kg</span>}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
