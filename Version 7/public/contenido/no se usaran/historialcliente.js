$(document).ready(function() {
    // Obtener el ID del paciente de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const pacienteId = urlParams.get('id');
    
    if (!pacienteId) {
        alert("ID de paciente no encontrado en la URL.");
        return;
    }

    // URL para obtener las recetas del paciente
    const url = `http://localhost:4000/datos/recetas?pacienteId=${pacienteId}`;

    $('#recetaTable').DataTable({
        "ajax": {
            "url": url,
            "dataSrc": ""
        },
        "columns": [
            { "data": "paciente.nomfac" },
            { "data": "paciente.nombre" },
            { "data": "paciente.apellido" },
            { "data": "medicamento.nombre" },
            { "data": "detalleReceta.dosis_diaria" },
            { "data": "detalleReceta.tiempo_consumo" },
            { "data": "detalleReceta.fecha_inicio" },
            { "data": "detalleReceta.fecha_fin" }
        ]
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
