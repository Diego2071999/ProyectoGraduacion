$(document).ready(function() {   
    var url = 'http://localhost:4000/datos/recetas';
    
    var table = $('#productTable').DataTable({            
        "ajax": {
            "url": url,
            "dataSrc": function(data) {
                console.log(data);
                return data;
            }
        },
        "columns": [
            // Paciente Detalles
            {
                "data": "Paciente",
                "title": "Paciente",
                "render": function(data, type, row) {
                    return `
                        <strong>Nombre:</strong> ${data.nombre} ${data.apellido}<br>
                        <strong>Edad:</strong> ${data.edad} años<br>
                        <strong>Encargado:</strong> ${data.nombre_encargado}
                        <strong>NIT:</strong> ${data.nit}<br>
                        <strong>Nombre Factura:</strong> ${data.nomfac}<br>
                        <strong>Email:</strong> ${data.email}<br>
                        <strong>Teléfonos:</strong> ${data.telefono} / ${data.telefono2}<br>
                    `;
                }
            },
            // Medicamento Detalles
            {
                "data": "medicamento",
                "title": "Medicamento",
                "render": function(data, type, row) {
                    return `
                        <strong>Código:</strong> ${data.codigo}<br>
                        <strong>Descripción:</strong> ${data.descripcion}
                    `;
                }
            },
            // Receta Detalles
            {
                "data": "recetas",
                "title": "Detalles de Receta",
                "render": function(data, type, row) {
                    return `
                        <strong>Dosis diaria:</strong> ${data.dosis_diaria}<br>
                        <strong>Consumo diario:</strong> ${data.consumo_diario}<br>
                        <strong>Tiempo consumo:</strong> ${data.tiempo_consumo} días<br>
                        <strong>Inicio:</strong> ${new Date(data.fecha_inicio).toLocaleDateString()}<br>
                        <strong>Fin:</strong> ${new Date(data.fecha_fin).toLocaleDateString()}
                    `;
                }
            },
            
            
            // Actions Column
            {
                "data": null,
                "title": "Acciones",
                "className": "text-center",
                "render": function(data, type, row) {
                    return `
                        <button class="view-btn btn-sm m-1" onclick="abrirModal(
                            '${row.Paciente.nombre}', 
                            '${row.medicamento.nombre}', 
                            '${row.recetas.dosis_diaria}',
                            '${row.recetas.consumo_diario}',
                            '${row.recetas.tiempo_consumo}',
                            '${row.recetas.fecha_fin}')">
                            Reabastecer
                        </button>
                    `;
                }
            }
        ],
        "language": {
            "search": "Buscar:",
            "lengthMenu": "Mostrar _MENU_ registros por página",
            "zeroRecords": "No se encontraron resultados",
            "info": "Mostrando página _PAGE_ de _PAGES_",
            "infoEmpty": "No hay registros disponibles",
            "infoFiltered": "(filtrado de _MAX_ registros totales)"
        },
        "responsive": true,
        "orderCellsTop": true,
        "fixedHeader": true,
        "pageLength": 10,
        "dom": '<"top"lf>rt<"bottom"ip><"clear">',
        "createdRow": function(row, data, dataIndex) {
            // Add Bootstrap classes for better styling
            $(row).addClass('align-middle');
        }
    });

    // Move search box to custom container if it exists
    if ($('#customSearchContainer').length) {
        $('#customSearchContainer').append($('.dataTables_filter'));
    }

    // Add real-time search event
    $('.dataTables_filter input').on('input', function () {
        table.search(this.value).draw();
    });

    // Add custom styling to the table
    $('#productTable').addClass('table table-striped table-bordered table-hover');
});

// Modified sorting function to work with nested data
function ordenarPor(criterio) {
    var table = $('#productTable').DataTable();
    var columnMapping = {
        'paciente': 0,
        'medicamento': 1,
        'receta': 2
    };
    
    if (columnMapping[criterio] !== undefined) {
        table.order([columnMapping[criterio], 'asc']).draw();
    }
}

// Función para abrir el modal y llenar los datos
function abrirModal(paciente, medicamento, receta, consumoDiario, tiempoConsumo, fechaFin) {
    // Llenar los datos en el modal
    $('#modal-paciente').text(paciente);
    $('#modal-medicamento').text(medicamento);
    $('#modal-receta').val(receta); // Usar .val() para campos input
    $('#modal-consumo-diario').val(consumoDiario);
    $('#modal-tiempo-consumo').val(tiempoConsumo); // Mostrar el valor de tiempoConsumo
    //$('#modal-tiempo-consumo').after(' días'); // Agregar la unidad 'días' al campo

    // Verificar que la fecha de fin esté en formato 'YYYY-MM-DD'
    if (!fechaFin || !/^\d{4}-\d{2}-\d{2}$/.test(fechaFin)) {
        alert("La fecha de fin proporcionada no es válida. Asegúrate de que esté en formato 'YYYY-MM-DD'.");
        return;
    }

    // Parsear la fecha de fin actual y convertirla en una fecha válida
    let nuevaFechaInicio = new Date(fechaFin);
    if (isNaN(nuevaFechaInicio.getTime())) {
        alert("No se pudo convertir la fecha de fin en una fecha válida.");
        return;
    }

    // Calcular la nueva fecha de fin sumando el tiempo de consumo (en días)
    let nuevaFechaFin = new Date(nuevaFechaInicio);
    nuevaFechaFin.setDate(nuevaFechaInicio.getDate() + (parseInt(tiempoConsumo) * parseInt(consumoDiario))); // Multiplicar días por cantidad diaria

    // Verificar si la nueva fecha es válida antes de usarla
    if (isNaN(nuevaFechaFin.getTime())) {
        alert("Error al calcular la nueva fecha de fin.");
        return;
    }

    // Formatear la nueva fecha de fin a 'YYYY-MM-DD'
    let nuevaFechaFinFormatted = nuevaFechaFin.toISOString().split('T')[0]; // Asegurarse de que sea una fecha válida

    // Agregar la unidad 'días' al campo de tiempo de consumo
    $('#modal-fecha-fin').val(nuevaFechaFinFormatted);

    // Mostrar el modal
    $('#reabastecerModal').css('display', 'block');
};

// Función para confirmar el reabastecimiento
function confirmarReabastecimiento() {
    alert("Reabastecimiento confirmado.");
    cerrarReabastecimientoModal();
}