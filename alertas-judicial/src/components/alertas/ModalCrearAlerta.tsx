'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';

// ============================================================
// MODAL CREAR ALERTA - Fase 2
// Formulario para registrar nuevas alertas de monitoreo judicial
// con tabs: "Número de Expediente" vs "Palabra Clave".
// Valida formato CUE del Poder Judicial del Perú y retroalimenta al usuario.
// ============================================================

interface ModalCrearAlertaProps {
  isOpen: boolean;
  onClose: () => void;
  initialValue?: string;
  onAlertCreated?: (valor: string, tipo: string) => void;
}

export default function ModalCrearAlerta({
  isOpen,
  onClose,
  initialValue = '',
  onAlertCreated,
}: ModalCrearAlertaProps) {
  const { agregarAlerta } = useApp();

  const [tipo, setTipo] = useState<'expediente' | 'palabra_clave'>('expediente');
  const [valor, setValor] = useState(initialValue);
  const [referencia, setReferencia] = useState('');
  const [especialidad, setEspecialidad] = useState('Todas');
  const [enviando, setEnviando] = useState(false);
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);

  // Sincronizar valor inicial si viene del input de búsqueda
  useEffect(() => {
    if (initialValue) {
      setValor(initialValue);
      // Auto-detectar si parece un expediente o palabra clave
      if (/\d{4,5}-\d{4}/.test(initialValue)) {
        setTipo('expediente');
      } else {
        setTipo('palabra_clave');
      }
    }
  }, [initialValue]);

  if (!isOpen) return null;

  // Validación básica del formato judicial peruano
  const validarFormulario = (): boolean => {
    const val = valor.trim();
    if (!val) {
      setErrorValidacion('Por favor ingresa un valor para monitorear.');
      return false;
    }

    if (tipo === 'expediente') {
      // Formato típico del PJ: 00456-2024 o 00456-2024-0-1801-JR-CI-05
      const patronExpediente = /^\d{4,5}-\d{4}/;
      if (!patronExpediente.test(val)) {
        setErrorValidacion(
          'El expediente debe contener al menos el número y año (ej. 00456-2024 o 00456-2024-0-1801-JR-CI-05).'
        );
        return false;
      }
    } else {
      if (val.length < 3) {
        setErrorValidacion('La palabra clave debe tener al menos 3 caracteres.');
        return false;
      }
    }

    setErrorValidacion(null);
    return true;
  };

  // Envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setEnviando(true);

    setTimeout(() => {
      const valorFinal = referencia.trim()
        ? `${valor.trim()} (${referencia.trim()})`
        : valor.trim();

      agregarAlerta({
        tipo,
        valor: valorFinal,
        estado: 'activo',
        costoTokens: 0,
      });

      setEnviando(false);
      if (onAlertCreated) {
        onAlertCreated(valorFinal, tipo);
      }
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#0e1628] border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Cabecera del Modal */}
        <div className="p-5 border-b border-slate-800/80 flex items-start justify-between bg-[#121c33]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
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
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                Crear Alerta de Monitoreo
              </h2>
              <p className="text-xs text-slate-400">
                El scraper rastreará automáticamente nuevas resoluciones del Poder Judicial.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Tabs Selector: Expediente vs Palabra Clave */}
          <div className="grid grid-cols-2 p-1 bg-[#162035] border border-slate-800 rounded-xl text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setTipo('expediente');
                setErrorValidacion(null);
              }}
              className={`py-2 rounded-lg transition text-center flex items-center justify-center gap-2 ${
                tipo === 'expediente'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>📄</span>
              Por N° de Expediente
            </button>
            <button
              type="button"
              onClick={() => {
                setTipo('palabra_clave');
                setErrorValidacion(null);
              }}
              className={`py-2 rounded-lg transition text-center flex items-center justify-center gap-2 ${
                tipo === 'palabra_clave'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🔍</span>
              Por Palabra Clave
            </button>
          </div>

          {/* Campo Principal */}
          {tipo === 'expediente' ? (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Número de Expediente Judicial
              </label>
              <input
                type="text"
                value={valor}
                onChange={(e) => {
                  setValor(e.target.value);
                  if (errorValidacion) setErrorValidacion(null);
                }}
                placeholder="Ej. 00456-2024-0-1801-JR-CI-05"
                className="w-full px-3.5 py-2.5 bg-[#162035] border border-[#233352] rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono transition"
                autoFocus
              />
              <p className="text-[11px] text-slate-400">
                Formato estándar del Poder Judicial: <span className="text-amber-400 font-mono">00000-AÑO-0-DISTRITO-INSTANCIA</span>
              </p>

              {/* Botones de ejemplo rápido */}
              <div className="pt-1 flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-slate-500">Ejemplos:</span>
                <button
                  type="button"
                  onClick={() => setValor('00456-2024-0-1801-JR-CI-05')}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  00456-2024-0-1801-JR-CI-05
                </button>
                <button
                  type="button"
                  onClick={() => setValor('01234-2024-0-1801-JR-PE-03')}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  01234-2024-0-1801-JR-PE-03
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Palabra Clave, Materia o Vocal
              </label>
              <input
                type="text"
                value={valor}
                onChange={(e) => {
                  setValor(e.target.value);
                  if (errorValidacion) setErrorValidacion(null);
                }}
                placeholder="Ej. casación laboral despido fraudulento"
                className="w-full px-3.5 py-2.5 bg-[#162035] border border-[#233352] rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                autoFocus
              />
              <p className="text-[11px] text-slate-400">
                Te notificaremos cuando cualquier Sala Suprema publique una casación con estos términos.
              </p>

              {/* Filtro de Materia */}
              <div className="pt-2">
                <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                  Especialidad preferente:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['Todas', 'Civil', 'Penal', 'Laboral', 'Constitucional'].map(
                    (mat) => (
                      <button
                        key={mat}
                        type="button"
                        onClick={() => setEspecialidad(mat)}
                        className={`px-2.5 py-1 text-[11px] rounded-lg transition ${
                          especialidad === mat
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
                            : 'bg-slate-800/60 text-slate-400 hover:text-white border border-transparent'
                        }`}
                      >
                        {mat}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Campo Opcional: Referencia / Cliente */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Referencia o Cliente <span className="text-slate-500">(opcional)</span>
            </label>
            <input
              type="text"
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
              placeholder="Ej. Caso Empresa ABC / Demandante"
              className="w-full px-3.5 py-2 bg-[#162035] border border-[#233352] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Mensaje de Error de Validación */}
          {errorValidacion && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorValidacion}</span>
            </div>
          )}

          {/* Caja Informativa de Monitoreo */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-[#121c33]/70 text-xs text-slate-400 flex items-start gap-2.5">
            <span className="text-amber-400 text-sm">🔔</span>
            <p className="leading-relaxed text-[11px]">
              <strong className="text-slate-200">Notificación automática:</strong> Al activarse la alerta, el scraper revisará continuamente el portal del Poder Judicial. En cuanto se cargue una nueva resolución, se encenderá la campana en la barra superior.
            </p>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={enviando}
              className="px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={enviando}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs rounded-lg shadow-lg shadow-amber-500/20 transition duration-150 cursor-pointer disabled:opacity-50"
            >
              {enviando ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Activando...</span>
                </>
              ) : (
                <>
                  <span>+ Activar Monitoreo</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
