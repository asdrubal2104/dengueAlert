'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RiskGauge } from '@/components/ui/RiskGauge';
import { AlertOverlay } from '@/components/ui/AlertOverlay';
import { SintomaIcon } from '@/components/ui/SintomaIcon';
import { useAppStore } from '@/stores/app-store';
import { CATALOGO_SINTOMAS } from '@/lib/dengue/sintomas';
import { clasificarDengue } from '@/lib/dengue/clasificador';
import { ClasificacionDengue, NivelAtencion } from '@/types/dengue';
import {
  MapPin,
  AlertTriangle,
  RefreshCw,
  ClipboardList,
  ShieldCheck,
  Ban,
  Pill,
  Stethoscope,
  ShieldAlert,
  Calendar,
} from 'lucide-react';

const getBannerStyle = (clasificacion: ClasificacionDengue) => {
  switch (clasificacion) {
    case 'DENGUE_GRAVE':
      return {
        background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)',
        boxShadow: '0 10px 32px rgba(220, 38, 38, 0.35)',
        Icon: ShieldAlert,
      };
    case 'DENGUE_ALARMA':
      return {
        background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 50%, #9A3412 100%)',
        boxShadow: '0 10px 32px rgba(234, 88, 12, 0.35)',
        Icon: AlertTriangle,
      };
    case 'CONSULTA_MEDICA':
    case 'DENGUE_POSIBLE':
      return {
        background: 'linear-gradient(135deg, #D97706 0%, #B45309 50%, #78350F 100%)',
        boxShadow: '0 10px 32px rgba(217, 119, 6, 0.35)',
        Icon: Stethoscope,
      };
    default:
      return {
        background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #064E3B 100%)',
        boxShadow: '0 10px 32px rgba(5, 150, 105, 0.35)',
        Icon: ShieldCheck,
      };
  }
};

const getAtencionStyle = (nivelAtencion: NivelAtencion) => {
  switch (nivelAtencion) {
    case 'EMERGENCIA':
      return { color: '#FCA5A5', background: 'rgba(220, 38, 38, 0.12)', border: 'rgba(220, 38, 38, 0.5)' };
    case 'ATENCION_HOY':
      return { color: '#FDBA74', background: 'rgba(234, 88, 12, 0.12)', border: 'rgba(234, 88, 12, 0.5)' };
    case 'MONITOREO_ESTRECHO':
      return { color: '#FCD34D', background: 'rgba(217, 119, 6, 0.12)', border: 'rgba(217, 119, 6, 0.5)' };
    default:
      return { color: '#6EE7B7', background: 'rgba(5, 150, 105, 0.12)', border: 'rgba(5, 150, 105, 0.5)' };
  }
};

export default function ResultadoEvaluacionPage() {
  const router = useRouter();
  const registros = useAppStore((state) => state.registros);
  const usuarioActual = useAppStore((state) => state.usuarioActual);
  const ultimaEvaluacion = registros[0];

  const resultado = React.useMemo(() => {
    return ultimaEvaluacion
      ? clasificarDengue(
          ultimaEvaluacion.sintomasIds,
          ultimaEvaluacion.diasConSintomas,
          ultimaEvaluacion.fiebreBajoRecientemente,
        )
      : null;
  }, [ultimaEvaluacion]);

  const esEmergencia = resultado?.nivelAtencion === 'EMERGENCIA';

  const [mostrarOverlay, setMostrarOverlay] = useState(esEmergencia);

  if (!ultimaEvaluacion || !resultado) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }} className="slide-up">
        <Card style={{ padding: '32px' }}>
          <ClipboardList size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
            No tenés evaluaciones recientes
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
            Realizá una evaluación seleccionando los síntomas que presentás actualmente.
          </p>
          <Link href="/sintomas" className="btn btn-primario btn-grande">
            Ir a evaluar mis síntomas
          </Link>
        </Card>
      </div>
    );
  }

  const { background, boxShadow, Icon: HeaderIcon } = getBannerStyle(resultado.clasificacion);
  const estiloAtencion = getAtencionStyle(resultado.nivelAtencion);

  const sintomasCriticos = resultado.sintomasSeleccionados
    .filter((s) => s.categoria === 'SEVERE')
    .map((s) => s.nombre);

  const sintomasObjetos = ultimaEvaluacion.sintomasIds
    .map((id) => CATALOGO_SINTOMAS.find((s) => s.id === id))
    .filter(Boolean);


  const fechaFormateada = new Date(ultimaEvaluacion.fechaRegistro).toLocaleDateString('es-NI', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="slide-up">
      {/* Auto-Triggered Full-Screen Alert Modal on Emergency */}
      {mostrarOverlay && (
        <AlertOverlay
          clasificacion={resultado.clasificacion}
          sintomasCriticos={sintomasCriticos}
          onCerrar={() => setMostrarOverlay(false)}
          onVerMapa={() => {
            setMostrarOverlay(false);
            router.push('/alerta');
          }}
        />
      )}


      {/* Hero Banner Header (Matching Inicio style) */}
      <div
        style={{
          background,
          borderRadius: '24px',
          padding: '24px',
          color: '#FFFFFF',
          boxShadow,
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.9, marginBottom: '12px' }}>
            <Calendar size={14} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }} suppressHydrationWarning>
              {fechaFormateada}
            </span>
          </div>

          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              opacity: 0.85,
              display: 'block',
              marginBottom: '4px',
            }}
          >
            Resultado del Triaje Presuntivo
          </span>

          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              lineHeight: 1.25,
            }}
          >
            {resultado.tituloResultado}
          </h1>
        </div>

        {/* Decorative Background Icon */}
        <HeaderIcon
          size={160}
          style={{
            position: 'absolute',
            right: '-25px',
            bottom: '-35px',
            opacity: 0.14,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />
      </div>

      <Card
        style={{
          padding: '18px 20px',
          backgroundColor: estiloAtencion.background,
          border: `1px solid ${estiloAtencion.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: estiloAtencion.color,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              flexShrink: 0,
            }}
          >
            {resultado.nivelAtencion === 'EMERGENCIA' ? <ShieldAlert size={22} /> : <Stethoscope size={22} />}
          </div>
          <div>
            <div style={{ color: estiloAtencion.color, fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {resultado.plazoAtencion}
            </div>
            <p style={{ marginTop: '4px', color: 'var(--color-text)', fontWeight: 800, fontSize: '1rem', lineHeight: 1.35 }}>
              {resultado.accionPrimaria}
            </p>
            {resultado.motivosDerivacion.length > 0 && (
              <p style={{ marginTop: '8px', color: 'var(--color-text-secondary)', fontSize: '0.8125rem', lineHeight: 1.45 }}>
                <strong style={{ color: 'var(--color-text)' }}>Motivo:</strong>{' '}
                {resultado.motivosDerivacion.join(', ')}.
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Clinical Risk Score Card (Extracted to maintain high contrast) */}
      <Card style={{ padding: '18px 20px' }}>
        <RiskGauge score={resultado.riskScore} clasificacion={resultado.clasificacion} />
      </Card>

      {/* WHO Clinical Phase Card */}
      <Card
        style={{
          padding: '18px 20px',
          backgroundColor:
            resultado.faseTemporal === 'CRITICA'
              ? 'rgba(245, 158, 11, 0.1)'
              : resultado.faseTemporal === 'RECUPERACION'
              ? 'rgba(16, 185, 129, 0.1)'
              : 'rgba(14, 165, 233, 0.1)',
          border:
            resultado.faseTemporal === 'CRITICA'
              ? '1px solid rgba(245, 158, 11, 0.35)'
              : resultado.faseTemporal === 'RECUPERACION'
              ? '1px solid rgba(16, 185, 129, 0.35)'
              : '1px solid rgba(14, 165, 233, 0.35)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              padding: '8px 12px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.8125rem',
              color:
                resultado.faseTemporal === 'CRITICA'
                  ? '#FBBF24'
                  : resultado.faseTemporal === 'RECUPERACION'
                  ? '#34D399'
                  : '#38BDF8',
              backgroundColor: 'var(--color-surface-1)',
              border: '1px solid var(--color-border)',
              flexShrink: 0,
            }}
          >
            {resultado.faseTemporal === 'FEBRIL' && '🌡️ Fase Febril'}
            {resultado.faseTemporal === 'CRITICA' && '⚠️ Fase Crítica'}
            {resultado.faseTemporal === 'RECUPERACION' && '💚 Fase Recuperación'}
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-text)' }}>
              Etapa evaluada: {ultimaEvaluacion.diasConSintomas} día(s) con síntomas
            </div>
            <div style={{ fontSize: '0.78125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              {resultado.faseTemporal === 'FEBRIL' &&
                'Típica de los primeros 1-3 días con fiebre alta. Requiere hidratación activa y monitoreo.'}
              {resultado.faseTemporal === 'CRITICA' &&
                'Ocurre típicamente entre días 3 y 6. Período de mayor cuidado por riesgo de fuga plasmática.'}
              {resultado.faseTemporal === 'RECUPERACION' &&
                'Días 7+. Etapa de reabsorción de líquidos y estabilización paulatina del organismo.'}
            </div>
          </div>
        </div>
      </Card>

      {resultado.advertenciaFaseCritica && (
        <Card style={{ padding: '16px 18px', backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.45)' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <AlertTriangle size={20} style={{ color: '#FBBF24', flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              <strong style={{ color: '#FCD34D' }}>Vigilancia reforzada:</strong> cuando la fiebre baja entre los días 3 y 6 pueden aparecer complicaciones. Observá signos de alarma durante las próximas 24–48 horas y acudí hoy si aparece alguno.
            </p>
          </div>
        </Card>
      )}

      {/* Medication Warning Box (Refined matching Emergency Contact design in Inicio) */}
      <Card
        style={{
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          padding: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '14px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              color: '#F87171',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '1px solid rgba(239, 68, 68, 0.4)',
            }}
          >
            <Ban size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#F87171', marginBottom: '6px' }}>
              ¡ADVERTENCIA DE MEDICAMENTOS CONTRAINDICADOS!
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--color-text)' }}>NO TOMAR:</strong> Ibuprofeno, Aspirina, Naproxeno o Diclofenaco (pueden precipitar hemorragias graves por dengue).
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '10px',
                padding: '10px 14px',
                backgroundColor: 'var(--color-surface-1)',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
                fontWeight: 700,
                fontSize: '0.8125rem',
              }}
            >
              <Pill size={16} style={{ flexShrink: 0, color: '#34D399' }} />
              <span>Usar ÚNICAMENTE Acetaminofén (Paracetamol) para la fiebre.</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {esEmergencia && (
          <Button
            variante="peligro"
            tamano="grande"
            onClick={() => setMostrarOverlay(true)}
            style={{ width: '100%' }}
          >
            <AlertTriangle size={20} />
            <span>ABRIR ALERTA Y BUSCAR HOSPITAL MINSA</span>
          </Button>
        )}

        <Link
          href="/alerta"
          className="btn btn-secundario"
          style={{ textDecoration: 'none', width: '100%' }}
        >
          <MapPin size={18} />
          <span>{resultado.nivelAtencion === 'ATENCION_HOY' ? '📍 Activar GPS y buscar centro de salud para hoy' : '📍 Ver mapa de centros de salud cercanos'}</span>
        </Link>

        <Link 
          href="/sintomas" 
          className="btn btn-fantasma"
          style={{ textDecoration: 'none', width: '100%' }}
        >
          <RefreshCw size={18} />
          <span>Volver a evaluar</span>
        </Link>
      </div>

      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', lineHeight: 1.45, textAlign: 'center', padding: '0 10px' }}>
        Esta evaluación es orientativa y no sustituye el diagnóstico de un médico. Si tenés dudas, consultá a tu médico o acudí al centro de salud más cercano.
      </p>

      {/* Care Recommendations List (Refined UI with icon bullets) */}
      <Card style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-primary-soft)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(14, 165, 233, 0.3)',
            }}
          >
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-text)' }}>
              Recomendaciones Médicas MINSA
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              Guía oficial de conducta clínica
            </p>
          </div>
        </div>

        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {resultado.recomendaciones.map((rec, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.875rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.45,
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-soft)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  marginTop: '1px',
                }}
              >
                {i + 1}
              </div>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Reported Symptoms Pills */}
      <Card style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, marginBottom: '14px', color: 'var(--color-text)' }}>
          Síntomas reportados ({sintomasObjetos.length})
        </h3>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {sintomasObjetos.map((s) => (
            <span
              key={s?.id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '9999px',
                backgroundColor: s?.esSignoAlarma ? 'var(--color-danger-soft)' : 'var(--color-surface-1)',
                color: s?.esSignoAlarma ? '#F87171' : 'var(--color-text-secondary)',
                border: s?.esSignoAlarma ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--color-border)',
                fontSize: '0.8125rem',
                fontWeight: 600,
              }}
            >
              <SintomaIcon nombreIcono={s?.icono || 'stethoscope'} size={14} />
              <span>{s?.nombre}</span>
            </span>
          ))}
        </div>
      </Card>

      {/* Save History & Register CTA for Guest Users */}
      {!usuarioActual && (
        <Card
          style={{
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(2, 132, 199, 0.1) 100%)',
            border: '1px solid rgba(14, 165, 233, 0.4)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
                }}
              >
                <ClipboardList size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-text)' }}>
                  ¿Querés guardar este resultado?
                </h3>
                <p style={{ fontSize: '0.78125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  Creá tu cuenta gratis para llevar tu historial de síntomas y conectarte con un médico MINSA.
                </p>
              </div>
            </div>

            <Link 
              href="/registro" 
              className="btn btn-primario btn-grande"
              style={{ textDecoration: 'none', width: '100%' }}
            >
              <span>Crear mi cuenta de Paciente</span>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
