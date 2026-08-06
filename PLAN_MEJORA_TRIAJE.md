# Mejora clínica del triaje y derivación hospitalaria

## Resumen

Reorientar la evaluación como un **triaje orientativo**, no un diagnóstico. La lógica se actualizará con los criterios clínicos OMS/OPS revisados y priorizará que el paciente se movilice oportunamente cuando reporte signos de alarma o gravedad.

La fase abarcará únicamente selección de síntomas, lógica de clasificación, resultado y pruebas. No modificará mapa, Supabase, alertas a médicos ni vinculación médico-paciente.

## Cambios de lógica y tipos

- Mantener el catálogo fijo de 25 síntomas reportables por el paciente; excluir de la evaluación cualquier criterio que requiera laboratorio o exploración clínica.
- Incorporar un nivel de atención separado de la clasificación clínica:
  - `EMERGENCIA`: cualquier signo grave; ir inmediatamente al hospital o llamar emergencias.
  - `ATENCION_HOY`: cualquier signo de alarma, aun sin fiebre o patrón completo de dengue; acudir hoy a una unidad de salud, sin afirmar que sea dengue.
  - `MONITOREO_ESTRECHO`: posible dengue sin signos de alarma; hidratación, acetaminofén y reevaluación inmediata ante empeoramiento.
  - `AUTOCUIDADO`: síntomas sin criterios de sospecha o alarma; prevención y vigilancia.
- Corregir la precedencia: signo grave > signo de alarma > posible dengue (fiebre más dos síntomas generales) > bajo riesgo.
- Los días con síntomas no cambiarán por sí solos la clasificación ni dispararán una alerta. Entre días 3–6 se solicitará si la fiebre bajó recientemente y, de ser así, se mostrará una advertencia de vigilancia reforzada durante 24–48 horas.
- Añadir al resultado motivos de derivación explícitos y estructurados: síntomas que activaron la decisión, nivel de atención, acción primaria y plazo recomendado. El indicador de riesgo seguirá siendo exclusivamente visual.

## Experiencia de evaluación y resultado

- Corregir el aviso de selección: un signo de alarma no se presentará como “dengue grave”; indicará que requiere valoración presencial hoy.
- Hacer visible la pregunta sobre descenso reciente de fiebre solo en días 3–6, con una opción clara de “sí / no / no estoy seguro”.
- Presentar una pantalla de resultado centrada en la acción:
  - Emergencia: mensaje rojo, instrucción inmediata, síntomas activadores y acceso al flujo actual de hospital/llamadas.
  - Atención hoy: mensaje ámbar, “acudí hoy” y sin overlay ni alarma sonora.
  - Monitoreo: medidas de cuidado, contraindicaciones y signos concretos que obligan a reevaluar o acudir.
  - Autocuidado: prevención, vigilancia y condiciones de escalamiento.
- Mantener en todos los resultados el disclaimer: la aplicación no confirma dengue ni sustituye una evaluación médica.
- Usar lenguaje español nicaragüense claro y no alarmista; prohibir afirmaciones como “tenés dengue” o “estás curado/a”.

## Pruebas y aceptación

- Ampliar pruebas unitarias con la matriz completa de prioridad: cada síntoma grave, cada signo de alarma aislado, alarma con contexto, fiebre más dos generales, combinaciones y ausencia de síntomas.
- Probar que días 3–6 y fiebre descendida generan advertencia contextual, pero no elevan por sí mismos a alerta u hospitalización.
- Probar que el nivel de atención, los motivos de derivación y los mensajes esperados se devuelven de forma determinista.
- Añadir pruebas de interfaz para el aviso de alarma, la pregunta condicional de fiebre y la acción principal de cada resultado.
- Validar compilación y la suite completa con `pnpm test` y `pnpm build`.

## Supuestos adoptados

- La revisión seguirá la clasificación clínica OMS 2009 y las guías/algoritmos OPS vigentes; una validación final por un profesional médico local seguirá siendo recomendable antes de producción.
- Cualquier signo de alarma aislado implicará “acudir hoy a una unidad de salud”, aunque no confirme dengue, porque también puede señalar otra causa que requiere valoración.
- Las comorbilidades, embarazo y otros factores de riesgo seguirán siendo contexto clínico y no cambiarán automáticamente el resultado en esta fase.
