import { useState } from 'react';
import { Row, Col, Form, Table, Alert } from 'react-bootstrap';
import EstadoCarga from './EstadoCarga';
import useColeccion from '../hooks/useColeccion';
import { put } from '../services/api';
import { ESTADOS_SOLICITUD } from '../data/catalogos';
import { codigoSolicitud, formatearFecha } from '../utils/formato';

// El coordinador revisa las solicitudes de los clientes y actualiza su estado.
export default function PanelSolicitudes() {
  const { datos, cargando, error, recargar } = useColeccion('solicitudes');
  const [filtro, setFiltro] = useState('todos');
  const [errorEstado, setErrorEstado] = useState('');
  const visibles = datos.filter((s) => filtro === 'todos' || s.estado === filtro);

  const cambiarEstado = async (id, estado) => {
    try {
      await put(`/solicitudes/${id}/estado`, { estado });
      setErrorEstado('');
    } catch (e) {
      setErrorEstado(e.message);
    }
    await recargar();   // vuelve a leer: si el backend rechazo el cambio, el selector regresa al valor real
  };

  return (
    <>
      {errorEstado && <Alert variant="danger">{errorEstado}</Alert>}
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />

      <Row className="mb-4">
        <Col md={4}>
          <Form.Label htmlFor="filtroEstadoSolicitud">Filtrar por estado</Form.Label>
          <Form.Select id="filtroEstadoSolicitud" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="todos">Todos los estados</option>
            {ESTADOS_SOLICITUD.map((e) => <option key={e} value={e}>{e}</option>)}
          </Form.Select>
        </Col>
      </Row>

      {visibles.length === 0 ? (
        !cargando && !error && <p className="text-center text-muted py-5">No hay solicitudes para mostrar.</p>
      ) : (
        <div className="table-responsive bg-white shadow-sm rounded">
          <Table hover className="align-middle mb-0">
            <thead className="table-header-staffpro">
              <tr><th>Codigo</th><th>Empresa</th><th>Especialidad</th><th>Cant.</th><th>Periodo</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {visibles.map((s) => (
                <tr key={s.id}>
                  <td>{codigoSolicitud(s.id)}</td>
                  <td>{s.empresa}<div className="small text-muted">{s.contacto}</div></td>
                  <td>{s.especialidad}</td>
                  <td>{s.cantidad}</td>
                  <td className="text-nowrap">{formatearFecha(s.fechaInicio)} - {formatearFecha(s.fechaTermino)}</td>
                  <td style={{ minWidth: 170 }}>
                    <Form.Select size="sm" aria-label={`Estado de ${codigoSolicitud(s.id)}`} value={s.estado}
                      onChange={(e) => cambiarEstado(s.id, e.target.value)}>
                      {ESTADOS_SOLICITUD.map((e) => <option key={e} value={e}>{e}</option>)}
                    </Form.Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
}