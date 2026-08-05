import { describe, it, expect } from 'vitest';
import { LoginSchema, RegistroPacienteSchema, RegistroMedicoSchema } from '../auth';

describe('Validadores de Autenticación (Zod)', () => {
  describe('LoginSchema', () => {
    it('falla con email inválido', () => {
      const res = LoginSchema.safeParse({ email: 'correo-invalido', password: 'password123' });
      expect(res.success).toBe(false);
    });

    it('falla con contraseña menor a 6 caracteres', () => {
      const res = LoginSchema.safeParse({ email: 'usuario@minsa.gob.ni', password: '123' });
      expect(res.success).toBe(false);
    });

    it('pasa con datos válidos', () => {
      const res = LoginSchema.safeParse({ email: 'dr.perez@minsa.gob.ni', password: 'password123' });
      expect(res.success).toBe(true);
    });
  });

  describe('RegistroPacienteSchema', () => {
    it('falla con departamento que no pertenece a Nicaragua', () => {
      const res = RegistroPacienteSchema.safeParse({
        email: 'paciente@gmail.com',
        password: 'password123',
        nombreCompleto: 'Juan Pérez',
        fechaNacimiento: '1995-05-10',
        departamento: 'San José',
      });
      expect(res.success).toBe(false);
    });

    it('pasa con un departamento nicaragüense válido', () => {
      const res = RegistroPacienteSchema.safeParse({
        email: 'paciente@gmail.com',
        password: 'password123',
        nombreCompleto: 'Juan Pérez',
        fechaNacimiento: '1995-05-10',
        departamento: 'Managua',
      });
      expect(res.success).toBe(true);
    });
  });

  describe('RegistroMedicoSchema', () => {
    it('falla si código MINSA tiene menos de 3 caracteres', () => {
      const res = RegistroMedicoSchema.safeParse({
        email: 'medico@minsa.gob.ni',
        password: 'password123',
        nombreCompleto: 'Dr. Roberto',
        codigoMinsa: 'M1',
        especialidad: 'Medicina Interna',
        unidadDeSalud: 'Hospital Manolo Morales',
        silais: 'Managua',
        telefono: '88889999',
      });
      expect(res.success).toBe(false);
    });

    it('pasa con todos los campos válidos del médico MINSA', () => {
      const res = RegistroMedicoSchema.safeParse({
        email: 'medico@minsa.gob.ni',
        password: 'password123',
        nombreCompleto: 'Dr. Roberto López',
        codigoMinsa: 'MINSA-12345',
        especialidad: 'Medicina Interna',
        unidadDeSalud: 'Hospital Manolo Morales',
        silais: 'Managua',
        telefono: '88889999',
      });
      expect(res.success).toBe(true);
    });
  });
});
