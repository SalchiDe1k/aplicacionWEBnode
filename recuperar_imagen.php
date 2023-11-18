<?php
// Configuración de la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "proyectoFinal";

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Consulta SQL para obtener la imagen con imagen_id igual a 1
$sql = "SELECT imagen FROM imagen WHERE imagen_id = 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Mostrar la imagen si se encontró el registro
    $row = $result->fetch_assoc();
    
    // Obtener los datos binarios de la imagen
    $imagen_binaria = $row["imagen"];

    // Desactivar la caché para asegurar la correcta visualización de la imagen
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Cache-Control: post-check=0, pre-check=0', false);
    header('Pragma: no-cache');

    // Establecer la cabecera para el tipo de contenido genérico de imagen
    header("Content-Type: image");

    // Mostrar los datos binarios directamente al navegador
    echo $imagen_binaria;
} else {
    echo "No se encontraron resultados para el ID 1";
}

// Cerrar la conexión
$conn->close();
?>
