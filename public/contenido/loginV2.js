import { methods as languageControler } from "../../src/rutas/language.rutes";
console.log(languageControler);

export function login() {
    var username = document.querySelector('input[name="usuario"]').value;
    var password = document.querySelector('input[name="contraseña"]').value;
    var errorMessage = document.getElementById("error-message");

    errorMessage.style.display = "none";

    //console.info(username, password);

    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'usuario=' + encodeURIComponent(username) + '&contraseña=' + encodeURIComponent(password)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.codigo == 200) {
            window.location.href = 'calendarioV2.html'; // Redirigir al usuario
        } else {
            errorMessage.innerText = data.mensaje;
            errorMessage.style.display = "block"; // Mostrar el mensaje de error
        }
    });

    languageControler.getLanguages(nombre_usuario, contraseña) // assuming this method exists in rutas.js
        .then(data => {
            if (data.codigo == 200) {
                window.location.href = 'calendarioV2.html'; // Redirigir al usuario
            } else {
                errorMessage.innerText = data.mensaje;
                errorMessage.style.display = "block"; // Mostrar el mensaje de error
            }
        });
}
