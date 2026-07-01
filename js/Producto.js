class Producto {
  constructor(id, nombre, precio, cantidad) {
    this._id = id;
    this._nombre = nombre;
    this._precio = precio;
    this._cantidad = cantidad;
  }

  get id() {
    return this._id;
  }

  get nombre() {
    return this._nombre;
  }

  get precio() {
    return this._precio;
  }

  get cantidad() {
    return this._cantidad;
  }

  set nombre(valorNuevo) {
    this._nombre = valorNuevo;
  }

  set precio(valorNuevo) {
    this._precio = valorNuevo;
  }

  set cantidad(valorNuevo) {
    this._cantidad = valorNuevo;
  }

  calcularPrecioConIva() {
    return this._precio * (1 + CONFIGURACION.TIPO_IVA);
  }

  tieneDescuento() {
    return this._cantidad >= CONFIGURACION.CANTIDAD_MINIMA_DESCUENTO;
  }

  calcularTotal() {
    const subtotal = this.calcularPrecioConIva() * this._cantidad;
    if (this.tieneDescuento()) {
      return subtotal * (1 - CONFIGURACION.DESCUENTO_MINIMO);
    }
    return subtotal;
  }

  tieneStockBajo() {
    return this._cantidad < CONFIGURACION.STOCK_MINIMO;
  }

  aLineaTexto() {
    return [this._id, this._nombre, this._precio, this._cantidad].join("|");
  }

  static desdeLineaTexto(linea) {
    const partes = linea.split("|");
    const id = partes[0];
    const nombre = partes[1];
    const precio = parseFloat(partes[2]);
    const cantidad = parseInt(partes[3], 10);
    return new Producto(id, nombre, precio, cantidad);
  }
}
