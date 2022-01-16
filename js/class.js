// ----------------- PRODUCTOS ---------------
class Productos {
    constructor(id, nombre, descripcion, precio, imagen, cantidadEnCarrito, tipo) {
        this.id = parseInt(id);
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = parseInt(precio);
        this.imagen = imagen;
        this.cantidadEnCarrito = parseFloat(cantidadEnCarrito || 1);
        this.tipo = tipo;
    }
    // metodo para agregar cantidad si cargamos 2 o mas productos del mismo al carrito
    agregarCantidadEnCarrito(valor) {
        this.cantidadEnCarrito += valor;
    }
    // metodo para calcular precio segun cantidad y le agregamos tambien el Iva
    subTotal() {
        return parseInt(this.cantidadEnCarrito * this.precio);
    }
}

// AJAX
// cargamos los productos por medio de un archivo .json
$.get("data/productos.json", function (respuesta, estado) {
    if (estado == 'success') {
        for (const generico of respuesta) {
            productos.push(new Productos(generico.id, generico.nombre, generico.descripcion, generico.precio, generico.imagen, generico.cantidadEnCarrito, generico.tipo));
        }
        creadorDeProductos(productos, '#seccionProductos');
    } else {
        console.log('Error en la carga de los datos');
    }
});