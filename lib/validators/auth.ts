import { z } from 'zod';

export const DEPARTAMENTOS_NICARAGUA = [
  'Boaco',
  'Carazo',
  'Chinandega',
  'Chontales',
  'Estelí',
  'Granada',
  'Jinotega',
  'León',
  'Madriz',
  'Managua',
  'Masaya',
  'Matagalpa',
  'Nueva Segovia',
  'RACCN',
  'RACCS',
  'Río San Juan',
  'Rivas',
] as const;

export const SILAIS_NICARAGUA = [
  'Boaco',
  'Carazo',
  'Chinandega',
  'Chontales',
  'Estelí',
  'Granada',
  'Jinotega',
  'Las Minas',
  'León',
  'Madriz',
  'Managua',
  'Masaya',
  'Matagalpa',
  'Nueva Segovia',
  'RACCN',
  'RACCS',
  'Río San Juan',
  'Rivas',
  'Zelaya Central',
] as const;

export const ESPECIALIDADES_MEDICAS = [
  'Médico General',
  'Medicina Interna',
  'Pediatría',
  'Ginecología y Obstetricia',
  'Cirugía General',
  'Anestesiología',
  'Ortopedia y Traumatología',
  'Radiología e Imagenología',
  'Patología',
  'Dermatología',
  'Infectología',
  'Medicina Crítica / Intensivista',
  'Nefrología',
  'Neonatología',
  'Oncología',
  'Epidemiología',
  'Otra',
] as const;

export const LoginSchema = z.object({
  email: z.string().email('Por favor ingresá un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const RegistroPacienteSchema = z.object({
  email: z.string().email('Por favor ingresá un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nombreCompleto: z.string().min(3, 'Ingresá tu nombre completo'),
  fechaNacimiento: z.string().min(1, 'Seleccioná tu fecha de nacimiento'),
  departamento: z.enum(DEPARTAMENTOS_NICARAGUA, {
    errorMap: () => ({ message: 'Seleccioná un departamento válido de Nicaragua' }),
  }),
});

export const RegistroMedicoSchema = z.object({
  email: z.string().email('Por favor ingresá un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nombreCompleto: z.string().min(3, 'Ingresá tu nombre completo con título (Dr./Dra.)'),
  codigoMinsa: z.string().min(3, 'Ingresá tu código sanitario MINSA válido'),
  especialidad: z.enum(ESPECIALIDADES_MEDICAS, {
    errorMap: () => ({ message: 'Seleccioná tu especialidad médica' }),
  }),
  unidadDeSalud: z.string().min(3, 'Ingresá el hospital o centro de salud donde laborás'),
  silais: z.enum(SILAIS_NICARAGUA, {
    errorMap: () => ({ message: 'Seleccioná el SILAIS correspondiente' }),
  }),
  telefono: z.string().min(8, 'Ingresá tu número de teléfono de contacto'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegistroPacienteInput = z.infer<typeof RegistroPacienteSchema>;
export type RegistroMedicoInput = z.infer<typeof RegistroMedicoSchema>;
