'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Bell, User } from 'lucide-react';

const ITEMS_NAVEGACION_MEDICO = [
  { href: '/dashboard', etiqueta: 'Dashboard', icon: LayoutDashboard },
  { href: '/pacientes', etiqueta: 'Pacientes', icon: Users },
  { href: '/alertas', etiqueta: 'Alertas', icon: Bell },
  { href: '/perfil-medico', etiqueta: 'Perfil', icon: User },
];

export const BottomNavMedico: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="Navegación principal de médico">
      {ITEMS_NAVEGACION_MEDICO.map((item) => {
        const IconComponent = item.icon;
        const esActivo = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className="bottom-nav__item touch-feedback"
            data-activo={esActivo}
            aria-current={esActivo ? 'page' : undefined}
          >
            <div className="bottom-nav__pill">
              <IconComponent size={20} strokeWidth={esActivo ? 2.5 : 2} />
            </div>
            <span>{item.etiqueta}</span>
          </Link>
        );
      })}
    </nav>
  );
};
