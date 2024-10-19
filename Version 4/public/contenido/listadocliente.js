let ClienteToDelete = null; // Variable para almacenar el ID del cliente a eliminar
let filteredClientes = [];


//Funciones de Carga y Renderizado:
function cargarClientes() {
    const historialClientes = JSON.parse(localStorage.getItem('historialClientes')) || [];
    const clientesList = document.getElementById('clientesList');
    clientesList.innerHTML = ''; // Limpiar la tabla antes de cargar

    historialClientes.forEach((cliente, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cliente.nombreFactura}</td>
            <td class="actions">
                <button class="view-btn" onclick="viewCliente(${index})">Ver</button>
                <button class="delete-btn" onclick="openDeleteModal(${index})">Eliminar</button>
            </td>
        `;
        clientesList.appendChild(tr);
    });
}

// Función para renderizar la tabla
function renderTable(clientes) {
    const clientesList = document.getElementById('clientesList');
    clientesList.innerHTML = ''; // Limpiar la tabla antes de cargar

    clientes.forEach((cliente, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cliente.nombreFactura}</td>
            <td class="actions">
                <button class="view-btn" onclick="viewCliente(${index})">Ver</button>
                <button class="delete-btn" onclick="openDeleteModal(${index})">Eliminar</button>
            </td>
        `;
        clientesList.appendChild(tr);
    });
}

function cargarClientes() {
    const historialClientes = JSON.parse(localStorage.getItem('historialClientes')) || [];
    filteredClientes = [...historialClientes]; // Guardar los clientes en filteredClientes también
    renderTable(filteredClientes); // Llamar a renderTable para mostrar la lista
}

//Funciones de Interacción con Clientes:
function actualizarCliente(cliente) {
    const clientesGuardados = JSON.parse(localStorage.getItem('clientes')) || [];
    const historialClientes = JSON.parse(localStorage.getItem('historialClientes')) || [];

    // Verificar si el cliente ya existe en la tabla de clientes
    const clienteExistente = clientesGuardados.find(c => c.codigoCliente === cliente.codigoCliente);

    if (clienteExistente) {
        // Si el cliente ya existe, se añade a la tabla de historial
        historialClientes.push(cliente);
        localStorage.setItem('historialClientes', JSON.stringify(historialClientes));

        // Redirigir al historial del cliente
        window.location.href = `historialcliente.html?cliente=${encodeURIComponent(cliente.nombreFactura)}`;
    } else {
        // Si el cliente no existe, se agrega a la tabla de clientes
        clientesGuardados.push(cliente);
        localStorage.setItem('clientes', JSON.stringify(clientesGuardados));

        // Actualizar la tabla de clientes
        cargarClientes();
    }
}

function viewCliente(index) {
    const historialClientes = JSON.parse(localStorage.getItem('historialClientes')) || [];
    const cliente = historialClientes[index]; // Obtener el cliente usando el índice

    if (cliente) {
        localStorage.setItem('selectedClient', JSON.stringify(cliente)); // Guardar cliente seleccionado
        window.location.href = `historialcliente.html?cliente=${encodeURIComponent(cliente.nombreFactura)}`; // Redirigir al historial
    }
}

//Funciones de Búsqueda y Ordenamiento:
// Función de búsqueda
function searchProduct() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const historialClientes = JSON.parse(localStorage.getItem('historialClientes')) || []; // Cargar los clientes
    filteredClientes = historialClientes.filter(cliente =>
        cliente.nombreFactura.toLowerCase().includes(searchTerm)
    );
    renderTable(filteredClientes); // Renderizar la tabla filtrada
}

// Función para invertir el orden de la lista
function sortTable() {
    filteredClientes.reverse(); // Invertir el orden de los clientes filtrados
    renderTable(filteredClientes); // Renderizar la tabla con el nuevo orden
}

//Funciones de Eliminación de Clientes:
// Función para abrir el modal de eliminación
function openDeleteModal(index) {
    ClienteToDelete = index; // Guardar el índice del cliente a eliminar
    document.getElementById('deleteModal').style.display = 'block';
}

// Función para cerrar el modal de eliminación
function closeDeleteModal() {
    ClienteToDelete = null; // Reiniciar el índice
    document.getElementById('deleteModal').style.display = 'none';
}

// Confirmar eliminación de cliente
function confirmDelete() {
    if (ClienteToDelete !== null) {
        const historialClientes = JSON.parse(localStorage.getItem('historialClientes')) || [];
        
        // Eliminar el cliente usando el índice
        historialClientes.splice(ClienteToDelete, 1); 
        
        // Guardar el nuevo estado en localStorage
        localStorage.setItem('historialClientes', JSON.stringify(historialClientes));
        
        // Recargar la lista de clientes
        cargarClientes(); 
        
        // Cerrar el modal
        closeDeleteModal(); 
    }
}

//Otras Funciones:
// Función para mostrar en listadoClientes solo los datos que no sean iguales al código del cliente
function actualizarListadoClientes() {
    const codigoCliente = localStorage.getItem('codigoCliente');
    let datosClientes = JSON.parse(localStorage.getItem('datosClientes')) || [];
  
    const listadoClientes = datosClientes.filter(cliente => cliente.codclie !== codigoCliente);
  
    // Aquí puedes mostrar los datos en el listado de clientes según tus necesidades
  }

document.addEventListener('DOMContentLoaded', cargarClientes);