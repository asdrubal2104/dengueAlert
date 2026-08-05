/**
 * 🎭 DATOS DEMO — Dengue Alert Nicaragua
 * 5 pacientes ficticios nicaragüenses con historial clínico realista.
 * Solo para presentación universitaria. No contiene datos reales.
 */

import { PerfilUsuario } from '@/types/user';
import { RegistroSintomas, Alerta, SintomaId } from '@/types/dengue';

// ─── PERFILES DE PACIENTES ────────────────────────────────────────────────────

export const DEMO_PACIENTES: PerfilUsuario[] = [
  {
    id: 'demo-p-001',
    email: 'natalia.lopez@ejemplo.ni',
    nombreCompleto: 'Natalia Elena López Martínez',
    rol: 'PACIENTE',
    fechaNacimiento: '1992-03-18',
    departamento: 'Managua',
    telefono: '+505 8812 3456',
    tipoSangre: 'A+',
    pesoKg: 68,
    enfermedadesCronicas: ['Diabetes mellitus'],
    medicamentosActuales: 'Metformina 850mg',
    fechaRegistro: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'demo-p-002',
    email: 'carlos.ruiz@yahoo.com',
    nombreCompleto: 'Carlos Alberto Ruiz Herrera',
    rol: 'PACIENTE',
    fechaNacimiento: '1998-07-22',
    departamento: 'León',
    telefono: '+505 8734 5678',
    tipoSangre: 'O+',
    pesoKg: 75,
    enfermedadesCronicas: ['Ninguna'],
    medicamentosActuales: '',
    fechaRegistro: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'demo-p-003',
    email: 'ana.garcia@hotmail.com',
    nombreCompleto: 'Ana Sofía García Morales',
    rol: 'PACIENTE',
    fechaNacimiento: '1981-11-05',
    departamento: 'Masaya',
    telefono: '+505 8656 7890',
    tipoSangre: 'B+',
    pesoKg: 72,
    enfermedadesCronicas: ['Hipertensión arterial'],
    medicamentosActuales: 'Enalapril 10mg',
    fechaRegistro: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'demo-p-004',
    email: 'pedro.jimenez@gmail.com',
    nombreCompleto: 'Pedro José Jiménez Torres',
    rol: 'PACIENTE',
    fechaNacimiento: '2007-04-30',
    departamento: 'Chinandega',
    telefono: '+505 8978 9012',
    tipoSangre: 'O-',
    pesoKg: 68,
    enfermedadesCronicas: ['Ninguna'],
    medicamentosActuales: '',
    fechaRegistro: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'demo-p-005',
    email: 'rosa.vega@gmail.com',
    nombreCompleto: 'Rosa Emilia Vega Castro',
    rol: 'PACIENTE',
    fechaNacimiento: '1965-09-12',
    departamento: 'Granada',
    telefono: '+505 8545 6789',
    tipoSangre: 'AB+',
    pesoKg: 82,
    enfermedadesCronicas: ['Hipertensión arterial', 'Diabetes mellitus'],
    medicamentosActuales: 'Losartán 50mg, Glibenclamida 5mg',
    fechaRegistro: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
];

// ─── HISTORIAL DE EVALUACIONES ─────────────────────────────────────────────────
// Cada paciente tiene 3-5 días de evaluaciones con evolución lógica

export const DEMO_REGISTROS: RegistroSintomas[] = [
  // ─── Natalia Elena López — Evolución hacia DENGUE GRAVE (día 1→5) ───────────
  {
    id: 'demo-r-001-d5',
    pacienteId: 'demo-p-001',
    pacienteNombre: 'Natalia Elena López Martínez',
    fechaRegistro: new Date(Date.now()).toISOString(),
    diasConSintomas: 1,

    sintomasIds: ['S01', 'S02'] as SintomaId[], // Fiebre, cefalea
    clasificacion: 'DENGUE_POSIBLE',
    riskScore: 15,
    notas: 'Inicio de fiebre. Toma paracetamol 500mg. Glucemia 210 mg/dL.',
  },
  {
    id: 'demo-r-001-d2',
    pacienteId: 'demo-p-001',
    pacienteNombre: 'Natalia Elena López Martínez',
    fechaRegistro: new Date(Date.now() - 86400000 * 3).toISOString(),
    diasConSintomas: 2,

    sintomasIds: ['S01', 'S02', 'S04', 'S05'] as SintomaId[], // + mialgias, artralgia
    clasificacion: 'DENGUE_POSIBLE',
    riskScore: 28,
    notas: 'Fiebre persiste 38.8°C. Refiere dolor generalizado intenso.',
  },
  {
    id: 'demo-r-001-d3',
    pacienteId: 'demo-p-001',
    pacienteNombre: 'Natalia Elena López Martínez',
    fechaRegistro: new Date(Date.now() - 86400000 * 2).toISOString(),
    diasConSintomas: 3,
    sintomasIds: ['S01', 'S02', 'S04', 'S05', 'S11', 'S12'] as SintomaId[], // + dolor abdominal, vómitos
    clasificacion: 'DENGUE_ALARMA',
    riskScore: 62,
    notas:
      '⚠️ ALERTA: Inicio de dolor abdominal. Vómitos persistentes. Hidratación oral insuficiente. Glucemia 280 mg/dL.',
  },
  {
    id: 'demo-r-001-d4',
    pacienteId: 'demo-p-001',
    pacienteNombre: 'Natalia Elena López Martínez',
    fechaRegistro: new Date(Date.now() - 86400000 * 1).toISOString(),
    diasConSintomas: 4,

    sintomasIds: ['S01', 'S02', 'S04', 'S11', 'S12', 'S15', 'S16', 'S17'] as SintomaId[], // + sangrado, dificultad respirar, desorientación
    clasificacion: 'DENGUE_GRAVE',
    riskScore: 88,
    notas:
      '🔴 EMERGENCIA: Sangrado de encías. Dificultad para respirar. Episodio de síncope. REQUIERE HOSPITALIZACIÓN INMEDIATA.',
  },

  // ─── Carlos Ruiz — DENGUE ALARMA (día 1→3) ───────────────────────────────
  {
    id: 'demo-r-002-d1',
    pacienteId: 'demo-p-002',
    pacienteNombre: 'Carlos Alberto Ruiz Herrera',
    fechaRegistro: new Date(Date.now() - 86400000 * 3).toISOString(),
    diasConSintomas: 1,
    sintomasIds: ['S01', 'S03'] as SintomaId[], // Fiebre, malestar general
    clasificacion: 'DENGUE_POSIBLE',
    riskScore: 12,
    notas: 'Fiebre 38.2°C. Refiere malestar general desde ayer.',
  },
  {
    id: 'demo-r-002-d2',
    pacienteId: 'demo-p-002',
    pacienteNombre: 'Carlos Alberto Ruiz Herrera',
    fechaRegistro: new Date(Date.now() - 86400000 * 2).toISOString(),
    diasConSintomas: 2,
    sintomasIds: ['S01', 'S03', 'S04', 'S07'] as SintomaId[], // + mialgias, rash
    clasificacion: 'DENGUE_POSIBLE',
    riskScore: 25,
    notas: 'Aparición de rash cutáneo maculopapular. Fiebre 39.1°C.',
  },
  {
    id: 'demo-r-002-d3',
    pacienteId: 'demo-p-002',
    pacienteNombre: 'Carlos Alberto Ruiz Herrera',
    fechaRegistro: new Date(Date.now() - 86400000 * 1).toISOString(),
    diasConSintomas: 3,
    sintomasIds: ['S01', 'S03', 'S04', 'S07', 'S11', 'S13'] as SintomaId[], // + dolor abdominal, sangrado encías
    clasificacion: 'DENGUE_ALARMA',
    riskScore: 58,
    notas: '⚠️ Dolor epigástrico. Sangrado leve de encías. Derivado a triaje del MINSA.',
  },

  // ─── Ana Sofía García — DENGUE POSIBLE (día 1→2) ─────────────────────────
  {
    id: 'demo-r-003-d1',
    pacienteId: 'demo-p-003',
    pacienteNombre: 'Ana Sofía García Morales',
    fechaRegistro: new Date(Date.now() - 86400000 * 2).toISOString(),
    diasConSintomas: 1,
    sintomasIds: ['S01', 'S02', 'S05'] as SintomaId[], // Fiebre, cefalea, artralgia
    clasificacion: 'DENGUE_POSIBLE',
    riskScore: 22,
    notas:
      'TA 160/95 mmHg (elevada). Fiebre 38.5°C. Se indica hidratación oral y control de presión.',
  },
  {
    id: 'demo-r-003-d2',
    pacienteId: 'demo-p-003',
    pacienteNombre: 'Ana Sofía García Morales',
    fechaRegistro: new Date(Date.now() - 86400000 * 1).toISOString(),
    diasConSintomas: 2,
    sintomasIds: ['S01', 'S02', 'S04', 'S05', 'S06'] as SintomaId[], // + mialgias, náuseas
    clasificacion: 'DENGUE_POSIBLE',
    riskScore: 35,
    notas: 'Fiebre persiste. Náuseas sin vómitos. TA controlada. Continúa seguimiento ambulatorio.',
  },

  // ─── Pedro Jiménez — BAJO RIESGO (día 1) ─────────────────────────────────
  {
    id: 'demo-r-004-d1',
    pacienteId: 'demo-p-004',
    pacienteNombre: 'Pedro José Jiménez Torres',
    fechaRegistro: new Date(Date.now() - 86400000 * 1).toISOString(),
    diasConSintomas: 1,
    sintomasIds: ['S01'] as SintomaId[], // Solo fiebre
    clasificacion: 'BAJO_RIESGO',
    riskScore: 8,
    notas: 'Fiebre 37.8°C de inicio reciente. Buen estado general. Hidratación adecuada.',
  },

  // ─── Rosa Emilia Vega — DENGUE ALARMA (día 1→4) ──────────────────────────
  {
    id: 'demo-r-005-d1',
    pacienteId: 'demo-p-005',
    pacienteNombre: 'Rosa Emilia Vega Castro',
    fechaRegistro: new Date(Date.now() - 86400000 * 5).toISOString(),
    diasConSintomas: 1,
    sintomasIds: ['S01', 'S02', 'S03'] as SintomaId[], // Fiebre, cefalea, malestar
    clasificacion: 'DENGUE_POSIBLE',
    riskScore: 18,
    notas: 'Fiebre 38°C. Cefalea intensa. Glucemia 245 mg/dL. Presión 155/90.',
  },
  {
    id: 'demo-r-005-d2',
    pacienteId: 'demo-p-005',
    pacienteNombre: 'Rosa Emilia Vega Castro',
    fechaRegistro: new Date(Date.now() - 86400000 * 4).toISOString(),
    diasConSintomas: 2,
    sintomasIds: ['S01', 'S02', 'S03', 'S04', 'S06'] as SintomaId[], // + mialgias, náuseas
    clasificacion: 'DENGUE_POSIBLE',
    riskScore: 32,
    notas: 'Náuseas persistentes. Hidratación oral difícil. Glucemia 290 mg/dL.',
  },
  {
    id: 'demo-r-005-d3',
    pacienteId: 'demo-p-005',
    pacienteNombre: 'Rosa Emilia Vega Castro',
    fechaRegistro: new Date(Date.now() - 86400000 * 3).toISOString(),
    diasConSintomas: 3,
    sintomasIds: ['S01', 'S02', 'S06', 'S11', 'S14'] as SintomaId[], // + dolor abdominal, frialdad
    clasificacion: 'DENGUE_ALARMA',
    riskScore: 65,
    notas: '⚠️ Dolor abdominal. Extremidades frías. Glucemia 320 mg/dL. Presión 95/60 mmHg (baja).',
  },
  {
    id: 'demo-r-005-d4',
    pacienteId: 'demo-p-005',
    pacienteNombre: 'Rosa Emilia Vega Castro',
    fechaRegistro: new Date(Date.now() - 86400000 * 2).toISOString(),
    diasConSintomas: 4,
    sintomasIds: ['S01', 'S06', 'S11', 'S12', 'S14', 'S18'] as SintomaId[], // + vómitos, líquido acumulado
    clasificacion: 'DENGUE_ALARMA',
    riskScore: 75,
    notas:
      '⚠️ INGRESADA: Hidratación IV iniciada. Vómitos persistentes. Ascitis leve. Glucemia 310 mg/dL.',
  },
];

// ─── ALERTAS GENERADAS ──────────────────────────────────────────────────────

export const DEMO_ALERTAS: Alerta[] = [
  {
    id: 'demo-alert-001',
    pacienteId: 'demo-p-001',
    pacienteNombre: 'Natalia Elena López Martínez',
    evaluacionId: 'demo-r-001-d4',
    tipo: 'EMERGENCY',
    estado: 'TRIGGERED',
    fechaHora: new Date(Date.now() - 86400000 * 1).toISOString(),
    sintomasCriticos: ['Sangrado de encías', 'Dificultad para respirar', 'Síncope (desmayo)'],
  },
  {
    id: 'demo-alert-002',
    pacienteId: 'demo-p-002',
    pacienteNombre: 'Carlos Alberto Ruiz Herrera',
    evaluacionId: 'demo-r-002-d3',
    tipo: 'WARNING',
    estado: 'SEEN',
    fechaHora: new Date(Date.now() - 86400000 * 1).toISOString(),
    sintomasCriticos: ['Dolor abdominal intenso', 'Sangrado de encías'],
  },
  {
    id: 'demo-alert-003',
    pacienteId: 'demo-p-005',
    pacienteNombre: 'Rosa Emilia Vega Castro',
    evaluacionId: 'demo-r-005-d3',
    tipo: 'WARNING',
    estado: 'ACTED',
    fechaHora: new Date(Date.now() - 86400000 * 3).toISOString(),
    sintomasCriticos: ['Dolor abdominal intenso', 'Extremidades frías'],
  },
];
