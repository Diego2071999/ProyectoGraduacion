let usuarioId = null;

$(document).ready(function() {   
    var url = 'http://localhost:4000/user/roles';

    $('#userTable').DataTable({            
        "ajax": {
            "url": url,
            "dataSrc": ""
        },
        "columns": [
            {"data": "Nombre"},
            {"data": "lastname"},
            {"data": "rol.Rol"},
            {
                "data": null,
                "render": function(data, type, row) {
                    return `
                        <button class="view-btn" onclick="abrirModalver(${data.id})">Ver</button>
                        <button class="update-btn" onclick="abrirUpdatemodal(${data.id})">Actualizar</button>
                        <button class="delete-btn" onclick="abrirDeleteUserModal(${data.id})">Eliminar</button>
                    `;
                }
            }
        ],
        "paging": false,           // Eliminar paginación
        "info": false             // Ocultar la información de "Mostrando X de Y entradas"
    });

    // Mover el buscador a la ubicación personalizada
    $('#customSearchContainer').append($('.dataTables_filter'));

    // Añadir evento para buscar en tiempo real
    $('.dataTables_filter input').on('input', function () {
        table.search(this.value).draw();
    });
});

function ordenarPor(criterio) {
    var table = $('#userTable').DataTable();
    var columnIndex = {
        'nombre': 0,
        'apellido': 1,
        'rol': 2
    }[criterio];
    table.order([columnIndex, 'asc']).draw();
}



function validateFrorm(){
    let name = document.getElementById('inputname').value;
    let lastname = document.getElementById('inputlastname').value;
    let email = document.getElementById('inputemail').value;
    let tel = document.getElementById('inputtel').value;
    let rol = document.getElementById('inputrol').value;
    let password = document.getElementById('inputpassword').value;
    let username = document.getElementById('inputusername').value;

    if (name ==  "") {
        alert("El campo esta vacío");
        return false;
    }
    if (lastname ==  "") {
        alert("El campo esta vacío");
        return false;
    }
    if (email ==  "") {
        alert("El campo esta vacío");
        return false;
    }else if(!email.includes('@')){
        alert("El correo no es valido");
        return false;
    }
    if (tel ==  "") {
        alert("El campo esta vacío");
        return false;
    }if (rol ==  "") {
        alert("El campo esta vacío");
        return false;
    }
    if (password ==  "") {
        alert("El campo esta vacío");
        return false;
    }
    if (username ==  "") {
        alert("El campo esta vacío");
        return false;
    }

    return true;
}

// Al cargar el DOM, agregar el evento al formulario
document.getElementById('newUserForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe de forma tradicional
    crearNuevoUsuario(); // Llamar a la función para crear el nuevo usuario
});

// Función para enviar los datos del nuevo usuario al backend
function crearNuevoUsuario() {
    if (!validateFrorm()) {
        return; // Validación fallida, no se envía la solicitud
    }

    const nombre = document.getElementById('inputname').value;
    const apellido = document.getElementById('inputlastname').value;
    const correo = document.getElementById('inputemail').value;
    const telefono = document.getElementById('inputtel').value;
    const rol = document.getElementById('inputrol').value;
    const password = document.getElementById('inputpassword').value;
    const username = document.getElementById('inputusername').value;

    const data = {
        Nombre: nombre,
        lastname: apellido,
        Correo: correo,
        telefono: telefono,
        idrol: { Rol: rol }, // Enviar el rol como objeto con la propiedad Rol
        password: password,
        nombre_usuario: username
    };

    fetch('http://localhost:4000/user/roles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Error al crear usuario y rol');
    })
    .then(data => {
        console.log(data);
        cerrarNuevoUsuarioModal(); // Cerrar el modal después de crear el usuario
        refrescarTablaUsuarios();
    })
    .catch(error => {
        console.error('Error al crear usuario y rol:', error);
        alert('Error al crear usuario y rol');
    });
    
}

function eliminarUsuarioYActualizarRegistro(id) {
    $.ajax({
        url: `http://localhost:4000/user/user/${id}`, // Nueva dirección para eliminar el usuario
        type: 'DELETE',
        success: function(response) {
            console.log("Usuario eliminado y registro actualizado correctamente");
            cerrarDeleteUserModal();
            $('#userTable').DataTable().ajax.reload(); // Actualizar la tabla de usuarios
        },
        error: function(xhr, status, error) {
            console.error("Error al eliminar usuario y actualizar registro:", error);
            alert('Error al eliminar usuario y actualizar registro. Por favor, inténtalo de nuevo.');
        }
    });
}


function refrescarTablaUsuarios() {
    var table = $('#userTable').DataTable();
    table.ajax.reload(); // Recargar los datos en la tabla
}

//ver usuario
// Función para obtener los datos del usuario desde el backend
async function obtenerUsuarioConRoles(userId) { // Recibir el userId
    try {
        const response = await fetch(`http://localhost:4000/user/roles/${userId}`);
        const data = await response.json();

        // Llenar los campos del modal con los datos del usuario
        document.getElementById('modal-nombre').textContent = data[0].Nombre;
        document.getElementById('modal-apellido').textContent = data[0].lastname;
        document.getElementById('modal-correo').textContent = data[0].Correo;
        document.getElementById('modal-telefono').textContent = data[0].telefono;
        document.getElementById('modal-username').textContent = data[0].nombre_usuario;
        document.getElementById('modal-rol').textContent = data[0].rol.Rol;

        // Mostrar el modal
        document.getElementById("userModal").style.display = "block";
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
    }
}

// Función para actualizar un usuario existente
function actualizarUsuario() {
    let usuario = {
        Nombre: $('#nombre').val(),
        lastname: $('#lastname').val(),
        correo: $('#correo').val(),
        telefono: $('#telefono').val(),
        rol: $('#rol').val(),
        password: $('#password').val(),
        nombre_usuario: $('#nombre_usuario').val()
    };

    // Llamada AJAX para actualizar el usuario existente
    $.ajax({
        url: `http://localhost:4000/user/${usuarioId}`, // Cambia a la URL adecuada de tu backend
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(usuario),
        success: function(response) {
            $('#modalCRUD').modal('hide');
            alert('Usuario actualizado correctamente');
            $('#userTable').DataTable().ajax.reload();
        },
        error: function(error) {
            alert('Error al actualizar el usuario');
            console.log(error);
        }
    });
}

