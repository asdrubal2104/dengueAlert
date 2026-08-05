export type DepartamentoNicaragua =
  | 'Boaco'
  | 'Carazo'
  | 'Chinandega'
  | 'Chontales'
  | 'Estelí'
  | 'Granada'
  | 'Jinotega'
  | 'León'
  | 'Madriz'
  | 'Managua'
  | 'Masaya'
  | 'Matagalpa'
  | 'Nueva Segovia'
  | 'RACCN'
  | 'RACCS'
  | 'Río San Juan'
  | 'Rivas';

export type SilaisNicaragua =
  | 'Boaco'
  | 'Carazo'
  | 'Chinandega'
  | 'Chontales'
  | 'Estelí'
  | 'Granada'
  | 'Jinotega'
  | 'Las Minas'
  | 'León'
  | 'Madriz'
  | 'Managua'
  | 'Masaya'
  | 'Matagalpa'
  | 'Nueva Segovia'
  | 'RACCN'
  | 'RACCS'
  | 'Río San Juan'
  | 'Rivas'
  | 'Zelaya Central';

export type EspecialidadMedica =
  | 'Médico General'
  | 'Medicina Interna'
  | 'Pediatría'
  | 'Ginecología y Obstetricia'
  | 'Cirugía General'
  | 'Anestesiología'
  | 'Ortopedia y Traumatología'
  | 'Radiología e Imagenología'
  | 'Patología'
  | 'Dermatología'
  | 'Infectología'
  | 'Medicina Crítica / Intensivista'
  | 'Nefrología'
  | 'Neonatología'
  | 'Oncología'
  | 'Epidemiología'
  | 'Otra';

export type Comorbilidad =
  | 'Hipertensión arterial'
  | 'Diabetes mellitus'
  | 'Asma bronquial'
  | 'Enfermedad renal crónica'
  | 'Artritis / Enfermedades reumáticas'
  | 'Enfermedad del corazón'
  | 'Epilepsia'
  | 'Problemas de tiroides'
  | 'VIH / SIDA'
  | 'Ninguna';

export interface NumeroEmergencia {
  nombre: string;
  numero: string;
  descripcion: string;
  icono: string;
}

export const NUMEROS_EMERGENCIA_NICARAGUA: NumeroEmergencia[] = [
  {
    nombre: 'Emergencias MINSA',
    numero: '102',
    descripcion: 'Central de ambulancias y emergencias médicas del MINSA',
    icono: 'ambulance',
  },
  {
    nombre: 'Cruz Blanca Nicaragua',
    numero: '128',
    descripcion: 'Servicio de ambulancia y rescate prehospitalario',
    icono: 'ambulance',
  },
  {
    nombre: 'Dirección General de Bomberos',
    numero: '115',
    descripcion: 'Atención prehospitalaria y bomberos',
    icono: 'flame',
  },
  {
    nombre: 'Policía Nacional',
    numero: '118',
    descripcion: 'Asistencia y emergencias de seguridad',
    icono: 'shield',
  },
];
