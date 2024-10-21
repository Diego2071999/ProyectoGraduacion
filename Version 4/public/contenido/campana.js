document.addEventListener("DOMContentLoaded", function() {
    const clients = [
        { days: '3 días', name: 'Cliente 1', medication: 'Medicamento' }
        // Add more clients here if needed
    ];

    const table = document.getElementById("client-table");

    clients.forEach(client => {
        const row = table.insertRow();
        row.insertCell(0).innerText = client.days;
        row.insertCell(1).innerText = client.name;
        row.insertCell(2).innerText = client.medication;
    });
});