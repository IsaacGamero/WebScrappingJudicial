import { useState, useEffect, useCallback } from 'react';

// ============================================================
// HOOK useIdentidad
// Persiste los datos de identidad del consultante en localStorage
// para que el usuario no tenga que volver a ingresarlos.
// ============================================================

export interface DatosIdentidad {
  tipoDocumento: string;
  numeroDocumento: string;
  fechaEmision: string;
  fechaNacimiento: string;
  guardadoEn: string;
}

const STORAGE_KEY = 'pj_identidad_consultante';

export function useIdentidad() {
  const [identidad, setIdentidadState] = useState<DatosIdentidad | null>(null);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DatosIdentidad;
        setIdentidadState(parsed);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setCargado(true);
    }
  }, []);

  const guardarIdentidad = useCallback((datos: Omit<DatosIdentidad, 'guardadoEn'>) => {
    const completo: DatosIdentidad = {
      ...datos,
      guardadoEn: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completo));
    setIdentidadState(completo);
  }, []);

  const limpiarIdentidad = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setIdentidadState(null);
  }, []);

  return {
    identidad,
    cargado,
    tieneIdentidad: identidad !== null,
    guardarIdentidad,
    limpiarIdentidad,
  };
}
