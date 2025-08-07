import React, { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [cantidad, setCantidad] = useState("");

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const res = await axios.get(`${API}/api/productos`);
    setProductos(res.data);
  };

  const agregar = async () => {
    if (!nombre || !precio || !cantidad) return;
    await axios.post(`${API}/api/productos`, {
      nombre,
      precio: parseFloat(precio),
      cantidad: parseInt(cantidad),
    });
    setNombre("");
    setPrecio("");
    setCantidad("");
    fetchProductos();
  };

  const eliminar = async (id) => {
    await axios.delete(`${API}/api/productos/${id}`);
    fetchProductos();
  };

  const generarQR = async (id) => {
    try {
      const res = await axios.post(`${API}/api/generar_qr/${id}`);
      window.open(res.data.url, "_blank");
    } catch {
      alert("Error al obtener QR");
    }
  };

 return (
  <div>
    <h1>Panel Administración Dispen-Easy</h1>
    <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
    <input value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="Precio" />
    <input value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder="Cantidad" />
    <button onClick={agregar}>Agregar</button>

    <h3>Productos</h3>
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((prod) => (
          <tr key={prod.id}>
            <td>{prod.nombre}</td>
            <td>${prod.precio}</td>
            <td>{prod.cantidad}</td>
            <td>
              <button onClick={() => generarQR(prod.id)}>QR Pago</button>
              <button onClick={() => eliminar(prod.id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
}

export default AdminPanel;
