---
name: buenas-practicas-ingenieria
description: |
  Estándares de ingeniería de software para el proyecto Dengue Alert.
  LEER OBLIGATORIAMENTE antes de escribir cualquier línea de código.
  Define principios SOLID, Clean Code, arquitectura, convenciones de
  naming, manejo de errores, testing y estructura de componentes.
  Toda contribución al proyecto DEBE cumplir estas prácticas.
---

# ⚙️ Buenas Prácticas de Ingeniería — Dengue Alert

## Stack Tecnológico

| Capa       | Tecnología                          | Versión          |
| :--------- | :---------------------------------- | :--------------- |
| Framework  | Next.js (App Router)                | 14+              |
| Lenguaje   | TypeScript                          | 5+ (strict mode) |
| Backend/DB | Supabase                            | latest           |
| Estilos    | Vanilla CSS (CSS Custom Properties) | -                |
| Estado UI  | Zustand                             | 4+               |
| Validación | Zod                                 | 3+               |
| Mapas      | Leaflet.js                          | 1.9+             |
| Testing    | Vitest + Testing Library            | latest           |
| Deploy     | Vercel (frontend) + Supabase Cloud  | -                |

---

## 1. Principios SOLID

### S — Single Responsibility Principle (SRP)

Cada módulo, clase o función tiene **una sola razón para cambiar**.

```typescript
// ❌ MAL — mezcla lógica de clasificación con lógica de UI
function SymptomForm() {
  const clasificar = (sintomas: string[]) => {
    // 40 líneas de lógica de negocio dentro del componente
  };
  return <form>...</form>;
}

// ✅ BIEN — separación de responsabilidades
// lib/dengue/clasificador.ts → solo lógica de clasificación
export function clasificarDengue(sintomas: SintomaId[]): Clasificacion { ... }

// components/sintomas/FormularioSintomas.tsx → solo UI
function FormularioSintomas() {
  const { clasificar } = useDengueClassifier();
  return <form>...</form>;
}
```

### O — Open/Closed Principle (OCP)

El sistema debe estar **abierto para extensión, cerrado para modificación**.
Preferir agregar nuevas funciones/componentes en lugar de modificar los existentes.

```typescript
// ✅ Usar composición para extender comportamiento
function TarjetaResultado({ clasificacion }: { clasificacion: Clasificacion }) {
  return (
    <div>
      <IconoClasificacion clasificacion={clasificacion} />
      <MensajeClasificacion clasificacion={clasificacion} />
      <AccionesClasificacion clasificacion={clasificacion} />
    </div>
  );
}
```

### L — Liskov Substitution Principle (LSP)

Los tipos derivados deben poder sustituir a sus tipos base sin romper el programa.
Respetar los contratos de TypeScript: **no usar `any`, no hacer type assertions sin validar**.

```typescript
// ❌ MAL
const datos = respuesta as DatosUsuario; // peligroso sin validación

// ✅ BIEN — validar con Zod antes de tipar
const resultado = PerfilSchema.safeParse(respuesta);
if (!resultado.success) throw new Error('Datos inválidos');
const datos: PerfilUsuario = resultado.data;
```

### I — Interface Segregation Principle (ISP)

Interfaces pequeñas y específicas, no una interfaz grande y genérica.

```typescript
// ❌ MAL
interface Usuario {
  nombre: string;
  codigoMinsa: string; // solo médicos
  especialidad: string; // solo médicos
  enfermedadesCronicas: string[]; // solo pacientes
}

// ✅ BIEN
interface PerfilBase {
  nombre: string;
  email: string;
}
interface PerfilPaciente extends PerfilBase {
  enfermedadesCronicas: Comorbilidad[];
}
interface PerfilMedico extends PerfilBase {
  codigoMinsa: string;
  especialidad: EspecialidadMedica;
}
```

### D — Dependency Inversion Principle (DIP)

Los módulos de alto nivel no dependen de módulos de bajo nivel. Ambos dependen de **abstracciones**.
Usar inyección de dependencias vía hooks y props.

```typescript
// ✅ El componente depende de la abstracción (hook), no de Supabase directamente
function HistorialPaciente({ pacienteId }: Props) {
  const { registros, loading, error } = useHistorialSintomas(pacienteId);
  // ...
}
```

---

## 2. Clean Code

### Naming — Convenciones del proyecto

| Elemento                   | Convención                   | Ejemplo                              |
| :------------------------- | :--------------------------- | :----------------------------------- |
| Archivos de componentes    | PascalCase                   | `TarjetaSintoma.tsx`                 |
| Archivos de utilidades/lib | kebab-case                   | `clasificador-dengue.ts`             |
| Variables y funciones      | camelCase                    | `calcularRiskScore()`                |
| Constantes                 | SCREAMING_SNAKE_CASE         | `MAX_SINTOMAS_SELECCIONADOS`         |
| Tipos e Interfaces         | PascalCase                   | `ClasificacionDengue`                |
| Enums                      | PascalCase + valores UPPER   | `enum Rol { PACIENTE = 'PACIENTE' }` |
| CSS Custom Properties      | kebab-case con prefijo `--`  | `--color-danger`                     |
| Hooks                      | camelCase con prefijo `use`  | `useClasificadorDengue`              |
| Stores Zustand             | camelCase con sufijo `Store` | `useAppStore`                        |
| Rutas Next.js              | kebab-case                   | `/registro-medico`, `/mis-sintomas`  |

### Nombres significativos

```typescript
// ❌ MAL — nombres crípticos
const d = calcD(ss);
const r = ss.filter((s) => s.c === 'W');

// ✅ BIEN — nombres que expresan intención
const clasificacion = calcularClasificacion(sintomasSeleccionados);
const signosDeAlarma = sintomasSeleccionados.filter((s) => s.categoria === 'WARNING');
```

### Funciones pequeñas y con un propósito

```typescript
// ✅ Cada función hace UNA cosa y su nombre lo describe
function tieneSintomasGraves(sintomas: SintomaId[]): boolean {
  return sintomas.some((id) => SINTOMAS_GRAVES.includes(id));
}

function tienSignosDeAlarma(sintomas: SintomaId[]): boolean {
  return sintomas.some((id) => SIGNOS_DE_ALARMA.includes(id));
}

function cumpleCriterioDengue(sintomas: SintomaId[]): boolean {
  const tieneFiebre = sintomas.includes('S01');
  const otrosSintomas = sintomas.filter((id) => id !== 'S01' && SINTOMAS_GENERALES.includes(id));
  return tieneFiebre && otrosSintomas.length >= 2;
}
```

### No más de 3-4 parámetros por función

```typescript
// ❌ MAL
function registrarEvaluacion(pacienteId, sintomas, dias, notas, ubicacion, fechaHora) { ... }

// ✅ BIEN — usar objeto
interface DatosEvaluacion {
  pacienteId: string;
  sintomasIds: SintomaId[];
  diasConSintomas: number;
  notas?: string;
}
function registrarEvaluacion(datos: DatosEvaluacion): Promise<EvaluacionGuardada> { ... }
```

### Evitar comentarios obvios; escribir código autoexplicativo

```typescript
// ❌ MAL — comentario que repite el código
// Incrementar contador
contador++;

// ✅ BIEN — comentar el POR QUÉ, no el QUÉ
// Según OMS 2009, la fiebre debe estar presente + mínimo 2 síntomas adicionales
// para clasificar como dengue sin signos de alarma
const cumpleCriterioOMS = tieneFiebre && sintomasAdicionales.length >= 2;
```

---

## 3. Arquitectura del Proyecto

### Separación de capas

```
UI (components/)
  ↓ llama a
Hooks (hooks/) ← maneja estado y side effects
  ↓ llama a
Servicios (lib/) ← lógica de negocio pura + acceso a datos
  ↓ llama a
Supabase Client (lib/supabase/)
```

**Reglas de capa:**

- Los componentes **nunca** llaman directamente a Supabase.
- Los componentes **nunca** contienen lógica de negocio (clasificación, validación de negocio).
- La lógica de clasificación de dengue vive en `lib/dengue/` y es **pura** (sin side effects).
- Los hooks son el "puente" entre UI y lógica de negocio.

### Server Components vs Client Components (Next.js App Router)

```typescript
// Server Component (por defecto en App Router)
// ✅ Usar para: fetch de datos, render inicial, SEO
// app/(paciente)/historial/page.tsx
export default async function PaginaHistorial() {
  const registros = await obtenerHistorial(); // fetch en servidor
  return <TimelineHistorial registros={registros} />;
}

// Client Component
// ✅ Usar SOLO cuando necesitás: useState, useEffect, event handlers, Web APIs
// components/sintomas/SelectorSintomas.tsx
'use client';
export function SelectorSintomas() {
  const [seleccionados, setSeleccionados] = useState<SintomaId[]>([]);
  // ...
}
```

**Regla:** Marcar `'use client'` solo cuando sea estrictamente necesario.
Preferir Server Components para reducir bundle size.

### Server Actions para mutaciones

```typescript
// app/actions/evaluaciones.ts
'use server';
import { z } from 'zod';

const EvaluacionSchema = z.object({
  sintomasIds: z.array(z.string()).min(1),
  diasConSintomas: z.number().min(1).max(7),
});

export async function guardarEvaluacion(formData: FormData) {
  // 1. Validar con Zod
  const datos = EvaluacionSchema.safeParse(...);
  if (!datos.success) return { error: 'Datos inválidos' };

  // 2. Verificar autenticación
  const usuario = await obtenerUsuarioActual();
  if (!usuario) return { error: 'No autenticado' };

  // 3. Ejecutar lógica de negocio
  const clasificacion = clasificarDengue(datos.data.sintomasIds);

  // 4. Guardar en DB
  await supabase.from('symptom_logs').insert({ ... });

  return { success: true, clasificacion };
}
```

---

## 4. TypeScript Estricto

### Configuración requerida en `tsconfig.json`

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Tipos centralizados

Todos los tipos compartidos viven en `types/` o junto al módulo que los define.

```typescript
// types/dengue.ts
export type SintomaId = 'S01' | 'S02' | ... | 'S25';
export type Clasificacion = 'BAJO_RIESGO' | 'DENGUE_POSIBLE' | 'DENGUE_ALARMA' | 'DENGUE_GRAVE';
export type Rol = 'PACIENTE' | 'MEDICO';

// types/nicaragua.ts
export type Departamento = 'Managua' | 'León' | 'Chinandega' | ...; // todos los 17+2
export type Silais = 'Managua' | 'León' | ...; // todos los 19
export type EspecialidadMedica = 'Médico General' | 'Medicina Interna' | ...;
```

### No usar `any` — nunca

```typescript
// ❌ PROHIBIDO
const datos: any = respuesta;
function procesar(input: any) { ... }

// ✅ Usar `unknown` y narrowing
function procesar(input: unknown): string {
  if (typeof input !== 'string') throw new Error('...');
  return input.trim();
}
```

---

## 5. Manejo de Errores

### Patrón Result para operaciones que pueden fallar

```typescript
// types/result.ts
export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

// lib/dengue/evaluaciones.ts
export async function guardarEvaluacion(datos: DatosEvaluacion): Promise<Result<Evaluacion>> {
  try {
    const { data, error } = await supabase.from('symptom_logs').insert(datos).select().single();
    if (error) return { success: false, error: new Error(error.message) };
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e : new Error('Error desconocido') };
  }
}
```

### Errores en la UI

- Nunca mostrar errores técnicos al usuario (`PG error: duplicate key...`).
- Traducir errores a mensajes en español amigables.
- Usar componentes de `Toast` o `ErrorBanner` para mostrar errores.
- Siempre dar al usuario una acción a seguir ("Intentar de nuevo", "Ir al inicio").

```typescript
// ✅ Error amigable en español
const MENSAJES_ERROR: Record<string, string> = {
  'auth/invalid-email': 'El correo electrónico no es válido.',
  'auth/email-already-in-use': 'Ya existe una cuenta con este correo.',
  'network-error': 'Sin conexión. Verificá tu internet e intentá de nuevo.',
  default: 'Ocurrió un error. Por favor intentá de nuevo.',
};
```

---

## 6. Validación con Zod

Validar **toda entrada de usuario** antes de procesar o enviar al servidor.

```typescript
// lib/validators/usuario.ts
import { z } from 'zod';

export const RegistroPacienteSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  nombreCompleto: z.string().min(2, 'Nombre muy corto').max(100),
  fechaNacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato: YYYY-MM-DD'),
  departamento: z.enum(DEPARTAMENTOS_NICARAGUA),
});

export const RegistroMedicoSchema = z.object({
  ...RegistroPacienteSchema.shape,
  codigoMinsa: z.string().min(3, 'Código MINSA inválido').max(20),
  especialidad: z.enum(ESPECIALIDADES_MEDICAS),
  unidadDeSalud: z.string().min(3).max(200),
  silais: z.enum(SILAIS_NICARAGUA),
  telefono: z.string().regex(/^\+?505\d{8}$/, 'Número de teléfono nicaragüense inválido'),
});
```

---

## 7. Estructura de Componentes

### Anatomía de un componente

```typescript
// components/sintomas/TarjetaSintoma.tsx
'use client';

// 1. Imports (externos → internos → tipos)
import { useState } from 'react';
import { Sintoma, SintomaId } from '@/types/dengue';
import estilos from './TarjetaSintoma.module.css'; // si se usa CSS modules

// 2. Types/Interfaces del componente
interface TarjetaSintomaProps {
  sintoma: Sintoma;
  seleccionado: boolean;
  onToggle: (id: SintomaId) => void;
}

// 3. Componente principal (arrow function)
export function TarjetaSintoma({ sintoma, seleccionado, onToggle }: TarjetaSintomaProps) {
  // 4. Hooks (al inicio, sin condicionales)

  // 5. Handlers (antes del return)
  const handleClick = () => onToggle(sintoma.id);

  // 6. Render
  return (
    <button
      type="button"
      onClick={handleClick}
      data-seleccionado={seleccionado}
      aria-pressed={seleccionado}
      className="tarjeta-sintoma"
    >
      <span className="tarjeta-sintoma__icono">{sintoma.icono}</span>
      <span className="tarjeta-sintoma__nombre">{sintoma.nombre}</span>
    </button>
  );
}
```

### Reglas de componentes

- Un archivo = un componente principal (pueden haber helpers internos).
- Props tipadas con `interface`, nunca `any`.
- Componentes presentacionales (sin lógica de negocio) son preferidos.
- Siempre incluir `aria-*` attributes para accesibilidad.
- Botones con `type="button"` explícito para evitar submit accidental en formularios.

---

## 8. Custom Hooks

```typescript
// hooks/useClasificador.ts
'use client';

import { useState, useCallback } from 'react';
import { clasificarDengue } from '@/lib/dengue/clasificador';
import type { SintomaId, Clasificacion } from '@/types/dengue';

interface EstadoClasificador {
  clasificacion: Clasificacion | null;
  riskScore: number;
  loading: boolean;
}

export function useClasificador() {
  const [estado, setEstado] = useState<EstadoClasificador>({
    clasificacion: null,
    riskScore: 0,
    loading: false,
  });

  const evaluar = useCallback((sintomasIds: SintomaId[], diasConSintomas: number) => {
    setEstado((prev) => ({ ...prev, loading: true }));
    const resultado = clasificarDengue(sintomasIds);
    setEstado({
      clasificacion: resultado.clasificacion,
      riskScore: resultado.riskScore,
      loading: false,
    });
    return resultado;
  }, []);

  const reiniciar = useCallback(() => {
    setEstado({ clasificacion: null, riskScore: 0, loading: false });
  }, []);

  return { ...estado, evaluar, reiniciar };
}
```

---

## 9. Testing

### Qué testear (prioridad alta → baja)

1. **Algoritmo de clasificación de dengue** → tests unitarios exhaustivos
2. **Validators (Zod schemas)** → probar edge cases
3. **Server Actions** → probar flujo feliz y errores
4. **Componentes críticos** → AlertOverlay, SelectorSintomas
5. **Flujos E2E** → registro, evaluar síntomas, ver resultado

### Estructura de tests

```typescript
// lib/dengue/__tests__/clasificador.test.ts
import { describe, it, expect } from 'vitest';
import { clasificarDengue } from '../clasificador';

describe('clasificarDengue — Algoritmo OMS 2009', () => {
  describe('DENGUE_GRAVE', () => {
    it('clasifica como GRAVE si hay al menos 1 síntoma severo', () => {
      expect(clasificarDengue(['S21']).clasificacion).toBe('DENGUE_GRAVE');
      expect(clasificarDengue(['S24']).clasificacion).toBe('DENGUE_GRAVE');
    });
    it('GRAVE prevalece sobre WARNING', () => {
      expect(clasificarDengue(['S11', 'S21']).clasificacion).toBe('DENGUE_GRAVE');
    });
  });

  describe('DENGUE_ALARMA', () => {
    it('clasifica como ALARMA si hay al menos 1 signo de alarma', () => {
      expect(clasificarDengue(['S01', 'S11']).clasificacion).toBe('DENGUE_ALARMA');
    });
  });

  describe('DENGUE_POSIBLE', () => {
    it('requiere fiebre + mínimo 2 síntomas generales', () => {
      expect(clasificarDengue(['S01', 'S02', 'S04']).clasificacion).toBe('DENGUE_POSIBLE');
    });
    it('solo fiebre no clasifica como dengue', () => {
      expect(clasificarDengue(['S01']).clasificacion).toBe('BAJO_RIESGO');
    });
    it('síntomas sin fiebre no clasifican como dengue', () => {
      expect(clasificarDengue(['S02', 'S03', 'S04']).clasificacion).toBe('BAJO_RIESGO');
    });
  });

  describe('BAJO_RIESGO', () => {
    it('sin síntomas es BAJO_RIESGO', () => {
      expect(clasificarDengue([]).clasificacion).toBe('BAJO_RIESGO');
    });
  });
});
```

---

## 10. Seguridad

- **Variables de entorno:** Nunca exponer claves al cliente. Solo `NEXT_PUBLIC_*` van al browser.
- **Supabase RLS:** Toda tabla tiene RLS activado. El código de acceso lo verifica en la DB.
- **Inputs sanitizados:** Usar Zod para validar antes de insertar en BD.
- **HTTPS obligatorio:** La app solo funciona en HTTPS (requerido por Geolocation API).
- **No logging de datos sensibles:** No hacer `console.log` de contraseñas, tokens o datos médicos.

---

## 11. Performance

- Usar `next/image` para imágenes (optimización automática).
- Lazy load componentes pesados (Leaflet, charts): `dynamic(() => import(...), { ssr: false })`.
- No cargar Leaflet en el servidor (es DOM-dependent).
- Usar `React.memo` solo cuando haya problema medido de re-renders.
- El catálogo de síntomas es estático → definirlo como `const` en el módulo, no en el estado.

---

## 12. Git y Commits

Usar **Conventional Commits** en español:

```
feat: agregar selector de síntomas con grid responsivo
fix: corregir clasificación cuando solo hay fiebre
chore: configurar supabase client con typescript
docs: agregar README con instrucciones de setup
test: agregar tests del clasificador de dengue
refactor: extraer lógica de alertas a hook useAlerta
style: aplicar design tokens al componente TarjetaSintoma
```

Branches:

- `main` → producción
- `develop` → integración
- `feature/nombre-feature` → desarrollo de features
