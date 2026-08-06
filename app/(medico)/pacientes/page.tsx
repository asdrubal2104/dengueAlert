'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/stores/app-store';
import { Search, MapPin, ChevronRight } from 'lucide-react';

export default function DirectoryPacientesPage() {
  const pacientes = useAppStore((state) => state.pacientesVinculados);
  const registros = useAppStore((state) => state.registros);
  const [busqueda, setBusqueda] = useState('');

  const pacientesFiltrados = pacientes.filter(
    (p) =>
      (p.nombreCompleto && p.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase())) ||
      (p.departamento && p.departamento.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} className="slide-up">
      <div>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 800 }}>
          Directorio de Pacientes Vinculados
        </h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
          Listado completo de pacientes asignados a tu código MINSA.
        </p>
      </div>

      <div style={{ position: 'relative' }}>
        <Search
          size={18}
          style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)',
          }}
        />
        <input
          type="text"
          placeholder="Buscar paciente por nombre o municipio..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="input"
          style={{ paddingLeft: '42px' }}
        />
      </div>

      <div className="grid-listas">
        {pacientesFiltrados.map((paciente) => {
          const evalPaciente = registros.find((e) => e.pacienteId === paciente.id);
          const clasificacion = evalPaciente?.clasificacion || 'BAJO_RIESGO';

          return (
            <Link key={paciente.id} href={`/pacientes/${paciente.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Card interactive style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(14, 165, 233, 0.1)',
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.125rem',
                        border: '1px solid rgba(14, 165, 233, 0.2)',
                        flexShrink: 0,
                      }}
                    >
                      {paciente.nombreCompleto ? paciente.nombreCompleto.charAt(0).toUpperCase() : 'P'}
                    </div>

                    <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
                      <h3 style={{ 
                        fontSize: '0.9375rem', 
                        fontWeight: 800, 
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: 'var(--color-text)',
                        lineHeight: 1.2
                      }}>
                        {paciente.nombreCompleto}
                      </h3>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                        <MapPin size={12} style={{ flexShrink: 0 }} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{paciente.departamento || 'Nicaragua'}</span>
                        <span style={{ margin: '0 2px' }}>•</span>
                        <span style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>{paciente.tipoSangre || 'N/A'}</span>
                      </div>

                      <div style={{ marginTop: '4px' }}>
                        <Badge tipo={clasificacion} />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', height: '44px', paddingLeft: '8px' }}>
                    <ChevronRight size={20} style={{ color: 'var(--color-text-muted)' }} />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
