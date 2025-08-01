import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');

  const API = 'https://dispen-easy-backend-production.up.railway.app';

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const res = await axios.get(`${API}/api/productos`);
    setProductos(res.data);
  };

  const agregarProducto = async () => {
    if (!nombre || !precio || !cantidad) return;
    await axios.post(`${API}/api/productos`, { nombre, precio, cantidad });
    setNombre('');
    setPrecio('');
    setCantidad('');
    fetchProductos();
  };

  const eliminarProducto = async (id) => {
    await axios.delete(`${API}/api/productos/${id}`);
    fetchProductos();
  };

  const generarQR = async (id) => {
    try {
      const res = await axios.post(`${API}/api/generar_qr/${id}`);
      const url = res.data.url;
      window.open(url, '_blank');
    } catch (error) {
      alert('Error al generar QR');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Panel Dispen-Easy</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="number"
        placeholder="Precio"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
      />
      <input
        type="number"
        placeholder="Cantidad"
        value={cantidad}
        onChange={(e) => setCantidadMl(e.target.value)}
      />
      <button onClick={agregarProducto}>Agregar</button>

      <table border="1" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>ML</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>${p.precio}</td>
              <td>{p.cantidad}ml</td>
              <td>
                <button onClick={() => generarQR(p.id)}>QR</button>
                <button onClick={() => eliminarProducto(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;
