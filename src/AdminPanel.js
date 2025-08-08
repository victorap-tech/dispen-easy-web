import React, { useState, useEffect } from "react";
import axios from "axios";
import { QRCode } from "qrcode.react";

const API = process.env.REACT_APP_API_URL;

function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await axios.get(`${API}/api/productos`);
      setProductos([...res.data]); // fuerza nuevo array
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const agregar = async () => {
    if (!nombre || !precio || !cantidad) return;
    try {
      await axios.post(`${API}/api/productos`, {
        nombre,
        precio: parseFloat(precio),
        cantidad: parseInt(cantidad),
      });
      setNombre("");
      setPrecio("");
      setCantidad("");
      fetchProductos();
    } catch (error) {
      console.error("Error al agregar:", error);
    }
  };

  const eliminar = async (id) => {
  try {
    await axios.delete(`${API}/api/productos/${id}`);
    // Quitamos el producto eliminado directamente del estado
    setProductos((prev) => prev.filter((p) => p.id !== id));
  } catch (error) {
    console.error("Error al eliminar:", error);
  }
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
      <h2>Panel Administration Dispen-Easy</h2>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
      <input value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="Precio" />
      <input value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder="Cantidad" />
      <button onClick={agregar}>Agregar</button>

      <h3>Productos</h3>
      <table>
        <thead>
          <tr>
            <th>Nombre</th><th>Precio</th><th>Cantidad</th><th></th><th></th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>${p.precio}</td>
              <td>{p.cantidad}</td>
              <td><button onClick={() => generarQR(p.id)}>QR Pago</button></td>
              <td><button onClick={() => eliminar(p.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
            {qrUrl && (
  <div style={{ marginTop: '20px' }}>
    <h3>Escaneá para pagar</h3>
    <img src={qrUrl} alt="QR de pago" style={{ width: "200px" }} />
  </div>
)}

export default AdminPanel;
