let isAscending = true;
let userIdToDelete = null; // ID del usuario a eliminar

// Función para cargar los usuarios en la tabla
function cargarUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const tableBody = document.getElementById('userTable').querySelector('tbody');
    tableBody.innerHTML = '';

    usuarios.forEach(usuario => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${usuario.id}</td>
        <td>${usuario.nombre}</td>
        <td>${usuario.apellido}</td>
        <td>${usuario.rol}</td>
        <td>
            <a href="#" onclick="editarUsuario(${usuario.id})">ver</a> |
            <a href="#" class="delete" onclick="eliminarUsuario(${usuario.id})">Eliminar</a>
        </td>
        `;
        tableBody.appendChild(row);
    });
}

        // Función para buscar usuarios
        function buscarUsuario() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const tableBody = document.getElementById('userTable').querySelector('tbody');
            tableBody.innerHTML = '';

            // Filtrar los usuarios por ID, nombre, apellido o rol
            const usuariosFiltrados = usuarios.filter(usuario => 
                usuario.id.toString().includes(searchTerm) || 
                usuario.nombre.toLowerCase().includes(searchTerm) || 
                (usuario.apellido && usuario.apellido.toLowerCase().includes(searchTerm)) || 
                (usuario.rol && usuario.rol.toLowerCase().includes(searchTerm))
            );

            

            // Ordenar los usuarios filtrados por ID
            const usuariosOrdenados = usuariosFiltrados.sort((a, b) => {
                return isAscending ? a.id - b.id : b.id - a.id; // Ordenar por ID
            });

            // Mostrar los usuarios filtrados
            usuariosFiltrados.forEach(usuario => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${usuario.id}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.apellido}</td>
                    <td>${usuario.rol}</td>
                    <td>
                        <a href="#" onclick="editarUsuario(${usuario.id})">ver</a> |
                        <a href="#" class="delete" onclick="eliminarUsuario(${usuario.id})">Eliminar</a>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }

            // Función para alternar el orden ascendente/descendente
            function toggleSortOrder() {
                isAscending = !isAscending; // Alternar entre ascendente y descendente
                const sortIcon = document.getElementById('sortIcon');
                sortIcon.src = isAscending ? 'imagenes/acendente y descendente.png' : 'imagenes/descendente.png'; // Cambiar icono si es necesario
                ordenarUsuarios(); // Reordenar la lista después de alternar el orden
            }

            // Función para ordenar usuarios por el criterio seleccionado en el menú desplegable
            function ordenarUsuarios() {
                const criterio = document.getElementById('sortCriteria').value; // Obtener el criterio seleccionado
                const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            
                usuarios.sort((a, b) => {
                    let aValue = a[criterio] ? a[criterio].toLowerCase() : '';
                    let bValue = b[criterio] ? b[criterio].toLowerCase() : '';
            
                    // Usamos localeCompare para comparar de manera insensible a mayúsculas y con soporte de caracteres especiales
                    if (isAscending) {
                        return aValue.localeCompare(bValue);
                    } else {
                        return bValue.localeCompare(aValue);
                    }
                });
            
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
                cargarUsuarios(); // Recargar la tabla con los usuarios ordenados
            }

        // Función para alternar el orden
        /*function ordenarUsuarios() {
            isAscending = !isAscending; // Alternar el estado de orden

            // Cambiar el icono o texto del botón según el estado
            const sortIcon = document.getElementById('sortIcon');
            sortIcon.src = isAscending ? 'imagenes/acendente y descendente.png' : 'acendente y descendente.png';

            buscarUsuario(); // Re-aplicar la búsqueda para que se muestre la lista ordenada
        }*/
        
        // Función para abrir el modal de confirmación
        function eliminarUsuario(id) {
            userIdToDelete = id; // Asignar el ID del usuario a eliminar
            document.getElementById('deleteUserModal').style.display = 'block';
        }

        function cerrarDeleteUserModal() {
            document.getElementById('deleteUserModal').style.display = 'none';
        }

        document.addEventListener('DOMContentLoaded', () => {
            cargarUsuarios();
            // Asignar el evento al botón de confirmar eliminación
            document.getElementById('confirmDeleteBtn').onclick = eliminarUsuarioConfirmado; 
        });

        function eliminarUsuarioConfirmado() {
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const index = usuarios.findIndex(usuario => usuario.id === userIdToDelete);
            if (index !== -1) {
                usuarios.splice(index, 1);
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
                cargarUsuarios();
            }
            cerrarDeleteUserModal();
        }
        
        // Función para editar un usuario
        function editarUsuario(id) {
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const usuario = usuarios.find(u => u.id === id);
            const url = `perfil.html?id=${usuario.id}&nombre=${encodeURIComponent(usuario.nombre)}&apellido=${encodeURIComponent(usuario.apellido)}&rol=${encodeURIComponent(usuario.rol)}`;
            window.location.href = url;
        }

        document.addEventListener('DOMContentLoaded', cargarUsuarios);


        function abrirNuevoUsuarioModal() {
            document.getElementById('newUserModal').style.display = 'block';
        }

        function cerrarNuevoUsuarioModal() {
            document.getElementById('newUserModal').style.display = 'none';
        }

        function guardarNuevoUsuario() {
            const nombre = document.getElementById('newUserName').value;
            const apellido = document.getElementById('newUserLastName').value;
            const rol = document.getElementById('newUserRole').value;
            const email = document.getElementById('newUserEmail').value;
            const telefono = document.getElementById('newUserPhone').value;

            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const nuevoId = usuarios.length ? usuarios[usuarios.length - 1].id + 1 : 1;

            const nuevoUsuario = {
                id: nuevoId,
                nombre: nombre,
                apellido: apellido,
                rol: rol,
                email: email,
                telefono: telefono
            };

            usuarios.push(nuevoUsuario);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));

            cerrarNuevoUsuarioModal();
            cargarUsuarios(); // Recargar usuarios en la tabla
        }