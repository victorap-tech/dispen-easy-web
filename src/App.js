import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Logo from './assets/logo-dispen-easy.svg';
import './App.css';

// Cambia la URL según tu backend
const API_URL = 'https://web-production-d4c6c.up.railway.app/productos';

function App() {
  const [productos, setProductos] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [nuevoLinkPago, setNuevoLinkPago] = useState('');
  const [qrOpen, setQROpen] = useState(false);
  const [qrValue, setQRValue] = useState('');
  const [qrProduct, setQRProduct] = useState('');

  // Traer productos al cargar
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(() => alert('No se pudo conectar al backend.'));
  }, []);

  // Agregar producto nuevo
  const handleAgregar = () => {
    if (!nuevoNombre || !nuevoPrecio || !nuevoLinkPago) {
      alert('Por favor completá todos los campos');
      return;
    }
    fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        nombre: nuevoNombre,
        precio: nuevoPrecio,
        link_pago: nuevoLinkPago
      })
    })
      .then(() => {
        setNuevoNombre('');
        setNuevoPrecio('');
        setNuevoLinkPago('');
        // Recarga productos para ver el nuevo
        fetch(API_URL)
          .then(res => res.json())
          .then(data => setProductos(data));
      });
  };

  // Borrar producto
  const handleBorrar = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => setProductos(productos.filter(p => p.id !== id)));
  };

  // Abrir modal QR
  const handleVerQR = (link, nombre) => {
    setQRValue(link);
    setQRProduct(nombre);
    setQROpen(true);
  };

  // Imprimir solo QR con texto
  const handlePrintQR = () => {
    const qrElement = document.getElementById('qr-to-print');
    const win = window.open('', 'Print QR', 'height=400,width=350');
    win.document.write(`
      <html>
        <head>
          <title>Imprimir QR</title>
          <style>
            body { 
              display: flex; 
              flex-direction: column; 
              align-items: center; 
              justify-content: center; 
              height: 100vh; 
              margin: 0; 
              font-family: Arial, sans-serif;
            }
            .qr-label {
              margin-top: 16px;
              font-size: 18px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          ${qrElement.outerHTML}
          <div class="qr-label">Escaneá y pagá aquí</div>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      win.close();
    }, 300);
  };

  return (
    <div className="App">
      <div className="card">
        <img src={Logo} alt="logo" style={{width: 70, margin: "16px auto"}} />
        <h2>Dispen-Easy Web</h2>
        <p style={{marginBottom: 24}}>Productos conectados al backend</p>
        <div style={{display:"flex", gap:8, marginBottom:18}}>
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
          <button className="btn" onClick={handleAgregar}>Agregar</button>
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
            {productos.map(prod => (
              <tr key={prod.id}>
                <td>{prod.nombre}</td>
                <td>{prod.precio}</td>
                <td>
                  <button className="btn-qr" onClick={() => handleVerQR(prod.link_pago, prod.nombre)}>
                    Ver QR
                  </button>
                </td>
                <td>
                  <button className="btn-delete" onClick={() => handleBorrar(prod.id)}>
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal QR */}
      {qrOpen && (
        <div className="modal">
          <div className="modal-content">
            <QRCodeCanvas value={qrValue} size={220} id="qr-to-print" />
            <div style={{display:"flex", gap:"10px", justifyContent:"center", margin:"14px 0 0 0"}}>
              <button className="btn" onClick={handlePrintQR}>Imprimir</button>
              <button className="btn-delete" onClick={() => setQROpen(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
