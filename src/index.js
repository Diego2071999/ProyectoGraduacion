import app from "./app";
const main =()=> {
    app.listen(app.get("port"));
    console.log(`Server on port ${app.get("port")}`);
};

main ();

/*//importar libreria
const express = require("express");
//const mysql = require("mysql");
let mysql = require("mysql");

//objetos para llamar los metodos de express
const app = express();
let conexion = mysql.createConnection({
    host: "localhost",
    database: "mydb",
    user: "root",
    password: ""
})

conexion.connect(function(err) {
    if (err) {
        console.error("Error de conexión: " + err.stack);
        return;
    }
    console.log("Conectado como id " + conexion.threadId);
});

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({extended: false}));

//conector del login
app.set("/", function(req,res){
    res.render("loginV2");
});

app.post("/login", function(req, res){
    const datos = req.body;

    let usuario = datos.usuario;
    let contraseña = datos.contraseña;

    let login = "SELECT * FROM USUARIO WHERE nombre_usuario = ? and contraseña = ?";

    conexion.query(login, [usuario, contraseña], function(error, results) {
        if (error) {
            console.error("Error en la consulta:", error);
            res.status(500).send({"mensaje": "conexion exitosa", "codigo": 500});
            
        }

        if (results.length > 0) {
            console.log("Inicio exitoso");
            res.status(200).send({"mensaje": "conexion exitosa", "codigo": 200});
        } else {
            console.log("Usuario o contraseña incorrectos");
            res.status(401).send({ "mensaje": "Usuario o contraseña incorrectos", "codigo": 401 }); // Usa solo res.json aquí
        }
        return;
    });
});*/

/*//prueba usuarios
// Ruta para obtener los usuarios
app.get('/api/usuarios', (req, res) => {
    const query = 'SELECT id, nombre, apellido, rol FROM usuarios';
    db.query(query, (err, rows) => {
        if (err) {
            console.error('Error al obtener los usuarios:', err);
            res.status(500).send({ message: 'Error al obtener los usuarios' });
        } else {
            res.send(rows);
        }
    });
});

const apiUrl = 'http://localhost:3000/api/usuarios';

fetch(apiUrl)
    .then(response => response.json())
    .then(usuarios => {
        const tableBody = document.getElementById('userTableBody');
        usuarios.forEach(usuario => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.apellido}</td>
                <td>${usuario.rol}</td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error al obtener los usuarios:', error));*/
/*
// Ruta para renderizar la vista de usuarios
app.get("/prueba", function(req, res) {//aqui va la pagian
    res.render("Usuarios"); // Renderiza la vista de usuarios
    if (results.length > 0) 
        console.log("Inicio exitoso");
        res.status(200).send({"mensaje": "conexion exitosa", "codigo": 200});
});*/
/*
// Ruta para obtener usuarios desde la base de datos
app.get("/usuarios", function(req, res) {
    const Usuario = "SELECT * FROM USUARIO";
    conexion.query(Usuario, function(error, results) {
        if (error) {
            console.error("Error en la consulta:", error);
            return res.status(500).send({"mensaje": "Error en la consulta", "codigo": 500});
        }
        if (variable && variable.start) {
            // Accede a variable.start
        } else {
            console.error("variable es undefined o no tiene la propiedad 'start'");
        }
        console.log(response); // Verifica la respuesta de la API
        console.log("funciona", results);
        res.status(200).json(results); // Devuelve los resultados como JSON
    });
});*/
/*
//conector usuarios
app.set("/", function(req,res){
    res.render("Usuarios");
});

app.post("/Usuario", function(req, res){
    const datos = req.body;

    let nombre = datos.nombre;
    let apellido = datos.apellido;
    let correo = datos.correo;
    let telefono = datos.telefono
    let rol_id = datos.rol_id;
    let usuario = datos.usuario;
    let contraseña = datos.contraseña;

    let Usuario = "SELECT * FROM USUARIO";

    conexion.query(Usuario, [nombre, apellido, correo, telefono, rol_id, usuario, contraseña], function(error, results) {
        if (error) {
            console.error("Error en la consulta:", error);
            res.status(500).send({"mensaje": "conexion exitosa", "codigo": 500});
            
        }

        if (results.length > 0) {
            console.log("Inicio exitoso");
            res.status(200).send({"mensaje": "conexion exitosa", "codigo": 200});
        } else {
            console.log("Usuario o contraseña incorrectos");
            res.status(401).send({ "mensaje": "Usuario o contraseña incorrectos", "codigo": 401 }); // Usa solo res.json aquí
        }
        return;
    });
});*/


/*//ruta inicial
app.get("/", function(req,res){
    res.send("Hola");
});*/

//ruta de archivos estaticos
/*app.use(express.static("public"));


//cfigurar el puesto usasdo para el servidor local
app.listen(3000, function(){
    console.log("Servidor conectado exitado correctamente: http://localhost:3000");
});*/