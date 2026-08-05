---
name: ui-ux-design-system
description: |
  Sistema de diseño completo de Dengue Alert. Define tokens de diseño,
  tipografía, colores, espaciado, componentes, patrones de UX, y reglas
  de interacción. LEER OBLIGATORIAMENTE antes de crear o modificar cualquier
  componente visual, pantalla, o estilo CSS. Garantiza coherencia visual
  en toda la app. No implementar diseño que contradiga estas especificaciones.
---

# 🎨 Sistema de Diseño — Dengue Alert

> **Principio guía:** Diseño premium, moderno y empático. El usuario puede
> estar enfermo. Cada decisión de diseño debe reducir la fricción y
> transmitir calma, claridad y urgencia cuando corresponda.

---

## 1. Tokens de Diseño (CSS Custom Properties)

Todos los valores de diseño se definen como custom properties en `:root`.
**NUNCA usar valores hardcoded en el CSS de componentes.**

### 1.1 Paleta de Colores y Accesibilidad (WCAG AAA/AA)

```css
:root {
  /* ── Colores de Marca ── */
  --color-primary: hsl(197, 85%, 38%); /* Azul médico con alto contraste */
  --color-primary-light: hsl(197, 85%, 95%); /* Fondo primario suave */
  --color-primary-dark: hsl(197, 90%, 25%); /* Hover/active primario */
  --color-primary-rgb: 14, 134, 180;

  /* ── Colores de Estado Clínico ── */
  --color-bajo-riesgo: hsl(152, 65%, 38%); /* Verde clínico */
  --color-bajo-riesgo-bg: hsl(152, 55%, 95%);
  --color-bajo-riesgo-dark: hsl(152, 70%, 22%);

  --color-dengue-posible: hsl(43, 96%, 45%); /* Amarillo/Dorado visible */
  --color-dengue-posible-bg: hsl(43, 96%, 94%);
  --color-dengue-posible-dark: hsl(43, 96%, 25%);

  --color-dengue-alarma: hsl(25, 95%, 48%); /* Naranja de alerta */
  --color-dengue-alarma-bg: hsl(25, 95%, 94%);
  --color-dengue-alarma-dark: hsl(25, 95%, 28%);

  --color-dengue-grave: hsl(0, 85%, 52%); /* Rojo de emergencia */
  --color-dengue-grave-bg: hsl(0, 84%, 96%);
  --color-dengue-grave-dark: hsl(0, 84%, 30%);

  /* ── Escala de Grises (Superficies y Texto) ── */
  --color-surface: hsl(210, 20%, 98%);
  --color-surface-card: hsl(0, 0%, 100%);
  --color-surface-hover: hsl(210, 20%, 94%);
  --color-surface-overlay: hsla(220, 26%, 10%, 0.6);

  --color-border: hsl(220, 16%, 86%);
  --color-border-focus: var(--color-primary);

  --color-text: hsl(220, 26%, 12%); /* Contraste >14:1 en modo claro */
  --color-text-secondary: hsl(220, 16%, 35%); /* Contraste >7:1 en modo claro */
  --color-text-muted: hsl(220, 12%, 48%);
  --color-text-on-primary: hsl(0, 0%, 100%);
  --color-text-on-dark: hsl(0, 0%, 100%);

  /* ── Dark Mode Alta Legibilidad (WCAG AAA) ── */
  --color-surface-dark-mode: hsl(222, 28%, 10%);
  --color-surface-card-dark-mode: hsl(222, 24%, 15%);
  --color-surface-hover-dark-mode: hsl(222, 22%, 22%);
  --color-text-dark-mode: hsl(0, 0%, 98%); /* Contraste máximo */
  --color-text-secondary-dark-mode: hsl(215, 20%, 82%); /* Alta legibilidad */
  --color-text-muted-dark-mode: hsl(215, 15%, 68%);
  --color-border-dark-mode: hsl(220, 20%, 32%);
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-surface: var(--color-surface-dark-mode);
    --color-surface-card: var(--color-surface-card-dark-mode);
    --color-surface-hover: var(--color-surface-hover-dark-mode);
    --color-text: var(--color-text-dark-mode);
    --color-text-secondary: var(--color-text-secondary-dark-mode);
    --color-text-muted: var(--color-text-muted-dark-mode);
    --color-border: var(--color-border-dark-mode);

    --color-primary: hsl(197, 85%, 55%);
    --color-primary-light: hsla(197, 85%, 22%, 0.8);
    --color-primary-dark: hsl(197, 90%, 85%);

    --color-bajo-riesgo: hsl(152, 65%, 45%);
    --color-bajo-riesgo-bg: hsla(152, 60%, 18%, 0.8);
    --color-bajo-riesgo-dark: hsl(152, 70%, 88%);

    --color-dengue-posible: hsl(43, 96%, 54%);
    --color-dengue-posible-bg: hsla(43, 90%, 20%, 0.8);
    --color-dengue-posible-dark: hsl(43, 96%, 88%);

    --color-dengue-alarma: hsl(25, 95%, 58%);
    --color-dengue-alarma-bg: hsla(25, 90%, 20%, 0.85);
    --color-dengue-alarma-dark: hsl(25, 95%, 88%);

    --color-dengue-grave: hsl(0, 85%, 62%);
    --color-dengue-grave-bg: hsla(0, 85%, 20%, 0.85);
    --color-dengue-grave-dark: hsl(0, 90%, 90%);
  }
}
```

### 1.2 Tipografía

```css
:root {
  /* ── Familias de fuente ── */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace; /* para datos numéricos */

  /* ── Escala tipográfica (rem, base 16px) ── */
  --text-xs: 0.75rem; /* 12px — etiquetas, badges */
  --text-sm: 0.875rem; /* 14px — texto auxiliar, inputs pequeños */
  --text-base: 1rem; /* 16px — cuerpo principal */
  --text-lg: 1.125rem; /* 18px — texto destacado */
  --text-xl: 1.25rem; /* 20px — subtítulos */
  --text-2xl: 1.5rem; /* 24px — títulos de sección */
  --text-3xl: 1.875rem; /* 30px — títulos de página */
  --text-4xl: 2.25rem; /* 36px — hero / pantallas de alerta */
  --text-5xl: 3rem; /* 48px — números de emergencia, impacto visual */

  /* ── Pesos ── */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;

  /* ── Altura de línea ── */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
}
```

**Fuente requerida en `layout.tsx`:**

```typescript
import { Inter } from 'next/font/google';
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});
```

### 1.3 Espaciado

Sistema de espaciado basado en múltiplos de 4px:

```css
:root {
  --space-1: 0.25rem; /*  4px */
  --space-2: 0.5rem; /*  8px */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem; /* 16px — unidad base */
  --space-5: 1.25rem; /* 20px */
  --space-6: 1.5rem; /* 24px */
  --space-8: 2rem; /* 32px */
  --space-10: 2.5rem; /* 40px */
  --space-12: 3rem; /* 48px */
  --space-16: 4rem; /* 64px */
  --space-20: 5rem; /* 80px */
  --space-24: 6rem; /* 96px */
}
```

### 1.4 Border Radius

```css
:root {
  --radius-sm: 0.375rem; /*  6px — inputs, badges */
  --radius-md: 0.75rem; /* 12px — botones */
  --radius-lg: 1rem; /* 16px — tarjetas */
  --radius-xl: 1.5rem; /* 24px — tarjetas grandes, modales */
  --radius-2xl: 2rem; /* 32px — elementos hero */
  --radius-full: 9999px; /* píldoras, avatares */
}
```

### 1.5 Sombras

```css
:root {
  --shadow-sm: 0 1px 3px hsla(220, 26%, 10%, 0.08), 0 1px 2px hsla(220, 26%, 10%, 0.06);
  --shadow-md: 0 4px 6px hsla(220, 26%, 10%, 0.07), 0 2px 4px hsla(220, 26%, 10%, 0.06);
  --shadow-lg: 0 10px 15px hsla(220, 26%, 10%, 0.1), 0 4px 6px hsla(220, 26%, 10%, 0.05);
  --shadow-xl: 0 20px 25px hsla(220, 26%, 10%, 0.1), 0 8px 10px hsla(220, 26%, 10%, 0.04);
  --shadow-card: 0 2px 8px hsla(220, 26%, 10%, 0.08);
  --shadow-float: 0 8px 30px hsla(220, 26%, 10%, 0.12);
}
```

### 1.6 Transiciones y Animaciones

```css
:root {
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
  --transition-spring: 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Animación de pulso para alertas */
@keyframes pulso-alerta {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.85;
    transform: scale(1.02);
  }
}

/* Animación de entrada desde abajo (modales, sheets) */
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Animación de entrada desde la derecha (navegación) */
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Fade in simple */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Shake para errores */
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20%,
  60% {
    transform: translateX(-4px);
  }
  40%,
  80% {
    transform: translateX(4px);
  }
}
```

### 1.7 Z-Index Scale

```css
:root {
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-fixed: 300;
  --z-modal: 400;
  --z-popover: 500;
  --z-toast: 600;
  --z-alert: 700; /* Pantalla de emergencia — por encima de todo */
}
```

---

## 2. Breakpoints y Layout

### Mobile-First (la prioridad)

```css
/* Mobile: 320px – 767px (diseño base, sin media query) */
/* Tablet: 768px – 1023px */
@media (min-width: 768px) {
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
}
```

### Layout base de la app

```
┌─────────────────────────┐
│ TopBar (56px, sticky)   │
├─────────────────────────┤
│                         │
│   Contenido Principal   │
│   (max-width: 480px     │
│    centrado en desktop) │
│   padding: 0 16px       │
│                         │
├─────────────────────────┤
│ BottomNav (56px, fixed) │
└─────────────────────────┘
```

```css
.app-layout {
  min-height: 100dvh; /* dvh para móviles con barras de navegación */
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
}

.contenido-principal {
  flex: 1;
  width: 100%;
  max-width: 480px; /* contenedor centrado en desktop */
  margin: 0 auto;
  padding: var(--space-4);
  padding-bottom: calc(56px + var(--space-4)); /* espacio para bottom nav */
}
```

---

## 3. Componentes Base

### 3.1 Botones

```css
/* Botón base */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  min-height: 48px; /* MÍNIMO OBLIGATORIO para touch targets */
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  line-height: 1;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-base);
  text-decoration: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

/* Variante primaria */
.btn-primario {
  background: var(--color-primary);
  color: var(--color-text-on-primary);
}
.btn-primario:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.btn-primario:active {
  transform: translateY(0);
  box-shadow: none;
}

/* Variante secundaria (outlined) */
.btn-secundario {
  background: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}
.btn-secundario:hover {
  background: var(--color-primary-light);
}

/* Variante fantasma (ghost) */
.btn-fantasma {
  background: transparent;
  color: var(--color-text-secondary);
}
.btn-fantasma:hover {
  background: var(--color-surface-hover);
}

/* Variante de peligro/emergencia */
.btn-peligro {
  background: var(--color-dengue-grave);
  color: var(--color-text-on-dark);
}
.btn-peligro:hover {
  background: var(--color-dengue-grave-dark);
}

/* Tamaño grande para emergencias */
.btn-grande {
  min-height: 60px;
  font-size: var(--text-lg);
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-lg);
  width: 100%;
}

/* Estado deshabilitado */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Estado de carga */
.btn-cargando {
  pointer-events: none;
  opacity: 0.8;
}
```

### 3.2 Tarjetas

```css
.tarjeta {
  background: var(--color-surface-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-card);
  padding: var(--space-4);
}

.tarjeta-elevada {
  box-shadow: var(--shadow-lg);
}

/* Tarjeta interactiva (clickeable) */
.tarjeta-interactiva {
  cursor: pointer;
  transition: all var(--transition-base);
}
.tarjeta-interactiva:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
.tarjeta-interactiva:active {
  transform: translateY(0);
}
```

### 3.3 Tarjetas de Síntomas

```css
.tarjeta-sintoma {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3);
  min-height: 90px;
  background: var(--color-surface-card);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-spring);
  text-align: center;
  -webkit-tap-highlight-color: transparent;
}

.tarjeta-sintoma__icono {
  font-size: 1.75rem;
  line-height: 1;
}

.tarjeta-sintoma__nombre {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  line-height: var(--leading-tight);
}

/* Estado seleccionado — síntoma general */
.tarjeta-sintoma[data-seleccionado='true'] {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  transform: scale(1.03);
}
.tarjeta-sintoma[data-seleccionado='true'] .tarjeta-sintoma__nombre {
  color: var(--color-primary-dark);
  font-weight: var(--font-semibold);
}

/* Estado seleccionado — signo de alarma (warning) */
.tarjeta-sintoma[data-categoria='WARNING'][data-seleccionado='true'] {
  border-color: var(--color-dengue-alarma);
  background: var(--color-dengue-alarma-bg);
  animation: pulso-alerta 1.5s ease-in-out infinite;
}

/* Estado seleccionado — signo grave (severe) */
.tarjeta-sintoma[data-categoria='SEVERE'][data-seleccionado='true'] {
  border-color: var(--color-dengue-grave);
  background: var(--color-dengue-grave-bg);
  animation: pulso-alerta 1s ease-in-out infinite;
}

/* Hover */
.tarjeta-sintoma:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

/* Grid del selector */
.grid-sintomas {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}
@media (min-width: 400px) {
  .grid-sintomas {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 3.4 Inputs y Formularios

```css
.campo-formulario {
  display: flex;
  flex-direction: column;
  gap: var(--space-1-5);
}

.etiqueta {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text);
}

.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  min-height: 48px;
  background: var(--color-surface-card);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  color: var(--color-text);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  outline: none;
}
.input::placeholder {
  color: var(--color-text-muted);
}
.input:focus,
.input:focus-visible {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px hsla(197, 85%, 50%, 0.25);
}
.input:focus {
  border-color: var(--color-border-focus);
}
.input:invalid:not(:placeholder-shown) {
  border-color: var(--color-dengue-grave);
}

.select {
  appearance: none;
  background-image: url('data:image/svg+xml,...'); /* flecha */
  background-repeat: no-repeat;
  background-position: right var(--space-3) center;
  padding-right: var(--space-10);
}

.texto-error {
  font-size: var(--text-sm);
  color: var(--color-dengue-grave);
}

.texto-ayuda {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
```

### 3.5 Bottom Navigation (Paciente)

```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: var(--color-surface-card);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: var(--z-fixed);
  padding-bottom: env(safe-area-inset-bottom); /* notch de iPhone */
}

.bottom-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2);
  min-width: 56px;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color var(--transition-fast);
  border-radius: var(--radius-md);
}

.bottom-nav__item[data-activo='true'] {
  color: var(--color-primary);
}

.bottom-nav__icono {
  font-size: 1.25rem;
}
.bottom-nav__label {
  font-size: 0.625rem;
  font-weight: var(--font-medium);
}
```

### 3.6 TopBar

```css
.topbar {
  position: sticky;
  top: 0;
  height: 56px;
  background: var(--color-surface-card);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  padding: 0 var(--space-4);
  gap: var(--space-3);
  z-index: var(--z-sticky);
}

.topbar__titulo {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text);
  flex: 1;
}

.topbar__logo {
  font-size: var(--text-xl);
  font-weight: var(--font-extrabold);
  color: var(--color-primary);
}
```

### 3.7 Gauge de Riesgo

```css
.gauge-riesgo {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.gauge-riesgo__barra-contenedor {
  height: 8px;
  background: var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.gauge-riesgo__barra-relleno {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(
    to right,
    var(--color-bajo-riesgo),
    var(--color-dengue-posible),
    var(--color-dengue-alarma),
    var(--color-dengue-grave)
  );
}

.gauge-riesgo__etiqueta {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.gauge-riesgo__puntaje {
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  font-family: var(--font-mono);
}
```

### 3.8 Badges / Chips de Clasificación

```css
.badge-clasificacion {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
}

.badge-clasificacion[data-tipo='BAJO_RIESGO'] {
  background: var(--color-bajo-riesgo-bg);
  color: var(--color-bajo-riesgo-dark);
}
.badge-clasificacion[data-tipo='DENGUE_POSIBLE'] {
  background: var(--color-dengue-posible-bg);
  color: var(--color-dengue-posible-dark);
}
.badge-clasificacion[data-tipo='DENGUE_ALARMA'] {
  background: var(--color-dengue-alarma-bg);
  color: var(--color-dengue-alarma-dark);
}
.badge-clasificacion[data-tipo='DENGUE_GRAVE'] {
  background: var(--color-dengue-grave-bg);
  color: var(--color-dengue-grave-dark);
}
```

### 3.9 Overlay de Alerta de Emergencia

```css
.overlay-emergencia {
  position: fixed;
  inset: 0;
  z-index: var(--z-alert);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  gap: var(--space-6);
  animation: fade-in var(--transition-base);
}

.overlay-emergencia[data-tipo='DENGUE_ALARMA'] {
  background: var(--color-dengue-alarma);
}

.overlay-emergencia[data-tipo='DENGUE_GRAVE'] {
  background: var(--color-dengue-grave);
  animation: pulso-alerta 1.5s ease-in-out infinite;
}

.overlay-emergencia__icono {
  font-size: 5rem;
  animation: pulso-alerta 1s ease-in-out infinite;
}

.overlay-emergencia__titulo {
  font-size: var(--text-3xl);
  font-weight: var(--font-extrabold);
  color: var(--color-text-on-dark);
  text-align: center;
}

.overlay-emergencia__mensaje {
  font-size: var(--text-lg);
  color: hsla(0, 0%, 100%, 0.9);
  text-align: center;
  line-height: var(--leading-relaxed);
}
```

### 3.10 Toast Notifications

```css
.toast-contenedor {
  position: fixed;
  bottom: calc(56px + var(--space-4)); /* encima del bottom nav */
  left: var(--space-4);
  right: var(--space-4);
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-text);
  color: var(--color-text-on-dark);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  animation: slide-up var(--transition-base);
  pointer-events: all;
}

.toast[data-tipo='error'] {
  background: var(--color-dengue-grave);
}
.toast[data-tipo='success'] {
  background: var(--color-bajo-riesgo);
}
.toast[data-tipo='warning'] {
  background: var(--color-dengue-alarma);
}
```

---

## 4. Patrones de UX

### 4.1 Formularios de Registro

- **Un campo por fila** en mobile.
- **Label visible siempre** (no usar solo placeholder como label).
- **Feedback inmediato de error** al salir del campo (`onBlur`), no solo al submit.
- **Progress indicator** si hay múltiples pasos: `Paso 1 de 2`.
- **Botón CTA sticky** en la parte inferior en mobile.
- **Teclado numérico** para campos de teléfono y código MINSA: `inputMode="numeric"`.
- **Autocompletado** habilitado: `autocomplete="email"`, `autocomplete="name"`, etc.

### 4.2 Selector de Síntomas

- **Grid de 2 columnas en mobile** (≥320px), 3 columnas en mobile grande (≥400px).
- **Scroll largo** con secciones separadas: "Síntomas Generales" y "Signos de Alarma".
- **Barra sticky inferior** con: conteo de seleccionados + botón "Ver mi resultado".
- El botón "Ver mi resultado" se **activa solo si hay ≥1 síntoma seleccionado**.
- Retroalimentación háptica en dispositivos que la soporten: `navigator.vibrate(50)`.
- Al seleccionar un signo de alarma (WARNING/SEVERE): mostrar **mini alerta inline**:
  _"⚠️ Este es un signo de alarma. Si lo tenés, buscá atención médica."_

### 4.3 Pantallas de Resultado

- **Color del fondo** de la pantalla cambia según la clasificación.
- La clasificación se muestra como el **elemento más grande** (foco visual principal).
- El gauge de riesgo es secundario (más pequeño, debajo de la clasificación).
- Los síntomas seleccionados se listan en un accordion colapsado por defecto.
- El **disclaimer médico** aparece siempre, pero en texto pequeño al final.
- Botones de acción grandes y claros.

### 4.4 Pantalla de Emergencia (Overlay)

- Ocupa **toda la pantalla** (full screen overlay).
- Fondo del color de la clasificación (naranja o rojo).
- Texto blanco, fuente grande.
- **Máximo 3 acciones** visibles (los botones más críticos primero).
- Botón "X" para cerrar/volver (siempre presente, aunque insista en ir al médico).
- Vibración del dispositivo al aparecer: `navigator.vibrate([200, 100, 200])`.

### 4.5 Estados de Carga

- **Skeleton loading** para listas de pacientes, historial.
- **Spinner** solo para acciones puntuales (guardar, procesar).
- **No bloquear la UI** con overlays de carga en acciones que toman <300ms.
- Mensajes de carga en español: "Cargando...", "Guardando...", "Procesando...".

### 4.6 Estados Vacíos

```
┌─────────────────────────┐
│                         │
│    🩺                   │
│                         │
│  Todavía no tenés       │
│  evaluaciones           │
│                         │
│  [Evaluar mis síntomas] │
│                         │
└─────────────────────────┘
```

Siempre incluir: ilustración emoji, texto explicativo, CTA (call to action).

### 4.7 Accesibilidad (A11y)

- Todos los botones tienen `aria-label` si no tienen texto visible.
- Las tarjetas de síntomas usan `role="checkbox"` y `aria-checked`.
- Contraste mínimo: **4.5:1** para texto normal, **3:1** para texto grande.
- Focus visible con outline: `outline: 2px solid var(--color-primary); outline-offset: 2px;`
- Nunca ocultar el outline de focus (no `outline: none` sin alternativa).
- Touch targets **mínimo 48×48px** para todos los elementos interactivos.

---

## 5. Iconografía

**Íconos de síntomas:** emojis (universales, sin librería).

**Íconos de navegación:** usar `lucide-react` con tamaño 24px.

```typescript
import { Home, Activity, Clock, User, Bell, ChevronRight } from 'lucide-react';
```

**Íconos de estado clínico:**

| Estado           | Emoji | Uso                       |
| :--------------- | :---- | :------------------------ |
| Bajo riesgo      | ✅    | Badge, pantalla resultado |
| Dengue posible   | ⚠️    | Badge, pantalla resultado |
| Signos de alarma | 🚨    | Badge, pantalla alerta    |
| Dengue grave     | 🔴    | Badge, overlay emergencia |
| Médico           | 👨‍⚕️👩‍⚕️  | Perfiles, dashboard       |
| Hospital         | 🏥    | Mapa, botones de acción   |
| Ambulancia       | 🚑    | Pantalla de emergencia    |
| Teléfono         | 📞    | Botones de llamada        |

---

## 6. Landing Page

La landing page es la primera impresión. Debe:

- Comunicar el propósito en **una sola pantalla sin scroll**.
- CTA principal: "Evaluar mis síntomas" (botón primario grande).
- CTA secundaria: "Soy médico, registrarme" (texto link o botón fantasma).
- Incluir: logo, nombre de la app, tagline, 3 puntos de valor, CTA.
- Fondo: gradiente suave de `--color-primary` a `--color-primary-dark` o imagen de fondo.
- **NO mostrar el selector de síntomas sin estar logueado.**

---

## 7. Reglas Absolutas (No romper)

1. **Min height de touch targets: 48px** — SIEMPRE.
2. **No valores hardcoded en CSS** — usar tokens.
3. **Mobile first** — el diseño base es para 320px+.
4. **Feedback de error en español** — nunca en inglés al usuario.
5. **El overlay de emergencia es full screen** — no puede ser un modal pequeño.
6. **Disclaimer médico en TODAS las pantallas de resultado** — sin excepción.
7. **Colores de clasificación** — no cambiar. Son médicamente significativos.
8. **Fondo de pantalla de alerta = color de clasificación** — inmersivo.
9. **Bottom nav fijo** en mobile para pacientes — siempre accesible.
10. **No usar tablas en mobile** — usar listas o cards en su lugar.
