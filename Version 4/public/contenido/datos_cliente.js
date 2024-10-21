// Variable global para almacenar los productos obtenidos
var productos = [];

$(document).ready(function() {   
    var url = 'http://localhost:4000/med/medi';
    
    var table = $('#productTable').DataTable({            
        "ajax": {
            "url": url,
            "dataSrc": function(data) {
                productos = data; // Almacenar los productos en una variable global
                console.log(data); // Verifica que los datos sean correctos
                return data;
            }
        },
        "columns": [
            {"data": "codigo"},
            {"data": "nombre"},
            {"data": "contenido"},
            {"data": "presentacion"},
            {"data": "descripcion"},
            {
                "data": null,
                "render": function(data, type, row) {
                    return `
                        <button class="update-btn" onclick="abrirUpdateProductModal(${data.id})">Actualizar</button>
                        <button class="delete-btn" onclick="abrirDeleteProductModal(${data.id})">Eliminar</button>
                    `;
                }
            }
        ]
    });

    // Mover el buscador a la ubicación personalizada
    $('#customSearchContainer').append($('.dataTables_filter'));

    // Añadir evento para buscar en tiempo real
    $('.dataTables_filter input').on('input', function () {
        table.search(this.value).draw();
    });

    // Evento para el formulario de nuevo producto
    document.getElementById('newProductForm').addEventListener('submit', function(event) {
        event.preventDefault();
        crearNuevoProducto();
    });
});

// Función para filtrar productos y mostrar sus descripciones en una lista
function filtrarProductos() {
    // Obtener el valor del input
    var input = document.getElementById('producto').value.toLowerCase();
    var listGroup = document.getElementById('autocomplete-list');

    // Limpiar la lista
    listGroup.innerHTML = '';

    // Filtrar productos basados en el valor del input
    var productosFiltrados = productos.filter(function(producto) {
        return producto.nombre.toLowerCase().includes(input);
    });

    // Mostrar las descripciones de los productos filtrados
    productosFiltrados.forEach(function(producto) {
        var item = document.createElement('div');
        item.classList.add('autocomplete-item');
        item.innerHTML = producto.descripcion;
        listGroup.appendChild(item);
    });
}
