export interface HospitalNicaragua {
  id: string;
  nombre: string;
  departamento: string;
  direccion: string;
  telefono: string;
  latitud: number;
  longitud: number;
  distanciaKm?: number;
  tipo: 'HOSPITAL' | 'CENTRO_SALUD';
}

export const HOSPITALES_NICARAGUA_SEED: HospitalNicaragua[] = [
  {
    id: 'hosp-1',
    nombre: 'Hospital Docente Universitario Fernando Vélez Paiz',
    departamento: 'Managua',
    direccion: 'Km 5.5 Carretera Sur, Managua',
    telefono: '+505 2265 0300',
    latitud: 12.1267,
    longitud: -86.3015,
    tipo: 'HOSPITAL',
  },
  {
    id: 'hosp-2',
    nombre: 'Hospital Escuela Manolo Morales Peralta',
    departamento: 'Managua',
    direccion: 'Contiguo a Mercado Roberto Huembes, Managua',
    telefono: '+505 2289 4700',
    latitud: 12.1145,
    longitud: -86.2412,
    tipo: 'HOSPITAL',
  },
  {
    id: 'hosp-3',
    nombre: 'Hospital Antonio Lenín Fonseca',
    departamento: 'Managua',
    direccion: 'Semáforos del Linda Vista 2c al Oeste, Managua',
    telefono: '+505 2266 1224',
    latitud: 12.1523,
    longitud: -86.3121,
    tipo: 'HOSPITAL',
  },
  {
    id: 'hosp-4',
    nombre: 'Hospital Alemán Nicaragüense',
    departamento: 'Managua',
    direccion: 'De la Sub-Estación Eléctrica 3c al Norte, Managua',
    telefono: '+505 2249 2060',
    latitud: 12.1489,
    longitud: -86.2195,
    tipo: 'HOSPITAL',
  },
  {
    id: 'cs-1',
    nombre: 'Centro de Salud Pedro Altamirano (MINSA)',
    departamento: 'Managua',
    direccion: 'Reparto Schick, Managua',
    telefono: '+505 2289 2310',
    latitud: 12.1221,
    longitud: -86.2489,
    tipo: 'CENTRO_SALUD',
  },
  {
    id: 'cs-2',
    nombre: 'Centro de Salud Sócrates Flores (MINSA)',
    departamento: 'Managua',
    direccion: 'Barrio Monseñor Lezcano, Managua',
    telefono: '+505 2266 4320',
    latitud: 12.1528,
    longitud: -86.2842,
    tipo: 'CENTRO_SALUD',
  },
  {
    id: 'hosp-5',
    nombre: 'Hospital Escuela Oscar Danilo Rosales Argüello (HEODRA)',
    departamento: 'León',
    direccion: 'Costado Oeste del Parque Central, León',
    telefono: '+505 2311 2241',
    latitud: 12.4352,
    longitud: -86.8791,
    tipo: 'HOSPITAL',
  },
  {
    id: 'hosp-6',
    nombre: 'Hospital Regional San Juan de Dios',
    departamento: 'Estelí',
    direccion: 'Salida Sur de Estelí, Km 147 Carretera Panamericana',
    telefono: '+505 2713 2420',
    latitud: 13.0854,
    longitud: -86.3541,
    tipo: 'HOSPITAL',
  },
  {
    id: 'hosp-7',
    nombre: 'Hospital Regional Asunción Juigalpa',
    departamento: 'Chontales',
    direccion: 'Entrada Principal a Juigalpa',
    telefono: '+505 2512 2341',
    latitud: 12.1083,
    longitud: -85.3644,
    tipo: 'HOSPITAL',
  },
  {
    id: 'hosp-8',
    nombre: 'Hospital Departamental San José de Diriamba',
    departamento: 'Carazo',
    direccion: 'Diriamba, Carazo',
    telefono: '+505 2532 2310',
    latitud: 11.8591,
    longitud: -86.2415,
    tipo: 'HOSPITAL',
  },
  {
    id: 'hosp-9',
    nombre: 'Hospital España D. H. Chinandega',
    departamento: 'Chinandega',
    direccion: 'Carretera Chinandega - El Viejo',
    telefono: '+505 2341 2450',
    latitud: 12.6321,
    longitud: -87.1324,
    tipo: 'HOSPITAL',
  },
  {
    id: 'hosp-10',
    nombre: 'Hospital Dr. Humberto Alvarado Vásquez',
    departamento: 'Masaya',
    direccion: 'Entrada Principal a Masaya, de la Rotonda San Jerónimo 1km al Este',
    telefono: '+505 2522 2541',
    latitud: 11.9744,
    longitud: -86.0942,
    tipo: 'HOSPITAL',
  },
  {
    id: 'hosp-11',
    nombre: 'Hospital Amistad Japón-Nicaragua',
    departamento: 'Granada',
    direccion: 'Carretera Granada - Nandaime',
    telefono: '+505 2552 2780',
    latitud: 11.9328,
    longitud: -85.9556,
    tipo: 'HOSPITAL',
  },
  {
    id: 'hosp-12',
    nombre: 'Hospital Regional César Amador Kuhl',
    departamento: 'Matagalpa',
    direccion: 'Salida a Jinotega, Matagalpa',
    telefono: '+505 2772 2310',
    latitud: 12.9256,
    longitud: -85.9172,
    tipo: 'HOSPITAL',
  },
  {
    id: 'hosp-13',
    nombre: 'Hospital Camilo Ortega Saavedra',
    departamento: 'Río San Juan',
    direccion: 'San Carlos, Río San Juan',
    telefono: '+505 2583 0120',
    latitud: 11.1342,
    longitud: -84.7781,
    tipo: 'HOSPITAL',
  },
  {
    id: 'hosp-14',
    nombre: 'Hospital Ernesto Sequeira Blanco',
    departamento: 'RACCS',
    direccion: 'Bluefields, Costa Caribe Sur',
    telefono: '+505 2572 2310',
    latitud: 12.0134,
    longitud: -83.7652,
    tipo: 'HOSPITAL',
  },
];

// Haversine formula to calculate distance in km
export function calcularDistanciaKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function obtenerHospitalesCercanos(userLat?: number, userLng?: number, departamentoUsuario?: string): HospitalNicaragua[] {
  if (userLat && userLng) {
    return HOSPITALES_NICARAGUA_SEED.map((h) => ({
      ...h,
      distanciaKm: calcularDistanciaKm(userLat, userLng, h.latitud, h.longitud),
    })).sort((a, b) => (a.distanciaKm || 0) - (b.distanciaKm || 0));
  }

  if (departamentoUsuario) {
    return [...HOSPITALES_NICARAGUA_SEED].sort((a, b) => {
      const aEsDepto = a.departamento.toLowerCase() === departamentoUsuario.toLowerCase();
      const bEsDepto = b.departamento.toLowerCase() === departamentoUsuario.toLowerCase();
      if (aEsDepto && !bEsDepto) return -1;
      if (!aEsDepto && bEsDepto) return 1;
      return 0;
    });
  }

  return HOSPITALES_NICARAGUA_SEED;
}

export function solicitarUbicacionActual(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('La geolocalización no está soportada en este dispositivo'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        let mensaje = 'Ubicación GPS no disponible';
        if (err.code === 1) mensaje = 'Acceso a ubicación no concedido en el navegador';
        else if (err.code === 2) mensaje = 'Posición GPS no disponible en este momento';
        else if (err.code === 3) mensaje = 'Tiempo de respuesta GPS agotado';
        reject(new Error(mensaje));
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 },
    );
  });
}
