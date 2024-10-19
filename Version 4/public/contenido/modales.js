//Usuarios----------------------------------------------------------------------------------------------------------
//crear usuario
// Función para abrir el modal (ajusta según sea necesario)
function abrirModal() {
    document.getElementById('newUserModal').style.display = 'block';
}

// Función para cerrar el modal
function cerrarNuevoUsuarioModal() {
    document.getElementById('newUserModal').style.display = 'none';
    
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

//ver usuario
/// Función para abrir el modal y cargar datos del usuario
function abrirModalver(userId) {
    obtenerUsuarioConRoles(userId); // Pasar el userId a la función
    document.getElementById("userModal").style.display = "flex"; // Mostrar el modal
}


//actualizar usuaio
// Función para cerrar el modal
function cerrarUpdateModal() {
    document.getElementById("updateUserModal").style.display = "none";
}

//Productos----------------------------------------------------------------------------------------------------------
//crear
function abrirModalProducto() {
    document.getElementById('modalCrearProducto').style.display = 'block';
}

// Función para cerrar el modal
function cerrarModalProducto() {
    document.getElementById('modalCrearProducto').style.display = 'none';
    
}

//eliminar
function abrirDeleteProductModal(id) {
    document.getElementById("deleteProductModal").style.display = "block";
    document.getElementById("confirmDeleteBtn").onclick = function() {
        eliminarProducto(id); // Llamar a la función que elimina el producto y actualiza el registro
    };
}

function cerrarDeleteProductModal() {
    document.getElementById("deleteProductModal").style.display = "none";
}
//actualizar
// Función para cerrar el modal
function cerrarUpdateProductModal() {
    document.getElementById("updateProductModal").style.display = "none";
}


// Función para cerrar el modal cuando se hace clic fuera de cualquier modal
window.onclick = function(event) {
    const newUserModal = document.getElementById('newUserModal');
    const deleteUserModal = document.getElementById('deleteUserModal');
    const userModal = document.getElementById('userModal');
    const updateUserModal = document.getElementById('updateUserModal');
    //productos
    const newProduct = document.getElementById('modalCrearProducto');
    const  deleteProductModal = document.getElementById('deleteProductModal');
    const  updateProductModal = document.getElementById('updateProductModal');



    if (event.target === newUserModal) {
        cerrarNuevoUsuarioModal();
    }

    if (event.target === deleteUserModal) {
        cerrarDeleteUserModal();
    }

    if (event.target === userModal) {
        cerrarModal();
    }

    if (event.target === updateUserModal) {
        cerrarUpdateModal();
    }
    if (event.target === newProduct){
        cerrarModalProducto();
    }
    if (event.target === deleteProductModal){
        cerrarDeleteProductModal();
    }
    if (event.target ===  updateProductModal){
        cerrarUpdateProductModal();
    }

}