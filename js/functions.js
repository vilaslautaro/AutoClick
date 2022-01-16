// ---------FUNCIONES---------------
// funcion que crea los productos en el DOM
function creadorDeProductos(productos, id) {
    $(id).empty();
    for (const producto of productos) {
        // cargamos de contenido el nuevo elemento
        $('#seccionProductos').append(` <div class="cajaProducto">
                                                <img class="imagenProducto" src="${producto.imagen}" alt="">
                                                <div class="datosProducto">
                                                    <p class="titulo">${producto.nombre}</p>
                                                    <p class="descripcion">${producto.descripcion}</p>
                                                    <p class="precio">USD ${producto.precio}</p>
                                                </div>
                                                <button id="${producto.id}" class="btn">Agregar al carrito</button>
                                            </div>`);
        console.log(producto.tipo);
    }
}
// funcion que agrega los productos al carrito
function añadirProductosCarrito(e) {
    e.preventDefault();
    // obtengo el id del producto en el boton pulsado
    let idProducto = e.target.id;
    // busco el id del producto seleccionado en EL CARRITO
    const buscarProductoEnCarrito = carritoProductos.find(producto => producto.id == idProducto);
    if (buscarProductoEnCarrito == undefined) {
        // busco el id del producto seleccionado en productos
        const buscadorId = productos.find(producto => producto.id == idProducto);
        // añado el producto seleccionado al carrito
        carritoProductos.push(buscadorId);
    } else {
        // Si ya se encuentra el producto en el carrito, le agregamos cantidad llamando al metodo agregarCantidadEnCarrito
        buscarProductoEnCarrito.agregarCantidadEnCarrito(1);
    }
    // guardamos los productos que tenemos/teniamos en el carrito una vez que el DOM ya se cargo completamente
    localStorage.setItem('carritoCargado', JSON.stringify(carritoProductos));
    // Agregamos el producto al carrito
    vistaProductosCarrito(carritoProductos);
}
// funcion que carga la parte VISUAL de los productos en el carrito
function vistaProductosCarrito(lista) {
    // actualizo el contador
    $('#contadorProductos').html(`${lista.length}`);
    // vacio el carrito
    $('#btnCarrito').empty();
    for (const productoslista of lista) {
        // llamo al carrito y le agrego como nodo hijo los nuevos productos seleccionados
        $('#btnCarrito').append(contenidoCarrito(productoslista));
    }
    for (const listaproductos of lista) {
        $('#cajaCarrito').append(procesamientoCarrito(listaproductos));
    }

    // evento que envia la compra con el metodo .post (boton finalizar compra de procesamientoCompras.html)
    $("#finalizarCompra").click(enviarCompra);
}
// generador carrito del index.html
function contenidoCarrito(productoslista) {
    return `<li id="carritoFooter" class="listasCarrito carrito-footer"><img class="imagenCarrito" src=${productoslista.imagen}>
        <div class="contenidoProducto">
        <p class="nombreEnCarrito">${productoslista.nombre}</p>
        <p class="descripcionEnCarrito">Modelo: ${productoslista.descripcion}</p>
        <p id="datoCantidadProductos" class="cantidadEnCarrito">Cantidad: ${productoslista.cantidadEnCarrito}</p>
        <p id="datoCantidadDinero" class="subtotalEnCarrito">Subtotal: $${productoslista.subTotal()}</p>
        <img id="${productoslista.id}" class="imgDltProd" title="Eliminar Producto" alt="Eliminar Producto" src="img/eliminardelcarrito.png" width="20px">
        </div>
        </li>`
}
// carrito de la pagina procesamientoCompras (tiene leves modificaciones con el carrito del index).
function procesamientoCarrito(productoslista) {
    return `<li id="carritoFooter" class="listasCarrito carrito-footer"><img class="imagenCarrito" src=${productoslista.imagen}>
        <div class="contenidoProducto">
            <p class="nombreEnCarrito">${productoslista.nombre}</p>
            <p class="descripcionEnCarrito">Modelo: ${productoslista.descripcion}</p>
            <img id="${productoslista.id}" class="imgDltProd" title="Eliminar producto" alt="Eliminar producto" src="img/eliminardelcarrito.png">
        </div>
        <div class="datosContenidosProductos"> 
            <div class="cantidad">
                <p id="datoCantidadProductos" class="cantidadEnCarrito">Cantidad: </p>
                    <input class="inputCantidad" max="10" min="1"name="numeroCantidad" type="number" id="datoCantidadProductos" class="cantProd" title="Modificar cantidad del producto" alt="Modificar cantidad del producto" value="${productoslista.cantidadEnCarrito}">
            </div>
            <p id="datoCantidadDinero" class="subtotalEnCarrito">Subtotal: $${productoslista.subTotal()}</p>
        </div>
        </li>`
}
//Eliminar producto del carrito buscando el id y utilizando el filtro splice
function eliminarProdCarrito(e) {
    let productoEliminar = carritoProductos.findIndex(eliminados => eliminados.id == e.target.id);
    carritoProductos.splice(productoEliminar, 1);
    $('#btnCarrito').empty();
    // para carrito de la pagina procesamientoCompras
    $('#cajaCarrito').empty();
    //Ejecuto para actualizar el carrito
    vistaProductosCarrito(carritoProductos);
    //Guardo la modificacion en el local
    localStorage.setItem('carritoCargado', JSON.stringify(carritoProductos));
}

// funcion que oculta o muestra el carrito cuando el usuario da click en el mismo
function mostrarOcultarCarrito(e) {
    e.preventDefault();
    // if que segun la clase que tenga el elemento #padreCarrito muestra u oculta los elementos del carrito
    if ($('#padreCarrito').hasClass('ocultar') == true) {
        $('.padreCarrito').removeClass("ocultar");
        $('.padreCarrito').addClass("mostrar");
        $('.listasCarrito').removeClass("carrito-footer");
        $('.listasCarrito').addClass("carrito-mostrar");
        $('#btnCarrito').css({
            overflowY: "scroll",
            opacity: "1"
        });
        $('#cajaBtnComprar').css({
            opacity: "1"
        });
    } else if ($('#padreCarrito').hasClass('mostrar') == true) {
        $('.padreCarrito').removeClass("mostrar");
        $('.padreCarrito').addClass("ocultar");
        $('.listasCarrito').removeClass("carrito-mostrar");
        $('.listasCarrito').addClass("carrito-footer");
        $('#btnCarrito').css({
            opacity: "0"
        });
        $('#cajaBtnComprar').css({
            opacity: "0"
        });
    }
}
// Funcion para enviar los productos del carrito a una base de datos
function enviarCompra(e) {
    e.preventDefault();
    $.post("https://jsonplaceholder.typicode.com/todos", JSON.stringify(carritoProductos), function (respuesta, estado) {
        console.log(respuesta);
        console.log(estado);
        //Si el envio de los datos del carrito fue exitoso
        if (estado == "success") {
            //Vaciamos el carrito y el contador de productos del carrito
            $("#btnCarrito").empty();
            $("#padreCajaCarrito").empty();
            $('#contadorProductos').html('0');
            // si el usuario finaliza la compra insertamos un html con un mensaje de que ha sido exitosa y tambien le mostramos un boton para regresar a la tienda(index.html)
            $("#contenedorDivCarrito").show(2000).html(`<div><h1 class="compraExitosa">Su compra se ha realizado de manera exitosa. Gracias por confiar en nosotros!</h1>
                <br>
                <a href="index.html"><button class="comprar">Regresar a la Tienda</button></a></div>`);
            //Elimino los datos del storage y del array
            localStorage.clear();
            carritoProductos.splice(0, carritoProductos.length);
        }
    });
}

let tipoAutomovil = ($('select[id=tipoAutomovil]').value);

$('#btnSendForm').click(function (e) {
    e.preventDefault();
        if (tipoAutomovil != "Todos") {
            const filtros = productos.filter(p => p.tipo == tipoAutomovil);
            creadorDeProductos(filtros);
        }
    }
);