import { createClient } from './client';
import { traducirErrorSupabase } from './errors';
import { RegistroSintomas, Alerta } from '@/types/dengue';
import { PerfilUsuario } from '@/types/user';

/**
 * Registra un paciente en Supabase Auth y crea su fila correspondiente en public.profiles.
 */
export async function registrarPacienteSupabase(datos: {
  email: string;
  password: string;
  nombreCompleto: string;
  fechaNacimiento: string;
  departamento: string;
  captchaToken?: string;
}): Promise<{ ok: boolean; usuario?: PerfilUsuario; error?: string }> {
  try {
    const supabase = createClient();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: datos.email,
      password: datos.password,
      options: datos.captchaToken ? { captchaToken: datos.captchaToken } : undefined,
    });

    if (authError) return { ok: false, error: traducirErrorSupabase(authError.message) };
    if (!authData.user) return { ok: false, error: 'No se pudo crear el usuario en Supabase' };

    const perfil: PerfilUsuario = {
      id: authData.user.id,
      email: datos.email,
      nombreCompleto: datos.nombreCompleto,
      rol: 'PACIENTE',
      fechaNacimiento: datos.fechaNacimiento,
      departamento: datos.departamento as any,
      fechaRegistro: new Date().toISOString(),
    };

    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      role: 'PATIENT',
      full_name: datos.nombreCompleto,
      birth_date: datos.fechaNacimiento,
      department: datos.departamento,
    });

    if (profileError) {
      console.warn('Nota: Perfil guardado localmente (asegúrate de haber ejecutado 001_initial_schema.sql en Supabase):', profileError.message);
    }

    return { ok: true, usuario: perfil };
  } catch (err: any) {
    return { ok: false, error: err.message || 'Error de red al registrar paciente' };
  }
}

/**
 * Registra un médico en Supabase Auth y crea su fila correspondiente en public.profiles.
 */
export async function registrarMedicoSupabase(datos: {
  email: string;
  password: string;
  nombreCompleto: string;
  codigoMinsa: string;
  especialidad: string;
  unidadDeSalud: string;
  silais: string;
  telefono: string;
  captchaToken?: string;
}): Promise<{ ok: boolean; usuario?: PerfilUsuario; error?: string }> {
  try {
    const supabase = createClient();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: datos.email,
      password: datos.password,
      options: datos.captchaToken ? { captchaToken: datos.captchaToken } : undefined,
    });

    if (authError) return { ok: false, error: traducirErrorSupabase(authError.message) };
    if (!authData.user) return { ok: false, error: 'No se pudo crear el usuario en Supabase' };

    const perfil: PerfilUsuario = {
      id: authData.user.id,
      email: datos.email,
      nombreCompleto: datos.nombreCompleto,
      rol: 'MEDICO',
      codigoMinsa: datos.codigoMinsa,
      especialidad: datos.especialidad as any,
      unidadDeSalud: datos.unidadDeSalud,
      silais: datos.silais as any,
      telefono: datos.telefono,
      fechaRegistro: new Date().toISOString(),
    };

    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      role: 'DOCTOR',
      full_name: datos.nombreCompleto,
      minsa_code: datos.codigoMinsa,
      specialty: datos.especialidad,
      health_unit: datos.unidadDeSalud,
      silais: datos.silais,
      phone: datos.telefono,
    });

    if (profileError) {
      console.warn('Nota: Perfil guardado localmente (asegúrate de haber ejecutado 001_initial_schema.sql en Supabase):', profileError.message);
    }

    return { ok: true, usuario: perfil };
  } catch (err: any) {
    return { ok: false, error: err.message || 'Error de red al registrar médico' };
  }
}

/**
 * Inicia sesión con correo y contraseña en Supabase Auth.
 */
export async function iniciarSesionSupabase(
  email: string,
  password: string,
  captchaToken?: string
): Promise<{ ok: boolean; usuario?: PerfilUsuario; error?: string }> {
  try {
    const supabase = createClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: captchaToken ? { captchaToken } : undefined,
    });

    if (authError) return { ok: false, error: traducirErrorSupabase(authError.message) };
    if (!authData.user) return { ok: false, error: 'Usuario no encontrado' };

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    const perfil: PerfilUsuario = {
      id: authData.user.id,
      email: authData.user.email || email,
      nombreCompleto: profile?.full_name || email.split('@')[0],
      rol: profile?.role === 'DOCTOR' ? 'MEDICO' : 'PACIENTE',
      fechaNacimiento: profile?.birth_date,
      departamento: profile?.department,
      codigoMinsa: profile?.minsa_code,
      especialidad: profile?.specialty,
      unidadDeSalud: profile?.health_unit,
      silais: profile?.silais,
      telefono: profile?.phone,
      fechaRegistro: profile?.created_at || new Date().toISOString(),
    };

    return { ok: true, usuario: perfil };
  } catch (err: any) {
    return { ok: false, error: err.message || 'Error al iniciar sesión' };
  }
}

/**
 * Cierra la sesión activa del usuario en Supabase Auth.
 */
export async function cerrarSesionSupabase(): Promise<void> {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.warn('Error al cerrar sesión en Supabase:', err);
  }
}

/**
 * Verifica la conexión activa con Supabase ejecutando una consulta ligera al catálogo de síntomas.
 */
export async function probarConexionSupabase(): Promise<{ ok: boolean; mensaje: string; count?: number }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('symptoms').select('id', { count: 'exact' });

    if (error) {
      return { ok: false, mensaje: `Error Supabase: ${error.message}` };
    }

    return {
      ok: true,
      mensaje: '¡Conexión exitosa a Supabase!',
      count: data?.length ?? 0,
    };
  } catch (err: any) {
    return { ok: false, mensaje: `Excepción de red: ${err.message || 'Sin conexión'}` };
  }
}

/**
 * Guarda una evaluación de síntomas en Supabase.
 */
export async function guardarEvaluacionSupabase(registro: RegistroSintomas) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('symptom_logs')
      .insert({
        patient_id: registro.pacienteId.includes('demo') ? null : registro.pacienteId,
        patient_name: registro.pacienteNombre,
        days_with_symptoms: registro.diasConSintomas,
        selected_symptom_ids: registro.sintomasIds,
        classification:
          registro.clasificacion === 'CONSULTA_MEDICA' ? 'BAJO_RIESGO' : registro.clasificacion,
        risk_score: registro.riskScore,
        notes: registro.notas,
      })
      .select()
      .single();

    if (error) throw error;
    return { ok: true, data };
  } catch (error: any) {
    console.warn('Evaluación guardada localmente (Modo fallback/demo u offline active):', error.message);
    return { ok: false, error: error.message };
  }
}

/**
 * Carga las alertas activas desde la base de datos de Supabase.
 */
export async function obtenerAlertasSupabase(): Promise<Alerta[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('triggered_at', { ascending: false });

    if (error || !data) return [];

    return data.map((item: any) => ({
      id: item.id,
      pacienteId: item.patient_id,
      pacienteNombre: item.patient_name || 'Paciente',
      evaluacionId: item.log_id || '',
      tipo: item.alert_type as any,
      estado: item.status as any,
      fechaHora: item.triggered_at,
      sintomasCriticos: item.critical_symptoms || [],
    }));
  } catch {
    return [];
  }
}
