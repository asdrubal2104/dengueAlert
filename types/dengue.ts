export type SintomaId =
  | 'S01'
  | 'S02'
  | 'S03'
  | 'S04'
  | 'S05'
  | 'S06'
  | 'S07'
  | 'S08'
  | 'S09'
  | 'S10'
  | 'S11'
  | 'S12'
  | 'S13'
  | 'S14'
  | 'S15'
  | 'S16'
  | 'S17'
  | 'S18'
  | 'S19'
  | 'S20'
  | 'S21'
  | 'S22'
  | 'S23'
  | 'S24'
  | 'S25';

export type CategoriaSintoma = 'GENERAL' | 'WARNING' | 'SEVERE';

export interface Sintoma {
  id: SintomaId;
  nombre: string;
  descripcion: string;
  icono: string;
  categoria: CategoriaSintoma;
  peso: number;
  esSignoAlarma: boolean;
}

export type ClasificacionDengue =
  | 'BAJO_RIESGO'
  | 'DENGUE_POSIBLE'
  | 'CONSULTA_MEDICA'
  | 'DENGUE_ALARMA'
  | 'DENGUE_GRAVE';

export type FaseDengue = 'FEBRIL' | 'CRITICA' | 'RECUPERACION';

export type NivelAtencion =
  | 'AUTOCUIDADO'
  | 'MONITOREO_ESTRECHO'
  | 'ATENCION_HOY'
  | 'EMERGENCIA';

export interface ResultadoEvaluacion {
  clasificacion: ClasificacionDengue;
  riskScore: number;
  sintomasSeleccionados: Sintoma[];
  tieneSignoAlarma: boolean;
  tieneSignoGrave: boolean;
  tieneContextoDengue: boolean;
  faseTemporal: FaseDengue;
  nivelAtencion: NivelAtencion;
  accionPrimaria: string;
  plazoAtencion: string;
  motivosDerivacion: string[];
  advertenciaFaseCritica: boolean;
  recomendaciones: string[];
  accionesRequeridas: string[];
  colorBadge: string;
  tituloResultado: string;
}

export interface RegistroSintomas {
  id: string;
  pacienteId: string;
  fechaRegistro: string;
  diasConSintomas: number;
  fiebreBajoRecientemente?: boolean;
  faseDengue?: FaseDengue;
  sintomasIds: SintomaId[];
  clasificacion: ClasificacionDengue;
  riskScore: number;
  notas?: string;
  pacienteNombre?: string;
}

export type TipoAlerta = 'WARNING' | 'EMERGENCY';
export type EstadoAlerta = 'TRIGGERED' | 'SEEN' | 'ACTED';

export interface Alerta {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  evaluacionId: string;
  tipo: TipoAlerta;
  estado: EstadoAlerta;
  fechaHora: string;
  latitud?: number;
  longitud?: number;
  sintomasCriticos: string[];
}
