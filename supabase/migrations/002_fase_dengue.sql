-- Migración 002: Agregar columna de fase de dengue en la tabla symptom_logs

ALTER TABLE public.symptom_logs 
  ADD COLUMN IF NOT EXISTS fase_enfermedad VARCHAR(20) CHECK (fase_enfermedad IN ('FEBRIL', 'CRITICA', 'RECUPERACION'));

-- Hacer opcional la columna days_with_symptoms
ALTER TABLE public.symptom_logs 
  ALTER COLUMN days_with_symptoms DROP NOT NULL;
