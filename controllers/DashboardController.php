<?php

namespace Controllers;

use MVC\Router;
use Model\Abono;
use Model\Usuario;
use Model\Apartado;
use Model\Categoria;
use Model\Transaccion;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager as Image;

class DashboardController {

    // Función principal para la vista principal de la app web 
    public static function index(Router $router) {
        session_start(); // Iniciamos la sesión
        \isAuth(); // Protejemos la sesión con la vista
        // Renderizar la vista
        $router->render('dashboard/index', [
            'titulo' => 'Dashboard',
        ]);
    }

    // Funcion para obtener los datos de los ingresos, gastos y apartados
    public static function datos() {
        session_start(); // Iniciamos la sesión
        \isAuth(); // Protejemos la sesión con la vista
        if($_SERVER['REQUEST_METHOD'] === 'GET') {
            $idUsuario = $_SESSION['id'] ?? null;
            $usuario = Usuario::find($idUsuario);

            // Traernos las transacciones del usuario
            $transaccionesTotales = Transaccion::belongsTo('propietario_id', $idUsuario);

            // Obtener todos los apartados que sean de ese usuario
            $apartadosTotales = Apartado::belongsTo('propietario_id', $idUsuario);

            // Obtener los abonos de los apartados
            $abonosTotales = Abono::belongsTo('propietario_id', $idUsuario);

            // Traemos el saldo del usuario
            $saldo = $usuario->saldo ?? 0;

            echo json_encode([
                'usuario' => $idUsuario, 
                'apartados' => $apartadosTotales, 
                'transacciones' => $transaccionesTotales,
                'saldo' => $saldo,
                'abonos' => $abonosTotales
            ]);
        }
    }

    // Función principal para la vista de soporte  
    public static function soporte(Router $router) {
        session_start(); // Iniciamos la sesión
        \isAuth(); // Protejemos la sesión con la vista
        // Renderizar la vista
        $router->render('dashboard/soporte', [
            'titulo' => 'Soporte',
        ]);
    }
}