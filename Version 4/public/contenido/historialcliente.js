//Función agregarFilaTabla(pedido):
// Función para agregar una nueva fila a la tabla
function agregarFilaTabla(pedido) {
    const historialBody = document.getElementById('historialBody');
    const row = document.createElement('tr');

    // Obtener la fecha actual
    const fechaActual = new Date().toLocaleDateString();

    // Rellenar la fila con los datos del cliente y la fecha actual
    row.innerHTML = `
        <td>${fechaActual}</td>
        <td>${pedido.nombrePaciente || 'N/A'}</td>
        <td>${pedido.edadPaciente || 'N/A'}</td>
        <td>${pedido.enfermedad}</td>
        <td>${pedido.nombreEncargado || 'N/A'}</td>
        <td>${pedido.producto || 'N/A'}</td>
        <td>${pedido.cantidad || 'N/A'}</td>
        <td>${pedido.dosisDiaria || 'N/A'}</td>
        <td>${pedido.tiempoConsumo || 'N/A'}</td>
        <td>${pedido.nit || 'N/A'}</td>
        <td>${pedido.telefono || 'N/A'}</td>
        <td>${pedido.telefono2 || 'N/A'}</td>
        <td>${pedido.direccionEntrega || 'N/A'}</td>
        <td>${pedido.referencia || 'N/A'}</td>
        <td>${pedido.medicoReceta || 'N/A'}</td>
        <td>${pedido.institucion || 'N/A'}</td>
        <td>${pedido.sede || 'N/A'}</td>
        <td>${pedido.email || 'N/A'}</td>
        <td>${pedido.codclie || 'N/A'}</td>
        <td>
            <button onclick="editarCliente('${pedido.codclie}')">Editar</button>
        </td>
    `;
    // Agregar la fila a la tabla
    historialBody.appendChild(row);
}

// Función para guardar un nuevo pedido en el localStorage y actualizar la tabla
// Función para guardar un nuevo pedido
function guardarPedido(nuevoPedido) {
    const codigoCliente = nuevoPedido.codclie;
    let pedidosCliente = JSON.parse(localStorage.getItem(`pedidos_${codigoCliente}`)) || [];
    pedidosCliente.push(nuevoPedido);

    // Guardar los datos actualizados en localStorage
    localStorage.setItem(`pedidos_${codigoCliente}`, JSON.stringify(pedidosCliente));

    // Actualizar la tabla con el nuevo pedido
    agregarFilaTabla(nuevoPedido);
}

// Función para cargar los datos del cliente seleccionado
// Cargar los datos del cliente seleccionado desde localStorage
document.addEventListener('DOMContentLoaded', () => {
    const codigoCliente = localStorage.getItem('codigoCliente');
    const pedidosCliente = JSON.parse(localStorage.getItem(`pedidos_${codigoCliente}`)) || [];
    const historialBody = document.getElementById('historialBody');

    pedidosCliente.forEach(pedido => {
        agregarFilaTabla(pedido);
    });
});

// Cargar los datos del cliente seleccionado desde localStorage
document.addEventListener('DOMContentLoaded', () => {
    const datosPaciente = JSON.parse(localStorage.getItem('selectedClient'));
    const historialBody = document.getElementById('historialBody');
    //const clienteSeleccionado = JSON.parse(localStorage.getItem('selectedClient'));

    if (datosPaciente && datosPaciente.nombreFactura) {
        document.getElementById('facturaTitulo').textContent = `${datosPaciente.nombreFactura}`;
    }

    if (datosPaciente) {
        const row = document.createElement('tr');
        // Obtener la fecha actual
        const fechaActual = new Date().toLocaleDateString();

        // Rellenar la fila con los datos del cliente y la fecha actual
        row.innerHTML = `
            <td>${fechaActual}</td>
            <td>${datosPaciente.nombrePaciente || 'N/A'}</td>
            <td>${datosPaciente.edadPaciente || 'N/A'}</td>
            <td>${datosPaciente.enfermedad}</td>
            <td>${datosPaciente.nombreEncargado || 'N/A'}</td>
            <td>${datosPaciente.producto || 'N/A'}</td>
            <td>${datosPaciente.cantidad || 'N/A'}</td>
            <td>${datosPaciente.dosisDiaria || 'N/A'}</td>
            <td>${datosPaciente.tiempoConsumo || 'N/A'}</td>
            <td>${datosPaciente.nit || 'N/A'}</td>
            <td>${datosPaciente.telefono || 'N/A'}</td>
            <td>${datosPaciente.telefono2 || 'N/A'}</td>
            <td>${datosPaciente.direccionEntrega || 'N/A'}</td>
            <td>${datosPaciente.referencia || 'N/A'}</td>
            <td>${datosPaciente.medicoReceta || 'N/A'}</td>
            <td>${datosPaciente.institucion || 'N/A'}</td>
            <td>${datosPaciente.sede || 'N/A'}</td>
            <td>${datosPaciente.email || 'N/A'}</td>
            <td>${datosPaciente.codclie || 'N/A'}</td>
            <td>
                <button onclick="editarCliente()">Editar</button>
            </td> <!-- Botón de editar -->
        `;
        // Agregar la fila a la tabla
        historialBody.appendChild(row);
    }
});

// Función para abrir el modal con los datos del cliente seleccionado para su edición
// Función para abrir el modal con los datos del cliente
function editarCliente() {
    const datosPaciente = JSON.parse(localStorage.getItem('selectedClient'));

    if (datosPaciente) {
        // Cargar los valores en los campos del modal
        document.getElementById('editnit').value = datosPaciente.nit || '';
        document.getElementById('editNombre').value = datosPaciente.nombrePaciente || '';
        document.getElementById('editEdad').value = datosPaciente.edadPaciente || ''; 
        document.getElementById('editenfermedad').value = datosPaciente.enfermedad ||'';
        document.getElementById('editEncargado').value = datosPaciente.nombreEncargado || '';
        document.getElementById('editMedicamento').value = datosPaciente.producto || '';
        document.getElementById('editCantidad').value = datosPaciente.cantidad || ''; 
        document.getElementById('editDosisDiaria').value = datosPaciente.dosisDiaria || '';
        document.getElementById('editTiempoConsumo').value = datosPaciente.tiempoConsumo || '';
        document.getElementById('editTelefono').value = datosPaciente.telefono || '';
        document.getElementById('editTelefono2').value = datosPaciente.telefono2 || '';
        document.getElementById('editDireccion').value = datosPaciente.direccionEntrega || '';
        document.getElementById('editMedico').value = datosPaciente.medicoReceta || '';
        document.getElementById('editInstitucion').value = datosPaciente.institucion || '';
        document.getElementById('editSede').value = datosPaciente.sede || '';
        document.getElementById('editEmail').value = datosPaciente.email || '';

        // Mostrar el modal
        document.getElementById('editModal').style.display = 'block';
    }
}

// Función para cerrar el modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Función para guardar los cambios
function saveEdit() {
    const datosPaciente = JSON.parse(localStorage.getItem('selectedClient'));
    
    if (datosPaciente) {
        // Obtener los valores editados
        const nuevonit = document.getElementById('editnit').value;
        const nuevoNombre = document.getElementById('editNombre').value;
        const nuevoEdad = document.getElementById('editEdad').value;
        const nuevoEnfermedad = document.getElementById('editenfermedad').value;
        const nuevoEncargado = document.getElementById('editEncargado').value;
        const nuevoMedicamento = document.getElementById('editMedicamento').value;
        const nuevoCantidad = document.getElementById('editCantidad').value;
        const nuevoDosisDiaria = document.getElementById('editDosisDiaria').value;
        const nuevoTiempoConsumo = document.getElementById('editTiempoConsumo').value;
        const nuevoTelefono = document.getElementById('editTelefono').value;
        const nuevoTelefono2 = document.getElementById('editTelefono2').value;
        const nuevoDireccion = document.getElementById('editDireccion').value;
        const nuevoMedico = document.getElementById('editMedico').value;
        const nuevoInstitucion = document.getElementById('editInstitucion').value; 
        const nuevoSede = document.getElementById('editSede').value;
        const nuevoEmail = document.getElementById('editEmail').value;

        // Actualizar los datos en localStorage
        datosPaciente.nit = nuevonit;
        datosPaciente.nombrePaciente = nuevoNombre;
        datosPaciente.edadPaciente = nuevoEdad;
        datosPaciente.enfermedad = nuevoEnfermedad;
        datosPaciente.nombreEncargado = nuevoEncargado;
        datosPaciente.producto = nuevoMedicamento;
        datosPaciente.cantidad = nuevoCantidad;
        datosPaciente.dosisDiaria = nuevoDosisDiaria;
        datosPaciente.tiempoConsumo = nuevoTiempoConsumo;
        datosPaciente.telefono = nuevoTelefono;
        datosPaciente.telefono2 = nuevoTelefono2;
        datosPaciente.direccionEntrega = nuevoDireccion;
        datosPaciente.medicoReceta = nuevoMedico;
        datosPaciente.institucion = nuevoInstitucion;
        datosPaciente.sede = nuevoSede;
        datosPaciente.email = nuevoEmail;

        localStorage.setItem('selectedClient', JSON.stringify(datosPaciente));

        // Cerrar el modal y actualizar la tabla
        closeEditModal();
        location.reload(); // Recargar la página para reflejar los cambios
    }
}

// Función para guardar un nuevo cliente en datosClientes y actualizar historialCliente
function guardarClienteNuevo(nuevoCliente) {
    // Verificar si el cliente ya existe en el historial
    const clienteExistente = datosClientes.find(cliente => cliente.codclie === nuevoCliente.codclie);

    if (clienteExistente) {
        // Actualizar los datos del cliente existente
        Object.assign(clienteExistente, nuevoCliente);
    } else {
        // Agregar un nuevo cliente al historial
        datosClientes.push(nuevoCliente);
    }

    // Actualizar el historial en el localStorage
    localStorage.setItem('historialClientes', JSON.stringify(datosClientes));

    // Actualizar la tabla de clientes
    actualizarTablaClientes();

    /*const codigoCliente = nuevoCliente.codclie;
    let datosClientes = JSON.parse(localStorage.getItem('datosClientes')) || [];
    let historialCliente = JSON.parse(localStorage.getItem(`historial_${codigoCliente}`)) || [];

    datosClientes.push(nuevoCliente);
    historialCliente.push(nuevoCliente);

    localStorage.setItem('datosClientes', JSON.stringify(datosClientes));
    localStorage.setItem(`historial_${codigoCliente}`, JSON.stringify(historialCliente));

    actualizarListadoClientes();*/
}
