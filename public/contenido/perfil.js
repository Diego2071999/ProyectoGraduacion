$(document).ready(function() {
    // Obtener el ID del usuario de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    // Llamar a la función para obtener y mostrar los datos del usuario
    obtenerDatosUsuario(userId);
});

// Función para obtener y mostrar los datos del usuario
function obtenerDatosUsuario(id) {
    $.ajax({
        url: `http://localhost:4000/user/roles/${id}`,
        type: 'GET',
        success: function(data) {
            $('#userName').text(data.Nombre);
            $('#userLastName').text(data.lastname);
            $('#userRole').text(data.rol.Rol);
            $('#userPhone').text(data.telefono);
            $('#userUser').text(data.nombre_usuario);
        },
        error: function(error) {
            console.error(error);
        }
    });
}

/*function guardarCambios() {
    const userId = new URLSearchParams(window.location.search).get('id');
    const userName = document.getElementById("editName").value;
    const userLastName = document.getElementById("editLastName").value;
    const userRole = document.getElementById("editRole").value;
    const userEmail = document.getElementById("editEmail").value;
    const userPhone = document.getElementById("editPhone").value;
    
    // Actualizar los valores en el perfil
    document.getElementById("userName").textContent = userName;
    document.getElementById("userLastName").textContent = userLastName;
    document.getElementById("userRole").textContent = userRole;
    document.getElementById("userEmail").textContent = userEmail;
    document.getElementById("userPhone").textContent = userPhone;

    // Actualizar en localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const index = usuarios.findIndex(u => u.id === parseInt(userId));
    if (index !== -1) {
        usuarios[index] = {
            id: parseInt(userId),
            nombre: userName,
            apellido: userLastName,
            rol: userRole,
            email: userEmail,
            telefono: userPhone
        };
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    // Cerrar el modal
    closeModal();
}

function cancelarEdicion() {
    closeModal();
}

function openModal() {
    const userName = document.getElementById("userName").textContent;
    const userLastName = document.getElementById("userLastName").textContent;
    const userRole = document.getElementById("userRole").textContent;
    const userEmail = document.getElementById("userEmail").textContent;
    const userPhone = document.getElementById("userPhone").textContent;

    document.getElementById("editName").value = userName;
    document.getElementById("editLastName").value = userLastName;
    document.getElementById("editRole").value = userRole;
    document.getElementById("editEmail").value = userEmail;
    document.getElementById("editPhone").value = userPhone;

    document.getElementById("editModal").style.display = "block";
}

function closeModal() {
    document.getElementById("editModal").style.display = "none";
}


function openPasswordModal() {
   document.getElementById("passwordModal").style.display = "block";
}

function closePasswordModal() {
    document.getElementById("passwordModal").style.display = "none";
}

function guardarNuevaContrasena() {
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;

// Aquí puedes agregar la lógica para verificar la contraseña actual y actualizarla en localStorage o en una base de datos.
*//*
closePasswordModal();
    /*alert('Contraseña cambiada exitosamente');*/
//}