import { SintomaId, ResultadoEvaluacion, ClasificacionDengue, FaseDengue } from '@/types/dengue';
import { CATALOGO_SINTOMAS, obtenerSintomaPorId } from './sintomas';

export function clasificarDengue(
  sintomasIds: SintomaId[],
  diasConSintomas: number = 1
): ResultadoEvaluacion {
  const seleccionados = sintomasIds
    .map((id) => obtenerSintomaPorId(id))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  const tieneGrave = seleccionados.some((s) => s.categoria === 'SEVERE');
  const tieneAlarma = seleccionados.some((s) => s.categoria === 'WARNING');

  const tieneFiebre = sintomasIds.includes('S01');
  const otrosGenerales = seleccionados.filter((s) => s.categoria === 'GENERAL' && s.id !== 'S01');
  
  // Contexto clínico de dengue: Fiebre (S01) O al menos 2 síntomas generales
  const tieneContextoDengue = tieneFiebre || otrosGenerales.length >= 2;
  const cumpleCriterioPosible = tieneFiebre && otrosGenerales.length >= 2;

  // Determinar Fase Temporal por Días según guías OMS
  let faseTemporal: FaseDengue = 'FEBRIL';
  if (diasConSintomas >= 3 && diasConSintomas <= 6) {
    faseTemporal = 'CRITICA';
  } else if (diasConSintomas >= 7) {
    faseTemporal = 'RECUPERACION';
  }

  let clasificacion: ClasificacionDengue = 'BAJO_RIESGO';

  if (tieneGrave) {
    clasificacion = 'DENGUE_GRAVE';
  } else if (tieneAlarma && tieneContextoDengue) {
    clasificacion = 'DENGUE_ALARMA';
  } else if (tieneAlarma && !tieneContextoDengue) {
    clasificacion = 'CONSULTA_MEDICA';
  } else if (cumpleCriterioPosible) {
    // Si cumple criterio de dengue posible PERO está en la ventana crítica (días 3-6),
    // elevamos la alerta a DENGUE_ALARMA preventivamente según guías OMS
    if (faseTemporal === 'CRITICA') {
      clasificacion = 'DENGUE_ALARMA';
    } else {
      clasificacion = 'DENGUE_POSIBLE';
    }
  } else {
    clasificacion = 'BAJO_RIESGO';
  }

  // Cálculo del Risk Score
  const pesoTotalMaximo = CATALOGO_SINTOMAS.reduce((acc, s) => acc + s.peso, 0);
  const pesoSeleccionado = seleccionados.reduce((acc, s) => acc + s.peso, 0);
  const riskScore = Math.min(100, Math.round((pesoSeleccionado / pesoTotalMaximo) * 100));

  // Generar mensajes y acciones según clasificación y fase
  const { recomendaciones, accionesRequeridas, colorBadge, tituloResultado } =
    obtenerDetallesClasificacion(clasificacion, faseTemporal);

  return {
    clasificacion,
    riskScore,
    sintomasSeleccionados: seleccionados,
    tieneSignoAlarma: tieneAlarma,
    tieneSignoGrave: tieneGrave,
    tieneContextoDengue,
    faseTemporal,
    recomendaciones,
    accionesRequeridas,
    colorBadge,
    tituloResultado,
  };
}

function obtenerDetallesClasificacion(
  clasificacion: ClasificacionDengue,
  faseTemporal: FaseDengue
) {
  switch (clasificacion) {
    case 'DENGUE_GRAVE':
      return {
        tituloResultado: 'EMERGENCIA MÉDICA — Dengue Grave',
        colorBadge: 'DENGUE_GRAVE',
        recomendaciones: [
          'Se detectaron signos de gravedad crítica.',
          'Acudí INMEDIATAMENTE al hospital o centro de salud más cercano.',
          'No tomes ningún medicamento por tu cuenta.',
          'Mantente en posición cómoda y pide ayuda a un familiar.',
        ],
        accionesRequeridas: [
          'Llamar al 911 o Cruz Roja (128)',
          'Ver hospital más cercano en el mapa',
          'Compartir ubicación con un familiar o médico',
        ],
      };

    case 'DENGUE_ALARMA':
      return {
        tituloResultado:
          faseTemporal === 'CRITICA'
            ? '¡ATENCIÓN! — Fase Crítica de Dengue Detectada'
            : '¡ATENCIÓN! — Signos de Alarma Detectados',
        colorBadge: 'DENGUE_ALARMA',
        recomendaciones: [
          faseTemporal === 'CRITICA'
            ? 'Te encontrás entre los días 3 y 6 de la enfermedad (Fase Crítica). En esta etapa la fiebre suele bajar pero aumenta el riesgo de fuga plasmática y complicaciones.'
            : 'En el contexto febril/clínico actual, se identificaron signos de alarma que requieren valoración médica urgente hoy.',
          'No esperes a que los síntomas empeoren.',
          'Toma abundante líquido (agua, suero oral) si toleras la vía oral.',
          'NO tomes aspirina, ibuprofeno ni naproxeno. Solo acetaminofén si hay dolor o fiebre.',
        ],
        accionesRequeridas: [
          'Acudir al médico o centro de salud hoy mismo',
          'Buscar hospital cercano',
          'Notificar a tu médico vinculado',
        ],
      };

    case 'CONSULTA_MEDICA':
      return {
        tituloResultado: 'Consulta Médica Recomendada',
        colorBadge: 'CONSULTA_MEDICA',
        recomendaciones: [
          'Presentás síntomas que ameritan valoración médica, pero no se detecta un cuadro típico febril de dengue.',
          'Acudí a tu unidad de salud MINSA más cercana para una evaluación presencial.',
          'Si en las próximas horas aparece fiebre (≥38°C), volvé a evaluar tus síntomas en la app.',
          'Mantené la hidratación y el reposo mientras tanto.',
          'NO tomes aspirina, ibuprofeno ni naproxeno. Usa únicamente acetaminofén si hay dolor.',
        ],
        accionesRequeridas: [
          'Visitar tu centro de salud MINSA para valoración',
          'Reevaluar si aparece fiebre',
          'Consultar a tu médico vinculado',
        ],
      };

    case 'DENGUE_POSIBLE':
      return {
        tituloResultado: 'Posible Dengue Sin Signos de Alarma',
        colorBadge: 'DENGUE_POSIBLE',
        recomendaciones: [
          faseTemporal === 'RECUPERACION'
            ? 'Estás en días de probable fase de recuperación (Día 7+). Si tus síntomas van disminuyendo, mantené reposo e hidratación.'
            : 'Tus síntomas son compatibles con la fase febril inicial del dengue (Días 1-3).',
          'Reposo absoluto y abundante hidratación (2 a 3 litros de suero u agua al día).',
          'Para la fiebre o dolor, usa ÚNICAMENTE acetaminofén (paracetamol).',
          'PROHIBIDO tomar aspirina, ibuprofeno o antiinflamatorios (aumentan riesgo de sangrado).',
          'Si la fiebre baja en los días 3 a 6, mantén vigilancia estricta de signos de alarma.',
        ],
        accionesRequeridas: [
          'Reevaluar tus síntomas cada 12 horas',
          'Consultar a tu médico vinculado',
          'Ver guía educativa de cuidados en casa',
        ],
      };

    case 'BAJO_RIESGO':
    default:
      return {
        tituloResultado: 'Bajo Riesgo — Sin Criterios de Dengue',
        colorBadge: 'BAJO_RIESGO',
        recomendaciones: [
          'Tus síntomas actuales no cumplen con el patrón típico del dengue.',
          'Si aparece fiebre o nuevos síntomas en las próximas horas, realiza una nueva evaluación.',
          'Mantén limpia tu vivienda y elimina recipientes con agua estancada para evitar mosquitos.',
        ],
        accionesRequeridas: [
          'Monitorear tu estado de salud',
          'Leer consejos de prevención del dengue',
        ],
      };
  }
}
