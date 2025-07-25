async function generarLink(titulo, precio) {
  const body = {
    title: titulo,
    quantity: 1,
    unit_price: precio
  };

  const BACKEND_URL = "https://web-production-d4c6.up.railway.app"; // URL del backend en Railway

  try {
    const response = await fetch(`${BACKEND_URL}/crear_link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    const resultadoDiv = document.getElementById("resultado");

    if (data.init_point) {
      resultadoDiv.innerHTML = `<a href="${data.init_point}" target="_blank">Pagar ${titulo}</a>`;
    } else {
      resultadoDiv.innerText = "Error al generar el link.";
      console.error(data);
    }
  } catch (error) {
    console.error("Error de red:", error);
    alert("No se pudo conectar al backend");
  }
}
