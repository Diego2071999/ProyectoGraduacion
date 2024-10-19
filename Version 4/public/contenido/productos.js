$(document).ready(function() {   
    var url = 'http://localhost:4000/med/medi';
    
    var table = $('#productTable').DataTable({            
        "ajax": {
            "url": url,
            "dataSrc": function(data) {
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
                        <button class="view-btn" onclick="abrirModalver(${data.id})">Ver</button>
                        <button class="update-btn" onclick="abrirUpdatemodal(${data.id})">Actualizar</button>
                        <button class="delete-btn" onclick="abrirDeleteUserModal(${data.id})">Eliminar</button>
                    `;
                }
            }
        ],
        "paging": false,           // Eliminar paginación
        "info": false              // Ocultar la información de "Mostrando X de Y entradas"
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

function ordenarPor(criterio) {
    var table = $('#productTable').DataTable();
    var columnIndex = {
        'codigo': 0,
        'nombre': 1,
        'contenido': 2,
        'presentacion': 3
    }[criterio];
    table.order([columnIndex, 'asc']).draw();
}
// Crear nuevo producto
function crearNuevoProducto() {
    const codigo = document.getElementById('inputCodigo').value;
    const nombre = document.getElementById('inputNombre').value;
    const contenido = document.getElementById('inputContenido').value;
    const presentacion = document.getElementById('inputPresentacion').value;
    const descripcion = document.getElementById('inputDescripcion').value;

    const data = {
        codigo: codigo,
        nombre: nombre,
        contenido: contenido,
        presentacion: presentacion,
        descripcion: descripcion
    };

    fetch('http://localhost:4000/med/medi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Error al crear el producto');
    })
    .then(data => {
        cerrarModalProducto();
        $('#productTable').DataTable().ajax.reload(); // Recargar la tabla
    })
    .catch(error => {
        console.error('Error al crear el producto:', error);
        alert('Error al crear el producto');
    });
}