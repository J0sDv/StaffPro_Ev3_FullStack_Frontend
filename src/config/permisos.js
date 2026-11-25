import { ROLES } from '../data/catalogos';

const { ADMIN, RRHH, COORDINADOR, RECLUTADOR, CLIENTE, TRABAJADOR } = ROLES;

// Quien puede hacer cada accion en la interfaz.
// El Gateway aplica las mismas reglas en el backend: ahi es donde se decide de verdad.
export const PERMISOS = {
  'usuarios.gestionar': [ADMIN],
  'trabajadores.editar': [RECLUTADOR, ADMIN],
  'trabajadores.asignar': [COORDINADOR, ADMIN],
  'solicitudes.crear': [CLIENTE],
  'solicitudes.cambiarEstado': [COORDINADOR, ADMIN],
  'asistencia.marcar': [TRABAJADOR],
  'reportes.ver': [RRHH, ADMIN],
};

export const puede = (rol, accion) => (PERMISOS[accion] ?? []).includes(rol);