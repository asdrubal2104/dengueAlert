'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Activity, Clock, BookOpen, User } from 'lucide-react';

const ITEMS_NAVEGACION = [
  { href: '/inicio', etiqueta: 'Inicio', icon: Home },
  { href: '/sintomas', etiqueta: 'Evaluar', icon: Activity },
  { href: '/historial', etiqueta: 'Historial', icon: Clock },
  { href: '/educacion', etiqueta: 'Educación', icon: BookOpen },
  { href: '/perfil', etiqueta: 'Perfil', icon: User },
];

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {ITEMS_NAVEGACION.map((item) => {
        const IconComponent = item.icon;
        const esActivo = pathname === item.href;

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
