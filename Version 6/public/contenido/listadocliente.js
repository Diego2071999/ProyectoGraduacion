// Tabla principal de pacientes
$(document).ready(function() {   
    var pacienteUrl = 'http://localhost:4000/datos/paci';
    
    var tablaPacientes = $('#productTable').DataTable({            
        "ajax": {
            "url": pacienteUrl,
            "dataSrc": function(data) {
                return data;
            }
        },
        "columns": [
            {"data": "nombre"},
            {"data": "apellido"},
            {"data": "email"},
            {
                "data": null,
                "render": function(data, type, row) {
                    return `
                        <button class="btn btn-primary view-btn" onclick="verRecetas(${data.id})">
                            <i class="fas fa-eye"></i> Ver Recetas
                        </button>
                    `;
                }
            }
        ],
        "language": {
            "search": "Buscar:",
            "zeroRecords": "No se encontraron resultados",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
            "infoEmpty": "Mostrando 0 a 0 de 0 registros",
            "infoFiltered": "(filtrado de _MAX_ registros totales)"
        }
    });

    $('#customSearchContainer').append($('.dataTables_filter'));

    $('.dataTables_filter input').on('input', function () {
        tablaPacientes.search(this.value).draw();
    });
});

// Función para redireccionar a la página de recetas
function verRecetas(pacienteId) {
    window.location.href = `historialcliente.html?id=${pacienteId}`;
}

// Tabla de recetas específicas para el paciente seleccionado
$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const pacienteId = urlParams.get('id');

    if (!pacienteId) {
        $('#errorMessage').html(`
            <div class="alert alert-warning">
                No se ha especificado un paciente.
            </div>
        `);
        return;
    }

    const tablaRecetas = $('#recetaTable').DataTable({
        "ajax": {
            "url": `http://localhost:4000/transaccion/recetas?paciente_cod=${pacienteId}`, // Usar template literals
            "method": "GET",
            "dataSrc": function(response) {
                console.log(response); // Para verificar la estructura de respuesta

                if (!Array.isArray(response)) {
                    $('#errorMessage').html(`
                        <div class="alert alert-warning">
                            No se encontraron recetas para este paciente.
                        </div>
                    `);
                    return [];
                }

                if (response.length === 0) {
                    $('#errorMessage').html(`
                        <div class="alert alert-info">
                            No se encontraron recetas para este paciente.
                        </div>
                    `);
                }

                return response; // Retornar el array si es correcto
            },
            "beforeSend": function() {
                $('#loadingMessage').html(`
                    <div class="spinner-border text-primary" role="status">
                        <span class="sr-only">Cargando...</span>
                    </div>
                `);
            },
            "complete": function() {
                $('#loadingMessage').empty();
            }
        },
        "columns": [
            { "data": "id", "title": "ID Receta", "className": "text-center" },
            { "data": "paciente.nombre", "title": "Nombre", "defaultContent": "<span class='text-muted'>No disponible</span>" },
            { "data": "paciente.apellido", "title": "Apellido", "defaultContent": "<span class='text-muted'>No disponible</span>" },
            {
                "data": "medicamento",
                "title": "Medicamento",
                "render": function(data) {
                    return data ? `<div>${data.nombre} ${data.contenido}<br>${data.presentacion}</div>` : "<span class='text-muted'>No disponible</span>";
                }
            },
            { "data": "detalleReceta.dosis_diaria", "title": "Dosis Diaria", "defaultContent": "<span class='text-muted'>-</span>" },
            { "data": "detalleReceta.tiempo_consumo", "title": "Días", "defaultContent": "<span class='text-muted'>-</span>" },
            {
                "data": "detalleReceta.fecha_inicio",
                "title": "Inicio",
                "render": function(data) {
                    return data ? new Date(data).toLocaleDateString() : '<span class="text-muted">-</span>';
                }
            },
            {
                "data": "detalleReceta.fecha_fin",
                "title": "Fin",
                "render": function(data) {
                    return data ? new Date(data).toLocaleDateString() : '<span class="text-muted">-</span>';
                }
            }
        ],
        "language": {
            "search": "Buscar:",
            "zeroRecords": "No se encontraron recetas para este paciente",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ recetas",
            "infoEmpty": "No hay recetas disponibles",
            "infoFiltered": "(filtrado de _MAX_ recetas totales)",
            "emptyTable": "No hay recetas disponibles para este paciente",
            "loadingRecords": "Cargando...",
            "processing": "Procesando..."
        },
        "pageLength": 10,
        "responsive": true,
        "scrollX": true,
        "autoWidth": false
    });
});


// Función para ordenar la tabla de recetas
function ordenarPor(criterio) {
    const columnasOrdenamiento = {
        'dosis_diaria': 4,
        'nombre': 1,
        'apellido': 2,
        'fecha_inicio': 6
    };
    
    if (criterio in columnasOrdenamiento) {
        const tabla = $('#recetaTable').DataTable();
        tabla.order([columnasOrdenamiento[criterio], 'asc']).draw();
    }
}
function createNewOrder() {
    const urlParams = new URLSearchParams(window.location.search);
    const pacienteId = urlParams.get('id');

    if (!pacienteId) {
        $('#errorMessage').html(`
            <div class="alert alert-danger">
                No se ha especificado un paciente.
            </div>
        `);
        return;
    }

    // Mostrar indicador de carga
    $('#loadingMessage').html(`
        <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Cargando...</span>
        </div>
    `);

    $.ajax({
        url: `http://localhost:4000/datos/paci/${pacienteId}`,
        method: 'GET',
        success: function(response) {
            if (!response) {
                $('#errorMessage').html(`
                    <div class="alert alert-warning">
                        No se encontraron datos del paciente.
                    </div>
                `);
                return;
            }

            // Guardar datos del paciente en sessionStorage
            const datosParaGuardar = {
                paciente_id: pacienteId,
                nit: response.nit || '',
                nombreFactura: response.nombreFactura || '',
                direccionEntrega: response.direccionEntrega || '',
                referencia: response.referencia || '',
                telefono: response.telefono || '',
                telefono2: response.telefono2 || '',
                email: response.email || '',
                nombrePaciente: response.nombre || '',
                apellidoPaciente: response.apellido || '',
                edad: response.edad || '',
                nombreEncargado: response.nombre_encargado || '',
                fecha_creacion: new Date().toISOString()
            };

            // Guardar en sessionStorage
            sessionStorage.setItem('datosPaciente', JSON.stringify(datosParaGuardar));

            // Redirigir a la página de toma de datos
            window.location.href = 'nuevoproducto.html';
        },
        error: function(xhr, status, error) {
            $('#errorMessage').html(`
                <div class="alert alert-danger">
                    Error al obtener datos del paciente: ${error}
                </div>
            `);
        },
        complete: function() {
            $('#loadingMessage').empty();
        }
    });
}