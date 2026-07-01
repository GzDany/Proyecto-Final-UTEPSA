function exportarInventarioATexto(inventario) {
  const lineas = inventario.productos.map((producto) => producto.aLineaTexto());
  const contenido = lineas.join("\n");

  const archivoBlob = new Blob([contenido], { type: "text/plain" });
  const url = URL.createObjectURL(archivoBlob);

  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = "inventario.txt";
  enlace.click();

  URL.revokeObjectURL(url);
}

function importarInventarioDesdeTexto(archivo, alTerminar) {
  const lector = new FileReader();

  lector.onload = function (evento) {
    const contenido = evento.target.result;
    const lineas = contenido.split("\n").filter((linea) => linea.trim() !== "");
    const productos = lineas.map((linea) => Producto.desdeLineaTexto(linea));
    alTerminar(productos);
  };

  lector.readAsText(archivo);
}

function exportarVentasATexto(ventas) {
  const lineas = ventas.map((venta) => venta.aLineaTexto());
  const contenido = lineas.join("\n");

  const archivoBlob = new Blob([contenido], { type: "text/plain" });
  const url = URL.createObjectURL(archivoBlob);

  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = "ventas.txt";
  enlace.click();

  URL.revokeObjectURL(url);
}

function importarVentasDesdeTexto(archivo, alTerminar) {
  const lector = new FileReader();

  lector.onload = function (evento) {
    const contenido = evento.target.result;
    const lineas = contenido.split("\n").filter((linea) => linea.trim() !== "");
    const ventas = lineas.map((linea) => Venta.desdeLineaTexto(linea));
    alTerminar(ventas);
  };

  lector.readAsText(archivo);
}
