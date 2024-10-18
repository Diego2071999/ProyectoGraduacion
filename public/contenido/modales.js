//crear usuario
// Función para abrir el modal (ajusta según sea necesario)
function abrirModal() {
    document.getElementById('newUserModal').style.display = 'block';
}

// Función para cerrar el modal
function cerrarNuevoUsuarioModal() {
    document.getElementById('newUserModal').style.display = 'none';
    
}
// Añade un evento para cerrar el modal cuando se hace clic fuera del contenido del modal
window.onclick = function(event) {
    const modal = document.getElementById('newUserModal');
    if (event.target === modal) {
        cerrarNuevoUsuarioModal();
    }
}
//eliminar Usuairo
function abrirDeleteUserModal(id) {
    document.getElementById("deleteUserModal").style.display = "block";
    document.getElementById("confirmDeleteBtn").onclick = function() {
        eliminarUsuarioYActualizarRegistro(id); // Llamar a la función que elimina el usuario y actualiza el registro
    };
}

function cerrarDeleteUserModal() {
    document.getElementById("deleteUserModal").style.display = "none";
}

/// Función para abrir el modal y cargar datos del usuario
function abrirModalver(userId) {
    obtenerUsuarioConRoles(userId); // Pasar el userId a la función
    document.getElementById("userModal").style.display = "flex"; // Mostrar el modal
}

// Función para cerrar el modal
function cerrarModal() {
    document.getElementById("userModal").style.display = "none"; // Cerrar el modal
}

// Función para cerrar el modal cuando se hace clic fuera de la ventana del modal
window.onclick = function(event) {
    const modal = document.getElementById('userModal');
    if (event.target == modal) {
        modal.style.display = 'none'; // Cerrar modal si se hace clic fuera
    }
}

// Función para abrir el modal y rellenar los datos del usuario
function abrirUpdatemodall(id) {
    obtenerUsuarioConRoles(id); // Obtener los datos del usuario y mostrarlos en el modal
    document.getElementById("updateUserModal").style.display = "flex";

    // Manejar el envío del formulario para actualizar el usuario
    document.getElementById("updateUserForm").onsubmit = function(event) {
        event.preventDefault();
        actualizarUsuario(id); // Llamar a la función de actualización
    };
}

// Función para cerrar el modal
function cerraraUpdatemodal() {
    document.getElementById("updateUserModal").style.display = "none";
}

