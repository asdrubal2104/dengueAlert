import { ClasificacionDengue } from '@/types/dengue';

/**
 * Solicita permiso al usuario para notificaciones nativas del sistema operativo.
 */
export async function solicitarPermisoNotificaciones(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

/**
 * Envía una notificación nativa si la clasificación es DENGUE_ALARMA o DENGUE_GRAVE.
 */
export async function enviarNotificacionAlerta(
  clasificacion: ClasificacionDengue,
  sintomasCriticos: string[] = []
): Promise<void> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  if (Notification.permission !== 'granted') {
    const otorgado = await solicitarPermisoNotificaciones();
    if (!otorgado) return;
  }

  const esGrave = clasificacion === 'DENGUE_GRAVE';
  const esAlarma = clasificacion === 'DENGUE_ALARMA';

  if (!esGrave && !esAlarma) return;

  const titulo = esGrave
    ? '🚨 ¡ALERTA CRÍTICA: DENGUE GRAVE DETECTADO!'
    : '⚠️ ALERTA DE SALUD: SIGNOS DE ALARMA DETECTADOS';

  const cuerpo = esGrave
    ? `Presentás signos de dengue grave (${sintomasCriticos.join(', ')}). Acudí inmediatamente a un hospital.`
    : `Se detectaron signos de alarma (${sintomasCriticos.join(', ')}). Necesitás atención médica hoy.`;

  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(titulo, {
        body: cuerpo,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: 'dengue-alert',
        data: { url: '/alerta' },
      });
    } else {
      new Notification(titulo, {
        body: cuerpo,
        icon: '/icons/icon-192.png',
      });
    }
  } catch (error) {
    console.error('Error al emitir notificación web:', error);
  }
}
