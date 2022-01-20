// FUNCIONES DE FILTROS --------- 2da opcion a tener en cuenta
// // 2 problemas:
// - como hago para que funcione si el usuario utiliza varios filtros
// - el filtroMarcas() no funciona si selecciona 2 o más marcas.


// evento que al hacer click el boton "Aplicar Filtros" ejecuta una funcion
$('#btnSendForm').click(filtroSearch && filtroTipo && filtroMarcas && filtroPrecio && filtroErrores);

let filtros;
function filtroSearch(e, filtros) {
    e.preventDefault();
    // input de busqueda
    let inputSearch = $('#searchForm').val().toUpperCase();
    // if con condicionales de ejecucion si el usuario uso al menos 1 o mas de los filtros
    if (inputSearch != "") {
        // metodo que filtra y trae los productos que cumplen las condiciones del filtro
        filtros = productos.filter(p => (p.nombre.includes(inputSearch) || (p.descripcion.includes(inputSearch))));
        console.log(filtros);
        // vaciamos la seccion de productos
        $('#seccionProductos').empty();
        // creamos los productos filtrados
        creadorDeProductos(filtros);
        // si no encontramos ningun producto que cumpla las condiciones del filtro se ejecuta este if con mensaje para el usuario
    }
}


function filtroTipo(filtros) {
    // input de seleccion de tipo de automovil (auto o camioneta, o todos)
    let tipoAutomovil = $('#tipoAutomovil').val();
    if (tipoAutomovil == "auto" || tipoAutomovil == "camioneta") {
        // metodo que filtra y trae los productos que cumplen las condiciones del filtro
        filtros = productos.filter(p => (p.tipo == tipoAutomovil));
        console.log(filtros);
        // vaciamos la seccion de productos
        $('#seccionProductos').empty();
        // creamos los productos filtrados
        creadorDeProductos(filtros);
        // si no encontramos ningun producto que cumpla las condiciones del filtro se ejecuta este if con mensaje para el usuario
    }
}

function filtroMarcas(filtros) {
    // seleccion de checkbox de marcas de auto
    let casillas = $(".marcasForm:checked");
    let valorCheck = [];
    if (casillas.length != 0) {
        // for que recorre el array de los objetos checkbox marcados y trae el valor
        for (let chequeados of casillas) {
            valorCheck.push(chequeados.value);
            console.log(chequeados);
            console.log(valorCheck);
            //metodo que filtra y trae los productos que cumplen las condiciones del filtro
            filtros = productos.filter(p => (p.nombre == valorCheck));
            console.log(filtros);
            // vaciamos la seccion de productos
            $('#seccionProductos').empty();
            // creamos los productos filtrados
            creadorDeProductos(filtros);
        }
    }
}

function filtroPrecio(filtros) {
    // input de precio minimos y/o maximos de los productos
    let precioMin = $('#precioMin').val();
    let precioMax = $('#precioMax').val();
    console.log(precioMin);
    console.log(precioMax);
    if (precioMin != 0 || precioMax != 0) {
        // metodo que filtra y trae los productos que cumplen las condiciones del filtro
        filtros = productos.filter(p => (p.precio >= precioMin && p.precio <= precioMax));
        console.log(filtros);
        // vaciamos la seccion de productos
        $('#seccionProductos').empty();
        // creamos los productos filtrados
        creadorDeProductos(filtros);
    }
}

function filtroErrores(filtros){
    if (filtros.length <= 0) {
        $('#seccionProductos').html('<h3>Lo sentimos no encontramos ningun producto con esas caracteristicas</h3>');
        // si el usuario hace click pero no usa ningun filtro, mostramos los productos sin filtros
    } else {
        $('#seccionProductos').empty();
        creadorDeProductos(productos);
    }
}





