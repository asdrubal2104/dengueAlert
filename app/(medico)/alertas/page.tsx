'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/stores/app-store';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AlertasMedicoPage() {
  const alertas = useAppStore((state) => state.alertas);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} className="slide-up">
      <div>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 800 }}>
          Centro de Alertas de Salud
        </h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
          Notificaciones en tiempo real de pacientes con signos de alarma.
        </p>
      </div>

      {alertas.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '32px' }}>
          <CheckCircle2 size={44} style={{ color: 'var(--color-success)', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '6px' }}>
            No hay alertas activas
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            Todos los pacientes vinculados se encuentran estables.
          </p>
        </Card>
      ) : (
        <div className="grid-listas">
          {alertas.map((alerta) => (
            <Card
              key={alerta.id}
              style={{
                backgroundColor: alerta.tipo === 'EMERGENCY' ? 'rgba(239, 68, 68, 0.06)' : 'rgba(249, 115, 22, 0.06)',
                border: alerta.tipo === 'EMERGENCY' ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(249, 115, 22, 0.25)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '2px' }}>
                    {alerta.pacienteNombre}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }} suppressHydrationWarning>
                    {new Date(alerta.fechaHora).toLocaleString('es-NI')}
                  </span>
                </div>
                <Badge tipo={alerta.tipo === 'EMERGENCY' ? 'DENGUE_GRAVE' : 'DENGUE_ALARMA'} />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                  Signos de alarma detectados:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {alerta.sintomasCriticos.map((s, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--color-danger-soft)',
                        color: 'var(--color-danger)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      ⚠️ {s}
                    </span>
                  ))}
                </div>
              </div>

              <Link href={`/pacientes/${alerta.pacienteId}`} style={{ textDecoration: 'none' }}>
                <Button variante="primario" style={{ width: '100%', minHeight: '44px' }}>
                  <span>Revisar historial del paciente</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
