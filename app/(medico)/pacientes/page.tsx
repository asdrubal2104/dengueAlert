'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/stores/app-store';
import { Search, MapPin, ChevronRight, Users } from 'lucide-react';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }} className="slide-up">
      <div>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text)' }}>
          <Users size={24} style={{ color: 'var(--color-primary)' }} />
          <span>Directorio de Pacientes Vinculados</span>
        </h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Listado completo de pacientes asignados a tu código MINSA.
        </p>
      </div>

      <div style={{ position: 'relative' }}>
        <Search
          size={20}
          style={{
            position: 'absolute',
            left: '16px',
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
          style={{ paddingLeft: '48px', minHeight: '52px', borderRadius: '16px' }}
        />
      </div>

      <div className="grid-listas">
        {pacientesFiltrados.map((paciente) => {
          const evalPaciente = registros.find((e) => e.pacienteId === paciente.id);
          const clasificacion = evalPaciente?.clasificacion || 'BAJO_RIESGO';

          return (
            <Link key={paciente.id} href={`/pacientes/${paciente.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Card interactive style={{ padding: '20px', borderRadius: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        backgroundColor: 'rgba(14, 165, 233, 0.12)',
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.125rem',
                        border: '1px solid rgba(14, 165, 233, 0.3)',
                        flexShrink: 0,
                      }}
                    >
                      {paciente.nombreCompleto ? paciente.nombreCompleto.charAt(0).toUpperCase() : 'P'}
                    </div>

                    <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
                      <h3 style={{ 
                        fontSize: '1rem', 
                        fontWeight: 800, 
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: 'var(--color-text)',
                        lineHeight: 1.25
                      }}>
                        {paciente.nombreCompleto}
                      </h3>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                        <MapPin size={13} style={{ flexShrink: 0, color: 'var(--color-primary)' }} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{paciente.departamento || 'Nicaragua'}</span>
                        <span style={{ margin: '0 2px', opacity: 0.4 }}>•</span>
                        <span style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>Sangre {paciente.tipoSangre || 'N/A'}</span>
                      </div>

                      <div style={{ marginTop: '6px' }}>
                        <Badge tipo={clasificacion} />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', height: '48px', paddingLeft: '8px' }}>
                    <ChevronRight size={22} style={{ color: 'var(--color-text-muted)' }} />
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
