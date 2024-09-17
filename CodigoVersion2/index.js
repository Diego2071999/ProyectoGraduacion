//importar libreria
const express = require("express");
const mysql = require("mysql");
//const bodyParser = require("body-parser");

//objetos para llmar los metodos de express
const app = express();
//app.use(bodyParser.json());
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

app.set("/", function(req,res){
    res.render("login");
});

app.post("/login", function(req, res){
    const datos = req.body;

    let usuario = datos.usuario;
    let contraseña = datos.contraseña;

    let login = "SELECT * FROM USUARIO WHERE nombre_usuario= ? and contraseña = ?";

    conexion.query(login, [usuario, contraseña], function(error, results) {
        if (error) {
            console.error("Error en la consulta:", error);
            res.status(500).send("Error en el servidor");
            return; // Asegúrate de salir de la función después de enviar la respuesta
        }

        if (results.length > 0) {
            console.log("Inicio exitoso");
            res.redirect("/calendarioV2");
        } else {
            console.log("Usuario o contraseña incorrectos");
            res.status(401).json({ success: false, message: "Usuario o contraseña incorrectos" }); // Usa solo res.json aquí
        }
    });
});


// Ruta para el calendario
app.get("/", function(req, res) {
    res.render("calendarioV2"); // Asegúrate de que este archivo exista
});

/*//ruta inicial
app.get("/", function(req,res){
    res.send("Hola");
});*/

//ruta de archivos estaticos
app.use(express.static("public"));


/*// Ruta para manejar el inicio de sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Aquí deberías validar las credenciales
    // Por ejemplo, si el usuario y contraseña son correctos
    if (username === "usuario" && password === "contraseña") {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});*/


//cfigurar el puesto usasdo para el servidor local
app.listen(3000, function(){
    console.log("Servidor conectado exitado correctamente: http://localhost:3000");
});