import React, { useEffect, useState } from "react";

const BACKEND_URL = "https://web-production-d4c6.up.railway.app/api"; // Reemplazá esto con tu backend real

export default function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [qrLink, setQrLink] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/productos`)
      .then((res) => res.json())
      .then(setProductos)
      .catch((err) => console.error("Error al cargar productos:", err));
  }, []);

  const generarQR = async (id) => {
    setLoading(true);
    setQrLink(null);
    try {
      const res = await fetch(`${BACKEND_URL}/generar_qr/${id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.qr_data) {
        setQrLink(data.qr_data);
      } else {
        alert("Error: no se recibió un enlace QR.");
      }
    } catch (error) {
      console.error("Error generando QR:", error);
      alert("Error al generar QR.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        Panel de Administración - Dispen-Easy
      </h1>

      {productos.map((p) => (
        <div key={p.id} style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
          marginBottom: "10px",
        }}>
          <p><strong>{p.nombre}</strong> - {p.cantidad_ml} ml - ${p.precio}</p>
          <button onClick={() => generarQR(p.id)} disabled={loading}>
            Generar QR
          </button>
        </div>
      ))}

      {qrLink && (
        <div style={{ marginTop: "30px" }}>
          <h2>Link de pago generado:</h2>
          <a href={qrLink} target="_blank" rel="noopener noreferrer">
            {qrLink}
          </a>
        </div>
      )}
    </div>
  );
}