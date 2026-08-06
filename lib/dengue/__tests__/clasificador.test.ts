import { describe, it, expect } from 'vitest';
import { clasificarDengue } from '../clasificador';

describe('clasificarDengue — Algoritmo OMS 2009', () => {
  describe('DENGUE_GRAVE (Categoría SEVERE)', () => {
    it('clasifica como DENGUE_GRAVE si se selecciona al menos 1 síntoma grave', () => {
      const res1 = clasificarDengue(['S21']);
      expect(res1.clasificacion).toBe('DENGUE_GRAVE');
      expect(res1.tieneSignoGrave).toBe(true);

      const res2 = clasificarDengue(['S24']);
      expect(res2.clasificacion).toBe('DENGUE_GRAVE');
    });

    it('DENGUE_GRAVE prevalece sobre signos de alarma y síntomas generales', () => {
      const res = clasificarDengue(['S01', 'S02', 'S11', 'S21']);
      expect(res.clasificacion).toBe('DENGUE_GRAVE');
    });
  });

  describe('DENGUE_ALARMA (Categoría WARNING con contexto)', () => {
    it('clasifica como DENGUE_ALARMA si hay al menos 1 signo de alarma Y fiebre (S01)', () => {
      const res1 = clasificarDengue(['S01', 'S11']);
      expect(res1.clasificacion).toBe('DENGUE_ALARMA');
      expect(res1.tieneSignoAlarma).toBe(true);
      expect(res1.tieneContextoDengue).toBe(true);
      expect(res1.nivelAtencion).toBe('ATENCION_HOY');

      const res2 = clasificarDengue(['S01', 'S13']);
      expect(res2.clasificacion).toBe('DENGUE_ALARMA');
    });

    it('clasifica como DENGUE_ALARMA si hay signo de alarma Y al menos 2 síntomas generales sin fiebre', () => {
      const res = clasificarDengue(['S02', 'S04', 'S11']);
      expect(res.clasificacion).toBe('DENGUE_ALARMA');
      expect(res.tieneContextoDengue).toBe(true);
    });

    it('DENGUE_ALARMA prevalece sobre DENGUE_POSIBLE', () => {
      const res = clasificarDengue(['S01', 'S02', 'S04', 'S11']);
      expect(res.clasificacion).toBe('DENGUE_ALARMA');
    });
  });

  describe('CONSULTA_MEDICA (Categoría WARNING sin contexto de dengue)', () => {
    it('clasifica como CONSULTA_MEDICA cuando hay signo de alarma aislado sin fiebre ni contexto', () => {
      const res1 = clasificarDengue(['S11']);
      expect(res1.clasificacion).toBe('CONSULTA_MEDICA');
      expect(res1.tieneSignoAlarma).toBe(true);
      expect(res1.tieneContextoDengue).toBe(false);
      expect(res1.nivelAtencion).toBe('ATENCION_HOY');
      expect(res1.accionPrimaria).toContain('Acudí hoy');

      const res2 = clasificarDengue(['S14']);
      expect(res2.clasificacion).toBe('CONSULTA_MEDICA');
    });

    it('WARNING + 1 solo síntoma general (sin fiebre) clasifica como CONSULTA_MEDICA', () => {
      const res = clasificarDengue(['S02', 'S12']);
      expect(res.clasificacion).toBe('CONSULTA_MEDICA');
      expect(res.tieneContextoDengue).toBe(false);
    });

    it('DENGUE_GRAVE prevalece sobre CONSULTA_MEDICA', () => {
      const res = clasificarDengue(['S11', 'S21']);
      expect(res.clasificacion).toBe('DENGUE_GRAVE');
    });
  });

  describe('DENGUE_POSIBLE (Categoría GENERAL)', () => {
    it('clasifica como DENGUE_POSIBLE cuando hay fiebre (S01) + al menos 2 síntomas generales', () => {
      const res = clasificarDengue(['S01', 'S02', 'S04']);
      expect(res.clasificacion).toBe('DENGUE_POSIBLE');
      expect(res.nivelAtencion).toBe('MONITOREO_ESTRECHO');
    });

    it('solo fiebre (S01) no clasifica como dengue posible', () => {
      const res = clasificarDengue(['S01']);
      expect(res.clasificacion).toBe('BAJO_RIESGO');
    });

    it('fiebre + solo 1 síntoma general no clasifica como dengue posible', () => {
      const res = clasificarDengue(['S01', 'S02']);
      expect(res.clasificacion).toBe('BAJO_RIESGO');
    });

    it('síntomas generales sin fiebre no clasifican como dengue posible', () => {
      const res = clasificarDengue(['S02', 'S03', 'S04', 'S05']);
      expect(res.clasificacion).toBe('BAJO_RIESGO');
    });
  });

  describe('BAJO_RIESGO', () => {
    it('devuelve BAJO_RIESGO cuando no hay síntomas o no cumplen criterios', () => {
      expect(clasificarDengue([]).clasificacion).toBe('BAJO_RIESGO');
      expect(clasificarDengue(['S06', 'S09']).clasificacion).toBe('BAJO_RIESGO');
    });
  });

  describe('Casos Borde y Cobertura Extendida OMS', () => {
    it('seleccionar SOLO síntomas de Categoría C (grave) genera DENGUE_GRAVE inmediatamente', () => {
      const res = clasificarDengue(['S21', 'S25']);
      expect(res.clasificacion).toBe('DENGUE_GRAVE');
      expect(res.tieneSignoGrave).toBe(true);
    });

    it('fiebre (S01) + exactamente 1 síntoma general es BAJO_RIESGO (criterio OMS exige >= 2 generales)', () => {
      const res = clasificarDengue(['S01', 'S03']);
      expect(res.clasificacion).toBe('BAJO_RIESGO');
    });

    it('todos los síntomas seleccionados genera DENGUE_GRAVE con score máximo (100)', () => {
      const todosLosIds = Array.from({ length: 25 }, (_, i) => `S${String(i + 1).padStart(2, '0')}` as any);
      const res = clasificarDengue(todosLosIds);
      expect(res.clasificacion).toBe('DENGUE_GRAVE');
      expect(res.riskScore).toBe(100);
    });
  });

  describe('Fases Temporales e Integración de Días (OMS)', () => {
    it('asigna correctamente las fases temporales según los días con síntomas', () => {
      expect(clasificarDengue(['S01'], 1).faseTemporal).toBe('FEBRIL');
      expect(clasificarDengue(['S01'], 3).faseTemporal).toBe('CRITICA');
      expect(clasificarDengue(['S01'], 5).faseTemporal).toBe('CRITICA');
      expect(clasificarDengue(['S01'], 7).faseTemporal).toBe('RECUPERACION');
    });

    it('no eleva la clasificación solo por estar en la fase crítica', () => {
      const resDia1 = clasificarDengue(['S01', 'S02', 'S04'], 1);
      expect(resDia1.clasificacion).toBe('DENGUE_POSIBLE');

      const resDia5 = clasificarDengue(['S01', 'S02', 'S04'], 5);
      expect(resDia5.clasificacion).toBe('DENGUE_POSIBLE');
      expect(resDia5.faseTemporal).toBe('CRITICA');
    });

    it('agrega vigilancia reforzada si la fiebre bajó en días 3 a 6 sin cambiar la clasificación', () => {
      const res = clasificarDengue(['S01', 'S02', 'S04'], 4, true);
      expect(res.clasificacion).toBe('DENGUE_POSIBLE');
      expect(res.nivelAtencion).toBe('MONITOREO_ESTRECHO');
      expect(res.advertenciaFaseCritica).toBe(true);
      expect(res.motivosDerivacion).toContain(
        'La fiebre bajó recientemente entre los días 3 y 6 de síntomas',
      );
    });

    it('síntomas SEVERE en día 8 (Recuperación) mantienen clasificación DENGUE_GRAVE', () => {
      const res = clasificarDengue(['S21', 'S22'], 8);
      expect(res.clasificacion).toBe('DENGUE_GRAVE');
      expect(res.faseTemporal).toBe('RECUPERACION');
    });
  });
});
