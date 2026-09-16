'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

// ============================================================
// SIDEBAR - Panel de Navegación Lateral (Estilo Benerelatum)
// Visible en pantallas grandes. Muestra acceso rápido al módulo
// de alertas y estado del scraper sin visualizador de tokens.
// ============================================================

export default function Sidebar() {
  const { usuario, alertas, notificacionesNoLeidas } = useApp();

  const alertasActivas = alertas.filter((a) => a.estado === 'activo').length;
  const documentosEncontrados = alertas.filter((a) => a.estado === 'encontrado').length;

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#090909] border-r border-slate-800/80 min-h-[calc(100vh-4.5rem)]">
      {/* Resumen del abogado */}
      <div className="p-5 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center text-black font-semibold text-sm shadow-md shadow-yellow-500/10">
            {usuario.nombre[0]}
            {usuario.apellido[0]}
          </div>
          <div>
            <p className="text-sm font-medium text-white leading-snug">
              {usuario.nombre} {usuario.apellido.split(' ')[0]}
            </p>
            <p className="text-xs text-slate-400">{usuario.colegiatura}</p>
          </div>
        </div>
      </div>

      {/* Navegación del Módulo de Alertas */}
      <nav className="flex-1 p-3 space-y-1">
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Alertas Judiciales
        </p>
        <SidebarLink icon="bell" label="Panel de Alertas" href="/" active badge={notificacionesNoLeidas} />
        <SidebarLink icon="radar" label="Casos en Monitoreo" href="/monitoreo" badge={alertasActivas} />
        <SidebarLink icon="check" label="Documentos Detectados" href="/encontrados" badge={documentosEncontrados} />
        <SidebarLink icon="search" label="Registrar Nueva Alerta" href="/alertas/nueva" />

        <div className="pt-4">
          <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Jurisprudencia
          </p>
          <SidebarLink icon="file" label="Poder Judicial" href="/poder-judicial" />
          <SidebarLink icon="file" label="Tribunal Constitucional" href="/tribunal-constitucional" />
        </div>
      </nav>

      {/* Widget de Estado del Sistema (Scraper) */}
      <div className="p-4 border-t border-slate-800/60">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400">Servicio de Alertas</span>
            <span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              En Línea
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Rastreo automático en Salas Supremas y El Peruano.
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Último sondeo</span>
            <span className="text-slate-300">Hace 4 min</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

// --- Componente auxiliar: Link del Sidebar ---
function SidebarLink({
  icon,
  label,
  href,
  active = false,
  badge,
}: {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
  badge?: number;
}) {
  const iconPaths: Record<string, React.ReactNode> = {
    bell: (
      <>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </>
    ),
    radar: (
      <>
        <path d="M19.07 4.93A10 10 0 0 0 6.99 3.34" />
        <path d="M4 6h.01" />
        <path d="M2.29 9.62A10 10 0 1 0 21.31 8.35" />
        <path d="M16.24 7.76A6 6 0 1 0 8.23 16.67" />
        <path d="M12 18h.01" />
        <path d="M17.99 11.66A6 6 0 0 1 15.77 16.67" />
        <circle cx="12" cy="12" r="2" />
      </>
    ),
    check: (
      <>
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </>
    ),
    file: (
      <>
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      </>
    ),
  };

  return (
    <a
      href={href}
      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition duration-200 ${
        active
          ? 'bg-yellow-400/10 text-yellow-400 font-medium border border-yellow-400/20 shadow-sm'
          : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
      }`}
    >
      <div className="flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          {iconPaths[icon]}
        </svg>
        <span>{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold bg-yellow-400 text-black rounded-full shadow-sm">
          {badge}
        </span>
      )}
    </a>
  );
}
