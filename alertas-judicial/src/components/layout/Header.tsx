'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';

// ============================================================
// HEADER - Réplica Exacta de Benerelatum + Notificaciones
// Barra superior con:
// - ← Volver + "Buscador de Casaciones" / "OpenSearch • PDFs indexados"
// - Navegación: Poder Judicial | Tribunal Constitucional
// - Campana interactiva con centro de notificaciones dropdown
// - Avatar circular anaranjado con inicial "I" y selector
// ============================================================

export default function Header({
  onSelectDocument,
}: {
  onSelectDocument?: (notif: any) => void;
}) {
  const {
    notificaciones,
    notificacionesNoLeidas,
    marcarComoLeida,
    marcarTodasComoLeidas,
  } = useApp();

  const [notificacionesAbierto, setNotificacionesAbierto] = useState(false);
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificacionesAbierto(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setMenuUsuarioAbierto(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0f1d]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* --- Lado Izquierdo: Volver + Título de Casaciones --- */}
        <div className="flex items-center gap-6">
          <a
            href="/"
            className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1.5"
          >
            <span className="text-sm leading-none">←</span> Volver
          </a>

          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight">
              Buscador de Casaciones
            </h1>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>OpenSearch</span>
              <span className="text-slate-600">•</span>
              <span>PDFs indexados</span>
            </p>
          </div>
        </div>

        {/* --- Centro: Enlaces Poder Judicial y Tribunal Constitucional --- */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a
            href="/poder-judicial"
            className="text-slate-300 hover:text-white transition duration-150"
          >
            Poder Judicial
          </a>
          <a
            href="/tribunal-constitucional"
            className="text-slate-300 hover:text-white transition duration-150"
          >
            Tribunal Constitucional
          </a>
        </nav>

        {/* --- Lado Derecho: Campana de Notificaciones + Avatar "I" --- */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Campana de Notificaciones (Requerimiento Principal) */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setNotificacionesAbierto(!notificacionesAbierto);
                setMenuUsuarioAbierto(false);
              }}
              className={`relative p-2 rounded-xl transition duration-200 border ${
                notificacionesAbierto
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                  : 'bg-[#111a2e] border-slate-800/80 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
              aria-label="Notificaciones del Poder Judicial"
              title="Alertas de expedientes y casaciones"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>

              {/* Badge de Alertas No Leídas */}
              {notificacionesNoLeidas > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[19px] h-[19px] px-1 text-[10px] font-bold bg-amber-500 text-slate-950 rounded-full shadow-md shadow-amber-500/30 animate-pulse">
                  {notificacionesNoLeidas}
                </span>
              )}
            </button>

            {/* Panel Dropdown de Notificaciones */}
            {notificacionesAbierto && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-slate-800 bg-[#0e1628] shadow-2xl shadow-black/80 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 z-50 overflow-hidden">
                {/* Cabecera del Dropdown */}
                <div className="px-4 py-3 border-b border-slate-800/80 flex items-center justify-between bg-[#121c33]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <h3 className="text-sm font-semibold text-white">
                      Alertas de Casaciones
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-full">
                      {notificacionesNoLeidas} nuevas
                    </span>
                  </div>

                  {notificacionesNoLeidas > 0 && (
                    <button
                      onClick={marcarTodasComoLeidas}
                      className="text-[11px] text-slate-400 hover:text-amber-400 transition"
                    >
                      Marcar leídas
                    </button>
                  )}
                </div>

                {/* Lista de Alertas Notificadas */}
                <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-800/60">
                  {notificaciones.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No hay notificaciones recientes.
                    </div>
                  ) : (
                    notificaciones.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          marcarComoLeida(n.id);
                          if (onSelectDocument) onSelectDocument(n);
                        }}
                        className={`p-4 transition cursor-pointer hover:bg-[#152038] ${
                          !n.leida ? 'bg-[#121c33]/70' : 'bg-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                              !n.leida
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="w-4 h-4"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p
                                className={`text-xs font-semibold truncate ${
                                  !n.leida ? 'text-white' : 'text-slate-300'
                                }`}
                              >
                                {n.titulo}
                              </p>
                              <span className="text-[10px] text-slate-500 shrink-0">
                                Hace 2h
                              </span>
                            </div>

                            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {n.mensaje}
                            </p>

                            {n.expediente && (
                              <div className="mt-2 flex items-center justify-between">
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800 text-amber-300">
                                  {n.expediente}
                                </span>
                                <span className="text-[11px] text-amber-400 font-medium hover:underline flex items-center gap-1">
                                  Ver documento →
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pie del Dropdown */}
                <div className="p-3 border-t border-slate-800/80 bg-[#0a0f1d] text-center">
                  <span className="text-[11px] text-slate-400">
                    El scraper sondea resoluciones del Poder Judicial en segundo plano.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Avatar del Usuario ("I" Anaranjado como en la captura) */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => {
                setMenuUsuarioAbierto(!menuUsuarioAbierto);
                setNotificacionesAbierto(false);
              }}
              className="flex items-center gap-2 group cursor-pointer"
            >
              {/* Círculo anaranjado con "I" */}
              <div className="w-8 h-8 rounded-full bg-[#f59e0b] text-white font-semibold text-sm flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:brightness-110 transition">
                I
              </div>
              {/* Chevron hacia abajo */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  menuUsuarioAbierto ? 'rotate-180 text-white' : ''
                }`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {/* Dropdown Usuario */}
            {menuUsuarioAbierto && (
              <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-800 bg-[#0e1628] p-2 text-slate-200 shadow-2xl shadow-black/80 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 z-50">
                <div className="px-4 py-2.5 border-b border-slate-800">
                  <p className="text-xs font-semibold text-white">Isaac</p>
                  <p className="text-[11px] text-slate-400">Abogado Colegiado</p>
                </div>
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition">
                    Mis Alertas Guardadas
                  </button>
                  <button className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition">
                    Configuración de Cuenta
                  </button>
                </div>
                <div className="pt-1 border-t border-slate-800">
                  <button className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition">
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
