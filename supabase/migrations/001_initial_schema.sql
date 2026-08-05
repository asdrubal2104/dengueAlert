-- =================================================================
-- 🦟 DENGUE ALERT NICARAGUA — ESQUEMA DE BASE DE DATOS (SUPABASE / POSTGRES)
-- =================================================================

-- 1. Tabla de Perfiles de Usuario
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('PATIENT', 'DOCTOR')),
  full_name TEXT NOT NULL,
  birth_date DATE,
  phone VARCHAR(20),
  department TEXT,
  blood_type VARCHAR(10),
  weight_kg NUMERIC(5,2),
  chronic_diseases JSONB DEFAULT '[]'::jsonb,
  current_medications TEXT,
  minsa_code VARCHAR(50),
  specialty TEXT,
  health_unit TEXT,
  silais TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS para Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven su propio perfil" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuarios editan su propio perfil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. Tabla de Catálogo de Síntomas
CREATE TABLE IF NOT EXISTS public.symptoms (
  id VARCHAR(10) PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(10) NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('GENERAL', 'WARNING', 'SEVERE')),
  severity_weight INT NOT NULL,
  is_alarm_sign BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.symptoms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Todos leen catálogo de síntomas" ON public.symptoms FOR SELECT USING (true);

-- 3. Tabla de Registros de Síntomas (Symptom Logs)
CREATE TABLE IF NOT EXISTS public.symptom_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  days_with_symptoms INT NOT NULL CHECK (days_with_symptoms BETWEEN 1 AND 14),
  selected_symptom_ids JSONB NOT NULL,
  classification VARCHAR(30) NOT NULL CHECK (classification IN ('BAJO_RIESGO', 'DENGUE_POSIBLE', 'DENGUE_ALARMA', 'DENGUE_GRAVE')),
  risk_score INT NOT NULL,
  notes TEXT
);

ALTER TABLE public.symptom_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pacientes ven sus propios registros" ON public.symptom_logs
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Pacientes crean sus registros" ON public.symptom_logs
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- 4. Tabla de Alertas
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  log_id UUID REFERENCES public.symptom_logs(id) ON DELETE CASCADE,
  alert_type VARCHAR(20) NOT NULL CHECK (alert_type IN ('WARNING', 'EMERGENCY')),
  status VARCHAR(20) DEFAULT 'TRIGGERED' CHECK (status IN ('TRIGGERED', 'SEEN', 'ACTED')),
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  critical_symptoms JSONB DEFAULT '[]'::jsonb
);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- 5. Tabla de Vinculación Médico-Paciente
CREATE TABLE IF NOT EXISTS public.doctor_patient (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  link_code VARCHAR(10) NOT NULL,
  status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('PENDING', 'ACTIVE', 'REVOKED')),
  linked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(doctor_id, patient_id)
);

ALTER TABLE public.doctor_patient ENABLE ROW LEVEL SECURITY;

-- Permitir a los médicos ver registros de sus pacientes vinculados
CREATE POLICY "Médicos ven registros de sus pacientes vinculados" ON public.symptom_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.doctor_patient dp
      WHERE dp.doctor_id = auth.uid()
      AND dp.patient_id = public.symptom_logs.patient_id
      AND dp.status = 'ACTIVE'
    )
  );
