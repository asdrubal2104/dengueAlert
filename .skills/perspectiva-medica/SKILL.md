---
name: perspectiva-medica
description: |
  Guía médica para ingenieros trabajando en Dengue Alert.
  Explica conceptos clínicos del dengue en lenguaje técnico-accesible:
  fisiopatología, fases, clasificación OMS, signos clínicos, contexto
  de Nicaragua, y cómo traducir estos conceptos al software.
  LEER antes de implementar el clasificador, las pantallas de síntomas,
  los textos al usuario, o cualquier feature relacionada con la lógica médica.
---

# 🏥 Perspectiva Médica — Guía para Ingenieros

> Esta skill traduce conceptos médicos del dengue a lenguaje de ingeniería.
> El objetivo es que puedas implementar features médicamente correctas
> sin necesitar ser médico.

---

## 1. ¿Qué es el Dengue? (para un ingeniero)

El dengue es una **infección viral** transmitida por la picadura del
mosquito _Aedes aegypti_ (el mismo que transmite Zika y Chikungunya).
Es **endémico en Nicaragua** — significa que siempre está presente,
con picos en época lluviosa (mayo–noviembre).

**Datos clave para el software:**

- No existe vacuna ni tratamiento antiviral específico.
- El tratamiento es **sintomático**: hidratación, reposo, acetaminofén.
- **Está prohibido usar aspirina (ácido acetilsalicílico) e ibuprofeno**
  porque aumentan el riesgo de sangrado grave. → La app DEBE mencionar esto.
- La mayoría de casos son leves. El peligro es la evolución a formas graves.
- El diagnóstico definitivo es por laboratorio (NS1, IgM/IgG), pero la
  app evalúa solo síntomas clínicos (como lo hace un médico en primer contacto).

---

## 2. Las 3 Fases del Dengue

El dengue evoluciona en 3 fases clínicas. Entenderlas explica POR QUÉ
el algoritmo funciona como funciona.

```
DÍA 1─────────DÍA 3─────────────DÍA 6──────────DÍA 7+
│  FASE FEBRIL  │  FASE CRÍTICA   │ FASE RECUPERACIÓN │
│               │                  │                   │
│ • Fiebre alta │ • Fiebre BAJA   │ • Mejora gradual  │
│ • Dolores     │   o desaparece  │ • Apetito vuelve  │
│ • Malestar    │ • MAYOR RIESGO  │ • Sarpullido posible│
│               │   de complicar  │                   │
```

### ¿Por qué esto importa para la app?

**Pregunta de la app: "¿Cuántos días llevás con síntomas?"**

Esta pregunta no es decorativa. Tiene valor clínico:

- **Días 1-3 (Fase febril):** Fiebre alta. Los signos de alarma aún no aparecen.
- **Días 3-6 (Fase crítica):** La fiebre BAJA pero el riesgo SUBE.
  Los signos de alarma aparecen aquí. Es la fase más peligrosa.
- **Día 7+ (Recuperación):** El paciente mejora.

> 🔴 **TRAMPA COMÚN:** Si un paciente dice "ya bajó la fiebre, estoy mejor",
> puede estar entrando a la **Fase Crítica**. Los médicos saben esto; la app
> debe mostrar al paciente en días 3-6 que la baja de fiebre NO significa
> que ya está sano si otros síntomas persisten.

**En la UI:** Cuando el usuario reporta días 3-6 + fiebre que bajó, agregar
una nota de advertencia en la pantalla de resultado (incluso si es "bajo riesgo"):
_"Atención: si tu fiebre bajó recientemente, monitoreá los síntomas de alarma
en las próximas 24-48 horas."_

---

## 3. Clasificación OMS 2009 — La Fuente de Verdad

La app implementa la clasificación oficial de la **Organización Mundial de
la Salud (OMS), versión 2009**, adoptada por la OPS y el MINSA de Nicaragua.

### Nivel 1: Dengue SIN Signos de Alarma

**Definición clínica:** Fiebre aguda (2-7 días) + mínimo 2 de los siguientes:

- Náuseas / vómitos
- Rash (sarpullido)
- Mialgias (dolor muscular) / Artralgias (dolor articular)
- Cefalea (dolor de cabeza)
- Dolor retro-orbitario (detrás de los ojos)
- Leucopenia (glóbulos blancos bajos — solo diagnosticable por laboratorio)
- Prueba del torniquete positiva (solo en clínica)

**¿Qué omitimos en la app?** Leucopenia y prueba de torniquete requieren
equipamiento clínico. La app evalúa solo síntomas que el paciente puede
identificar por sí mismo.

**Manejo:** Ambulatorio (en casa). Hidratación, reposo, acetaminofén.
Vigilancia de signos de alarma.

### Nivel 2: Dengue CON Signos de Alarma

**Definición clínica:** Dengue + cualquiera de los siguientes:

- **Dolor abdominal intenso o a la palpación:** El dolor de panza del dengue
  es diferente al normal. Es severo, continuo, no mejora con posición.
- **Vómitos persistentes:** ≥3 episodios en 1 hora o ≥4 en 6 horas.
  Impide la hidratación oral (muy peligroso).
- **Acumulación de líquidos:** Líquido en pulmones (dificultad respiratoria),
  abdomen (barriga hinchada), extremidades. El paciente lo nota como hinchazón.
- **Sangrado de mucosas:** Encías, nariz, vagina. Señal de que las plaquetas
  están cayendo.
- **Letargia / Inquietud:** El cerebro no está recibiendo suficiente sangre.
  La persona está anormalmente somnolienta o, al contrario, agitada sin razón.
- **Hepatomegalia >2cm:** Hígado agrandado — no detectable por el paciente,
  omitido en la app.
- **Aumento de hematocrito + caída de plaquetas:** Solo laboratorio, omitido.

**Manejo:** HOSPITALIZACIÓN. El paciente necesita suero IV, monitoreo de
signos vitales y recuento plaquetario cada 6-12 horas.

### Nivel 3: Dengue GRAVE

**Definición clínica:** Cualquiera de los siguientes:

- **Extravasación de plasma grave:** El virus daña los vasos sanguíneos y
  el plasma (líquido de la sangre) se sale. Causa shock (presión baja,
  pulso débil) o acumulación de líquido en pulmones (no puede respirar).
- **Sangrado grave:** Hematemesis (vomitar sangre), melena (heces negras
  con sangre), sangrado espontáneo abundante.
- **Falla orgánica grave:** Hígado (ictericia, confusión), riñón
  (no orina), corazón (arritmias), SNC (confusión, pérdida de consciencia).

**Manejo:** UCI. Emergencia médica. Sin atención inmediata puede ser fatal.

---

## 4. Síntomas: Traducción Clínica → Lenguaje de Usuario

Cómo describir cada síntoma en español coloquial nicaragüense, sin jerga médica:

| Término Médico          | Cómo decirlo en la app                                         |
| :---------------------- | :------------------------------------------------------------- |
| Fiebre (≥38°C)          | "Tengo fiebre o siento mucho calor en el cuerpo"               |
| Cefalea                 | "Me duele la cabeza, especialmente en la frente y sienes"      |
| Dolor retro-orbitario   | "Siento dolor o presión detrás de los ojos"                    |
| Mialgia                 | "Me duelen los músculos del cuerpo (brazos, piernas, espalda)" |
| Artralgia               | "Me duelen las coyunturas (rodillas, codos, muñecas)"          |
| Náuseas                 | "Siento ganas de vomitar, el estómago revuelto"                |
| Rash / Exantema         | "Tengo manchas rojas o sarpullido en la piel"                  |
| Astenia / Fatiga        | "Estoy muy cansado/a, sin fuerzas ni energía"                  |
| Anorexia                | "No tengo ganas de comer, perdí el apetito"                    |
| Dolor abdominal intenso | "Me duele mucho la barriga sin parar"                          |
| Vómitos persistentes    | "He vomitado 3 o más veces seguidas"                           |
| Sangrado de mucosas     | "Me sangran las encías o la nariz sin golpearme"               |
| Hematemesis             | "Vomité sangre o algo con color café oscuro"                   |
| Melena                  | "Las heces (popó) son negras o con sangre"                     |
| Letargia                | "Estoy muy dormido/a, me cuesta mantenerme despierto/a"        |
| Irritabilidad/Agitación | "Estoy muy inquieto/a o agitado/a sin razón"                   |
| Edema                   | "Se me hinchó la cara, manos, pies o barriga"                  |
| Piel fría y pegajosa    | "Tengo la piel fría y húmeda, sudo sin tener calor"            |
| Disnea                  | "Me cuesta respirar, siento que me ahogo"                      |
| Confusión / Somnolencia | "Estoy confundido/a, no sé dónde estoy"                        |
| Síncope                 | "Me desmayé o casi me desmayo"                                 |
| Pulso débil/taquicardia | "Siento el corazón muy rápido o muy débil"                     |
| Hematuria               | "Vi sangre al orinar"                                          |

---

## 5. Comorbilidades: Cómo Afectan al Dengue

Las enfermedades crónicas complican el dengue. Los médicos necesitan
saber esto para priorizar la atención. Aunque el clasificador actual
no modifica su resultado por comorbilidades, el médico que ve al
paciente SÍ necesita este contexto.

| Comorbilidad         | Riesgo adicional en dengue                                                                                                    |
| :------------------- | :---------------------------------------------------------------------------------------------------------------------------- |
| **Hipertensión**     | Los medicamentos antihipertensivos pueden alterar la respuesta al shock. El sangrado puede elevar la presión paradójicamente. |
| **Diabetes**         | Mayor riesgo de infección bacteriana secundaria. Dificulta el manejo de líquidos.                                             |
| **Embarazo**         | Riesgo de parto prematuro, muerte fetal. Requiere hospitalización preventiva.                                                 |
| **Enfermedad renal** | El dengue puede causar insuficiencia renal aguda. Mucho más peligroso con riñón comprometido.                                 |
| **Asma**             | La acumulación de líquido en pulmones es más peligrosa.                                                                       |
| **Enf. del corazón** | El dengue puede causar miocarditis. Mayor riesgo de arritmias.                                                                |
| **Anemia**           | El sangrado en dengue es más peligroso con hemoglobina baja.                                                                  |
| **Obesidad**         | Dificulta detectar ascitis y edema. Mayor riesgo en shock.                                                                    |

**Para la app:** Mostrar en el perfil del médico las comorbilidades
del paciente de forma **prominente**, con íconos de advertencia si
el paciente tiene condiciones de alto riesgo (renales, cardíacas, embarazo).

---

## 6. Lo que la App NO puede hacer (limitaciones clínicas)

Estas son las limitaciones del diagnóstico clínico por síntomas sin laboratorio.
El equipo debe entenderlas para no sobredimensionar las capacidades de la app.

| Lo que no podemos saber          | Por qué                              | Impacto en la app                   |
| :------------------------------- | :----------------------------------- | :---------------------------------- |
| Recuento de plaquetas            | Requiere hemograma                   | No incluir en algoritmo             |
| Hematocrito                      | Requiere hemograma                   | No incluir en algoritmo             |
| Diagnóstico confirmado (NS1/IgM) | Requiere prueba de laboratorio       | Siempre usar "posible" o "sospecha" |
| Hepatomegalia                    | Requiere palpación por médico        | No incluir en algoritmo             |
| Prueba del torniquete            | Requiere equipamiento                | No incluir en algoritmo             |
| Estadio exacto de la enfermedad  | Requiere evaluación clínica completa | Usar días como proxy                |

**Consecuencia:** La app **solo ofrece orientación** (triage preliminar),
nunca un diagnóstico definitivo. El disclaimer es obligatorio (ver RN-011).

---

## 7. Sistema de Salud de Nicaragua (contexto para la app)

### Estructura del MINSA

```
MINSA (Ministerio de Salud)
└── ANRS (Autoridad Nacional de Regulación Sanitaria)
    └── Registra y certifica a los profesionales de salud
        └── Emite el CÓDIGO SANITARIO (Código MINSA)

Territorialmente organizado en 19 SILAIS:
SILAIS = Sistema Local de Atención Integral en Salud
└── Departamento o región autónoma
    ├── Hospitales departamentales/regionales
    ├── Centros de salud
    └── Puestos de salud
```

### El Código MINSA

- Es el identificador único de un profesional de salud en Nicaragua.
- Es emitido por la ANRS a través del **sistema KARPLUS**.
- Formato: numérico, típicamente 4-7 dígitos (varía).
- **En la app:** Capturarlo como texto libre sin validación de formato en el MVP.

### Números de emergencia (verificados)

| Servicio               | Número | Notas                                      |
| :--------------------- | :----- | :----------------------------------------- |
| Sistema 911            | 911    | Emergencias generales (incluye ambulancia) |
| Cruz Roja Nicaragüense | 128    | Ambulancias                                |
| Bomberos               | 115    | Emergencias                                |
| Policía Nacional       | 118    | Seguridad                                  |

---

## 8. Textos Médicamente Correctos para la UI

### ✅ Frases correctas para usar en la app

**En pantalla de resultado bajo riesgo:**

> "Tus síntomas actuales no corresponden a los criterios diagnósticos del
> dengue según la OMS. Sin embargo, si desarrollás fiebre o nuevos síntomas,
> evaluá de nuevo."

**En pantalla de posible dengue:**

> "Tus síntomas son compatibles con dengue sin signos de alarma.
> Descansá, tomá mucho líquido (agua, suero oral) y acetaminofén para
> la fiebre. **NO tomés aspirina ni ibuprofeno.**
> Monitoreá tus síntomas y regresá si empeorás."

**En pantalla de signos de alarma:**

> "Presentás signos de alarma del dengue. Estos síntomas indican que
> la enfermedad puede estar complicándose. **Necesitás atención médica
> hoy.** Acudí al centro de salud o hospital más cercano."

**En pantalla de dengue grave:**

> "⚠️ EMERGENCIA MÉDICA ⚠️
> Presentás signos de dengue grave. Llamá al 911 o buscá el hospital
> más cercano INMEDIATAMENTE. No esperes."

**Disclaimer obligatorio (en todas las pantallas de resultado):**

> "Esta evaluación es orientativa y no sustituye el diagnóstico
> de un médico. Si tenés dudas, consultá a tu médico o acudí
> al centro de salud más cercano."

### ❌ Frases prohibidas (médicamente incorrectas o alarman sin base)

| ❌ No usar                   | Motivo                                                   |
| :--------------------------- | :------------------------------------------------------- |
| "Tenés dengue"               | La app no puede confirmar el diagnóstico sin laboratorio |
| "Estás en peligro de muerte" | Alarmista, puede causar pánico innecesario               |
| "Tomá antibióticos"          | El dengue es viral, los antibióticos no sirven           |
| "Tomá ibuprofeno/aspirina"   | CONTRAINDICADO en dengue por riesgo de hemorragia        |
| "No necesitás ir al médico"  | Nunca decir esto, siempre recomendar consultar           |
| "Estás curado/a"             | La app no puede determinarlo                             |

---

## 9. Glosario Médico → Ingeniería

| Término médico              | Qué significa para el código                                                             |
| :-------------------------- | :--------------------------------------------------------------------------------------- |
| **Triage**                  | Clasificación rápida por gravedad — lo que hace el clasificador                          |
| **Signo**                   | Observable por un médico (ej. hepatomegalia). A veces el paciente puede reportarlo.      |
| **Síntoma**                 | Lo que el paciente siente/reporta (ej. dolor, náuseas)                                   |
| **Patognomónico**           | Síntoma único de una enfermedad. No existe para dengue en la app.                        |
| **Comorbilidad**            | Enfermedad crónica que coexiste con el dengue. Campo en perfil del paciente.             |
| **Endémico**                | Siempre presente en Nicaragua. No es una alerta, es la normalidad.                       |
| **Extravasación de plasma** | "Fuga" de líquido de los vasos → causa shock → causa DENGUE_GRAVE                        |
| **Plaquetas**               | Células que coagulan la sangre. El dengue las baja (plaquetopenia). Por eso el sangrado. |
| **Leucopenia**              | Glóbulos blancos bajos. Sugiere infección viral. Solo por laboratorio.                   |
| **Hematocrito**             | % de glóbulos rojos en la sangre. Sube cuando hay extravasación. Solo por laboratorio.   |
| **AST/ALT**                 | Enzimas del hígado. Suben si el hígado está dañado. Solo por laboratorio.                |
| **Glasgow**                 | Escala de consciencia (3-15). Bajo = confusión/coma = DENGUE_GRAVE.                      |
| **Suero oral**              | Agua con sal y azúcar para rehidratación. En Nicaragua: Pedialyte, suero del MINSA.      |

---

## 10. Validación del Clasificador con un Médico

Cuando presentes el proyecto, los médicos verificarán principalmente:

1. **¿El algoritmo sigue la clasificación OMS 2009?** → Sí (verificar con guía PAHO).
2. **¿Los síntomas están bien descritos en lenguaje accesible?** → Revisar con esta guía.
3. **¿Se menciona NO tomar aspirina/ibuprofeno?** → Debe aparecer en resultados DENGUE_POSIBLE+.
4. **¿Hay disclaimer que no sustituye al médico?** → Obligatorio en toda pantalla de resultado.
5. **¿Los números de emergencia son correctos?** → 911, Cruz Roja 128.
6. **¿Los días de síntomas se registran?** → Sí, es contexto clínico relevante.
7. **¿Las comorbilidades están presentes en el perfil?** → Sí, visibles para el médico.
