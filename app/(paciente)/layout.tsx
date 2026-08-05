import React from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { ToastContainer } from '@/components/ui/Toast';

export default function PacienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBar />
      <main className="contenido-principal">
        {children}
      </main>
      <BottomNav />
      <ToastContainer />
    </>
  );
}
