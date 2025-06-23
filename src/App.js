import React, { useState } from 'react';
import { getVendedores, getVentasPorFecha, getReglas } from './api';

function App() {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [comisiones, setComisiones] = useState([]);
  const [loading, setLoading] = useState(false);

  const calcularComisiones = async () => {
    setLoading(true);
    try {
      const ventas = await getVentasPorFecha(fechaInicio, fechaFin);
      const vendedores = await getVendedores();
      const reglas = await getReglas();

      const comisionesPorVendedor = vendedores.map(vendedor => {
        const ventasVendedor = ventas.filter(v => v.vendedor_id === vendedor.id);
        let totalComision = 0;
        ventasVendedor.forEach(venta => {
          const regla = reglas.find(r => venta.monto >= r.amount);
          if (regla) {
            totalComision += venta.monto * regla.rule;
          }
        });
        return {
          nombre: vendedor.nombre,
          totalComision,
        };
      });

      setComisiones(comisionesPorVendedor);
    } catch (error) {
      alert('Error al calcular comisiones');
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Calcular Comisión de Ventas</h1>
      <label>
        Fecha Inicio:
        <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
      </label>
      <label>
        Fecha Fin:
        <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
      </label>
      <button onClick={calcularComisiones} disabled={loading}>
        {loading ? 'Calculando...' : 'Calcular'}
      </button>
      <h2>Resultados</h2>
      <ul>
        {comisiones.map((c, i) => (
          <li key={i}>{c.nombre}: ${c.totalComision.toFixed(2)}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
