$(document).ready(function() {   
    var url = 'http://localhost:4000/datos/paci';
    
    var table = $('#productTable').DataTable({            
        "ajax": {
            "url": url,
            "dataSrc": function(data) {
                console.log(data); // Verifica que los datos sean correctos
                return data;
            }
        },
        "columns": [
            {"data": "nomfac"},
            {"data": "nombre"},
            {"data": "apellido"},
            {"data": "email"},
            {
                "data": null,
                "render": function(data, type, row) {
                    return `
                        <button class="view-btn" onclick="window.location.href='historialcliente.html?id=${data.id}'" >Ver</button>
                        <button class="delete-btn" onclick="abrirDeleteProductModal(${data.id})">Eliminar</button>
                    `;
                }
            }
        ],
       // "paging": false,           // Eliminar paginación
       // "info": false              // Ocultar la información de "Mostrando X de Y entradas"
    });

    // Mover el buscador a la ubicación personalizada
    $('#customSearchContainer').append($('.dataTables_filter'));

    // Añadir evento para buscar en tiempo real
    $('.dataTables_filter input').on('input', function () {
        table.search(this.value).draw();
    });

});

function ordenarPor(criterio) {
    var table = $('#productTable').DataTable();
    var columnIndex = {
        'nomfac': 0,
        'nombre': 1,
        'apellido': 2,
        'email': 3
    }[criterio];
    table.order([columnIndex, 'asc']).draw();
}