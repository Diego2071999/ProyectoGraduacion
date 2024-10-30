$(document).ready(function() {   
    var url = 'http://localhost:4000/datos/docpaci';
    
    var table = $('#DocTable').DataTable({            
        "ajax": {
            "url": url,
            "dataSrc": function(data) {
                console.log(data); // Verifica que los datos sean correctos
                return data;
            }
        },
        "columns": [
            {"data": "Doctor.nombre"},   // Accediendo al nombre del Doctor
            {"data": "Doctor.instituto"}, // Accediendo al instituto del Doctor
            {"data": "Doctor.sede"},      // Accediendo a la sede del Doctor
            {"data": "Doctor.email"},     // Accediendo al email del Doctor
            {
                "data": null,
                "render": function(data, type, row) {
                    return `${row.Paciente.nombre} ${row.Paciente.apellido}`;
                }
            },   // Accediendo al nombre del Paciente
        ],
    });

    // Mover el buscador a la ubicación personalizada
    $('#customSearchContainer').append($('.dataTables_filter'));

    // Añadir evento para buscar en tiempo real
    $('.dataTables_filter input').on('input', function () {
        table.search(this.value).draw();
    });
});

function ordenarPor(criterio) {
    var table = $('#DocTable').DataTable();
    var columnIndex = {
        'nombre': 0,
        'instituto': 1,
        'sede': 2,
    }[criterio];
    table.order([columnIndex, 'asc']).draw();
}