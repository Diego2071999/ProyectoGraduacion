<?php
session_start();

$servername = "localhost"; // Cambia si es necesario
$username = "root"; // Tu usuario de MySQL
$password = ""; // Tu contraseña de MySQL (vacío en este caso)
$dbname = "mydb"; // Aquí coloca el nombre de tu base de datos

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Verificar si se han enviado datos de inicio de sesión
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener datos de la solicitud
    $user = $_POST['username'];
    $pass = $_POST['password'];

    // Usar sentencias preparadas para prevenir inyecciones SQL
    $stmt = $conn->prepare("SELECT contraseña FROM USUARIO WHERE nombre_usuario=?");
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    if ($row && password_verify($pass, $row['contraseña'])) {
        // Usuario autenticado
        $_SESSION['user'] = $user; // Guardar el usuario en la sesión
        echo json_encode(["success" => true]);
    } else {
        // Usuario no encontrado o contraseña incorrecta
        echo json_encode(["success" => false]);
    }

    $stmt->close();
    $conn->close();
    exit(); // Asegúrate de salir después de manejar la solicitud
}

// Verificar si el usuario está autenticado
if (!isset($_SESSION['user'])) {
    header('Location: login.html'); // Redirigir a la página de login si no está autenticado
    exit();
}

// Aquí puedes continuar con la lógica para mostrar el calendario
?>