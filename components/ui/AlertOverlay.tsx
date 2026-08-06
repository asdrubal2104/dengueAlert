'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ClasificacionDengue } from '@/types/dengue';
import {
  reproducirAlertaWarning,
  reproducirAlertaEmergency,
  detenerAlerta,
} from '@/lib/audio/alert-sounds';
import { NUMEROS_EMERGENCIA_NICARAGUA } from '@/types/nicaragua';
import { Button } from './Button';
import { Phone, MapPin, Share2, Volume2, VolumeX, X, Siren, AlertTriangle } from 'lucide-react';

interface AlertOverlayProps {
  clasificacion: ClasificacionDengue;
  sintomasCriticos?: string[];
  onCerrar: () => void;
  onVerMapa: () => void;
}

export const AlertOverlay: React.FC<AlertOverlayProps> = ({
  clasificacion,
  sintomasCriticos = [],
  onCerrar,
  onVerMapa,
}) => {
  const [sonando, setSonando] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Lock body scroll while overlay is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    if (clasificacion === 'DENGUE_GRAVE') {
      reproducirAlertaEmergency();
    } else if (clasificacion === 'DENGUE_ALARMA') {
      reproducirAlertaWarning();
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      detenerAlerta();
    };
  }, [clasificacion]);

  const toggleSonido = () => {
    if (sonando) {
      detenerAlerta();
      setSonando(false);
    } else {
      if (clasificacion === 'DENGUE_GRAVE') reproducirAlertaEmergency();
      else reproducirAlertaWarning();
      setSonando(true);
    }
  };

  const compartirUbicacion = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: 'Alerta Dengue — Mi Ubicación',
          text: 'Tengo síntomas de alarma de dengue y necesito asistencia médica.',
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      alert('Link de asistencia copiado al portapapeles.');
    }
  };

  const esGrave = clasificacion === 'DENGUE_GRAVE';
  const bgColor = esGrave
    ? 'linear-gradient(180deg, #DC2626 0%, #991B1B 100%)'
    : 'linear-gradient(180deg, #EA580C 0%, #9A3412 100%)';

  if (!mounted) return null;

  const content = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: bgColor,
        color: '#ffffff',
        padding: 'max(16px, env(safe-area-inset-top)) 16px max(32px, env(safe-area-inset-bottom)) 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        animation: 'fade-in 0.3s ease',
      }}
    >
      {/* Header controls */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
          flexShrink: 0,
        }}
      >
        <button
          onClick={toggleSonido}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#FFFFFF',
            borderRadius: '9999px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.78125rem',
            backdropFilter: 'blur(8px)',
          }}
          className="touch-feedback"
        >
          {sonando ? <Volume2 size={15} /> : <VolumeX size={15} />}
          <span>{sonando ? 'Silenciar Alarma' : 'Activar Alarma'}</span>
        </button>

        <button
          onClick={onCerrar}
          aria-label="Cerrar alerta"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#FFFFFF',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
          }}
          className="touch-feedback"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main warning content */}
      <div style={{ textAlign: 'center', margin: '4px 0', maxWidth: '440px', width: '100%', flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div
          style={{
            marginBottom: '8px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0, 0, 0, 0.25)',
            }}
            className="pulso-alerta"
          >
            {esGrave ? <Siren size={30} color="#FFFFFF" /> : <AlertTriangle size={30} color="#FFFFFF" />}
          </div>
        </div>

        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
          {esGrave ? '¡EMERGENCIA MÉDICA GRAVE!' : '¡ATENCIÓN: SIGNOS DE ALARMA!'}
        </h1>

        <p style={{ fontSize: '0.8125rem', opacity: 0.95, lineHeight: 1.35, marginBottom: '10px', color: '#FFF' }}>
          {esGrave
            ? 'Presentás signos de dengue grave. Acudí INMEDIATAMENTE a un centro de salud u hospital.'
            : 'Se detectaron signos de alarma que indican riesgo de complicación. Necesitás atención médica hoy.'}
        </p>

        {sintomasCriticos.length > 0 && (
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '10px 14px',
              textAlign: 'left',
              marginBottom: '8px',
            }}
          >
            <span
              style={{
                fontSize: '0.6875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                opacity: 0.85,
                fontWeight: 800,
                color: '#FFF',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              Signos de alarma detectados:
            </span>
            <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.8125rem', lineHeight: 1.35 }}>
              {sintomasCriticos.map((s, idx) => (
                <li key={idx} style={{ fontWeight: 700 }}>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '10px',
            padding: '8px 12px',
            fontSize: '0.75rem',
            textAlign: 'center',
            lineHeight: 1.35,
          }}
        >
          <strong style={{ color: '#FFF' }}>RECOMENDACIÓN CRÍTICA:</strong> No tomés aspirina ni ibuprofeno. Mantenete hidratado/a con vida suero oral.
        </div>
      </div>

      {/* Action buttons */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flexShrink: 0,
          marginTop: 'auto',
        }}
      >
        <Button
          variante="blanco"
          tamano="grande"
          onClick={onVerMapa}
          style={{
            color: esGrave ? '#DC2626' : '#C2410C',
            fontWeight: 800,
            fontSize: '0.875rem',
            width: '100%',
            minHeight: '44px',
          }}
        >
          <MapPin size={18} />
          <span>BUSCAR HOSPITAL CERCANO</span>
        </Button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <a
            href={`tel:${NUMEROS_EMERGENCIA_NICARAGUA[0].numero}`}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '10px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontWeight: 800,
              fontSize: '0.8125rem',
            }}
            className="touch-feedback"
          >
            <Phone size={16} />
            <span>MINSA 102</span>
          </a>

          <a
            href={`tel:${NUMEROS_EMERGENCIA_NICARAGUA[1].numero}`}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '10px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontWeight: 800,
              fontSize: '0.8125rem',
            }}
            className="touch-feedback"
          >
            <Phone size={16} />
            <span>Cruz Roja 128</span>
          </a>
        </div>

        <button
          onClick={compartirUbicacion}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            color: '#FFFFFF',
            borderRadius: '12px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            fontSize: '0.78125rem',
            fontWeight: 700,
          }}
          className="touch-feedback"
        >
          <Share2 size={15} />
          <span>Compartir mi ubicación con mi familia</span>
        </button>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};
