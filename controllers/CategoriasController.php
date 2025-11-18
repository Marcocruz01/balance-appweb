<?php 

namespace Controllers;

use MVC\Router;
use Model\Categoria;

class CategoriasController {

    // Funcion para agregar las categorias a la base de datos
    public static function crear(Router $router) {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            session_start(); // Iniciamos la sesión
            \isAuth(); // Protejemos la sesión con la vista
            // Instanciamos el modelo del categoria
            $categoria = new Categoria();
            // Procesar los datos enviados.
            $categoria->sincronizar($_POST); // Sincronizamos los datos del formulario

            // Seteamos al usuario quien creo la categoria
            $categoria->propietarioId($_SESSION['id']);
            // Guardamos la categoria en la BD
            $resultado = $categoria->guardar();
            if($resultado) {
                // Enviamos la respuesta
                $respuesta = [
                    'tipo' => 'exito',
                    'categoria' => $categoria
                ];
            }
            echo json_encode($respuesta);
        }
    }

    // Funcion que obtiene las categorias de la base de datos
    public static function listar() {
        if($_SERVER['REQUEST_METHOD'] === 'GET') {
            session_start(); // Iniciamos la sesión
            \isAuth(); // Protejemos la sesión con la vista
            $usuario_id = $_SESSION['id']; // Obtener el id de la session
            $categorias = Categoria::belongsTo('propietario_id', $usuario_id);
            echo json_encode(['categorias' => $categorias]);
        }
    }

    // Funcion para actualizar la categoria respecto al id
    public static function actualizar(Router $router, $id) {
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            session_start(); // Iniciamos la sesión
            \isAuth(); // Protejemos la sesión con la vista
            // Leer el cuerpo de la petición como JSON
            $data = json_decode(file_get_contents("php://input"), true);
            // Buscar la categoría por ID
            $categoria = Categoria::find($id);
            // Sincronizar los datos 
            $categoria->sincronizar($data);
            // Actualizar la categoría
            $resultado = $categoria->actualizar();
            if($resultado) {
                // Enviamos la respuesta
                $respuesta = [
                    'tipo' => 'exito',
                    'categoria' => $categoria
                ];
            }
            echo json_encode($respuesta);
        }
    }

    // Funcion para eliminar la categoria respecto al id
    public static function eliminar(Router $router, $id) {
        if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
            session_start(); // Iniciamos la sesión
            \isAuth(); // Protejemos la sesión con la vista
            // Buscar la categoría por ID
            $categoria = Categoria::find($id);
            // Eliminar la categoría
            $resultado = $categoria->eliminar();
            if($resultado) {
                // Enviamos la respuesta
                $respuesta = [
                    'tipo' => 'exito'
                ];
            }
            echo json_encode($respuesta);
        }
    }
}
