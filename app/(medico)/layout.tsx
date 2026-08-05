import React from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNavMedico } from '@/components/layout/BottomNavMedico';
import { ToastContainer } from '@/components/ui/Toast';

export default function MedicoLayout({
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
      <BottomNavMedico />
      <ToastContainer />
    </>
  );
}
