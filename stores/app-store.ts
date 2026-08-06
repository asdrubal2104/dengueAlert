import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PerfilUsuario } from '@/types/user';
import { RegistroSintomas, Alerta, SintomaId } from '@/types/dengue';
import { clasificarDengue } from '@/lib/dengue/clasificador';
import { DEMO_PACIENTES, DEMO_REGISTROS, DEMO_ALERTAS } from '@/lib/demo/datos-demo';
import { enviarNotificacionAlerta } from '@/lib/notificaciones/web-push';
import { guardarEvaluacionSupabase } from '@/lib/supabase/services';

const MOCK_MEDICO: PerfilUsuario = {
  id: 'medico-demo-1',
  email: 'dr.perez@minsa.gob.ni',
  nombreCompleto: 'Dr. Juan Carlos Pérez López',
  rol: 'MEDICO',
  codigoMinsa: 'MINSA-48291',
  especialidad: 'Medicina Interna',
  unidadDeSalud: 'Hospital Escuela Manolo Morales',
  silais: 'Managua',
  telefono: '+505 8999 5678',
  fechaRegistro: new Date().toISOString(),
};

interface AppState {
  usuarioActual: PerfilUsuario | null;
  registros: RegistroSintomas[];
  alertas: Alerta[];
  codigoVinculacionActual: string | null;
  medicosVinculados: { id: string; nombre: string; especialidad: string; hospital: string }[];
  pacientesVinculados: PerfilUsuario[];
  esModoDemo: boolean;

  // Acciones
  setUsuarioActual: (usuario: PerfilUsuario | null) => void;
  iniciarSesionDemo: (rol: 'PACIENTE' | 'MEDICO') => void;
  cerrarSesion: () => void;
  cargarDatosDemo: () => void;
  limpiarDatosDemo: () => void;
  guardarEvaluacion: (
    sintomasIds: SintomaId[],
    diasConSintomas: number,
    fiebreBajoRecientemente?: boolean,
    notas?: string,
  ) => RegistroSintomas;
  generarCodigoVinculacion: () => string;
  vincularConMedicoPorCodigo: (codigo: string) => boolean;
  actualizarPerfilPaciente: (datos: Partial<PerfilUsuario>) => void;
  actualizarPerfilMedico: (datos: Partial<PerfilUsuario>) => void;
  agregarNotaMedica: (registroId: string, nota: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      usuarioActual: DEMO_PACIENTES[0], // Inicia con paciente demo por defecto (Natalia Elena López Martínez)
      registros: DEMO_REGISTROS,
      alertas: DEMO_ALERTAS,
      codigoVinculacionActual: 'A3F7K2',
      medicosVinculados: [
        {
          id: 'medico-demo-1',
          nombre: 'Dr. Juan Carlos Pérez López',
          especialidad: 'Medicina Interna',
          hospital: 'Hospital Manolo Morales',
        },
      ],
      pacientesVinculados: DEMO_PACIENTES,
      esModoDemo: true,

      setUsuarioActual: (usuario) => set({ usuarioActual: usuario }),

      cargarDatosDemo: () => {
        set({
          pacientesVinculados: DEMO_PACIENTES,
          registros: DEMO_REGISTROS,
          alertas: DEMO_ALERTAS,
          esModoDemo: true,
        });
      },

      limpiarDatosDemo: () => {
        set({
          pacientesVinculados: DEMO_PACIENTES,
          registros: DEMO_REGISTROS,
          alertas: DEMO_ALERTAS,
          esModoDemo: true,
        });
      },

      iniciarSesionDemo: (rol) => {
        if (rol === 'PACIENTE') {
          set({ usuarioActual: DEMO_PACIENTES[0] });
        } else {
          set({ usuarioActual: MOCK_MEDICO });
        }
      },

      cerrarSesion: () => set({ usuarioActual: null }),

      guardarEvaluacion: (sintomasIds, diasConSintomas, fiebreBajoRecientemente, notas) => {
        const usuario = get().usuarioActual;
        const evaluacion = clasificarDengue(
          sintomasIds,
          diasConSintomas,
          fiebreBajoRecientemente,
        );

        const nuevoRegistro: RegistroSintomas = {
          id: `reg-${Date.now()}`,
          pacienteId: usuario?.id || 'paciente-anon',
          pacienteNombre: usuario?.nombreCompleto || 'Paciente',
          fechaRegistro: new Date().toISOString(),
          diasConSintomas,
          fiebreBajoRecientemente,
          faseDengue: evaluacion.faseTemporal,
          sintomasIds,
          clasificacion: evaluacion.clasificacion,
          riskScore: evaluacion.riskScore,
          notas,
        };

        const nuevosRegistros = [nuevoRegistro, ...get().registros];

        // Solo los signos graves activan una alerta disruptiva. Los signos de alarma
        // llevan a atención presencial hoy desde el resultado, sin alarma sonora.
        let nuevasAlertas = get().alertas;
        if (evaluacion.clasificacion === 'DENGUE_GRAVE') {
          const sintomasCriticos = evaluacion.sintomasSeleccionados
            .filter((s) => s.esSignoAlarma)
            .map((s) => s.nombre);

          const nuevaAlerta: Alerta = {
            id: `alert-${Date.now()}`,
            pacienteId: usuario?.id || 'paciente-anon',
            pacienteNombre: usuario?.nombreCompleto || 'Paciente',
            evaluacionId: nuevoRegistro.id,
            tipo: 'EMERGENCY',
            estado: 'TRIGGERED',
            fechaHora: new Date().toISOString(),
            sintomasCriticos,
          };
          nuevasAlertas = [nuevaAlerta, ...nuevasAlertas];

          // Disparar notificación nativa web
          enviarNotificacionAlerta(evaluacion.clasificacion, sintomasCriticos);
        }

        set({ registros: nuevosRegistros, alertas: nuevasAlertas });

        // Intentar sincronización background con Supabase
        guardarEvaluacionSupabase(nuevoRegistro);

        return nuevoRegistro;
      },

      generarCodigoVinculacion: () => {
        const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let codigo = '';
        for (let i = 0; i < 6; i++) {
          codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        set({ codigoVinculacionActual: codigo });
        return codigo;
      },

      vincularConMedicoPorCodigo: (codigo) => {
        const codigoLimpio = codigo.trim().toUpperCase();
        if (codigoLimpio.length === 6) {
          const yaExiste = get().medicosVinculados.some((m) => m.id === 'medico-demo-1');
          if (!yaExiste) {
            set({
              medicosVinculados: [
                ...get().medicosVinculados,
                {
                  id: 'medico-demo-1',
                  nombre: 'Dr. Juan Carlos Pérez López',
                  especialidad: 'Medicina Interna',
                  hospital: 'Hospital Manolo Morales',
                },
              ],
            });
          }
          return true;
        }
        return false;
      },

      actualizarPerfilPaciente: (datos) => {
        const actual = get().usuarioActual;
        if (actual) {
          set({ usuarioActual: { ...actual, ...datos } });
        }
      },

      actualizarPerfilMedico: (datos) => {
        const actual = get().usuarioActual;
        if (actual) {
          set({ usuarioActual: { ...actual, ...datos } });
        }
      },

      agregarNotaMedica: (registroId, nota) => {
        const registros = get().registros.map((r) => {
          if (r.id === registroId) {
            return {
              ...r,
              notas: r.notas ? `${r.notas}\n\n[Nota Médica]: ${nota}` : `[Nota Médica]: ${nota}`,
            };
          }
          return r;
        });
        set({ registros });
      },
    }),
    {
      name: 'dengue-alert-store',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version < 2) {
          return {
            ...(persistedState || {}),
            pacientesVinculados: DEMO_PACIENTES,
            registros: DEMO_REGISTROS,
            alertas: DEMO_ALERTAS,
            esModoDemo: true,
          };
        }
        return persistedState as AppState;
      },
    },
  ),
);
