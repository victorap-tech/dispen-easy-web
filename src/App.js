import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Logo from './assets/logo-dispen-easy.svg';
import './App.css';

// URL del backend (cambiá si tu backend es otro)
const API_URL = 'https://web-production-d4c6c.up.railway.app/productos';

function App() {
  const [productos, setProductos] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [nuevoLinkPago, setNuevoLinkPago] = useState('');
  const [qrOpen, setQROpen] = useState(false);
  const [qrValue, setQRValue] = useState('');
  const [qrProduct, setQRProduct] = useState('');

  // Trae los productos del backend
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch(() => alert("No se pudo conectar al backend."));
  }, []);

  // Agregar producto
  const handleAgregar = () => {
    if (!nuevoNombre || !nuevoPrecio || !nuevoLinkPago) return;
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nuevoNombre,
        precio: Number(nuevoPrecio),
        link_pago: nuevoLinkPago,
      }),
    })
      .then((res) => res.json())
      .then((nuevo) => setProductos([...productos, nuevo]))
      .catch(() => alert("Error al agregar producto"));
    setNuevoNombre('');
    setNuevoPrecio('');
    setNuevoLinkPago('');
  };

  // Borrar producto
  const handleBorrar = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => setProductos(productos.filter(p => p.id !== id)))
      .catch(() => alert("Error al borrar producto"));
  };

  // Imprimir solo el QR
  const handlePrint = () => {
    const printContents = document.getElementById('qr-to-print').innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // Refresca por si acaso
  };

  return (
    <div className="app-bg">
      <div className="centered-container">
        <img src={Logo} alt="Logo Dispen-Easy" className="logo-img" />
        <h1 className="main-title">Dispen-Easy Web</h1>
        <h2 className="subtitle">Productos conectados al backend</h2>
        <div className="inputs-row">
          <input
            type="text"
            placeholder="Nuevo producto"
            value={nuevoNombre}
            onChange={e => setNuevoNombre(e.target.value)}
          />
          <input
            type="number"
            placeholder="Precio"
            value={nuevoPrecio}
            onChange={e => setNuevoPrecio(e.target.value)}
          />
          <input
            type="text"
            placeholder="Link de pago"
            value={nuevoLinkPago}
            onChange={e => setNuevoLinkPago(e.target.value)}
          />
          <button className="add-btn" onClick={handleAgregar}>Agregar</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio ($)</th>
              <th>Ver QR</th>
              <th>Borrar</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(producto => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>{producto.precio}</td>
                <td>
                  <button
                    className="qr-btn"
                    onClick={() => {
                      setQRValue(producto.link_pago);
                      setQRProduct(producto.nombre);
                      setQROpen(true);
                    }}
                  >
                    Ver QR
                  </button>
                </td>
                <td>
                  <button className="delete-btn" onClick={() => handleBorrar(producto.id)}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal QR */}
      {qrOpen && (
        <div className="modal-bg">
          <div className="modal">
            <div id="qr-to-print" className="qr-print-container">
              <QRCodeCanvas value={qrValue} size={256} />
              <div className="qr-link">{qrValue}</div>
              <div className="qr-product">{qrProduct}</div>
              <div className="qr-text">Escaneá y pagá aquí</div>
            </div>
            <button className="imprimir" onClick={handlePrint}>Imprimir</button>
            <button className="cerrar" onClick={() => setQROpen(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
