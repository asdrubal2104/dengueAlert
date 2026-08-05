import {
  DepartamentoNicaragua,
  SilaisNicaragua,
  EspecialidadMedica,
  Comorbilidad,
} from './nicaragua';

export type RolUsuario = 'PACIENTE' | 'MEDICO';

export interface PerfilUsuario {
  id: string;
  email: string;
  nombreCompleto: string;
  rol: RolUsuario;
  fechaNacimiento?: string;
  departamento?: DepartamentoNicaragua;
  telefono?: string;
  tipoSangre?: string;
  pesoKg?: number;
  enfermedadesCronicas?: Comorbilidad[];
  medicamentosActuales?: string;
  // Campos específicos de médico
  codigoMinsa?: string;
  especialidad?: EspecialidadMedica;
  unidadDeSalud?: string;
  silais?: SilaisNicaragua;
  avatarUrl?: string;
  fechaRegistro: string;
}

export interface VinculacionMedicoPaciente {
  id: string;
  medicoId: string;
  medicoNombre: string;
  medicoEspecialidad: string;
  medicoHospital: string;
  pacienteId: string;
  pacienteNombre: string;
  codigoVinculacion: string;
  estado: 'PENDING' | 'ACTIVE' | 'REVOKED';
  fechaVinculacion: string;
}
