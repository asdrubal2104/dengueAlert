'use client';

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

export interface TurnstileWidgetHandle {
  reset: () => void;
}

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
}

export const TurnstileWidget = forwardRef<TurnstileWidgetHandle, TurnstileWidgetProps>(
  ({ onSuccess, onError, onExpire }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    const [loadError, setLoadError] = useState(false);
    const widgetIdRef = useRef<string | null>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetIdRef.current && window.turnstile?.reset) {
          window.turnstile.reset(widgetIdRef.current);
        }
      }
    }));

  // Preserve callbacks in ref to avoid re-running effect on inline function prop changes
  const callbacksRef = useRef({ onSuccess, onError, onExpire });
  useEffect(() => {
    callbacksRef.current = { onSuccess, onError, onExpire };
  });

  useEffect(() => {
    if (!siteKey) return;

    const scriptId = 'cloudflare-turnstile-script';
    let checkInterval: NodeJS.Timeout | null = null;
    let isCancelled = false;
    const renderWidget = () => {
      if (isCancelled || !containerRef.current || widgetIdRef.current) return;

      if (window.turnstile) {
        try {
          // Clear container content before rendering to avoid duplicate or stacked widgets
          if (containerRef.current) {
            containerRef.current.innerHTML = '';
          }

          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              if (!isCancelled) callbacksRef.current.onSuccess(token);
            },
            'error-callback': () => {
              if (!isCancelled) callbacksRef.current.onError?.();
            },
            'expired-callback': () => {
              if (!isCancelled) {
                callbacksRef.current.onExpire?.();
                if (widgetIdRef.current && window.turnstile?.reset) {
                  window.turnstile.reset(widgetIdRef.current);
                }
              }
            },
          });

          if (checkInterval) clearInterval(checkInterval);
        } catch (e) {
          console.error('Error rendering Turnstile widget:', e);
          if (!isCancelled) setLoadError(true);
        }
      }
    };

    let existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!existingScript) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => renderWidget();
      script.onerror = () => {
        if (!isCancelled) setLoadError(true);
      };
      document.head.appendChild(script);
    } else {
      if (window.turnstile) {
        renderWidget();
      } else {
        existingScript.addEventListener('load', renderWidget);
      }
    }

    // Polling fallback to guarantee rendering when window.turnstile completes initialization
    let attempts = 0;
    checkInterval = setInterval(() => {
      attempts++;
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        renderWidget();
      }
      if (attempts > 50) { // 5 seconds max
        if (checkInterval) clearInterval(checkInterval);
      }
    }, 100);

    return () => {
      isCancelled = true;
      if (checkInterval) clearInterval(checkInterval);
      if (existingScript) {
        existingScript.removeEventListener('load', renderWidget);
      }
      if (widgetIdRef.current && window.turnstile?.remove) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // Ignore removal error on unmount
        }
      }
    };
  }, [siteKey]);

  if (!siteKey) {
    return (
      <div style={{ color: 'var(--color-danger)', fontSize: '14px', textAlign: 'center', padding: '10px', border: '1px dashed var(--color-danger)', borderRadius: '8px', margin: '12px 0' }}>
        ⚠️ Error de Configuración: Falta NEXT_PUBLIC_TURNSTILE_SITE_KEY
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={{ color: 'var(--color-danger)', fontSize: '13px', textAlign: 'center', padding: '8px', margin: '8px 0' }}>
        ⚠️ No se pudo cargar la verificación de seguridad. Por favor, refrescá la página.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '65px',
        margin: '12px 0',
      }}
    />
  );
});

TurnstileWidget.displayName = 'TurnstileWidget';
