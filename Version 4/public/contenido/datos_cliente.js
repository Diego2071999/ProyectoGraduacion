//select doctores
document.addEventListener('DOMContentLoaded', function() {
    var dropdown = document.getElementById('dropdownDoc');

    fetch('http://localhost:4000/datos/doc', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(function(item) {
            var option = document.createElement('option');
            option.text = item.nombre; // Suponiendo que el campo en la base de datos se llama 'nombre'
            option.value = item.id; // Suponiendo que el campo en la base de datos se llama 'id'
            dropdown.add(option);
        });
    })
    .catch(error => console.error('Error al cargar los datos:', error));
});
//select medicamentos
document.addEventListener('DOMContentLoaded', function() {
    var dropdown = document.getElementById('dropdown');

    fetch('http://localhost:4000/med/medi', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(function(item) {
            var option = document.createElement('option');
            option.text = item.descripcion; // Suponiendo que el campo en la base de datos se llama 'nombre'
            option.value = item.id; // Suponiendo que el campo en la base de datos se llama 'id'
            dropdown.add(option);
        });
    })
    .catch(error => console.error('Error al cargar los datos:', error));
});