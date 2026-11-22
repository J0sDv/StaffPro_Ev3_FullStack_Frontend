import { useCallback, useEffect, useState } from 'react';
import { get, post, put, del } from '../services/api';

// Cada coleccion de StaffPro vive en un microservicio, aqui se asocia a su ruta del Gateway.
const RUTAS = {
  usuarios: '/usuarios',
  trabajadores: '/trabajadores',
  solicitudes: '/solicitudes',
  asistencias: '/asistencias',
};

export default function useColeccion(coleccion) {
  const ruta = RUTAS[coleccion];
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const recargar = useCallback(async () => {
    setCargando(true);
    try {
      setDatos(await get(ruta));
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, [ruta]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  // Ejecuta una operacion y, si resulto bien, vuelve a leer la lista
  const ejecutar = useCallback(async (operacion) => {
    try {
      const data = await operacion();
      await recargar();
      return { ok: true, data };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }, [recargar]);

  const agregar = useCallback((item) => ejecutar(() => post(ruta, item)), [ejecutar, ruta]);
  const modificar = useCallback((id, cambios) => ejecutar(() => put(`${ruta}/${id}`, cambios)), [ejecutar, ruta]);
  const quitar = useCallback((id) => ejecutar(() => del(`${ruta}/${id}`)), [ejecutar, ruta]);

  return { datos, cargando, error, agregar, modificar, quitar, recargar };
}
