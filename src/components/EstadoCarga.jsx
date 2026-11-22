import { Alert, Button, Spinner } from 'react-bootstrap';

export default function EstadoCarga({ cargando, error, onReintentar }) {
  if (cargando) {
    return (
      <div className="text-center text-muted py-3">
        <Spinner animation="border" size="sm" className="me-2" />Cargando...
      </div>
    );
  }
  if (error) {
    return (
      <Alert variant="danger" className="d-flex justify-content-between align-items-center">
        <span>{error}</span>
        {onReintentar && <Button size="sm" variant="outline-danger" onClick={onReintentar}>Reintentar</Button>}
      </Alert>
    );
  }
  return null;
}