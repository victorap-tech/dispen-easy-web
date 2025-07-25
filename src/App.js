<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Dispen-Easy - Productos</title>
</head>
<body>
  <h2>Lista de Productos</h2>
  <table border="1">
    <tr>
      <th>Producto</th>
      <th>Precio</th>
      <th>Acción</th>
    </tr>
    <tr>
      <td>Lavandina</td>
      <td>100</td>
      <td><button onclick="generarLink('Lavandina', 100)">Generar Link</button></td>
    </tr>
    <tr>
      <td>Jabón</td>
      <td>150</td>
      <td><button onclick="generarLink('Jabón', 150)">Generar Link</button></td>
    </tr>
  </table>

  <div id="resultado" style="margin-top: 20px;"></div>

  <script>
    async function generarLink(titulo, precio) {
      const body = {
        title: titulo,
        quantity: 1,
        unit_price: precio
      };

      const response = await fetch("https://web-production-d4c6.up.railway.app/crear_link", {
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
    }
  </script>
</body>
</html>
