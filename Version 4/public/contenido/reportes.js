// Guardar el reporte seleccionado
let selectedReport = '';

// Función para seleccionar un reporte desde el dropdown
function selectReport(reportName) {
    selectedReport = reportName;
    document.getElementById('selected-report').textContent = "Seleccionado: " + reportName;

    // Acción adicional para cuando se selecciona un reporte
    alert('Ha seleccionado: ' + reportName);
}

// Funcionalidad para generar y descargar reporte
document.getElementById('generate-report-btn').addEventListener('click', function() {
    if (selectedReport) {
        const user = 'Usuario123';  // Simulación de usuario actual
        const date = new Date().toLocaleString();

        // Notificación de descarga de reporte
        alert('Descargando ' + selectedReport);

        // Agregar reporte descargado al historial
        const historyTable = document.getElementById('report-history');
        const newRow = document.createElement('tr');

        newRow.innerHTML = `
            <td>${selectedReport}</td>
            <td>${date}</td>
            <td>${user}</td>
            <td><button class="download-btn">Descargar</button></td>
        `;

        historyTable.appendChild(newRow);
    } else {
        alert('Seleccione un reporte primero.');
    }
});

// Botones de descarga en el historial
document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('download-btn')) {
        const reportRow = event.target.parentNode.parentNode;
        const reportName = reportRow.cells[0].textContent;
        alert('Descargando ' + reportName + ' nuevamente');
    }
});