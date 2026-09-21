'use client';

import React, { ReactNode } from 'react';
import Header from './Header';

// ============================================================
// MAIN LAYOUT - Réplica Visual Exacta de la Pantalla del Usuario
// Sin sidebar lateral, fondo navy #0a0f1d y estructura limpia.
// ============================================================

export default function MainLayout({
  children,
  onSelectDocument,
}: {
  children: ReactNode;
  onSelectDocument?: (notif: any) => void;
}) {
  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 flex flex-col font-sans">
      <Header onSelectDocument={onSelectDocument} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
        {children}
      </main>
    </div>
  );
}
