/**
 * Traduce mensajes de error comunes de Supabase Auth a español claro y amigable.
 */
export function traducirErrorSupabase(errorMsg?: string): string {
  if (!errorMsg) return 'Ocurrió un error inesperado. Por favor, intentá de nuevo.';

  const msg = errorMsg.toLowerCase();

  if (msg.includes('invalid login credentials')) {
    return 'Correo electrónico o contraseña incorrectos. Por favor, verificá tus datos.';
  }

  if (msg.includes('email not confirmed')) {
    return 'Debés confirmar tu correo electrónico antes de ingresar. Revisá tu bandeja de entrada.';
  }

  if (msg.includes('user already registered') || msg.includes('already exists')) {
    return 'Ya existe una cuenta registrada con este correo electrónico.';
  }

  if (msg.includes('password should be at least')) {
    return 'La contraseña es muy corta. Debe tener al menos 6 caracteres.';
  }

  if (msg.includes('rate limit') || msg.includes('too many requests')) {
    return 'Demasiados intentos seguidos. Por seguridad, esperá un minuto antes de reintentar.';
  }

  if (msg.includes('captcha protection') || msg.includes('captcha_token')) {
    return 'Fallo la verificación de seguridad (Captcha). Por favor, intentá nuevamente.';
  }

  if (msg.includes('user not found')) {
    return 'No encontramos ninguna cuenta registrada con este correo electrónico.';
  }

  if (msg.includes('network') || msg.includes('fetch failed')) {
    return 'Error de conexión a internet. Verificá tu red e intentá de nuevo.';
  }

  return errorMsg;
}
