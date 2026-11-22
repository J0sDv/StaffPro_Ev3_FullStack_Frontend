// Listas fijas de la interfaz de StaffPro (no son datos del backend).
export const ROLES = {
  ADMIN: 'Administrador',
  RRHH: 'Jefe de RR.HH.',
  COORDINADOR: 'Coordinador',
  RECLUTADOR: 'Reclutador',
  CLIENTE: 'Cliente',
  TRABAJADOR: 'Trabajador',
};

export const TIPOS_CONTRATO = [
  { codigo: 'CT001', nombre: 'Eventual', descripcion: 'Contrato por obra o servicio especifico.', duracion: 'Hasta 3 meses', beneficios: 'Sin beneficios' },
  { codigo: 'CT002', nombre: 'Plazo fijo', descripcion: 'Contrato por tiempo determinado.', duracion: '3 a 12 meses', beneficios: 'Seguro de salud' },
  { codigo: 'CT003', nombre: 'Indefinido', descripcion: 'Contrato por tiempo indefinido.', duracion: 'Indefinido', beneficios: 'Seguro de salud + vacaciones pagadas' },
  { codigo: 'CT004', nombre: 'Honorarios', descripcion: 'Contrato de prestacion de servicios.', duracion: 'Por proyecto', beneficios: 'Sin beneficios' },
];

export const ESTADOS_SOLICITUD = ['Solicitado', 'En seleccion', 'Asignado', 'En servicio', 'Finalizado'];

export const DESCRIPCION_ESTADO = {
  'Solicitado': 'Hemos recibido tu solicitud de personal y estamos buscando perfiles.',
  'En seleccion': 'Estamos evaluando a los candidatos disponibles para tu solicitud.',
  'Asignado': 'Hemos asignado personal a tu solicitud.',
  'En servicio': 'Los trabajadores estan cumpliendo con el servicio en tu empresa.',
  'Finalizado': 'El servicio ha finalizado correctamente.',
};