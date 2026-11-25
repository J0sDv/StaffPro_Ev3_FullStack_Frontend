import { useAuth } from '../context/AuthContext';
import { puede } from '../config/permisos';

// Muestra su contenido solo si el rol del usuario tiene permiso para la accion.
// Si no, muestra 'alternativa' (por defecto, nada).
export default function Permiso({ accion, children, alternativa = null }) {
  const { usuario } = useAuth();
  return puede(usuario?.rol, accion) ? children : alternativa;
}