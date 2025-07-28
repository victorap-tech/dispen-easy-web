import React, { useEffect, useState } from 'react';
import './App.css'; // Asegúrate de tener tu archivo App.css si lo usas
import QRCode from 'qrcode.react'; // Necesitarás instalar esta librería si no la tienes

// Paso 1: Obtener la URL base del backend desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function App() {
  const [productos, setProductos] = useState([]);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para obtener productos desde tu backend
  const getProductos = async () => {
    if (!API_BASE_URL) {
      setError("Error: REACT_APP_API_BASE_URL no está definida en el entorno.");
      return [];
    }
    try {
      // Llamada a la API de tu backend para obtener productos
      const response = await fetch(`${API_BASE_URL}/api/productos`);
      if (!response.ok) {
        // Si la respuesta no es OK (ej. 404, 500), lanzar un error
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error al obtener productos:", err);
      setError(`No se pudieron cargar los productos: ${err.message}. Verifica el backend.`);
      return []; // Retorna un array vacío en caso de error
    }
  };

  // Función para generar un QR de pago para un producto específico
  const generarQR = async (productoId) => {
    if (!API_BASE_URL) {
      setError("Error: REACT_APP_API_BASE_URL no está definida en el entorno.");
      return null;
    }
    try {
      // Llamada a la API de tu backend para generar un QR
      const response = await fetch(`${API_BASE_URL}/api/generar_qr/${productoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        // Si la respuesta no es OK, lanzar un error
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data; // Esto debería contener 'qr_data' y 'id_pago_mp'
    } catch (err) {
      console.error("Error al generar QR:", err);
      setError(`Error al generar el QR: ${err.message}. Verifica el backend.`);
      throw err; // Propaga el error para manejarlo en el componente
    }
  };

  // useEffect para cargar los productos cuando el componente se monta
  useEffect(() => {
    async function fetchProductos() {
      setLoading(true);
      setError(null);
      const fetchedProductos = await getProductos();
      setProductos(fetchedProductos);
      setLoading(false);
    }
    fetchProductos();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  // Manejador del botón para generar QR
  const handleGenerarQR = async (productoId) => {
    setLoading(true);
    setError(null);
    setQrData(null); // Limpia cualquier QR anterior
    try {
      const data = await generarQR(productoId);
      if (data && data.qr_data) {
        setQrData(data.qr_data); // Guarda la URL del QR
        console.log("QR Data (URL de Mercado Pago):", data.qr_data);
        console.log("ID de pago MP (para referencia):", data.id_pago_mp);
      } else {
        setError("La respuesta del QR no contiene 'qr_data'.");
      }
    } catch (err) {
      // El error ya fue manejado en generarQR, solo se propaga aquí
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dispen-Easy Panel de Control</h1>
        <p>Backend URL: {API_BASE_URL || "No definida"}</p>
      </header>

      <main>
        <h2>Productos Disponibles</h2>
        {loading && <p>Cargando productos...</p>}
        {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

        {!loading && productos.length === 0 && !error && (
          <p>No hay productos disponibles. ¿Tu backend está funcionando correctamente?</p>
        )}

        {productos.length > 0 && (
          <div className="product-list">
            {productos.map(producto => (
              <div key={producto.id} className="product-item">
                <h3>{producto.nombre}</h3>
                <p>Cantidad: {producto.cantidad_ml} ml</p>
                <p>Precio: ${producto.precio}</p>
                <button onClick={() => handleGenerarQR(producto.id)} disabled={loading}>
                  {loading && qrData === null ? 'Generando QR...' : 'Generar QR para este Producto'}
                </button>
              </div>
            ))}
          </div>
        )}

        {qrData && (
          <div className="qr-section">
            <h2>Escanea para Pagar</h2>
            <div className="qr-code-container">
              {/* Usa la librería qrcode.react para mostrar el QR */}
              <QRCode value={qrData} size={256} level="H" includeMargin={true} />
            </div>
            <p>
              O haz clic para abrir en el navegador:{" "}
              <a href={qrData} target="_blank" rel="noopener noreferrer">
                {qrData.substring(0, 50)}...
              </a>
            </p>
            <p>Asegúrate de pagar con una **cuenta de prueba de Mercado Pago**.</p>
          </div>
        )}
      </main>

      <footer>
        <p>&copy; 2025 Dispen-Easy</p>
      </footer>
    </div>
  );
}

export default App;
