---
name: reglas-de-negocio
description: |
  Reglas de negocio oficiales de la aplicación Dengue Alert.
  LEER OBLIGATORIAMENTE antes de implementar cualquier feature, flujo de usuario,
  lógica de clasificación, acceso a datos o pantalla. Estas reglas son la fuente
  de verdad del sistema. No implementar nada que las contradiga.
---

# 📋 Reglas de Negocio — Dengue Alert

## Contexto del Proyecto

Dengue Alert es una **PWA médica de nivel universitario** diseñada para Nicaragua.
Su propósito es ayudar a pacientes a identificar síntomas del dengue y alertarles
sobre signos de alarma, y permitir a médicos dar seguimiento a sus pacientes.

> **Audiencia del sistema:** Pacientes nicaragüenses (posiblemente enfermos, con
> bajo nivel tecnológico) y médicos registrados ante el MINSA de Nicaragua.
>
> **Idioma:** Solo español. Ningún texto en inglés visible al usuario.

---

## RN-001 — Roles de Usuario

El sistema tiene exactamente **dos roles de usuario**:

| Rol        | Descripción                                                |
| :--------- | :--------------------------------------------------------- |
| `PACIENTE` | Persona que reporta síntomas y recibe evaluaciones         |
| `MEDICO`   | Profesional de salud registrado ante el MINSA de Nicaragua |

- No existe rol de administrador en el MVP.
- El rol se asigna en el momento del registro y **no puede cambiarse**.
- Una misma cuenta no puede ser paciente y médico a la vez.

---

## RN-002 — Registro de Pacientes

### Datos obligatorios al registro (mínimos):

1. Correo electrónico (único en el sistema)
2. Contraseña
3. Nombre completo
4. Fecha de nacimiento
5. Departamento de Nicaragua

### Datos opcionales (perfil médico del paciente, completable después):

- Teléfono
- Tipo de sangre
- Peso en kg
- Enfermedades crónicas (multiselect)
- Medicamentos actuales (texto libre)

### Regla crítica:

> El paciente DEBE poder llegar a la pantalla de selección de síntomas
> habiendo completado solo los 5 campos obligatorios. **NO bloquear el
> uso de la app por falta de datos del perfil médico.**

---

## RN-003 — Registro de Médicos

### Datos obligatorios al registro:

1. Correo electrónico (único en el sistema)
2. Contraseña
3. Nombre completo (con título: "Dr./Dra.")
4. Código MINSA (código sanitario emitido por la ANRS/MINSA Nicaragua)
5. Especialidad médica (selección de lista oficial)
6. Unidad de salud / Hospital donde labora
7. SILAIS al que pertenece
8. Teléfono de contacto

### Validación del Código MINSA:

> Para el MVP universitario, el Código MINSA es un campo de texto libre
> numérico. **No se valida contra sistemas externos.** El sistema confía
> en que el médico ingresa su código real.

### Especialidades válidas (lista oficial):

- Médico General
- Medicina Interna
- Pediatría
- Ginecología y Obstetricia
- Cirugía General
- Anestesiología
- Ortopedia y Traumatología
- Radiología e Imagenología
- Patología
- Dermatología
- Infectología
- Medicina Crítica / Intensivista
- Nefrología
- Neonatología
- Oncología
- Epidemiología
- Otra (con campo de texto para especificar)

### SILAIS válidos (Nicaragua — 19 SILAIS):

Boaco, Carazo, Chinandega, Chontales, Estelí, Granada, Jinotega, León,
Madriz, Managua, Masaya, Matagalpa, Nueva Segovia, RACCN, RACCS,
Río San Juan, Rivas, Las Minas, Zelaya Central

---

## RN-004 — Evaluación de Síntomas

### RN-004.1 — Catálogo de síntomas

El sistema maneja exactamente **25 síntomas** organizados en 3 categorías.
El catálogo es fijo (hardcoded en el frontend). No es configurable por usuarios.

**Categoría GENERAL (síntomas #1–#10, peso 1-3):**

| ID  | Síntoma                         | Peso |
| --- | ------------------------------- | ---- |
| S01 | Fiebre (≥38°C)                  | 3    |
| S02 | Dolor de cabeza intenso         | 2    |
| S03 | Dolor detrás de los ojos        | 2    |
| S04 | Dolor muscular                  | 2    |
| S05 | Dolor en articulaciones         | 2    |
| S06 | Náuseas                         | 1    |
| S07 | Vómitos                         | 2    |
| S08 | Sarpullido / Manchas en la piel | 2    |
| S09 | Cansancio extremo               | 1    |
| S10 | Falta de apetito                | 1    |

**Categoría WARNING — Signos de ALARMA (#11–#20, peso 7-9):**

| ID  | Signo                                          | Peso |
| --- | ---------------------------------------------- | ---- |
| S11 | Dolor abdominal intenso y persistente          | 8    |
| S12 | Vómitos persistentes (3+ veces en pocas horas) | 7    |
| S13 | Sangrado de encías                             | 8    |
| S14 | Sangrado nasal                                 | 8    |
| S15 | Sangrado vaginal inusual                       | 8    |
| S16 | Sangre en orina o heces                        | 9    |
| S17 | Somnolencia extrema / Letargia                 | 7    |
| S18 | Inquietud o irritabilidad inusual              | 7    |
| S19 | Piel fría, pegajosa o sudoración excesiva      | 8    |
| S20 | Hinchazón (cara, manos, pies o barriga)        | 7    |

**Categoría SEVERE — Signos de DENGUE GRAVE (#21–#25, peso 10):**

| ID  | Signo                                                | Peso |
| --- | ---------------------------------------------------- | ---- |
| S21 | Dificultad para respirar o sensación de ahogo        | 10   |
| S22 | Sangrado abundante (vómito con sangre, heces negras) | 10   |
| S23 | Confusión mental / Desorientación                    | 10   |
| S24 | Desmayo o pérdida de conocimiento                    | 10   |
| S25 | Pulso débil o corazón acelerado                      | 10   |

### RN-004.2 — Algoritmo de clasificación (OMS 2009)

**El algoritmo es determinístico y basado en reglas. NO usa ML.**

Contexto clínico de dengue = Presenta Fiebre (S01) O presenta ≥2 síntomas generales (S02–S10).

```
PASO 1: Si seleccionó ≥1 síntoma de Categoría SEVERE (S21–S25)
         → Clasificación: DENGUE_GRAVE (Rojo 🔴)
         → Disparar alerta de emergencia inmediatamente
         → DETENER evaluación (no verificar más condiciones)

PASO 2: Si seleccionó ≥1 síntoma de Categoría WARNING (S11–S20) Y cumple Contexto Clínico de Dengue
         → Clasificación: DENGUE_ALARMA (Naranja 🟠)
         → Disparar alerta de signos de alarma
         → DETENER evaluación

PASO 3: Si seleccionó ≥1 síntoma de Categoría WARNING (S11–S20) SIN Contexto Clínico de Dengue
         → Clasificación: CONSULTA_MEDICA (Ámbar 🟡🟠)
         → Mostrar recomendación de consulta presencial MINSA (sin alerta sonora/overlay)
         → DETENER evaluación

PASO 4: Si seleccionó S01 (Fiebre) Y ≥2 síntomas de Categoría GENERAL (S02–S10)
         → Clasificación: DENGUE_POSIBLE (Amarillo 🟡)
         → Mostrar recomendaciones de monitoreo
         → DETENER evaluación

PASO 5: No cumple ninguna condición anterior
         → Clasificación: BAJO_RIESGO (Verde 🟢)
         → Mostrar consejos de prevención
```

> **REGLA CRÍTICA:** Un solo signo de Categoría SEVERE siempre dispara emergencia. Un signo de Categoría WARNING **requiere contexto febril/clínico de dengue** (Fiebre S01 O ≥2 síntomas generales) para clasificar como `DENGUE_ALARMA`. De lo contrario, se clasifica como `CONSULTA_MEDICA`.

### RN-004.3 — Risk Score (solo visual)

$$\text{risk\_score} = \min\left(100,\ \frac{\sum_{i \in \text{seleccionados}} w_i}{\sum_{j=S01}^{S25} w_j} \times 100\right)$$

- El risk score es **solo un indicador visual** (barra/gauge).
- La **clasificación categórica** es la que determina la acción a tomar.
- No usar el score para tomar decisiones de negocio.

### RN-004.4 — Campo adicional en la evaluación

El paciente también debe indicar: **¿Cuántos días lleva con estos síntomas?**
Opciones: 1, 2, 3, 4, 5, 6, 7+ días.
Esto se almacena en `symptom_logs.days_with_symptoms` para contexto clínico.

---

## RN-005 — Alertas

### RN-005.1 — Tipos de alerta

| Tipo            | Trigger                     | Acción                                              |
| :-------------- | :-------------------------- | :-------------------------------------------------- |
| `ALERTA_ALARMA` | Clasificación DENGUE_ALARMA | Alerta visual naranja + sonido                      |
| `EMERGENCIA`    | Clasificación DENGUE_GRAVE  | Alerta visual roja + sonido + botones de emergencia |

### RN-005.2 — Botones en pantalla de alerta

**Para DENGUE_ALARMA:**

- 🏥 Buscar hospital o centro de salud cercano (abre mapa)
- 📞 Llamar a Cruz Blanca (tel: 128)
- 📤 Compartir mi ubicación (genera link de Google Maps)

**Para DENGUE_GRAVE:**

- 🚨 Llamar 911 (marcación directa)
- 📞 Llamar a Cruz Blanca (tel: 128)
- 🏥 Ver hospital más cercano (abre mapa)
- 📤 Compartir mi ubicación

### RN-005.3 — Números de emergencia Nicaragua

| Servicio         | Número |
| :--------------- | :----- |
| Sistema 911      | 911    |
| Cruz Blanca        | 128    |
| Bomberos         | 115    |
| Policía Nacional | 118    |

### RN-005.4 — Alerta sonora

- **Solo se reproduce cuando la app está en primer plano** (Web Audio API).
- DENGUE_ALARMA: tono intermitente (3 repeticiones, 800 Hz).
- DENGUE_GRAVE: tono agudo continuo con pulso (1200 Hz, hasta que el usuario interactúe).
- El usuario puede silenciar el sonido en cualquier momento.
- No depender del sonido como único canal; la alerta visual es igualmente importante.

---

## RN-006 — Mapa de Hospitales

- Tecnología: Leaflet.js + OpenStreetMap (gratuito, sin API key).
- Buscar centros médicos usando **Overpass API** (OpenStreetMap).
- Query para Nicaragua: buscar nodos con `amenity=hospital` o `amenity=clinic`
  en un radio de 10km desde la ubicación del usuario.
- Si la geolocalización es denegada: mostrar campo de búsqueda manual
  por departamento/municipio.
- Botón "Cómo llegar" abre Google Maps o la app de mapas del dispositivo
  con las coordenadas del centro médico.
- El mapa **solo se activa en la pantalla de alerta**, no es accesible libremente.

---

## RN-007 — Vinculación Paciente-Médico

1. El médico genera un código de 6 caracteres alfanuméricos (mayúsculas) desde su dashboard.
2. El código es válido por **48 horas** desde su generación.
3. El código es de un solo uso — una vez aceptado, se invalida.
4. El paciente ingresa el código desde: `Inicio → Mi Médico → Ingresar código`.
5. Al aceptar: el médico puede ver todos los registros del paciente (actuales y futuros).
6. El paciente puede **desvincular** al médico en cualquier momento desde su perfil.
7. Un paciente puede estar vinculado a **máximo 3 médicos** simultáneamente.
8. Un médico puede tener **máximo 200 pacientes** vinculados.

---

## RN-008 — Privacidad y Acceso a Datos

- Un médico solo puede ver datos de pacientes que **aceptaron el vínculo**.
- Un paciente solo puede ver sus propios datos.
- Los datos de salud se almacenan en Supabase con **Row-Level Security (RLS)**.
- No se comparten datos con terceros (para el MVP).
- El paciente puede **eliminar su cuenta y todos sus datos** desde el perfil.

---

## RN-009 — Historial del Paciente

- Se guarda cada evaluación de síntomas realizada.
- El historial muestra: fecha, síntomas seleccionados, clasificación obtenida, días con síntomas.
- El historial es visible para el paciente y para sus médicos vinculados.
- Los médicos pueden agregar **notas médicas** a cualquier registro del historial.
- No hay límite de evaluaciones por paciente.

---

## RN-010 — Contenido Educativo

Secciones fijas con contenido sobre dengue (solo lectura, gestionado en BD):

- **Prevención:** cómo evitar el dengue, eliminación de criaderos.
- **Síntomas:** qué es el dengue, cómo reconocerlo.
- **Tratamiento:** qué hacer si tengo dengue (hidratación, acetaminofén, NO ibuprofeno/aspirina).
- **Emergencia:** cuándo ir al médico, signos de alarma.

---

## RN-011 — Advertencia Médica (Disclaimer)

> Toda pantalla de resultado DEBE mostrar el mensaje:
> _"Esta evaluación es orientativa y no sustituye el diagnóstico de un
> médico. Si tenés dudas, consultá a tu médico o acudí al centro de
> salud más cercano."_

Este disclaimer es **obligatorio en todas las pantallas de resultado**,
sin excepción.

---

## RN-012 — Enfermedades Crónicas Relevantes

Lista de comorbilidades a mostrar en el perfil del paciente
(basada en datos del MINSA Nicaragua):

1. Hipertensión arterial
2. Diabetes mellitus
3. Asma bronquial
4. Enfermedad renal crónica
5. Artritis / Enfermedades reumáticas
6. Enfermedad del corazón
7. Epilepsia
8. Problemas de tiroides
9. VIH / SIDA
10. Otra (campo de texto)
11. Ninguna

> Las enfermedades crónicas son **contexto clínico** para los médicos.
> El algoritmo de clasificación actual NO modifica su resultado por
> comorbilidades (eso requeriría validación médica adicional).
> Mostrar las comorbilidades en el perfil del paciente visible al médico.
