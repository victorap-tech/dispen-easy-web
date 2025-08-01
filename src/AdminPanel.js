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
    <div style={{ padding: 20 }}>
      <h1>Panel Administration Dispen‑Easy</h1>

      <div>
        <input
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
          onChange={(e) => setCantidad(e.target.value)}
        />
        <button onClick={agregar}>Agregar</button>
      </div>

      <h2>Productos</h2>
      <table border="1" style={{ width: "100%", marginTop: 10 }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>${p.precio}</td>
              <td>{p.cantidad}</td>
              <td>
                <button onClick={() => generarQR(p.id)}>QR Pago</button>{" "}
                <button onClick={() => eliminar(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;
