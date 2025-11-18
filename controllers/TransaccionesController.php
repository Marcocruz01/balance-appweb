<?php 

namespace Controllers;

use MVC\Router;
use Model\Usuario;
use Model\Categoria;
use Model\Transaccion;

class TransaccionesController {

    // Función principal para la vista de ingresos
    public static function ingresos(Router $router) {
        session_start(); // Iniciamos la sesión
        \isAuth(); // Protejemos la sesión con la vista
        // Renderizar la vista
        $router->render('dashboard/ingresos', [
            'titulo' => 'Ingresos',
        ]);
    }

    // Función principal para la vista de gastos
    public static function gastos(Router $router) {
        session_start(); // Iniciamos la sesión
        \isAuth(); // Protejemos la sesión con la vista
        // Renderizar la vista
        $router->render('dashboard/gastos', [
            'titulo' => 'Gastos',
        ]);
    }

    // Obtener categorías según el tipo (ingreso o gasto)
    public static function obtenerCategorias($tipo) {
        session_start();
        \isAuth();
        $usuario_id = $_SESSION['id'];
        $categorias = Categoria::whereAll(['tipo' => $tipo, 'propietario_id' => $usuario_id]);
        echo json_encode($categorias);
    }

    // Crear una nueva transacción (ingreso o gasto)
    public static function crear(Router $router, $tipo) {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            session_start();
            \isAuth();
            $usuario_id = $_SESSION['id'] ?? null;
            $usuario = Usuario::find($usuario_id); 
            // Instanciamos el modelo del categoria
            $transaccion = new Transaccion();
            // Procesar los datos enviados.
            $transaccion->sincronizar($_POST); // Sincronizamos los datos del formulario

            $transaccion->tipo = $tipo;
            $transaccion->propietarioId($_SESSION['id']);
            $resultado = $transaccion->guardar();

            if($resultado) {
                // Recalcular saldo actual
                if ($usuario) {
                    $saldo = $usuario->recalcularSaldo();
                }
                
                // Enviar ambas cosas al cliente
                echo json_encode([
                    'tipo' => 'exito',
                    'transaccion' => $transaccion,
                ]);
            }
        }
    }

    // Listar transacciones del usuario (filtradas por tipo)
    public static function listar($tipo) {
        if($_SERVER['REQUEST_METHOD'] === 'GET') {
            session_start();
            \isAuth();
            $usuario_id = $_SESSION['id'] ?? null;
            $usuario = Usuario::find($usuario_id); 

            // Obtener transacciones
            $transacciones = Transaccion::whereAll([
                'propietario_id' => $usuario_id,
                'tipo' => $tipo
            ]);

            // Recalcular saldo actual
            if ($usuario) {
                $saldo = $usuario->recalcularSaldo();
            }

            // Enviar ambas cosas al cliente
            echo json_encode([
                'transacciones' => $transacciones,
            ]);
        }
    }

    // Actualizar una transacción
    public static function actualizar(Router $router, $id) {
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            session_start();
            \isAuth();
            $usuario_id = $_SESSION['id'] ?? null;
            $usuario = Usuario::find($usuario_id); 

            $data = json_decode(file_get_contents("php://input"), true);

            $transaccion = Transaccion::find($id);
            $transaccion->sincronizar($data);
            
            $resultado = $transaccion->actualizar();
            if($resultado) {
                // Recalcular saldo actual
                if ($usuario) {
                    $saldo = $usuario->recalcularSaldo();
                }

                // Enviar ambas cosas al cliente
                echo json_encode([
                    'tipo' => 'exito',
                    'transaccion' => $transaccion,
                ]);
            }
        }
    }

    // Eliminar transacción
    public static function eliminar(Router $router, $id) {
        if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
            session_start();
            \isAuth();
            $usuario_id = $_SESSION['id'] ?? null;
            $usuario = Usuario::find($usuario_id); 
            
            $transaccion = Transaccion::find($id);

            $resultado = $transaccion->eliminar();
            if($resultado) {
                // Recalcular saldo actual
                if ($usuario) {
                    $saldo = $usuario->recalcularSaldo();
                }

                // Enviar ambas cosas al cliente
                echo json_encode(['tipo' => 'exito', 'saldo' => $saldo]);
            }
        }
    }
}
