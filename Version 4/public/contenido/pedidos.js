const table = document.getElementById('orders-table');
const newRow = `
  <tr>
    <td>${fechaDelPedido}</td>
    <td>${nombreDelPedido}</td>
    <td>${medicamento}</td>
    <td>${fechaDeEntrega}</td>
  </tr>
`;
table.innerHTML += newRow;