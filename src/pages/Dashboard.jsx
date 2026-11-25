import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';   
import PageHeader from '../components/PageHeader';
import ReporteHoras from '../components/ReporteHoras';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { MENUS } from '../config/menus';
import { cargarDatosPanel } from '../services/panel';
import { estadisticasPorRol } from '../utils/estadisticas';
import Permiso from '../components/Permiso';

// Panel de inicio
export default function Dashboard() {
  const { usuario } = useAuth();
  const location = useLocation();   
  const [datos, setDatos] = useState({});

  useEffect(() => {
    cargarDatosPanel(usuario).then(setDatos);
  }, [usuario.id, usuario.rol, usuario.empresa]); // eslint-disable-line react-hooks/exhaustive-deps

  const estadisticas = estadisticasPorRol(usuario.rol, usuario, datos);
  const accesos = (MENUS[usuario.rol] ?? []).filter((m) => m.descripcion);

  return (
    <>
      <PageHeader titulo={`Hola, ${usuario.nombre}`} subtitulo={`Panel de ${usuario.rol}`} />

      <Container className="my-5">
        {/* aviso cuando RutaProtegida nos devolvio aqui por falta de permiso */}
        {location.state?.sinPermiso && (
          <Alert variant="warning">No tienes permiso para acceder a esa sección.</Alert>
        )}

        <Row className="g-4 text-center mb-5">
          {estadisticas.map((e) => (
            <Col key={e.titulo} xs={6} lg={3}>
              <StatCard {...e} />
            </Col>
          ))}
        </Row>

        {accesos.length > 0 && <h2 className="h5 fw-bold mb-3">Accesos rapidos</h2>}
        <Row className="g-4">
          {accesos.map((a) => (
            <Col key={a.to} xs={12} md={6} lg={3}>
              <Card as={Link} to={a.to} className="panel-card shadow-sm h-100">
                <Card.Body>
                  <i className={`bi ${a.icono} panel-icono`}></i>
                  <h3 className="h6 fw-bold mt-2">{a.label}</h3>
                  <p className="small text-muted mb-0">{a.descripcion}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Reporte de horas y costos solo para RR.HH. y Administrador */}
        <Permiso accion="reportes.ver"><ReporteHoras /></Permiso>
      </Container>
    </>
  );
}
