// ---------FUNCIONES---------------
// funcion que crea los productos en el DOM
function creadorDeProductos(productos, id) {
    $(id).empty();
    for (let producto of productos) {
        // cargamos de contenido el nuevo elemento
        $('#seccionProductos').append(` <div class="cajaProducto">
        <div class="subcajaProducto">
                                                <img class="imagenProducto" src="${producto.imagen}" alt="">
                                                <div class="datosProducto">
                                                    <p class="titulo">${producto.nombre}</p>
                                                    <p class="descripcion">${producto.descripcion}</p>
                                                    <p class="precio">USD ${producto.precio}</p>
                                                </div>
                                                </div>
                                                <span id="productoAgregado" class="productoAgregado">Su producto ha sido agregado correctamente al carrito</span>
                                                <button id="${producto.id}" class="btn">Agregar al carrito</button>
                                                </div>`);
    }
    // evento que al hacer click en el boton "agregar producto" ejecuta la funcion que añade el producto al carrito
    $('.btn').click(añadirProductosCarrito);
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
        $('#productoAgregado').show(500).delay(1500).hide(500);
    } else if (buscarProductoEnCarrito) {
        // Si ya se encuentra el producto en el carrito, le agregamos cantidad llamando al metodo agregarCantidadEnCarrito
        buscarProductoEnCarrito.agregarCantidadEnCarrito(1);
        $('#productoAgregado').show(500).delay(1500).hide(500);
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
    // carrito de procesamientoCompras.html
    for (const listaproductos of lista) {
        $('#cajaCarrito').append(procesamientoCarrito(listaproductos));
    }
    // inserto el precio total en el carrito
    $('#insertTotal').html(`USD ${calcularPrecioTotal()}`);
    // evento que elimina el producto del carrito
    $('.imgDltProd').click(eliminarProdCarrito);
    // evento que envia la compra con el metodo .post (boton finalizar compra de procesamientoCompras.html)
    $("#finalizarCompra").click(enviarCompra);
    calcularPrecioTotal();
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
    // actualizo el precio total
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
            display: "flex"
        });
        $('#cajaBtnComprar').css({
            display: "flex"
        });
    } else if ($('#padreCarrito').hasClass('mostrar') == true) {
        $('.padreCarrito').removeClass("mostrar");
        $('.padreCarrito').addClass("ocultar");
        $('.listasCarrito').removeClass("carrito-mostrar");
        $('.listasCarrito').addClass("carrito-footer");
        $('#btnCarrito').css({
            display: "none"
        });
        $('#cajaBtnComprar').css({
            display: "none"
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

// funcion que calcula el precio total del carrito segun los productos que esten en el mismo
function calcularPrecioTotal() {
    // con el metodo map, extraemos el precio de los productos en el carrito y los guardamos en un array
    let arrayPrecios = carritoProductos.map(p => p.precio);
    // con el metodo reduce, sumamos todos los precios que quedaron guardados en el arrayPrecios asi nos da el total
    total = arrayPrecios.reduce((a, b) => a + b);
    return total;
}

// evento que ejecuta los filtros
$('#btnSendForm').click(botonFiltros);

// funcion para ejecutar los filtros
function botonFiltros(e) {
    e.preventDefault();
    // traemos y guardamos en variables cada input, select y los input checked del formulario
    let inputSearch = $('#searchForm').val().toUpperCase();
    let tipoAutomovil = $('#tipoAutomovil').val();
    let casillas = $(".marcasForm:checked");
    let valorCheck = [];
    let precioMin = $('#precioMin').val();
    let precioMax = $('#precioMax').val();

    // for que recorre el array de los objetos checkbox marcados y trae el valor
    for (let chequeados of casillas) {
        valorCheck.push(chequeados.value);
    }

    let filtrados = productos;
// le decimos que si el usuario ingreso algun filtro, ingrese y ejecute segun el/los que haya usado.
    if (inputSearch != "" || (tipoAutomovil == "auto" || tipoAutomovil == "camioneta") || casillas.length != 0 || (precioMin != "" || precioMax != "")) {

        if (inputSearch != "") {
            filtrados = filtrados.filter(p => (p.nombre.includes(inputSearch) || p.descripcion.includes(inputSearch)));
        }

        if (tipoAutomovil == "auto" || tipoAutomovil == "camioneta") {
            filtrados = filtrados.filter(p => (p.tipo == tipoAutomovil));
        };

        if (valorCheck.length > 0) {
            filtrados = filtrados.filter(p => valorCheck.includes(p.nombre));
        }

        if (precioMin != "" || precioMax != "") {
            filtrados = filtrados.filter(p => p.precio >= precioMin && p.precio <= precioMax);
        }
        // vaciamos la seccion de productos
        $('#seccionProductos').empty();
        // creamos los productos filtrados
        creadorDeProductos(filtrados);
        // si no encontramos ningun producto que cumpla las condiciones del filtro se ejecuta este if con mensaje para el usuario
        if (filtrados.length <= 0) {
            $('#seccionProductos').html('<h3>Lo sentimos no encontramos ningun producto con esas caracteristicas</h3>');
        }
        // si el usuario hace click pero no uso ningun filtro, mostramos los productos como al inicio
    } else {
        $('#seccionProductos').empty();
        creadorDeProductos(productos);
    }
}
// le agregamos al boton quitarFiltros, el reinicio de los productos para q se vuelvan a mostrar sin filtros.
$('#btnRemoveFilt').on('click', function () {
    $('#seccionProductos').empty();
    creadorDeProductos(productos);
});