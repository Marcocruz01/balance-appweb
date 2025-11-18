<?php

namespace Controllers;

use MVC\Router;
use Model\Apartado;

class ApartadoController {

    // Renderiza la vista del apartado
    public static function vista(Router $router) {
        session_start();
        \isAuth();

        // Obtenemos el uid y la session
        $uuid = $_GET['uid'] ?? null;
        $usuario_id = $_SESSION['id'] ?? null;

        if(!$uuid || !$usuario_id) {
            header('Location: /');
            return;
        }

        // Obtenemos el apartado referente al uid del apartado que se dio click
        $apartado = Apartado::where('uuid', $uuid);

        if (!$apartado || $apartado->propietario_id !== $usuario_id) {
            header('Location: /');
            return;
        }

        $router->render('dashboard/abonos', [
            'titulo' => 'Ahorros',
            'uuid' => $uuid,
            'apartado' => $apartado
        ]);
    }
}
