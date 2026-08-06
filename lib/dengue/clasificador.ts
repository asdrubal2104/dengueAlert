import {
  ClasificacionDengue,
  FaseDengue,
  NivelAtencion,
  ResultadoEvaluacion,
  Sintoma,
  SintomaId,
} from '@/types/dengue';
import { CATALOGO_SINTOMAS, obtenerSintomaPorId } from './sintomas';

interface DetallesTriaje {
  tituloResultado: string;
  colorBadge: string;
  nivelAtencion: NivelAtencion;
  accionPrimaria: string;
  plazoAtencion: string;
  recomendaciones: string[];
  accionesRequeridas: string[];
}

/**
 * Triaje orientativo basado en síntomas reportados por la persona.
 * No confirma dengue ni reemplaza la evaluación presencial de un profesional.
 */
export function clasificarDengue(
  sintomasIds: SintomaId[],
  diasConSintomas = 1,
  fiebreBajoRecientemente = false,
): ResultadoEvaluacion {
  const seleccionados = sintomasIds
    .map((id) => obtenerSintomaPorId(id))
    .filter((s): s is Sintoma => s !== undefined);

  const sintomasGraves = seleccionados.filter((s) => s.categoria === 'SEVERE');
  const signosAlarma = seleccionados.filter((s) => s.categoria === 'WARNING');
  const tieneFiebre = sintomasIds.includes('S01');
  const otrosGenerales = seleccionados.filter(
    (s) => s.categoria === 'GENERAL' && s.id !== 'S01',
  );
  const tieneContextoDengue = tieneFiebre || otrosGenerales.length >= 2;
  const cumpleCriterioPosible = tieneFiebre && otrosGenerales.length >= 2;
  const faseTemporal = obtenerFaseTemporal(diasConSintomas);
  const advertenciaFaseCritica = faseTemporal === 'CRITICA' && fiebreBajoRecientemente;

  const clasificacion = obtenerClasificacion({
    tieneSignoGrave: sintomasGraves.length > 0,
    tieneSignoAlarma: signosAlarma.length > 0,
    tieneContextoDengue,
    cumpleCriterioPosible,
  });

  const detalles = obtenerDetallesTriaje(clasificacion);
  const motivosDerivacion = obtenerMotivosDerivacion(
    clasificacion,
    sintomasGraves,
    signosAlarma,
    advertenciaFaseCritica,
  );
  const pesoTotalMaximo = CATALOGO_SINTOMAS.reduce((acc, s) => acc + s.peso, 0);
  const pesoSeleccionado = seleccionados.reduce((acc, s) => acc + s.peso, 0);

  return {
    clasificacion,
    riskScore: Math.min(100, Math.round((pesoSeleccionado / pesoTotalMaximo) * 100)),
    sintomasSeleccionados: seleccionados,
    tieneSignoAlarma: signosAlarma.length > 0,
    tieneSignoGrave: sintomasGraves.length > 0,
    tieneContextoDengue,
    faseTemporal,
    advertenciaFaseCritica,
    motivosDerivacion,
    ...detalles,
  };
}

function obtenerFaseTemporal(diasConSintomas: number): FaseDengue {
  if (diasConSintomas >= 7) return 'RECUPERACION';
  if (diasConSintomas >= 3) return 'CRITICA';
  return 'FEBRIL';
}

function obtenerClasificacion({
  tieneSignoGrave,
  tieneSignoAlarma,
  tieneContextoDengue,
  cumpleCriterioPosible,
}: {
  tieneSignoGrave: boolean;
  tieneSignoAlarma: boolean;
  tieneContextoDengue: boolean;
  cumpleCriterioPosible: boolean;
}): ClasificacionDengue {
  if (tieneSignoGrave) return 'DENGUE_GRAVE';
  if (tieneSignoAlarma && tieneContextoDengue) return 'DENGUE_ALARMA';
  if (tieneSignoAlarma) return 'CONSULTA_MEDICA';
  if (cumpleCriterioPosible) return 'DENGUE_POSIBLE';
  return 'BAJO_RIESGO';
}

function obtenerDetallesTriaje(clasificacion: ClasificacionDengue): DetallesTriaje {
  switch (clasificacion) {
    case 'DENGUE_GRAVE':
      return {
        tituloResultado: 'Emergencia médica: buscá ayuda ahora',
        colorBadge: 'DENGUE_GRAVE',
        nivelAtencion: 'EMERGENCIA',
        accionPrimaria: 'Llamá al 911 o acudí inmediatamente al hospital más cercano.',
        plazoAtencion: 'Ahora mismo',
        recomendaciones: [
          'Se reportaron síntomas que pueden corresponder a una emergencia médica.',
          'No esperés a que mejoren: pedí ayuda a un familiar o persona cercana para trasladarte.',
          'No tomés aspirina, ibuprofeno, naproxeno ni diclofenaco.',
        ],
        accionesRequeridas: ['Llamar al 911', 'Ver hospital más cercano', 'Compartir ubicación'],
      };
    case 'DENGUE_ALARMA':
      return {
        tituloResultado: 'Atención hoy: signos de alarma',
        colorBadge: 'DENGUE_ALARMA',
        nivelAtencion: 'ATENCION_HOY',
        accionPrimaria: 'Acudí hoy a un centro de salud u hospital para una valoración presencial.',
        plazoAtencion: 'Hoy, sin esperar a que empeore',
        recomendaciones: [
          'Los síntomas reportados requieren valoración médica el mismo día.',
          'Mientras te trasladás, tomá líquidos si los tolerás.',
          'No tomés aspirina, ibuprofeno, naproxeno ni diclofenaco.',
        ],
        accionesRequeridas: ['Acudir hoy a un centro de salud', 'Buscar hospital cercano', 'Compartir ubicación'],
      };
    case 'CONSULTA_MEDICA':
      return {
        tituloResultado: 'Atención hoy: síntoma que requiere valoración',
        colorBadge: 'CONSULTA_MEDICA',
        nivelAtencion: 'ATENCION_HOY',
        accionPrimaria: 'Acudí hoy a una unidad de salud para que te evalúen presencialmente.',
        plazoAtencion: 'Hoy, aunque no se confirme dengue',
        recomendaciones: [
          'Este síntoma puede requerir atención médica por dengue u otra causa.',
          'No esperés a que aparezca fiebre para buscar valoración.',
          'No tomés aspirina, ibuprofeno, naproxeno ni diclofenaco.',
        ],
        accionesRequeridas: ['Acudir hoy a un centro de salud', 'Buscar hospital cercano'],
      };
    case 'DENGUE_POSIBLE':
      return {
        tituloResultado: 'Posible dengue sin signos de alarma',
        colorBadge: 'DENGUE_POSIBLE',
        nivelAtencion: 'MONITOREO_ESTRECHO',
        accionPrimaria: 'Descansá, hidratate y reevaluá de inmediato si aparece un signo de alarma.',
        plazoAtencion: 'Reevaluá ante cualquier empeoramiento',
        recomendaciones: [
          'Tus síntomas son compatibles con una sospecha de dengue, pero la app no puede confirmarlo.',
          'Tomá abundantes líquidos y usá únicamente acetaminofén para fiebre o dolor.',
          'Buscá atención hoy si aparece dolor abdominal intenso, vómitos persistentes, sangrado, somnolencia o dificultad para respirar.',
        ],
        accionesRequeridas: ['Reevaluar si aparece un signo de alarma', 'Leer cuidados en casa'],
      };
    case 'BAJO_RIESGO':
    default:
      return {
        tituloResultado: 'Sin criterios actuales de alarma por dengue',
        colorBadge: 'BAJO_RIESGO',
        nivelAtencion: 'AUTOCUIDADO',
        accionPrimaria: 'Vigilá tus síntomas y realizá otra evaluación si aparece fiebre o empeorás.',
        plazoAtencion: 'Reevaluá si aparecen síntomas nuevos',
        recomendaciones: [
          'Los síntomas reportados no cumplen criterios actuales de sospecha o alarma por dengue.',
          'Si aparece fiebre, dolor abdominal intenso, vómitos persistentes, sangrado o dificultad para respirar, evaluate de nuevo y buscá atención.',
          'Eliminá recipientes con agua estancada para prevenir criaderos de mosquitos.',
        ],
        accionesRequeridas: ['Monitorear síntomas', 'Leer consejos de prevención'],
      };
  }
}

function obtenerMotivosDerivacion(
  clasificacion: ClasificacionDengue,
  sintomasGraves: Sintoma[],
  signosAlarma: Sintoma[],
  advertenciaFaseCritica: boolean,
): string[] {
  if (clasificacion === 'DENGUE_GRAVE') {
    return sintomasGraves.map((s) => s.nombre);
  }

  if (clasificacion === 'DENGUE_ALARMA' || clasificacion === 'CONSULTA_MEDICA') {
    return signosAlarma.map((s) => s.nombre);
  }

  if (advertenciaFaseCritica) {
    return ['La fiebre bajó recientemente entre los días 3 y 6 de síntomas'];
  }

  return [];
}
