import { getToken, limpiarSesion } from './sesion';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export class ApiError extends Error {
  constructor(mensaje, status, datos) {
    super(mensaje);
    this.status = status;
    this.datos = datos;
  }
}

// Unica funcion que habla con el backend: agrega el token y traduce los errores.
export async function api(ruta, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let resp;
  try {
    resp = await fetch(`${BASE}${ruta}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor.', 0);
  }

  // 401 con token enviado = token vencido o invalido: se cierra la sesion
  if (resp.status === 401 && token) {
    limpiarSesion();
    window.dispatchEvent(new Event('sesion-expirada'));
  }

  const data = resp.status === 204 ? null : await resp.json().catch(() => null);
  if (!resp.ok) throw new ApiError(data?.error ?? `Error ${resp.status}`, resp.status, data);
  return data;
}

export const get = (ruta) => api(ruta);
export const post = (ruta, body) => api(ruta, { method: 'POST', body });
export const put = (ruta, body) => api(ruta, { method: 'PUT', body });
export const del = (ruta) => api(ruta, { method: 'DELETE' });