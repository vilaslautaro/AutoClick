$(document).ready(function () {
    if ("carritoCargado" in localStorage) {// recorro los datos guardados del carrito en el local Storage
        let carritoParseado = JSON.parse(localStorage.getItem('carritoCargado'));
        for (const carritoVisual of carritoParseado) {
            carritoProductos.push(new Productos(carritoVisual.id, carritoVisual.nombre, carritoVisual.descripcion, carritoVisual.precio, carritoVisual.imagen, carritoVisual.cantidadEnCarrito, carritoVisual.tipo));
        }
    }
   
});
$(window).on('load', function () {
    // cuando termine de cargar las imagenes y otros recursos, le cambio el titulo de la seccion de la tienda de "Cargando Productos..." a "Nuestros Productos"
    $('#tituloProductos').html(`Nuestros Productos`);
});

// animacion que hace aparecer los elementos del header
$('#menu, #logo, #contenedorCarrito').fadeIn(2000);

// evento que elimina el producto del carrito
$('.imgDltProd').click(eliminarProdCarrito);

 // evento que muestra u oculta el carrito cuando el usuario da click en el mismo
$('#imagenCarrito').click(mostrarOcultarCarrito);

// evento que al hacer click en el boton "agregar producto" ejecuta la funcion que añade el producto al carrito
$('.btn').click(añadirProductosCarrito);

// ejecuto un evento que cuando se ejecuta un click que llama la funcion añadirProductosCarrito que inserta el producto seleccionado al carrito
vistaProductosCarrito(carritoProductos);