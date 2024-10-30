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
            {"data": "nomfac"},
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
                        <button class="btn btn-danger delete-btn" onclick="abrirDeleteProductModal(${data.id})">
                            <i class="fas fa-trash"></i> Eliminar
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

// Modificación en el frontend para manejar la respuesta
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
            "url": `http://localhost:4000/transaccion/recetas?paciente_cod=${pacienteId}`,
            "dataSrc": function(response) {
                if (!response || response.error) {
                    $('#errorMessage').html(`
                        <div class="alert alert-warning">
                            ${response.error || 'No se encontraron recetas'}
                        </div>
                    `);
                    return [];
                }
                return response;
            }
        },
        "columns": [
            { 
                "data": "paciente.nomfac",
                "title": "Nombre Facturación" 
            },
            { 
                "data": "paciente.nombre",
                "title": "Nombre" 
            },
            { 
                "data": "paciente.apellido",
                "title": "Apellido" 
            },
            { 
                "data": "medicamento.nombre",
                "title": "Medicamento",
                "render": function(data, type, row) {
                    return `${data} ${row.medicamento.contenido} ${row.medicamento.presentacion}`;
                }
            },
            { 
                "data": "detalleReceta.dosis_diaria",
                "title": "Dosis Diaria" 
            },
            { 
                "data": "detalleReceta.tiempo_consumo",
                "title": "Días de Tratamiento" 
            },
            { 
                "data": "detalleReceta.fecha_inicio",
                "title": "Fecha Inicio",
                "render": function(data) {
                    return new Date(data).toLocaleDateString();
                }
            },
            { 
                "data": "detalleReceta.fecha_fin",
                "title": "Fecha Fin",
                "render": function(data) {
                    return new Date(data).toLocaleDateString();
                }
            }
        ],
        "order": [[6, 'desc']], // Ordenar por fecha de inicio descendente
        "language": {
            "emptyTable": "No hay recetas disponibles para este paciente"
        }
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