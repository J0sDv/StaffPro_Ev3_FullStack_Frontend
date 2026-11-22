import { get } from './api';
import { ROLES } from '../data/catalogos';

// Que pide el Panel de cada rol (solo rutas que ese rol tiene permitidas en el Gateway)
const PEDIDOS = {
  [ROLES.ADMIN]: { usuarios: '/usuarios', trabajadores: '/trabajadores', solicitudes: '/solicitudes', asistencias: '/asistencias' },
  [ROLES.RRHH]: { trabajadores: '/trabajadores', asistencias: '/asistencias' },
  [ROLES.COORDINADOR]: { solicitudes: '/solicitudes', trabajadores: '/trabajadores' },
  [ROLES.RECLUTADOR]: { trabajadores: '/trabajadores' },
  [ROLES.CLIENTE]: { solicitudes: '/solicitudes' },
  [ROLES.TRABAJADOR]: { asistencias: '/asistencias', ficha: '/trabajadores/mi-ficha' },
};

export async function cargarDatosPanel(usuario) {
  const pedidos = { ...(PEDIDOS[usuario.rol] ?? {}) };
  if (usuario.rol === ROLES.CLIENTE) {
    pedidos.asignados = `/trabajadores/asignados?cliente=${encodeURIComponent(usuario.empresa ?? '')}`;
  }
  const claves = Object.keys(pedidos);
  // allSettled: si un servicio no responde (por ejemplo ms-solicitudes aun no existe) las demas tarjetas igual se muestran
  const resultados = await Promise.allSettled(claves.map((k) => get(pedidos[k])));
  const crudos = {};
  claves.forEach((k, i) => {
    crudos[k] = resultados[i].status === 'fulfilled' ? resultados[i].value : null;
  });
  return {
    usuarios: crudos.usuarios ?? [],
    trabajadores: crudos.trabajadores ?? (crudos.ficha ? [crudos.ficha] : []),
    solicitudes: crudos.solicitudes ?? [],
    asistencias: crudos.asistencias ?? [],
    personalAsignado: crudos.asignados?.cantidad ?? 0,
  };
}