/**
 * Helper para Cloudflare Turnstile (Invisible / Gestionado).
 * Sistema antibot nativo de Supabase Auth, rápido, privado y 100% libre de puzzles.
 */

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          action?: string;
          callback: (token: string) => void;
          'error-callback'?: () => void;
        }
      ) => string;
      execute?: (container: string | HTMLElement, options?: any) => void;
      remove?: (widgetId: string) => void;
    };
  }
}

export async function obtenerTokenTurnstile(action: string = 'signup'): Promise<string | undefined> {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!siteKey || typeof window === 'undefined') {
    return undefined;
  }

  return new Promise((resolve) => {
    const scriptId = 'cloudflare-turnstile-script';

    const ejecutar = () => {
      if (window.turnstile) {
        try {
          const container = document.createElement('div');
          container.style.display = 'none';
          document.body.appendChild(container);

          window.turnstile.render(container, {
            sitekey: siteKey,
            action,
            callback: (token: string) => {
              if (document.body.contains(container)) {
                document.body.removeChild(container);
              }
              resolve(token);
            },
            'error-callback': () => {
              if (document.body.contains(container)) {
                document.body.removeChild(container);
              }
              resolve(undefined);
            },
          });
        } catch {
          resolve(undefined);
        }
      } else {
        resolve(undefined);
      }
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.onload = ejecutar;
      script.onerror = () => resolve(undefined);
      document.head.appendChild(script);
    } else {
      ejecutar();
    }
  });
}
