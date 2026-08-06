'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/stores/app-store';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SintomaIcon } from '@/components/ui/SintomaIcon';
import { CATALOGO_SINTOMAS } from '@/lib/dengue/sintomas';
import { Clock, Plus, Calendar, FileText } from 'lucide-react';

export default function HistorialPacientePage() {
  const { registros } = useAppStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Mi Historial de Salud</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            Registro de evaluaciones de síntomas en el tiempo
          </p>
        </div>
        <Link
          href="/sintomas"
          className="btn btn-primario"
          style={{ width: 'auto', padding: '8px 14px', fontSize: '0.85rem' }}
        >
          <Plus size={16} />
          <span>Nueva</span>
        </Link>
      </div>

      {registros.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '36px 16px' }}>
          <Clock size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Todavía no tenés evaluaciones</h3>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '20px',
            }}
          >
            Realizá tu primera evaluación de síntomas para llevar tu historial.
          </p>
          <Link href="/sintomas" className="btn btn-primario">
            Evaluar síntomas ahora
          </Link>
        </Card>
      ) : (
        <div className="grid-listas">
          {registros.map((reg) => {
            const fecha = new Date(reg.fechaRegistro);
            const fechaFormateada = fecha.toLocaleDateString('es-NI', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <Card key={reg.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    borderBottom: '1px solid var(--color-border)',
                    paddingBottom: '12px',
                    marginBottom: '4px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <Badge clasificacion={reg.clasificacion} />
                    <span
                      style={{
                        fontSize: '0.78125rem',
                        background: 'var(--color-surface-1)',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontWeight: 700,
                        color: 'var(--color-text)',
                        border: '1px solid var(--color-border)',
                        boxShadow: 'var(--shadow-sm)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Día {reg.diasConSintomas} • {reg.faseDengue === 'CRITICA' || (reg.diasConSintomas >= 3 && reg.diasConSintomas <= 6) ? 'Fase Crítica' : reg.faseDengue === 'RECUPERACION' || reg.diasConSintomas >= 7 ? 'Recuperación' : 'Fase Febril'}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: 600,
                    }}
                  >
                    <Calendar size={13} />
                    <span suppressHydrationWarning>{fechaFormateada}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.03em' }}>
                    Síntomas Reportados ({reg.sintomasIds.length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {reg.sintomasIds
                      .map((id) => CATALOGO_SINTOMAS.find((s) => s.id === id))
                      .filter(Boolean)
                      .map((s) => (
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

                {reg.notas && (
                  <div
                    style={{
                      background: 'var(--color-surface)',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      color: 'var(--color-text-secondary)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <FileText size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                    <span>{reg.notas}</span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
