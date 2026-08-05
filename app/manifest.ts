import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dengue Alert Nicaragua',
    short_name: 'DengueAlert',
    description: 'Detección oportuna de síntomas de dengue y signos de alarma en Nicaragua',
    start_url: '/inicio',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f8fafc',
    theme_color: '#169bc4',
    categories: ['health', 'medical'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Evaluar síntomas',
        short_name: 'Evaluar',
        description: 'Iniciar evaluación de síntomas de dengue',
        url: '/sintomas',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Alerta de emergencia',
        short_name: 'Emergencia',
        description: 'Ver números de emergencia y mapa de hospitales',
        url: '/alerta',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}

