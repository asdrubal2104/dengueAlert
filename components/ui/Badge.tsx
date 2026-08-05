import React from 'react';
import { ClasificacionDengue } from '@/types/dengue';
import { ShieldCheck, AlertTriangle, ShieldAlert, Activity } from 'lucide-react';

interface BadgeProps {
  tipo?: ClasificacionDengue;
  clasificacion?: ClasificacionDengue;
  texto?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ tipo, clasificacion, texto, className = '' }) => {
  const t = (tipo || clasificacion || 'BAJO_RIESGO') as ClasificacionDengue;

  const getIconAndDefaultText = () => {
    switch (t) {
      case 'BAJO_RIESGO':
        return { icon: <ShieldCheck size={14} />, text: 'Bajo Riesgo' };
      case 'DENGUE_POSIBLE':
        return { icon: <Activity size={14} />, text: 'Sin Signos de Alarma' };
      case 'CONSULTA_MEDICA':
        return { icon: <Activity size={14} />, text: 'Consulta Médica' };
      case 'DENGUE_ALARMA':
        return { icon: <AlertTriangle size={14} />, text: 'Con Signos de Alarma' };
      case 'DENGUE_GRAVE':
        return { icon: <ShieldAlert size={14} />, text: '¡Dengue Grave!' };
      default:
        return { icon: null, text: String(t) };
    }
  };

  const { icon, text } = getIconAndDefaultText();

  return (
    <span className={`badge ${className}`} data-tipo={t}>
      {icon}
      <span>{texto || text}</span>
    </span>
  );
};
