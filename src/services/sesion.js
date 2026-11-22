const CLAVE = 'staffpro.sesion';

// El token se guarda en sessionStorage: sobrevive a recargar la pagina (F5)
// y se borra al cerrar la pestana.
export function guardarSesion({ token, usuario }) {
  sessionStorage.setItem(CLAVE, JSON.stringify({ token, usuario }));
}

export function leerSesion() {
  try {
    const sesion = JSON.parse(sessionStorage.getItem(CLAVE));
    if (!sesion?.token || tokenVencido(sesion.token)) {
      limpiarSesion();
      return null;
    }
    return sesion;
  } catch {
    return null;
  }
}

export function limpiarSesion() {
  sessionStorage.removeItem(CLAVE);
}

export const getToken = () => leerSesion()?.token ?? null;

// Lee el vencimiento (exp) del JWT solo para no usar un token ya vencido.
// Quien valida de verdad la firma es el Gateway.
export function tokenVencido(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}