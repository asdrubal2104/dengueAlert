/**
 * Helper para Google reCAPTCHA v3 (Invisible / Basado en Puntaje de Riesgo).
 * A diferencia de reCAPTCHA v2 (que obliga al usuario a marcar casillas de "No soy un robot" o resolver imágenes),
 * reCAPTCHA v3 corre 100% de forma invisible en segundo plano asignando un puntaje (0.0 a 1.0) sin interrumpir la experiencia.
 */

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export async function obtenerTokenRecaptchaV3(action: string = 'signup'): Promise<string | undefined> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!siteKey || typeof window === 'undefined') {
    return undefined;
  }

  return new Promise((resolve) => {
    const scriptId = 'recaptcha-v3-script';

    const ejecutar = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(async () => {
          try {
            const token = await window.grecaptcha?.execute(siteKey, { action });
            resolve(token);
          } catch {
            resolve(undefined);
          }
        });
      } else {
        resolve(undefined);
      }
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.onload = ejecutar;
      script.onerror = () => resolve(undefined);
      document.head.appendChild(script);
    } else {
      ejecutar();
    }
  });
}
