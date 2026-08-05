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
      <Card style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-primary-soft)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <MapPin size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-text)' }}>
              Hospitales y Centros de Salud Cercanos
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              {ubicacion
                ? 'Calculado por tu ubicación GPS en tiempo real'
                : usuarioActual?.departamento
                ? `Priorizando red MINSA en ${usuarioActual.departamento}`
                : 'Mostrando principales unidades de salud MINSA'}
            </p>
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
            title="Actualizar ubicación GPS"
            className="touch-feedback"
          >
            <RefreshCw size={20} className={cargandoUbi ? 'pulso-alerta' : ''} />
          </button>
        </div>

        {errorUbi && (
          <div
            style={{
              marginTop: '12px',
              padding: '10px 14px',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '12px',
              fontSize: '0.8125rem',
              color: '#F59E0B',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              lineHeight: 1.4,
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0, color: '#F59E0B' }} />
            <span>
              {errorUbi}. Mostrando centros de salud ordenados por departamento ({usuarioActual?.departamento || 'Nicaragua'}).
            </span>
          </div>
        )}
      </Card>

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
