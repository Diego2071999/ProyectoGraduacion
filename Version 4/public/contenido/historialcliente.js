$(document).ready(function() {
    var url = 'http://localhost:4000/datos/his'; // URL de la API para obtener los datos

    var table = $('#productTable').DataTable({
        "ajax": {
            "url": url,
            "dataSrc": function(data) {
                console.log(data); // Verifica que los datos sean correctos
                return data.recetas; // Devuelve directamente la lista de recetas
            }
        },
        "columns": [
            { "data": "dosis_diaria" },                  // Dosis diaria de la receta
            { "data": "paciente.nombre" },               // Nombre del paciente
            { "data": "paciente.apellido" },             // Apellido del paciente
            { "data": "paciente.email" },                // Email del paciente
            {
                "data": null,
                "render": function(data, type, row) {
                    return `
                        <button class="view-btn" onclick="window.location.href='historialcliente.html?id=${row.paciente.id}'">Ver</button>
                        <button class="delete-btn" onclick="abrirDeleteProductModal(${row.id})">Eliminar</button>
                    `;
                }
            }
        ],
        // Mover el buscador a la ubicación personalizada
        "initComplete": function() {
            $('#customSearchContainer').append($('.dataTables_filter'));
        }
    });

    // Añadir evento para buscar en tiempo real
    $('.dataTables_filter input').on('input', function () {
        table.search(this.value).draw();
    });
});

// Función para ordenar por un criterio específico
function ordenarPor(criterio) {
    var table = $('#productTable').DataTable();
    var columnIndex = {
        'dosis_diaria': 0,
        'nombre': 1,
        'apellido': 2,
        'email': 3
    }[criterio];
    table.order([columnIndex, 'asc']).draw();
}
