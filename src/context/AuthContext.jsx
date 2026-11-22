import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { post } from '../services/api';
import { guardarSesion, leerSesion, limpiarSesion } from '../services/sesion';

const AuthContext = createContext(null);
const RENOVAR_CADA_MS = 20 * 60 * 1000; // el token dura 60 min

export function AuthProvider({ children }) {
  // Al cargar o recargar la pagina se recupera la sesion guardada (si sigue vigente)
  const [usuario, setUsuario] = useState(() => leerSesion()?.usuario ?? null);
  const hayUsuario = Boolean(usuario);

  const abrirSesion = useCallback((auth) => {
    guardarSesion(auth); // { token, usuario } tal como lo devuelve el backend
    setUsuario(auth.usuario);
    return auth.usuario;
  }, []);

  const logout = useCallback(() => {
    limpiarSesion();
    setUsuario(null);
  }, []);

  const login = async ({ correo, rut, password }) => {
    try {
      return { ok: true, usuario: abrirSesion(await post('/auth/login', { correo, rut, password })) };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  };

  const registrar = async (datos) => {
    try {
      return { ok: true, usuario: abrirSesion(await post('/auth/registro', datos)) };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  };

  // Si el backend responde 401, api.js avisa y se cierra la sesion
  useEffect(() => {
    window.addEventListener('sesion-expirada', logout);
    return () => window.removeEventListener('sesion-expirada', logout);
  }, [logout]);

  // Renueva el token al cargar y cada 20 minutos mientras haya sesion
  useEffect(() => {
    if (!hayUsuario) return undefined;
    const renovar = async () => {
      try {
        abrirSesion(await post('/auth/refresh'));
      } catch {
        /* si fue un 401, api.js ya cerro la sesion */
      }
    };
    renovar();
    const id = setInterval(renovar, RENOVAR_CADA_MS);
    return () => clearInterval(id);
  }, [hayUsuario, abrirSesion]);

  return (
    <AuthContext.Provider value={{ usuario, login, logout, registrar }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}