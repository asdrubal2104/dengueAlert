import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PerfilUsuario } from '@/types/user';
import { RegistroSintomas, Alerta, SintomaId } from '@/types/dengue';
import { clasificarDengue } from '@/lib/dengue/clasificador';
import { DEMO_PACIENTES, DEMO_REGISTROS, DEMO_ALERTAS } from '@/lib/demo/datos-demo';
import { enviarNotificacionAlerta } from '@/lib/notificaciones/web-push';
import { guardarEvaluacionSupabase } from '@/lib/supabase/services';

// Datos de semilla para demostración inmediata
const MOCK_PACIENTE: PerfilUsuario = {
  id: 'paciente-demo-1',
  email: 'paciente@ejemplo.com',
  nombreCompleto: 'Natalia Elizabeth López',
  rol: 'PACIENTE',
  fechaNacimiento: '1995-06-15',
  departamento: 'Managua',
  telefono: '+505 8888 1234',
  tipoSangre: 'O+',
  pesoKg: 62,
  enfermedadesCronicas: ['Hipertensión arterial'],
  medicamentosActuales: 'Losartán 50mg',
  fechaRegistro: new Date().toISOString(),
};

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

const MOCK_REGISTROS: RegistroSintomas[] = [
  {
    id: 'reg-1',
    pacienteId: 'paciente-demo-1',
    pacienteNombre: 'Natalia Elizabeth López',
    fechaRegistro: new Date(Date.now() - 86400000 * 2).toISOString(),
    diasConSintomas: 2,
    sintomasIds: ['S01', 'S02', 'S04'],
    clasificacion: 'DENGUE_POSIBLE',
    riskScore: 18,
    notas: 'Fiebre inicio hace 2 días. Toma acetaminofén 500mg.',
  },
];

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
      usuarioActual: MOCK_PACIENTE, // Inicia con paciente demo por defecto
      registros: MOCK_REGISTROS,
      alertas: [],
      codigoVinculacionActual: 'A3F7K2',
      medicosVinculados: [
        {
          id: 'medico-demo-1',
          nombre: 'Dr. Juan Carlos Pérez López',
          especialidad: 'Medicina Interna',
          hospital: 'Hospital Manolo Morales',
        },
      ],
      pacientesVinculados: [MOCK_PACIENTE],
      esModoDemo: false,

      setUsuarioActual: (usuario) => set({ usuarioActual: usuario }),

      cargarDatosDemo: () => {
        set({
          pacientesVinculados: DEMO_PACIENTES,
          registros: [...DEMO_REGISTROS, ...get().registros],
          alertas: [...DEMO_ALERTAS, ...get().alertas],
          esModoDemo: true,
        });
      },

      limpiarDatosDemo: () => {
        set({
          pacientesVinculados: [MOCK_PACIENTE],
          registros: MOCK_REGISTROS,
          alertas: [],
          esModoDemo: false,
        });
      },

      iniciarSesionDemo: (rol) => {
        if (rol === 'PACIENTE') {
          set({ usuarioActual: MOCK_PACIENTE });
        } else {
          set({ usuarioActual: MOCK_MEDICO });
        }
      },

      cerrarSesion: () => set({ usuarioActual: null }),

      guardarEvaluacion: (sintomasIds, diasConSintomas, notas) => {
        const usuario = get().usuarioActual;
        const evaluacion = clasificarDengue(sintomasIds, diasConSintomas);

        const nuevoRegistro: RegistroSintomas = {
          id: `reg-${Date.now()}`,
          pacienteId: usuario?.id || 'paciente-anon',
          pacienteNombre: usuario?.nombreCompleto || 'Paciente',
          fechaRegistro: new Date().toISOString(),
          diasConSintomas,
          faseDengue: evaluacion.faseTemporal,
          sintomasIds,
          clasificacion: evaluacion.clasificacion,
          riskScore: evaluacion.riskScore,
          notas,
        };

        const nuevosRegistros = [nuevoRegistro, ...get().registros];

        // Crear alerta si es ALARMA o GRAVE
        let nuevasAlertas = get().alertas;
        if (
          evaluacion.clasificacion === 'DENGUE_ALARMA' ||
          evaluacion.clasificacion === 'DENGUE_GRAVE'
        ) {
          const sintomasCriticos = evaluacion.sintomasSeleccionados
            .filter((s) => s.esSignoAlarma)
            .map((s) => s.nombre);

          const nuevaAlerta: Alerta = {
            id: `alert-${Date.now()}`,
            pacienteId: usuario?.id || 'paciente-anon',
            pacienteNombre: usuario?.nombreCompleto || 'Paciente',
            evaluacionId: nuevoRegistro.id,
            tipo: evaluacion.clasificacion === 'DENGUE_GRAVE' ? 'EMERGENCY' : 'WARNING',
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
    },
  ),
);
