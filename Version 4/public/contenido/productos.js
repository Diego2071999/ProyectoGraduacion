let products = [];
let isEditing = false;
let editingIndex = -1;
let filteredProducts = [];
let productToDelete = null;


// Cargar productos desde localStorage al iniciar
function loadFromLocalStorage() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    } else {
        initializeProducts(); // Inicializa productos de ejemplo si no hay
    }
    renderTable(); // Renderizar la tabla
}

// Función para abrir el modal
function openModal() {
    document.getElementById('productModal').style.display = 'flex';
    document.getElementById('modalTitle').textContent = 'Nuevo Producto';
}

// Función para cerrar el modal
function closeModal() {
    document.getElementById('productModal').style.display = 'none';
    document.getElementById('productForm').reset();
    isEditing = false;
    editingIndex = -1; 
}

// Función para agregar/editar productos
function saveProduct() {
    const medicamento = document.getElementById('medicamento').value;
    const presentacion = document.getElementById('presentacion').value;
    const dosis = document.getElementById('dosis').value;
    const fechaCompra = document.getElementById('fechaCompra').value;
    const fechaVencimiento = document.getElementById('fechaVencimiento').value;
    const fechaRegistro = document.getElementById('fechaRegistro').value;

    const product = { medicamento, fechaCompra, fechaVencimiento, presentacion, dosis, fechaRegistro };

    // Evitar duplicados al guardar
    const exists = products.some(p => 
        p.medicamento === product.medicamento &&
        p.presentacion === product.presentacion &&
        p.dosis === product.dosis
    );

    if (isEditing && editingIndex >= 0) {
        products[editingIndex] = product;
    } else {
        if (exists) {
            alert('El producto ya está registrado.');
            return;
        }
        products.push(product);
    }

    saveToLocalStorage();  // Guardar los productos en localStorage
    closeModal();
    renderTable();
}



function renderTable() {
    const tableBody = document.querySelector('#productTable tbody');
    tableBody.innerHTML = '';

    const dataToRender = filteredProducts.length > 0 ? filteredProducts : products;

    dataToRender.forEach((product, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${product.medicamento}</td>
            <td>${product.presentacion}</td>
            <td>${product.dosis}</td>
            <td>${product.fechaCompra}</td>
            <td>${product.fechaVencimiento}</td>
            <td>${product.fechaRegistro}</td>
            <td class="acciones">
                <button class="btn btn-view" onclick="viewProduct(${index})">Ver</button>
                <button class="btn btn-delete" onclick="openDeleteModal(${index})">Eliminar</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Función para abrir el modal de eliminación
function openDeleteModal(index) {
    productToDelete = index;
    document.getElementById('deleteModal').style.display = 'block';
}

// Función para cerrar el modal de eliminación
function closeDeleteModal() {
    productToDelete = null;
    document.getElementById('deleteModal').style.display = 'none';
}

// Confirmar eliminación de producto
function confirmDelete() {
    if (productToDelete !== null) {
        if (filteredProducts.length > 0) {
            const productIndexInOriginal = products.indexOf(filteredProducts[productToDelete]);
            products.splice(productIndexInOriginal, 1);
            filteredProducts.splice(productToDelete, 1);
        } else {
            products.splice(productToDelete, 1);
        }
        saveToLocalStorage();
        renderTable();
        closeDeleteModal();
    }
}


// Función para ver el detalle del producto
function viewProduct(index) {
    const dataToRender = filteredProducts.length > 0 ? filteredProducts : products;
    const product = dataToRender[index];
    localStorage.setItem('selectedProduct', JSON.stringify(product));
    window.location.href = `detalleproducto.html?medicamento=${encodeURIComponent(product.medicamento)}`;
}

// Función para invertir el orden de la lista
function sortTable() {
    if (filteredProducts.length > 0) {
        filteredProducts.reverse();
        renderFilteredTable(filteredProducts);
    } else {
        products.reverse();
        renderTable();
    }
}

// Función de búsqueda
function searchProduct() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.medicamento.toLowerCase().includes(searchTerm) ||
        product.presentacion.toLowerCase().includes(searchTerm) ||
        product.dosis.toLowerCase().includes(searchTerm) ||
        product.fechaCompra.includes(searchTerm) ||
        product.fechaVencimiento.includes(searchTerm) ||
        product.fechaRegistro.includes(searchTerm)
    );
    renderFilteredTable(filteredProducts);
}

// Función para renderizar tabla filtrada
function renderFilteredTable(filteredProducts) {
    const tbody = document.getElementById('productTable').querySelector('tbody');
    tbody.innerHTML = '';

    filteredProducts.forEach((product, index) => {
        const row = `<tr>
            <td>${product.medicamento}</td>
            <td>${product.presentacion}</td>
            <td>${product.dosis}</td>
            <td>${product.fechaCompra}</td>
            <td>${product.fechaVencimiento}</td>
            <td>${product.fechaRegistro}</td>
            <td>
                <button onclick="viewProduct(${index})">Ver</button>
                <button onclick="openDeleteModal(${index})">Eliminar</button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

// Función para guardar productos en localStorage
function saveToLocalStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Llama a estas funciones al cargar la página
window.onload = function() {
    loadFromLocalStorage();
};