'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ArticuloEducativo {
  id: string;
  titulo: string;
  categoria: 'GENERAL' | 'CUIDADO_HOGAR' | 'SIGNOS_ALARMA' | 'PREVENCION';
  descripcionCorta: string;
  puntosClave: { titulo: string; descripcion: string; icono?: string }[];
}

const ARTICULOS: ArticuloEducativo[] = [
  {
    id: 'que-es-dengue',
    titulo: '¿Qué es el Dengue y cómo se transmite?',
    categoria: 'GENERAL',
    descripcionCorta: 'Información fundamental sobre la enfermedad transmitida por el mosquito Aedes aegypti.',
    puntosClave: [
      {
        titulo: 'Transmisión por picadura',
        descripcion: 'El dengue no se contagia de persona a persona. Se transmite únicamente cuando el mosquito Aedes aegypti pica a una persona infectada y luego a una sana.',
      },
      {
        titulo: 'Fase Febril (Días 1 a 3)',
        descripcion: 'Fiebre alta repentina (39°-40°C), dolor de cabeza severo, dolor detrás de los ojos (retroocular), dolores musculares y articulares.',
      },
      {
        titulo: 'Fase Crítica (Días 4 a 7)',
        descripcion: 'Al bajar la fiebre es cuando se debe tener MAYOR PRECAUCIÓN. En esta fase pueden aparecer los signos de alarma o sangrados.',
      },
    ],
  },
  {
    id: 'cuidados-hogar',
    titulo: 'Cuidados en el Hogar y Manejo de la Fiebre',
    categoria: 'CUIDADO_HOGAR',
    descripcionCorta: 'Guía segura para el tratamiento de pacientes febriles estables.',
    puntosClave: [
      {
        titulo: 'Hidratación abundante (CRÍTICO)',
        descripcion: 'Tomar Sales de Rehidratación Oral (SRO), suero oral, agua de coco, jugos naturales y sopas. Evitar refrescos embotellados.',
      },
      {
        titulo: 'Únicamente Acetaminofén / Paracetamol',
        descripcion: 'Tomar la dosis indicada por el médico según peso. NUNCA exceder la dosis diaria recomendada.',
      },
      {
        titulo: 'Reposo absoluto bajo mosquitero',
        descripcion: 'Guardar reposo en cama. Utilizar mosquitero para evitar que los mosquitos piquen al enfermo y propaguen el virus a la familia.',
      },
    ],
  },
  {
    id: 'signos-alarma',
    titulo: 'Signos de Alarma: ¿Cuándo ir al Hospital?',
    categoria: 'SIGNOS_ALARMA',
    descripcionCorta: 'Síntomas críticos que indican complicación grave de dengue y requieren emergencia.',
    puntosClave: [
      {
        titulo: 'Dolor abdominal intenso y continuo',
        descripcion: 'Dolor severo en el vientre que no cede.',
      },
      {
        titulo: 'Vómitos persistentes',
        descripcion: 'Más de 3 episodios de vómito en 24 horas o incapacidad para retener líquidos.',
      },
      {
        titulo: 'Sangrado espontáneo',
        descripcion: 'Sangrado por la nariz, encías, vómito con sangre o heces oscuras/negras.',
      },
      {
        titulo: 'Somnolencia o irritabilidad extrema',
        descripcion: 'Decaimiento severo, desorientación o confusión mental.',
      },
    ],
  },
  {
    id: 'prevencion-criaderos',
    titulo: 'Eliminación de Criaderos de Mosquitos en Nicaragua',
    categoria: 'PREVENCION',
    descripcionCorta: 'Acciones comunitarias y familiares para erradicar el Aedes aegypti.',
    puntosClave: [
      {
        titulo: 'Lavar y cepillar pilas y barriles',
        descripcion: 'Lavar los bordes de los recipientes de agua cada 3 días para destruir los huevos del mosquito.',
      },
      {
        titulo: 'Tapar todos los recipientes con agua',
        descripcion: 'Mantener cerrados herméticamente los tanques, barriles y baldes de reserva.',
      },
      {
        titulo: 'Eliminar objetos en desuso',
        descripcion: 'Desechar llantas viejas, botellas, latas y plásticos donde se pueda acumular agua de lluvia.',
      },
    ],
  },
];

export default function EducacionPage() {
  const [articuloAbierto, setArticuloAbierto] = useState<string>('que-es-dengue');

  const toggleArticulo = (id: string) => {
    setArticuloAbierto((prev) => (prev === id ? '' : id));
  };

  const getCategoriaBadgeStyle = (cat: ArticuloEducativo['categoria']) => {
    switch (cat) {
      case 'SIGNOS_ALARMA':
        return { bg: 'var(--color-danger-soft)', text: 'var(--color-danger)', border: 'var(--color-danger)', label: 'Emergencia Crítica' };
      case 'CUIDADO_HOGAR':
        return { bg: 'var(--color-primary-soft)', text: 'var(--color-primary)', border: 'var(--color-primary)', label: 'Cuidados en Casa' };
      case 'PREVENCION':
        return { bg: 'var(--color-success-soft)', text: 'var(--color-success)', border: 'var(--color-success)', label: 'Prevención' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.15)', text: 'var(--color-text-secondary)', border: 'var(--color-border)', label: 'Información General' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} className="slide-up">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', marginBottom: '4px' }}>
          <BookOpen size={20} />
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
            Guía Clínica MINSA
          </span>
        </div>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 800 }}>
          Educación y Prevención del Dengue
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {ARTICULOS.map((art) => {
          const abierto = articuloAbierto === art.id;
          const badge = getCategoriaBadgeStyle(art.categoria);

          return (
            <Card key={art.id} style={{ padding: 0, overflow: 'hidden' }}>
              <button
                type="button"
                onClick={() => toggleArticulo(art.id)}
                aria-expanded={abierto}
                style={{
                  width: '100%',
                  padding: '18px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'inherit',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
                className="touch-feedback"
              >
                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: badge.bg,
                      color: badge.text,
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      marginBottom: '8px',
                    }}
                  >
                    {badge.label}
                  </span>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px', lineHeight: 1.3 }}>
                    {art.titulo}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                    {art.descripcionCorta}
                  </p>
                </div>

                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-surface-1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {abierto ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {abierto && (
                <div
                  style={{
                    padding: '0 18px 18px 18px',
                    borderTop: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface-1)',
                  }}
                  className="slide-up"
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '16px' }}>
                    {art.puntosClave.map((punto, idx) => (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: 'var(--color-surface-0)',
                          borderRadius: '12px',
                          padding: '12px',
                          border: '1px solid var(--color-border)',
                        }}
                      >
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                          • {punto.titulo}
                        </h4>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                          {punto.descripcion}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
