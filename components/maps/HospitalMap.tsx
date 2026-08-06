'use client';

import React, { useEffect, useState } from 'react';
import {
  HOSPITALES_NICARAGUA_SEED,
  HospitalNicaragua,
  solicitarUbicacionActual,
  calcularDistanciaKm,
  obtenerHospitalesCercanos,
} from '@/lib/geo/location';
import { useAppStore } from '@/stores/app-store';
import { MapPin, Navigation, Phone, RefreshCw, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';

export const HospitalMap: React.FC = () => {
  const usuarioActual = useAppStore((state) => state.usuarioActual);
  const [ubicacion, setUbicacion] = useState<{ lat: number; lng: number } | null>(null);
  const [cargandoUbi, setCargandoUbi] = useState(false);
  const [hospitales, setHospitales] = useState<HospitalNicaragua[]>(() =>
    obtenerHospitalesCercanos(undefined, undefined, usuarioActual?.departamento)
  );
  const [errorUbi, setErrorUbi] = useState<string | null>(null);

  const obtenerUbicacion = React.useCallback(async () => {
    setCargandoUbi(true);
    setErrorUbi(null);
    try {
      const coords = await solicitarUbicacionActual();
      setUbicacion(coords);

      const listaOrdenada = HOSPITALES_NICARAGUA_SEED.map((h) => ({
        ...h,
        distanciaKm: calcularDistanciaKm(coords.lat, coords.lng, h.latitud, h.longitud),
      })).sort((a, b) => (a.distanciaKm || 0) - (b.distanciaKm || 0));

      setHospitales(listaOrdenada);
    } catch (err: unknown) {
      setErrorUbi(err instanceof Error ? err.message : 'No se pudo obtener la ubicación GPS');
      setHospitales(obtenerHospitalesCercanos(undefined, undefined, usuarioActual?.departamento));
    } finally {
      setCargandoUbi(false);
    }
  }, [usuarioActual?.departamento]);

  useEffect(() => {
    obtenerUbicacion();
  }, [obtenerUbicacion]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Mandatory Location Request Card if location not active */}
      {!ubicacion ? (
        <Card
          style={{
            backgroundColor: 'var(--color-primary-soft)',
            border: '2px solid var(--color-primary)',
            borderRadius: '16px',
            padding: '18px',
          }}
        >
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 14px rgba(14, 165, 233, 0.3)',
              }}
            >
              <Navigation size={22} className={cargandoUbi ? 'pulso-alerta' : ''} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '4px' }}>
                📍 Permiso de Ubicación GPS Requerido
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                Para calcular la distancia exacta en kilómetros y dirigirte al centro de salud u hospital MINSA más cercano, es necesario otorgar acceso a tu ubicación GPS.
              </p>
            </div>
          </div>

          {errorUbi && (
            <div
              style={{
                marginTop: '12px',
                padding: '10px 12px',
                backgroundColor: 'var(--color-danger-soft)',
                border: '1px solid var(--color-danger)',
                borderRadius: '10px',
                fontSize: '0.78125rem',
                color: 'var(--color-danger)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                lineHeight: 1.4,
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>
                {errorUbi}. Hacé clic en el botón de abajo o habilitá el permiso de ubicación en tu navegador.
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={obtenerUbicacion}
            disabled={cargandoUbi}
            style={{
              width: '100%',
              marginTop: '14px',
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.875rem',
              cursor: cargandoUbi ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.35)',
            }}
            className="touch-feedback"
          >
            <Navigation size={18} />
            <span>{cargandoUbi ? 'Obteniendo GPS...' : 'Activar Ubicación GPS Ahora'}</span>
          </button>
        </Card>
      ) : (
        /* Status header when location IS active */
        <Card style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#22C55E',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <MapPin size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-text)' }}>
                  Ubicación GPS Activa
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  Hospitales ordenados de menor a mayor distancia en tiempo real
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={obtenerUbicacion}
              disabled={cargandoUbi}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
              }}
              title="Actualizar GPS"
              className="touch-feedback"
            >
              <RefreshCw size={18} className={cargandoUbi ? 'pulso-alerta' : ''} />
            </button>
          </div>
        </Card>
      )}

      {/* Lista interactiva de hospitales */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {hospitales.map((hosp) => (
          <Card key={hosp.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-text)' }}>
                  {hosp.nombre}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  {hosp.direccion} • {hosp.departamento}
                </p>
              </div>

              {hosp.distanciaKm !== undefined && (
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '999px',
                    backgroundColor: 'var(--color-primary-soft)',
                    color: 'var(--color-primary)',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    flexShrink: 0,
                  }}
                >
                  {hosp.distanciaKm.toFixed(1)} km
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <a
                href={`tel:${hosp.telefono}`}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--color-surface-1)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  textDecoration: 'none',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                }}
                className="touch-feedback"
              >
                <Phone size={14} style={{ color: 'var(--color-primary)' }} />
                <span>Llamar</span>
              </a>

              <a
                href={
                  ubicacion
                    ? `https://www.google.com/maps/dir/?api=1&origin=${ubicacion.lat},${ubicacion.lng}&destination=${hosp.latitud},${hosp.longitud}`
                    : `https://www.google.com/maps/dir/?api=1&destination=${hosp.latitud},${hosp.longitud}`
                }
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontSize: '0.8125rem',
                  fontWeight: 800,
                }}
                className="touch-feedback"
              >
                <Navigation size={14} />
                <span>Ir con GPS</span>
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
