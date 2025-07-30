import React, { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ nombre: "", precio: "", cantidad_ml: "" });
  const [qrGenerado, setQrGenerado] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/productos`)
      .then((res) => res.json())
      .then(setProductos);
  }, []);

  const agregar = async () => {
    await fetch(`${API}/api/productos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ nombre: "", precio: "", cantidad_ml: "" });
    const res = await fetch(`${API}/api/productos`);
    const data = await res.json();
    setProductos(data);
  };

  const eliminar = async (id) => {
    await fetch(`${API}/api/productos/${id}`, { method: "DELETE" });
    const res = await fetch(`${API}/api/productos`);
    const data = await res.json();
    setProductos(data);
  };

  const generarQR = async (id) => {
    const res = await fetch(`${API}/api/generar_qr/${id}`, {
      method: "POST",
    });
    const data = await res.json();
    setQrGenerado(data.qr_data);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Panel Dispen-Easy</h1>

      <input
        placeholder="Nombre"
        value={form.nombre}
        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
      />
      <input
        type="number"
        placeholder="Precio"
        value={form.precio}
        onChange={(e) => setForm({ ...form, precio: e.target.value })}
      />
      <input
        type="number"
        placeholder="Cantidad ML"
        value={form.cantidad_ml}
        onChange={(e) => setForm({ ...form, cantidad_ml: e.target.value })}
      />
      <button onClick={agregar}>Agregar</button>

      <table border="1" style={{ marginTop: "1rem" }}>
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
              <td>{p.precio}</td>
              <td>{p.cantidad_ml}</td>
              <td>
                <button onClick={() => eliminar(p.id)}>Eliminar</button>
                <button onClick={() => generarQR(p.id)}>QR Pago</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {qrGenerado && (
        <div style={{ marginTop: "1rem" }}>
          <strong>Enlace QR:</strong>
          <br />
          <a href={qrGenerado} target="_blank" rel="noreferrer">
            {qrGenerado}
          </a>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
