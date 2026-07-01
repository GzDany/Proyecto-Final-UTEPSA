class Inventario {
  constructor() {
    this._productos = [];
  }

  get productos() {
    return this._productos;
  }

  generarId() {
    return "p_" + Date.now();
  }

  agregarProducto(nombre, precio, cantidad) {
    const nuevoProducto = new Producto(this.generarId(), nombre, precio, cantidad);
    this._productos.push(nuevoProducto);
    return nuevoProducto;
  }

  buscarPorId(id) {
    return this._productos.find((producto) => producto.id === id);
  }

  actualizarProducto(id, nombre, precio, cantidad) {
    const producto = this.buscarPorId(id);
    if (!producto) return false;
    producto.nombre = nombre;
    producto.precio = precio;
    producto.cantidad = cantidad;
    return true;
  }

  eliminarProducto(id) {
    this._productos = this._productos.filter((producto) => producto.id !== id);
  }

  vaciar() {
    this._productos = [];
  }

  cargarProductos(listaProductos) {
    this._productos = listaProductos;
  }

  obtenerCantidadProductos() {
    return this._productos.length;
  }

  obtenerUnidadesTotales() {
    return this._productos.reduce((suma, producto) => suma + producto.cantidad, 0);
  }

  obtenerValorTotalInventario() {
    return this._productos.reduce((suma, producto) => suma + producto.calcularTotal(), 0);
  }

  obtenerProductosConStockBajo() {
    return this._productos.filter((producto) => producto.tieneStockBajo());
  }

  reducirStock(idProducto, cantidad) {
    const producto = this.buscarPorId(idProducto);
    if (!producto) return false;
    if (producto.cantidad < cantidad) return false;
    
    producto.cantidad = producto.cantidad - cantidad;
    return true;
  }

  generarIdVenta() {
    return "v_" + Date.now();
  }
}
