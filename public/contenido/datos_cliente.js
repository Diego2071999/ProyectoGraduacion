let productos = [];

//funciones realcionada con la gestion de productos y autocompletado
function loadProductosFromLocalStorage() {
  const storedProducts = localStorage.getItem('products');
  if (storedProducts) {
      productos = JSON.parse(storedProducts);
  } else {
      productos = [];  // Si no hay productos, se inicia con una lista vacía
  }
}

// Filtrar y mostrar la lista de productos
function filtrarProductos() {
  const input = document.getElementById('producto');
  const filter = input.value.toLowerCase();
  const autocompleteList = document.getElementById('autocomplete-list');
  
  // Limpiar lista anterior
  autocompleteList.innerHTML = '';

  // Filtrar productos y crear la lista de autocompletado
  productos
      .filter(producto => producto.medicamento.toLowerCase().includes(filter))
      .forEach(producto => {
          const div = document.createElement('div');
          div.innerHTML = producto.medicamento;
          div.addEventListener('click', () => {
              input.value = producto.medicamento;  // Asignar el producto seleccionado al campo de texto
              autocompleteList.innerHTML = '';  // Limpiar la lista
          });
          autocompleteList.appendChild(div);
      });
}

function closeAutocompleteOnClick(event) {
  const autocompleteList = document.getElementById('autocomplete-list');
  const input = document.getElementById('producto');
  
  if (event.target !== input && event.target.closest('.autocomplete-items') === null) {
      autocompleteList.innerHTML = ''; // Limpiar la lista si se hace clic fuera
  }
}

//Funciones relacionadas con la captura y guardado de datos de pacientes:
function guardarDatos() {
  const datosPaciente = {
    id: document.getElementById('id').value,
    nit: document.getElementById('nit').value,
    nombreFactura: document.getElementById('nombreFactura').value,
    direccionEntrega: document.getElementById('direccionEntrega').value,
    referencia: document.getElementById('referencia').value,
    telefono: document.getElementById('telefono').value,
    nombrePaciente: document.getElementById('nombrePaciente').value,
    enfermedad: document.getElementById('enfermedad').value,
    telefono2: document.getElementById('telefono2').value,
    edadPaciente: document.getElementById('edadPaciente').value,
    nombreEncargado: document.getElementById('nombreEncargado').value,
    medicoReceta: document.getElementById('medicoReceta').value,
    institucion: document.getElementById('institucion').value,
    sede: document.getElementById('sede').value,
    email: document.getElementById('email').value,
    dosisDiaria: document.getElementById('dosisDiaria').value,
    codclie: document.getElementById('codclie').value,
    producto: document.getElementById('producto').value,
    cantidad: document.getElementById('cantidad').value,
    tiempoConsumo: document.getElementById('tiempoConsumo').value

  /*const cliente = {
      id, nit, nombreFactura, direccionEntrega, referencia, telefono, nombrePaciente, telefono2,
      edadPaciente, nombreEncargado, medicoReceta, institucion, sede, email, dosisDiaria,
      cantidadDiaria, codclie, producto, cantidad*/
  };
  // Obtener el historial actual de clientes
  const historialClientes = JSON.parse(localStorage.getItem('historialClientes')) || [];
  historialClientes.push(datosPaciente); // Añadir nuevo cliente

  // Guardar el nuevo historial de clientes en localStorage
  localStorage.setItem('historialClientes', JSON.stringify(historialClientes));

  alert('Datos guardados con éxito.');
  document.getElementById('datosForm').reset(); // Limpiar el formulario
}

//Funciones relacionadas con la gestión de clientes en datosClientes y historialCliente:
// Función para guardar un nuevo cliente en datosClientes y actualizar historialCliente
function guardarClienteNuevo(nuevoCliente) {
    const codigoCliente = nuevoCliente.codclie;
    let datosClientes = JSON.parse(localStorage.getItem('datosClientes')) || [];
    let historialCliente = JSON.parse(localStorage.getItem(`historial_${codigoCliente}`)) || [];

    datosClientes.push(nuevoCliente);
    historialCliente.push(nuevoCliente);

    localStorage.setItem('datosClientes', JSON.stringify(datosClientes));
    localStorage.setItem(`historial_${codigoCliente}`, JSON.stringify(historialCliente));

    actualizarListadoClientes();
}

// Función para verificar si el cliente ya existe y actualizar historialCliente si es necesario
function verificarClienteExistente(nuevoCliente) {
  const codigoCliente = nuevoCliente.codclie;
  let datosClientes = JSON.parse(localStorage.getItem('datosClientes')) || [];
  let historialCliente = JSON.parse(localStorage.getItem(`historial_${codigoCliente}`)) || [];

  const clienteExistente = datosClientes.find(cliente => cliente.codclie === codigoCliente);

  if (clienteExistente) {
      historialCliente.push(nuevoCliente);
      localStorage.setItem(`historial_${codigoCliente}`, JSON.stringify(historialCliente));
  } else {
      datosClientes.push(nuevoCliente);
      historialCliente.push(nuevoCliente);

      localStorage.setItem('datosClientes', JSON.stringify(datosClientes));
      localStorage.setItem(`historial_${codigoCliente}`, JSON.stringify(historialCliente));
  }

  actualizarListadoClientes();
}

// Llamar a esta función al cargar la página
window.onload = function() {
  loadProductosFromLocalStorage();
  document.addEventListener('click', closeAutocompleteOnClick); // Escuchar clics en el documento
};




