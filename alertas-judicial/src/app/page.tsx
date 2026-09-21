'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import ModalCrearAlerta from '@/components/alertas/ModalCrearAlerta';
import DashboardMonitoreo from '@/components/alertas/DashboardMonitoreo';
import BuscadorExpedientes, { FiltrosBusqueda } from '@/components/alertas/BuscadorExpedientes';
import { Alerta } from '@/data/mockData';

// ============================================================
// BUSCADOR DE CASACIONES + DASHBOARD DE CASOS MONITOREADOS
// (Fases 1, 2 y 3)
// ============================================================

export default function BuscadorCasacionesPage() {
  const { alertas } = useApp();

  const [vistaActual, setVistaActual] = useState<'buscador' | 'monitoreo'>('buscador');
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [busquedaLoading, setBusquedaLoading] = useState(false);
  const [filtrosActivos, setFiltrosActivos] = useState<FiltrosBusqueda | null>(null);
  const [modalAlertaAbierto, setModalAlertaAbierto] = useState(false);
  const [valorParaModal, setValorParaModal] = useState('');
  const [toastData, setToastData] = useState<{ valor: string; tipo: string } | null>(null);
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState<any>(null);

  // Manejador de búsqueda
  const handleBuscar = (filtros: FiltrosBusqueda) => {
    setBusquedaLoading(true);
    setFiltrosActivos(filtros);
    // Simula llamada al backend
    setTimeout(() => {
      setBusquedaRealizada(true);
      setBusquedaLoading(false);
    }, 800);
  };

  // Abrir modal con valor predeterminado
  const handleAbrirModal = (prefill: string = '') => {
    setValorParaModal(prefill);
    setModalAlertaAbierto(true);
  };

  // Callback cuando se crea la alerta exitosamente desde el modal
  const handleAlertaCreada = (valorRegistrado: string, tipoRegistrado: string) => {
    setToastData({ valor: valorRegistrado, tipo: tipoRegistrado });
    setTimeout(() => setToastData(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Flotante de Éxito al Registrar Alerta */}
      {toastData && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121c33] border border-amber-500/60 text-white px-5 py-4 rounded-2xl shadow-2xl shadow-black/80 flex items-start gap-3.5 max-w-md animate-in fade-in slide-in-from-top-2">
          <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white flex items-center gap-2">
              <span>Alerta de Monitoreo Activada</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </p>
            <p className="text-xs text-amber-300 font-mono mt-0.5 truncate">
              {toastData.valor}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              El bot ha comenzado el rastreo. Recibirás una notificación en la <strong>campana superior (🔔)</strong> tan pronto se detecte una resolución.
            </p>
          </div>
          <button
            onClick={() => setToastData(null)}
            className="text-slate-400 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* --- Switcher de Vistas Superior (Buscador vs Casos en Monitoreo) --- */}
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
        <div className="flex items-center gap-2 p-1 bg-[#0d1527] border border-slate-800 rounded-xl text-xs font-medium">
          <button
            onClick={() => setVistaActual('buscador')}
            className={`px-4 py-1.5 rounded-lg transition flex items-center gap-2 ${
              vistaActual === 'buscador'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🔍</span>
            Buscador de Casaciones
          </button>

          <button
            onClick={() => setVistaActual('monitoreo')}
            className={`px-4 py-1.5 rounded-lg transition flex items-center gap-2 ${
              vistaActual === 'monitoreo'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📡</span>
            Casos en Monitoreo
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                vistaActual === 'monitoreo'
                  ? 'bg-slate-950 text-amber-400'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {alertas.length}
            </span>
          </button>
        </div>

        {/* Botón rápido "+ Crear Alerta" */}
        <button
          onClick={() => handleAbrirModal(filtrosActivos?.codigoExpediente || filtrosActivos?.nroExpediente || '')}
          className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-medium transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-3.5 h-3.5"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          + Nueva Alerta
        </button>
      </div>

      {/* --- RENDER CONDICIONAL SEGÚN VISTA SELECCIONADA --- */}
      {vistaActual === 'monitoreo' ? (
        <DashboardMonitoreo
          onOpenCrearAlerta={() => handleAbrirModal()}
          onVerDocumento={(alerta: Alerta) => setDocumentoSeleccionado({
            mensaje: `Se ha detectado una nueva resolución judicial oficial para este caso en las Salas Supremas.`,
            expediente: alerta.valor,
          })}
        />
      ) : (
        /* --- VISTA 1: BUSCADOR POR FILTROS (replica Portal PJ) --- */
        <div className="space-y-6">
          {/* Header con título y botón crear alerta */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white tracking-wide">Búsqueda de Expedientes</h2>
              <p className="text-xs text-slate-500 mt-0.5">Portal del Poder Judicial del Perú</p>
            </div>
            <button
              type="button"
              onClick={() => handleAbrirModal(filtrosActivos?.codigoExpediente || filtrosActivos?.nroExpediente || '')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1.5 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              + Crear Alerta de Monitoreo
            </button>
          </div>

          {/* Formulario de búsqueda por categorías */}
          <BuscadorExpedientes onBuscar={handleBuscar} loading={busquedaLoading} />

          {/* Indicador de Resultados */}
          {busquedaRealizada && filtrosActivos && (
            <div className="pt-2 flex items-center justify-between">
              <p className="text-xs text-slate-400 font-normal">
                <strong className="text-slate-200 font-semibold">0</strong>{' '}
                resultados para{' '}
                <span className="text-amber-400 font-mono">
                  {filtrosActivos.modo === 'codigo'
                    ? filtrosActivos.codigoExpediente
                    : `${filtrosActivos.distritoJudicial} / ${filtrosActivos.instancia} / ${filtrosActivos.especialidad} / ${filtrosActivos.anio}`}
                </span>
              </p>
            </div>
          )}

          {/* Estado Vacío Central */}
          <div className="py-24 sm:py-32 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-base sm:text-lg font-normal text-slate-300">
              No se encontraron resultados
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Intenta con otra búsqueda o cambia los filtros
            </p>

            {/* Banner CTA */}
            <div className="mt-8 p-5 rounded-2xl border border-slate-800 bg-[#0d1527]/70 max-w-lg text-left flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5"
                >
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-semibold text-white">
                  ¿Esperando una resolución que aún no se publica?
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  No necesitas entrar a revisar todos los días. Registra el número de expediente y nuestro bot te notificará de inmediato cuando aparezca en las Salas Supremas.
                </p>
                <div className="mt-3 flex items-center gap-4">
                  <button
                    onClick={() => handleAbrirModal(filtrosActivos?.codigoExpediente || filtrosActivos?.nroExpediente || '')}
                    className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium"
                  >
                    <span>Configurar alerta de monitoreo</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => setVistaActual('monitoreo')}
                    className="text-xs text-slate-400 hover:text-white transition"
                  >
                    Ver mis {alertas.length} casos activos →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL CREAR ALERTA (FASE 2) --- */}
      <ModalCrearAlerta
        isOpen={modalAlertaAbierto}
        onClose={() => setModalAlertaAbierto(false)}
        initialValue={valorParaModal}
        onAlertCreated={handleAlertaCreada}
      />

      {/* --- MODAL DETALLE DE DOCUMENTO DETECTADO --- */}
      {documentoSeleccionado && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1628] border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-5 h-5"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </span>
                <h3 className="text-sm font-semibold text-white">
                  Documento detectado por Alerta
                </h3>
              </div>
              <button
                onClick={() => setDocumentoSeleccionado(null)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                {documentoSeleccionado.mensaje}
              </p>
              <div className="p-3 bg-[#121c33] rounded-xl border border-slate-800 text-xs font-mono text-amber-300">
                Expediente: {documentoSeleccionado.expediente || '01234-2024-0-1801-JR-PE-03'}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDocumentoSeleccionado(null)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300 hover:bg-slate-800"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  alert('Descargando resolución del expediente en PDF...');
                  setDocumentoSeleccionado(null);
                }}
                className="px-5 py-2 rounded-lg bg-amber-500 text-black font-semibold text-xs hover:bg-amber-400 shadow-md shadow-amber-500/20"
              >
                Descargar PDF Oficial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
