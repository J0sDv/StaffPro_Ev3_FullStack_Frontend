import { useEffect, useState } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import StatCard from './StatCard';
import EstadoCarga from './EstadoCarga';
import { get } from '../services/api';
import { formatoCLP } from '../utils/formato';

// Reporte de horas y costo estimado: el calculo lo hace ms-personal (GET /reportes/horas).
export default function ReporteHoras() {
  const [reporte, setReporte] = useState({ filas: [], totales: [] });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    get('/reportes/horas')
      .then(setReporte)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  const { filas, totales: porCliente } = reporte;
  const totalHoras = filas.reduce((suma, f) => suma + f.horas, 0);
  const totalCosto = filas.reduce((suma, f) => suma + f.costo, 0);
 
  return (
    <section className="mt-5">
      <h2 className="h4 fw-bold mb-3">Reporte de horas y costos</h2>
      <EstadoCarga cargando={cargando} error={error} />
 
      <Row className="g-4 text-center mb-4">
        <Col xs={12} md={4}><StatCard valor={filas.length} titulo="Trabajadores con horas" icono="bi-people" /></Col>
        <Col xs={6} md={4}><StatCard valor={totalHoras.toFixed(1)} titulo="Horas totales" icono="bi-clock-history" /></Col>
        <Col xs={6} md={4}><StatCard valor={formatoCLP(totalCosto)} titulo="Costo estimado" icono="bi-cash-coin" /></Col>
      </Row>
 
      {filas.length === 0 ? (
        !cargando && !error && (
        <p className="text-muted">Aun no hay marcajes completos (entrada y salida) para calcular horas.</p>
        )
      ) : (
        <>
          <h3 className="h6 fw-bold">Costo por cliente</h3>
          <div className="table-responsive bg-white shadow-sm rounded mb-4">
            <Table hover className="align-middle mb-0">
              <thead className="table-header-staffpro">
                <tr><th>Cliente</th><th className="text-end">Horas</th><th className="text-end">Costo estimado</th></tr>
              </thead>
              <tbody>
                {porCliente.map((c) => (
                  <tr key={c.cliente}>
                    <td>{c.cliente}</td>
                    <td className="text-end">{c.horas.toFixed(1)}</td>
                    <td className="text-end">{formatoCLP(c.costo)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
 
          <h3 className="h6 fw-bold">Detalle por trabajador</h3>
          <div className="table-responsive bg-white shadow-sm rounded">
            <Table hover className="align-middle mb-0">
              <thead className="table-header-staffpro">
                <tr><th>Trabajador</th><th>Cliente</th><th className="text-end">Horas</th><th className="text-end">Valor hora</th><th className="text-end">Costo</th></tr>
              </thead>
              <tbody>
                {filas.map((f) => (
                  <tr key={f.id}>
                    <td>{f.nombre}</td>
                    <td>{f.cliente}</td>
                    <td className="text-end">{f.horas.toFixed(1)}</td>
                    <td className="text-end">{formatoCLP(f.valorHora)}</td>
                    <td className="text-end">{formatoCLP(f.costo)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}
    </section>
  );
}
