'use client';

import React, { useState } from 'react';
import DashboardMonitoreo from '@/components/alertas/DashboardMonitoreo';
import ModalCrearAlerta from '@/components/alertas/ModalCrearAlerta';
import { Alerta } from '@/data/mockData';

export default function MonitoreoPage() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [documentoModal, setDocumentoModal] = useState<Alerta | null>(null);

  return (
    <div className="space-y-6">
      <DashboardMonitoreo
        onOpenCrearAlerta={() => setModalAbierto(true)}
        onVerDocumento={(alerta) => setDocumentoModal(alerta)}
      />

      <ModalCrearAlerta
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
      />

      {/* Modal de Detalle de Documento */}
      {documentoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1628] border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">📄</span>
                <h3 className="text-sm font-semibold text-white">Documento Detectado</h3>
              </div>
              <button
                onClick={() => setDocumentoModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <p>
                <strong className="text-slate-400">Expediente:</strong> {documentoModal.valor}
              </p>
              <p>
                <strong className="text-slate-400">Detección:</strong> {new Date(documentoModal.ultimaRevision).toLocaleString('es-PE')}
              </p>
              <p className="text-slate-400 leading-relaxed pt-2">
                Se ha detectado una nueva resolución judicial oficial publicada en las Salas Supremas del Poder Judicial.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDocumentoModal(null)}
                className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  alert(`Descargando resolución oficial para ${documentoModal.valor}...`);
                  setDocumentoModal(null);
                }}
                className="px-4 py-2 bg-amber-500 text-black font-semibold text-xs rounded-lg hover:bg-amber-400 shadow-md shadow-amber-500/20"
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
