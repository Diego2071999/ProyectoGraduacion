let medicamentoId = null;

$(document).ready(function() {   
    var url = 'http://localhost:4000/med/medi'; // Nueva URL del controlador

    $('#tablaArticulos').DataTable({            
        "ajax":{
            "url": url,
            "dataSrc":""
        },
        "columns":[
            {"data":"codigo"},
            {"data":"nombre"},
            {"data":"contenido"},
            {"data":"presentacion"},
            {"data":"descripcion"}
        ],
        "columnDefs":[{
            "targets":[2],
            render(v){
                return Number(v).toFixed(2)
            }
        }],
        "paging": false, // Eliminar paginación
        "info": false    // Ocultar la información de "Mostrando X de Y entradas"
    });


    // Mover el buscador a la ubicación personalizada
    $('#customSearchContainer').append($('.dataTables_filter'));

    // Añadir evento para buscar en tiempo real
    $('.dataTables_filter input').on('input', function () {
        var table = $('#medicamentoTable').DataTable();
        table.search(this.value).draw();
    });
});

function ordenarPor(criterio) {
    var table = $('#medicamentoTable').DataTable();
    var columnIndex = {
        'codigo': 0,
        'nombre': 1,
        'contenido': 2,
        'presentacion': 3
    }[criterio];
    table.order([columnIndex, 'asc']).draw();
}