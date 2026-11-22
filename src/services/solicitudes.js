import { post } from './api';

// La regla de negocio (no pedir mas personal del disponible) la aplica ms-solicitudes.
// Aqui solo se traduce la respuesta al formato que ya usa la vista.
export async function registrarSolicitud(datos) {
  try {
    const solicitud = await post('/solicitudes', { ...datos, cantidad: Number(datos.cantidad) });
    return { ok: true, solicitud };
  } catch (e) {
    return { ok: false, motivo: e.message, disponibles: e.datos?.disponibles ?? 0 };
  }
}
