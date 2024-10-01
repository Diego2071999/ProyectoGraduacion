
function guardarCambios() {
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
    /*alert('Cambios guardados');*/
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

// Cargar los datos del usuario al inicio (opcional)
document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const userId = parseInt(params.get('id'));

    fetch(`perfil.php?id=${userId}`)
    .then(response => response.json())
    .then(usuario => {
        if (usuario) {
            document.getElementById('userName').textContent = usuario.nombre;
            document.getElementById('userLastName').textContent = usuario.apellido;
            document.getElementById('userRole').textContent = usuario.rol;
            document.getElementById('userEmail').textContent = usuario.email;
            document.getElementById('userPhone').textContent = usuario.telefono;
        }
    });
});

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

closePasswordModal();
    /*alert('Contraseña cambiada exitosamente');*/
}