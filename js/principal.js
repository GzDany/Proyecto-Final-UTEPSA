const inventario = new Inventario();
let idEnEdicion = null;
let ventaActual = null;
const historialVentas = [];

const formulario = document.getElementById("formulario-producto");
const campoNombre = document.getElementById("nombre");
const campoPrecio = document.getElementById("precio");
const campoCantidad = document.getElementById("cantidad");
const botonGuardar = document.getElementById("boton-guardar");
const botonCancelar = document.getElementById("boton-cancelar");
const cuerpoTabla = document.getElementById("cuerpo-tabla");
const mensajeVacio = document.getElementById("mensaje-vacio");
const botonExportar = document.getElementById("boton-exportar");
const entradaArchivo = document.getElementById("entrada-archivo");
const mensajeArchivo = document.getElementById("mensaje-archivo");

// Variables para ventas
const selectorProducto = document.getElementById("selector-producto");
const cantidadVenta = document.getElementById("cantidad-venta");
const botonAgregarVenta = document.getElementById("boton-agregar-venta");
const cuerpoTablaVenta = document.getElementById("cuerpo-tabla-venta");
const mensajeVentaVacia = document.getElementById("mensaje-venta-vacia");
const botonFinalizarVenta = document.getElementById("boton-finalizar-venta");
const botonCancelarVenta = document.getElementById("boton-cancelar-venta");
const botonExportarVentas = document.getElementById("boton-exportar-ventas");
const cuerpoTablaHistorial = document.getElementById("cuerpo-tabla-historial");
const mensajeHistorialVacio = document.getElementById("mensaje-historial-vacio");

function formatearMoneda(valor) {
  return CONFIGURACION.TIPO_MONEDA + " " + valor.toFixed(2);
}

function renderizarTabla() {
  cuerpoTabla.innerHTML = "";

  const productos = inventario.productos;
  mensajeVacio.style.display = productos.length === 0 ? "block" : "none";

  productos.forEach((producto) => {
    const fila = document.createElement("tr");
    if (producto.tieneStockBajo()) {
      fila.classList.add("fila-stock-bajo");
    }

    const etiquetaClase = producto.tieneStockBajo() ? "etiqueta-bajo" : "etiqueta-normal";
    const etiquetaTexto = producto.tieneStockBajo() ? "Stock bajo" : "Normal";

    fila.innerHTML = `
      <td>${producto.nombre}</td>
      <td>${formatearMoneda(producto.precio)}</td>
      <td>${producto.cantidad}</td>
      <td>${formatearMoneda(producto.calcularPrecioConIva())}</td>
      <td>${formatearMoneda(producto.calcularTotal())}${producto.tieneDescuento() ? " (con descuento)" : ""}</td>
      <td><span class="etiqueta-estado ${etiquetaClase}">${etiquetaTexto}</span></td>
      <td>
        <button class="boton-fila boton-editar" data-id="${producto.id}">Editar</button>
        <button class="boton-fila boton-eliminar" data-id="${producto.id}">Eliminar</button>
      </td>
    `;

    cuerpoTabla.appendChild(fila);
  });

  renderizarResumen();
}

function renderizarResumen() {
  document.getElementById("resumen-cantidad-productos").textContent = inventario.obtenerCantidadProductos();
  document.getElementById("resumen-unidades").textContent = inventario.obtenerUnidadesTotales();
  document.getElementById("resumen-valor-total").textContent = formatearMoneda(inventario.obtenerValorTotalInventario());
  document.getElementById("resumen-stock-bajo").textContent = inventario.obtenerProductosConStockBajo().length;
}

function limpiarFormulario() {
  formulario.reset();
  document.getElementById("producto-id").value = "";
  idEnEdicion = null;
  botonGuardar.textContent = "Agregar Producto";
  mostrarError("nombre", "");
  mostrarError("precio", "");
  mostrarError("cantidad", "");
}

campoNombre.addEventListener("input", () => {
  mostrarError("nombre", validarNombre(campoNombre.value));
});

campoPrecio.addEventListener("input", () => {
  mostrarError("precio", validarPrecio(campoPrecio.value));
});

campoCantidad.addEventListener("input", () => {
  mostrarError("cantidad", validarCantidad(campoCantidad.value));
});

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nombre = campoNombre.value.trim();
  const precioTexto = campoPrecio.value;
  const cantidadTexto = campoCantidad.value;

  const esValido = validarFormularioCompleto(nombre, precioTexto, cantidadTexto);
  if (!esValido) return;

  const precio = parseFloat(precioTexto);
  const cantidad = parseInt(cantidadTexto, 10);

  if (idEnEdicion) {
    inventario.actualizarProducto(idEnEdicion, nombre, precio, cantidad);
  } else {
    inventario.agregarProducto(nombre, precio, cantidad);
  }

  limpiarFormulario();
  renderizarTabla();
});

botonCancelar.addEventListener("click", () => {
  limpiarFormulario();
});

cuerpoTabla.addEventListener("click", (evento) => {
  const id = evento.target.dataset.id;
  if (!id) return;

  if (evento.target.classList.contains("boton-editar")) {
    const producto = inventario.buscarPorId(id);
    if (!producto) return;

    document.getElementById("producto-id").value = producto.id;
    campoNombre.value = producto.nombre;
    campoPrecio.value = producto.precio;
    campoCantidad.value = producto.cantidad;

    idEnEdicion = producto.id;
    botonGuardar.textContent = "Guardar Cambios";
    campoNombre.focus();
  }

  if (evento.target.classList.contains("boton-eliminar")) {
    const confirmacion = confirm("¿Seguro que deseas eliminar este producto?");
    if (confirmacion) {
      inventario.eliminarProducto(id);
      renderizarTabla();
    }
  }
});

botonExportar.addEventListener("click", () => {
  if (inventario.productos.length === 0) {
    mensajeArchivo.textContent = "No hay productos para exportar.";
    return;
  }
  exportarInventarioATexto(inventario);
  mensajeArchivo.textContent = "Archivo inventario.txt descargado correctamente.";
});

entradaArchivo.addEventListener("change", (evento) => {
  const archivo = evento.target.files[0];
  if (!archivo) return;

  importarInventarioDesdeTexto(archivo, (productosImportados) => {
    inventario.cargarProductos(productosImportados);
    renderizarTabla();
    mensajeArchivo.textContent = `Se importaron ${productosImportados.length} producto(s) correctamente.`;
  });

  entradaArchivo.value = "";
});

// ===== FUNCIONES DE VENTAS =====

function actualizarSelectorProductos() {
  selectorProducto.innerHTML = '<option value="">-- Selecciona un producto --</option>';
  
  inventario.productos.forEach((producto) => {
    const option = document.createElement("option");
    option.value = producto.id;
    option.textContent = producto.nombre + " (Disponible: " + producto.cantidad + ")";
    selectorProducto.appendChild(option);
  });
}

function iniciarVentaNueva() {
  ventaActual = new Venta(inventario.generarIdVenta());
  cantidadVenta.value = "";
  mostrarError("cantidad-venta", "");
  renderizarTablaVenta();
  actualizarResumenVenta();
}

function agregarProductoAVenta() {
  const idProducto = selectorProducto.value;
  const cantidadTexto = cantidadVenta.value;

  const errorProducto = validarProductoSeleccionado(idProducto);
  const errorCantidad = validarCantidadVenta(cantidadTexto);

  if (errorProducto) {
    alert(errorProducto);
    return;
  }

  mostrarError("cantidad-venta", errorCantidad);
  if (errorCantidad) return;

  const cantidad = parseInt(cantidadTexto, 10);
  const producto = inventario.buscarPorId(idProducto);

  if (!producto) {
    alert("Producto no encontrado.");
    return;
  }

  if (cantidad > producto.cantidad) {
    mostrarError("cantidad-venta", "No hay suficiente stock. Disponible: " + producto.cantidad);
    return;
  }

  const resultado = ventaActual.agregarProducto(producto, cantidad);
  
  if (!resultado) {
    alert("Error al agregar el producto a la venta.");
    return;
  }

  cantidadVenta.value = "";
  selectorProducto.value = "";
  mostrarError("cantidad-venta", "");
  renderizarTablaVenta();
}

function eliminarProductoDeVenta(indice) {
  ventaActual.productos.splice(indice, 1);
  renderizarTablaVenta();
}

function renderizarTablaVenta() {
  cuerpoTablaVenta.innerHTML = "";

  if (ventaActual.productos.length === 0) {
    mensajeVentaVacia.style.display = "block";
    return;
  }

  mensajeVentaVacia.style.display = "none";

  ventaActual.productos.forEach((item, indice) => {
    const fila = document.createElement("tr");
    const subtotal = item.precio * item.cantidad;
    
    fila.innerHTML = `
      <td>${item.nombre}</td>
      <td>${formatearMoneda(item.precio)}</td>
      <td>${item.cantidad}</td>
      <td>${formatearMoneda(subtotal)}</td>
      <td>
        <button class="boton-fila boton-eliminar" data-indice="${indice}">Eliminar</button>
      </td>
    `;

    cuerpoTablaVenta.appendChild(fila);
  });

  cuerpoTablaVenta.addEventListener("click", (evento) => {
    if (evento.target.classList.contains("boton-eliminar")) {
      const indice = parseInt(evento.target.dataset.indice, 10);
      eliminarProductoDeVenta(indice);
    }
  });

  actualizarResumenVenta();
}

function actualizarResumenVenta() {
  ventaActual.calcularSubtotal();
  ventaActual.calcularDescuento(CONFIGURACION.DESCUENTO_MINIMO, CONFIGURACION.CANTIDAD_MINIMA_DESCUENTO);
  ventaActual.calcularIVA(CONFIGURACION.TIPO_IVA);
  ventaActual.calcularTotal();

  document.getElementById("resumen-venta-subtotal").textContent = formatearMoneda(ventaActual.subtotal);
  document.getElementById("resumen-venta-descuento").textContent = formatearMoneda(ventaActual.descuentoAplicado);
  document.getElementById("resumen-venta-iva").textContent = formatearMoneda(ventaActual.iva);
  document.getElementById("resumen-venta-total").textContent = formatearMoneda(ventaActual.total);
}

function finalizarVenta() {
  if (ventaActual.productos.length === 0) {
    alert("No hay productos en la venta.");
    return;
  }

  // Reducir stock de cada producto
  let ventaExitosa = true;
  ventaActual.productos.forEach((item) => {
    const resultado = inventario.reducirStock(item.id, item.cantidad);
    if (!resultado) {
      ventaExitosa = false;
    }
  });

  if (!ventaExitosa) {
    alert("Error al procesar la venta. Verifica el stock.");
    return;
  }

  // Agregar venta al historial
  historialVentas.push(ventaActual);

  // Mostrar resumen
  const resumen = ventaActual.obtenerResumen();
  let productosList = resumen.productos.map((p) => p.nombre + " (x" + p.cantidad + ")").join(", ");
  
  alert("¡Venta realizada exitosamente!\n\n" +
        "Productos: " + productosList + "\n" +
        "Subtotal: " + formatearMoneda(resumen.subtotal) + "\n" +
        "Descuento: " + formatearMoneda(resumen.descuentoAplicado) + "\n" +
        "IVA: " + formatearMoneda(resumen.iva) + "\n" +
        "Total: " + formatearMoneda(resumen.total));

  // Actualizar tablas
  renderizarTabla();
  renderizarHistorialVentas();
  iniciarVentaNueva();
}

function renderizarHistorialVentas() {
  cuerpoTablaHistorial.innerHTML = "";

  if (historialVentas.length === 0) {
    mensajeHistorialVacio.style.display = "block";
    return;
  }

  mensajeHistorialVacio.style.display = "none";

  historialVentas.forEach((venta) => {
    const fila = document.createElement("tr");
    const productosList = venta.productos.map((p) => p.nombre).join(", ");
    
    fila.innerHTML = `
      <td>${venta.id}</td>
      <td>${venta.fecha.toLocaleString()}</td>
      <td>${productosList}</td>
      <td>${formatearMoneda(venta.subtotal)}</td>
      <td>${formatearMoneda(venta.descuentoAplicado)}</td>
      <td>${formatearMoneda(venta.iva)}</td>
      <td>${formatearMoneda(venta.total)}</td>
    `;

    cuerpoTablaHistorial.appendChild(fila);
  });
}

// Event listeners para ventas
botonAgregarVenta.addEventListener("click", () => {
  agregarProductoAVenta();
});

botonFinalizarVenta.addEventListener("click", () => {
  finalizarVenta();
});

botonCancelarVenta.addEventListener("click", () => {
  if (confirm("¿Deseas cancelar la venta actual?")) {
    iniciarVentaNueva();
  }
});

botonExportarVentas.addEventListener("click", () => {
  if (historialVentas.length === 0) {
    alert("No hay ventas para exportar.");
    return;
  }
  exportarVentasATexto(historialVentas);
  alert("Archivo ventas.txt descargado correctamente.");
});

// ----- Inicio -----
renderizarTabla();
iniciarVentaNueva();
actualizarSelectorProductos();
