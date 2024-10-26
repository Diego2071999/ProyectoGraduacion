// Cargar los datos del producto seleccionado
document.addEventListener('DOMContentLoaded', () => {
    const product = JSON.parse(localStorage.getItem('selectedProduct'));

    if (product) {
        document.getElementById('medicamento').textContent = product.medicamento || 'N/A';
        document.getElementById('presentacion').textContent = product.presentacion || 'N/A';
        document.getElementById('dosis').textContent = product.dosis || 'N/A';
        document.getElementById('fechaCompra').textContent = product.fechaCompra || 'N/A';
        document.getElementById('fechaVencimiento').textContent = product.fechaVencimiento || 'N/A';
        document.getElementById('fechaRegistro').textContent = product.fechaRegistro || 'N/A';
    }

    // Cargar los valores en el modal para editar
    document.getElementById('editButton').addEventListener('click', () => {
        if (product) {
            document.getElementById('editMedicamento').value = product.medicamento;
            document.getElementById('editPresentacion').value = product.presentacion;
            document.getElementById('editDosis').value = product.dosis;
            document.getElementById('editFechaCompra').value = product.fechaCompra;
            document.getElementById('editFechaVencimiento').value = product.fechaVencimiento;
            document.getElementById('editFechaRegistro').value = product.fechaRegistro;
        }
        document.getElementById('editModal').style.display = 'flex';
    });

    // Guardar los cambios
    document.getElementById('saveChanges').addEventListener('click', () => {
        const updatedProduct = {
            medicamento: document.getElementById('editMedicamento').value,
            presentacion: document.getElementById('editPresentacion').value,
            dosis: document.getElementById('editDosis').value,
            fechaCompra: document.getElementById('editFechaCompra').value,
            fechaVencimiento: document.getElementById('editFechaVencimiento').value,
            fechaRegistro: document.getElementById('editFechaRegistro').value
        };

        // Actualizar el producto en el almacenamiento local
        localStorage.setItem('selectedProduct', JSON.stringify(updatedProduct));
        localStorage.setItem('products', JSON.stringify(
            JSON.parse(localStorage.getItem('products')).map(p => 
                p.medicamento === product.medicamento ? updatedProduct : p
            )
        ));

        // Cerrar el modal y recargar la página
        document.getElementById('editModal').style.display = 'none';
        location.reload();
    });

    // Cerrar el modal
    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('editModal').style.display = 'none';
    });
});