class Venta {
  constructor(id) {
    this._id = id;
    this._productos = [];
    this._subtotal = 0;
    this._descuentoAplicado = 0;
    this._iva = 0;
    this._total = 0;
    this._fecha = new Date();
  }

  get id() {
    return this._id;
  }

  get productos() {
    return this._productos;
  }

  get subtotal() {
    return this._subtotal;
  }

  get descuentoAplicado() {
    return this._descuentoAplicado;
  }

  get iva() {
    return this._iva;
  }

  get total() {
    return this._total;
  }

  get fecha() {
    return this._fecha;
  }

  agregarProducto(producto, cantidad) {
    if (cantidad <= 0) {
      return false;
    }
    if (cantidad > producto.cantidad) {
      return false;
    }
    
    const productoEnVenta = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: cantidad
    };
    
    this._productos.push(productoEnVenta);
    return true;
  }

  calcularSubtotal() {
    this._subtotal = 0;
    this._productos.forEach((item) => {
      this._subtotal += item.precio * item.cantidad;
    });
    return this._subtotal;
  }

  calcularDescuento(descuentoMinimo, cantidadMinima) {
    this._descuentoAplicado = 0;
    const cantidadTotal = this._productos.reduce((suma, item) => suma + item.cantidad, 0);
    
    if (cantidadTotal >= cantidadMinima) {
      this._descuentoAplicado = this._subtotal * (descuentoMinimo / 100);
    }
    
    return this._descuentoAplicado;
  }

  calcularIVA(tipoIVA) {
    const baseIVA = this._subtotal - this._descuentoAplicado;
    this._iva = baseIVA * tipoIVA;
    return this._iva;
  }

  calcularTotal() {
    this._total = this._subtotal - this._descuentoAplicado + this._iva;
    return this._total;
  }

  obtenerResumen() {
    return {
      id: this._id,
      productos: this._productos,
      subtotal: this._subtotal,
      descuentoAplicado: this._descuentoAplicado,
      iva: this._iva,
      total: this._total,
      fecha: this._fecha.toLocaleString()
    };
  }

  aLineaTexto() {
    const fechaFormato = this._fecha.toISOString();
    const productosFormato = this._productos.map((p) => p.id + ":" + p.cantidad).join(";");
    return [this._id, productosFormato, this._subtotal, this._descuentoAplicado, this._iva, this._total, fechaFormato].join("|");
  }

  static desdeLineaTexto(linea) {
    const partes = linea.split("|");
    const id = partes[0];
    const venta = new Venta(id);
    
    const productosFormato = partes[1].split(";");
    productosFormato.forEach((prod) => {
      const [productoId, cantidad] = prod.split(":");
      venta._productos.push({
        id: productoId,
        cantidad: parseInt(cantidad, 10)
      });
    });
    
    venta._subtotal = parseFloat(partes[2]);
    venta._descuentoAplicado = parseFloat(partes[3]);
    venta._iva = parseFloat(partes[4]);
    venta._total = parseFloat(partes[5]);
    venta._fecha = new Date(partes[6]);
    
    return venta;
  }
}
