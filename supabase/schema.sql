-- =================================================================
-- 🦟 DENGUE ALERT NICARAGUA — SCRIPT SQL COMPLETO PARA SUPABASE
-- Basado en la Guía OMS 2009 de Clasificación del Dengue y MINSA
-- Copiá y pegá este código en el SQL Editor de tu proyecto Supabase
-- =================================================================

-- -----------------------------------------------------------------
-- 1. ESTRUCTURA DE TABLAS PRINCIPALES
-- -----------------------------------------------------------------

-- Tabla de Perfiles de Usuario (Extiende auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('PACIENTE', 'MEDICO', 'PATIENT', 'DOCTOR')),
  full_name TEXT NOT NULL,
  birth_date DATE,
  phone VARCHAR(20),
  department TEXT,
  blood_type VARCHAR(10),
  weight_kg NUMERIC(5,2),
  chronic_diseases JSONB DEFAULT '[]'::jsonb,
  current_medications TEXT,
  -- Campos específicos de Médico
  minsa_code VARCHAR(50),
  specialty TEXT,
  health_unit TEXT,
  silais TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Catálogo de Síntomas OMS
CREATE TABLE IF NOT EXISTS public.symptoms (
  id VARCHAR(10) PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(10) NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('GENERAL', 'WARNING', 'SEVERE')),
  severity_weight INT NOT NULL,
  is_alarm_sign BOOLEAN DEFAULT FALSE
);

-- Tabla de Evaluaciones / Registros de Síntomas
CREATE TABLE IF NOT EXISTS public.symptom_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_name TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  days_with_symptoms INT NOT NULL CHECK (days_with_symptoms BETWEEN 1 AND 14),
  selected_symptom_ids JSONB NOT NULL,
  classification VARCHAR(30) NOT NULL CHECK (classification IN ('BAJO_RIESGO', 'DENGUE_POSIBLE', 'DENGUE_ALARMA', 'DENGUE_GRAVE')),
  risk_score INT NOT NULL,
  notes TEXT
);

-- Tabla de Alertas de Emergencia
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_name TEXT,
  log_id UUID REFERENCES public.symptom_logs(id) ON DELETE CASCADE,
  alert_type VARCHAR(20) NOT NULL CHECK (alert_type IN ('WARNING', 'EMERGENCY')),
  status VARCHAR(20) DEFAULT 'TRIGGERED' CHECK (status IN ('TRIGGERED', 'SEEN', 'ACTED')),
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  critical_symptoms JSONB DEFAULT '[]'::jsonb
);

-- Tabla de Códigos de Vinculación Médico-Paciente
CREATE TABLE IF NOT EXISTS public.link_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  code VARCHAR(10) NOT NULL UNIQUE,
  is_used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '48 hours'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Relación Médico-Paciente (Vinculaciones Activas)
CREATE TABLE IF NOT EXISTS public.doctor_patient (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  link_code VARCHAR(10),
  status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('PENDING', 'ACTIVE', 'REVOKED')),
  linked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(doctor_id, patient_id)
);

-- -----------------------------------------------------------------
-- 2. TRIGGER AUTOMÁTICO PARA CREAR PERFIL AL REGISTRAR USUARIO EN AUTH
-- -----------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    role,
    full_name,
    department,
    minsa_code,
    specialty,
    health_unit,
    silais,
    phone
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'PACIENTE'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario DengueAlert'),
    NEW.raw_user_meta_data->>'department',
    NEW.raw_user_meta_data->>'minsa_code',
    NEW.raw_user_meta_data->>'specialty',
    NEW.raw_user_meta_data->>'health_unit',
    NEW.raw_user_meta_data->>'silais',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger si existe previamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------
-- 3. POLÍTICAS DE SEGURIDAD RLS (ROW LEVEL SECURITY)
-- -----------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_patient ENABLE ROW LEVEL SECURITY;

-- Politicas para PROFILES
CREATE POLICY "Lectura de perfiles propios o vinculados" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM public.doctor_patient dp
      WHERE (dp.doctor_id = auth.uid() AND dp.patient_id = public.profiles.id)
         OR (dp.patient_id = auth.uid() AND dp.doctor_id = public.profiles.id)
    )
  );

CREATE POLICY "Edición de perfil propio" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para SYMPTOMS
CREATE POLICY "Lectura pública de síntomas" ON public.symptoms
  FOR SELECT USING (true);

-- Políticas para SYMPTOM_LOGS
CREATE POLICY "Pacientes ven sus propios registros" ON public.symptom_logs
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Pacientes insertan sus registros" ON public.symptom_logs
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Médicos ven registros de sus pacientes vinculados" ON public.symptom_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.doctor_patient dp
      WHERE dp.doctor_id = auth.uid()
        AND dp.patient_id = public.symptom_logs.patient_id
        AND dp.status = 'ACTIVE'
    )
  );

CREATE POLICY "Médicos editan/añaden notas a registros de sus pacientes" ON public.symptom_logs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.doctor_patient dp
      WHERE dp.doctor_id = auth.uid()
        AND dp.patient_id = public.symptom_logs.patient_id
        AND dp.status = 'ACTIVE'
    )
  );

-- Políticas para ALERTS
CREATE POLICY "Pacientes ven sus alertas" ON public.alerts
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Pacientes crean sus alertas" ON public.alerts
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Médicos ven alertas de sus pacientes vinculados" ON public.alerts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.doctor_patient dp
      WHERE dp.doctor_id = auth.uid()
        AND dp.patient_id = public.alerts.patient_id
        AND dp.status = 'ACTIVE'
    )
  );

-- Políticas para LINK_CODES
CREATE POLICY "Médicos gestionan sus códigos de vinculación" ON public.link_codes
  FOR ALL USING (auth.uid() = doctor_id);

CREATE POLICY "Pacientes leen códigos para vincularse" ON public.link_codes
  FOR SELECT USING (true);

-- Políticas para DOCTOR_PATIENT
CREATE POLICY "Médicos y pacientes ven sus vinculaciones" ON public.doctor_patient
  FOR SELECT USING (auth.uid() = doctor_id OR auth.uid() = patient_id);

CREATE POLICY "Pacientes crean su vinculación" ON public.doctor_patient
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- -----------------------------------------------------------------
-- 4. SEMILLA CON EL CATÁLOGO OFICIAL DE 25 SÍNTOMAS OMS 2009
-- -----------------------------------------------------------------

INSERT INTO public.symptoms (id, name, description, icon, category, severity_weight, is_alarm_sign)
VALUES
  -- CATEGORÍA A: Síntomas Generales (Dengue sin signos de alarma)
  ('S01', 'Fiebre alta (≥38°C)', 'Fiebre de aparición súbita, de 2 a 7 días de duración.', '🌡️', 'GENERAL', 3, false),
  ('S02', 'Cefalea intensa', 'Dolor de cabeza fuerte, predominantemente frontal.', '🧠', 'GENERAL', 2, false),
  ('S03', 'Dolor retro-ocular', 'Dolor característico detrás de los ojos que aumenta con el movimiento ocular.', '👁️', 'GENERAL', 2, false),
  ('S04', 'Mialgias (Dolor muscular)', 'Dolor muscular generalizado en brazos, piernas y espalda.', '💪', 'GENERAL', 2, false),
  ('S05', 'Artralgias (Dolor articular)', 'Dolor e inflamación ligera en articulaciones (rodillas, muñecas, tobillos).', '🦴', 'GENERAL', 2, false),
  ('S06', 'Erupción cutánea (Rash)', 'Exantema o sarpullido rojo que aparece en tronco y extremidades.', '🔴', 'GENERAL', 2, false),
  ('S07', 'Náuseas', 'Sensación de malestar estomacal con deseo de vomitar.', '🤢', 'GENERAL', 1, false),
  ('S08', 'Leucopenia', 'Disminución de glóbulos blancos verificada por examen de hemograma.', '🩸', 'GENERAL', 2, false),
  ('S09', 'Prurito (Picazón)', 'Picazón en palmas de manos y plantas de los pies al ceder la fiebre.', '✋', 'GENERAL', 1, false),
  ('S10', 'Malestar general / Astenia', 'Sensación extrema de cansancio, debilidad o decaimiento.', '😴', 'GENERAL', 1, false),

  -- CATEGORÍA B: Signos de Alarma (Requieren observación hospitalaria inmediata)
  ('S11', 'Dolor abdominal intenso', 'Dolor continuo y fuerte en el abdomen o a la palpación.', '🔥', 'WARNING', 8, true),
  ('S12', 'Vómitos persistentes', 'Tres o más episodios de vómito en 24 horas o incapacidad de retener líquidos.', '🤮', 'WARNING', 8, true),
  ('S13', 'Acumulación de líquidos', 'Presencia de ascitis, derrame pleural o edema en miembros inferiores.', '💧', 'WARNING', 8, true),
  ('S14', 'Sangrado de mucosas', 'Sangrado espontáneo de encías, nariz (epistaxis), o sangrado vaginal fuera del periodo.', '🩸', 'WARNING', 8, true),
  ('S15', 'Letargia / Irritabilidad', 'Somnolencia excesiva, confusión, debilidad extrema o agitación motora.', '🧠', 'WARNING', 8, true),
  ('S16', 'Hepatomegalia (>2 cm)', 'Aumento del tamaño del hígado detectable por palpación debajo del reborde costal.', '🩺', 'WARNING', 8, true),
  ('S17', 'Aumento del hematocrito', 'Elevación progresiva del hematocrito junto con rápida caída de plaquetas.', '📊', 'WARNING', 8, true),
  ('S18', 'Lipotimia / Mareo al ponerse de pie', 'Sensación de desmayo o baja de presión al cambiar de posición.', '💫', 'WARNING', 7, true),

  -- CATEGORÍA C: Criterios de Dengue Grave (Emergencia médica inmediata / UCI)
  ('S19', 'Choque hipovolémico (DSS)', 'Pulso rápido y débil, presión arterial convergente o indetectable.', '📉', 'SEVERE', 15, true),
  ('S20', 'Dificultad respiratoria grave', 'Respiración rápida y dificultosa por acumulación de líquido en pulmones.', '🫁', 'SEVERE', 15, true),
  ('S21', 'Sangrado grave (Digestivo / SNC)', 'Vómitos con sangre (hematemesis), heces negras (melena) o sangrado cerebral.', '⚠️', 'SEVERE', 15, true),
  ('S22', 'Falla hepática (AST/ALT ≥ 1000)', 'Daño severo en el hígado con ictericia o elevación masiva de transaminasas.', '🧪', 'SEVERE', 15, true),
  ('S23', 'Miocarditis / Falla cardíaca', 'Alteración en el ritmo cardíaco o inflamación del miocardio por el virus.', '❤️', 'SEVERE', 15, true),
  ('S24', 'Alteración del estado de conciencia', 'Estupor, coma o convulsiones causadas por encefalopatía por dengue.', '🚨', 'SEVERE', 15, true),
  ('S25', 'Falla renal aguda', 'Disminución drástica o ausencia total de producción de orina (anuria).', '🏥', 'SEVERE', 15, true)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  category = EXCLUDED.category,
  severity_weight = EXCLUDED.severity_weight,
  is_alarm_sign = EXCLUDED.is_alarm_sign;
