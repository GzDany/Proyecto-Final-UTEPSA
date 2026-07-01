function validarNombre(nombre) {
  if (!nombre || nombre.trim().length === 0) {
    return "El nombre es obligatorio.";
  }
  if (nombre.trim().length < 3) {
    return "El nombre debe tener al menos 3 caracteres.";
  }
  return "";
}

function validarPrecio(precioTexto) {
  const precio = parseFloat(precioTexto);
  if (precioTexto === "" || isNaN(precio)) {
    return "El precio debe ser un número.";
  }
  if (precio <= 0) {
    return "El precio debe ser mayor a 0.";
  }
  return "";
}

function validarCantidad(cantidadTexto) {
  const cantidad = parseInt(cantidadTexto, 10);
  if (cantidadTexto === "" || isNaN(cantidad)) {
    return "La cantidad debe ser un número entero.";
  }
  if (cantidad < 0) {
    return "La cantidad no puede ser negativa.";
  }
  return "";
}

function validarFormularioCompleto(nombre, precioTexto, cantidadTexto) {
  const errorNombre = validarNombre(nombre);
  const errorPrecio = validarPrecio(precioTexto);
  const errorCantidad = validarCantidad(cantidadTexto);

  mostrarError("nombre", errorNombre);
  mostrarError("precio", errorPrecio);
  mostrarError("cantidad", errorCantidad);

  return !errorNombre && !errorPrecio && !errorCantidad;
}

function mostrarError(idCampo, mensaje) {
  const entrada = document.getElementById(idCampo);
  const spanError = document.getElementById("error-" + idCampo);

  spanError.textContent = mensaje;

  if (mensaje) {
    entrada.classList.add("campo-invalido");
  } else {
    entrada.classList.remove("campo-invalido");
  }
}

function validarCantidadVenta(cantidadTexto) {
  const cantidad = parseInt(cantidadTexto, 10);
  if (cantidadTexto === "" || isNaN(cantidad)) {
    return "La cantidad debe ser un número entero.";
  }
  if (cantidad <= 0) {
    return "La cantidad debe ser mayor a 0.";
  }
  return "";
}

function validarProductoSeleccionado(idProducto) {
  if (!idProducto || idProducto === "") {
    return "Debes seleccionar un producto.";
  }
  return "";
}

// ===== VALIDACIONES EN TIEMPO REAL (oninput) =====

function validarNombreEnTiempoReal() {
  const nombre = document.getElementById("nombre").value;
  const error = validarNombre(nombre);
  mostrarError("nombre", error);
}

function validarPrecioEnTiempoReal() {
  const precio = document.getElementById("precio").value;
  const error = validarPrecio(precio);
  mostrarError("precio", error);
}

function validarCantidadEnTiempoReal() {
  const cantidad = document.getElementById("cantidad").value;
  const error = validarCantidad(cantidad);
  mostrarError("cantidad", error);
}

function validarCantidadVentaEnTiempoReal() {
  const cantidad = document.getElementById("cantidad-venta").value;
  const error = validarCantidadVenta(cantidad);
  mostrarError("cantidad-venta", error);
}

