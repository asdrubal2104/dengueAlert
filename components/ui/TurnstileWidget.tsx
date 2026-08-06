'use client';

import React, { useEffect, useRef } from 'react';

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
}

export const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({ onSuccess, onError, onExpire }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // Use refs for callbacks to prevent useEffect re-running when inline functions change on parent render
  const callbacksRef = useRef({ onSuccess, onError, onExpire });
  useEffect(() => {
    callbacksRef.current = { onSuccess, onError, onExpire };
  });

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    const scriptId = 'cloudflare-turnstile-script';
    let widgetId: string | null = null;

    const renderWidget = () => {
      if (window.turnstile && containerRef.current && !widgetId) {
        try {
          widgetId = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => callbacksRef.current.onSuccess(token),
            'error-callback': () => callbacksRef.current.onError?.(),
            'expired-callback': () => callbacksRef.current.onExpire?.(),
          });
        } catch (e) {
          console.error('Error rendering Turnstile widget:', e);
        }
      }
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    } else {
      renderWidget();
    }

    return () => {
      if (widgetId && window.turnstile?.remove) {
        window.turnstile.remove(widgetId);
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

  return <div ref={containerRef} style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }} />;
};

