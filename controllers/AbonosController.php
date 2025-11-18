<?php

namespace Controllers;

use MVC\Router;
use Model\Abono;
use Model\Usuario;
use Model\Apartado;

class AbonosController {
    
    // Funcion del CRUD para crear el abono al apartado
    public static function crear(Router $router) {
        session_start(); // Iniciamos la sesión
        \isAuth(); // Protegemos la sesión con la vista

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Instanciamos el modelo de abono  
            $abono = new Abono();
            $abono->sincronizar($_POST); // Sincronizamos los datos del formulario

            // Obtenemos el ID del usuario autenticado desde la sesión
            $idUsuario = $_SESSION['id'] ?? null;
            if (!$idUsuario) hedaer('Location: /');

            // Consultamos al usuario en la base de datos
            $usuario = Usuario::find($idUsuario);
            if (!$usuario) header('Location: /');

            $apartado_id = $_POST['apartado_id']; // Obtenemos el apartado al cual estamos agregando el abono
            $apartado = Apartado::where('uuid', $apartado_id); // Buscamos el apartado
            
            // Validamos que apartado pertenezca al usuario que inicio sesión y exista el apartado
            if(!$apartado || $apartado->propietario_id !== $_SESSION['id']) {
                $respuesta = [
                    'tipo' => 'error',
                    'mensaje' => 'Hubo un error al agregar el abono, intenta más tarde.'
                ];
                echo json_encode($respuesta);
                return;
            } 

            // Validar que el saldo del usuario permita o sea mayor al monto que se agregara
            if ($abono->monto > $usuario->saldo) {
                $respuesta = [
                    'tipo' => 'error',
                    'mensaje' => 'Saldo insuficiente; aumenta tu saldo para poder ahorrar.',
                ];
                echo json_encode($respuesta);
                return;
            }   
            
            // Validar que el usuario no exceda la meta del apartado
            $totalDespuesDelAbono = $apartado->saldo_actual + $abono->monto;
            if($totalDespuesDelAbono > $apartado->monto) {
                $respuesta = [
                    'tipo' => 'error',
                    'mensaje' => 'El monto del abono excede la meta del apartado.',
                ];
                echo json_encode($respuesta);
                return;
            }

            // Guardamos el abono
            $abono->propietarioId($idUsuario);
            $abono->apartado_id = $apartado_id;
            $resultado = $abono->guardar();

            if($resultado) {
                // Actualizar el saldo del apartado
                $apartado->saldo_actual += $abono->monto;
                $apartado->guardar();

                // Recalcular saldo actual
                if($usuario) {
                    $saldo = $usuario->recalcularSaldo();
                }
                
                $respuesta = [
                    'tipo' => 'exito',
                    'abono' => $abono,
                    'saldo_actual' => $apartado->saldo_actual
                ];
            }
            echo json_encode($respuesta);
        }
    }

    // Funcion del CRUD para listar el abono al apartado
    public static function listar(Router $router) {
        session_start(); // Iniciamos la sesión
        \isAuth(); // Protejemos la sesión con la vista
        if($_SERVER['REQUEST_METHOD'] === 'GET') {
            // Obtener el UID desde la URL
            $uuid = $_GET['uid'] ?? null;
            if(!$uuid) header('Location: /');

            // Obtener los abonos asociados a ese apartado (usando el uuid)
            $abonos = Abono::belongsTo('apartado_id', $uuid);
            // Obtenemos el apartado referente al uid del apartado que se dio click
            $apartado = Apartado::where('uuid', $uuid);

            echo json_encode([
                'saldo_actual' => $apartado->saldo_actual,
                'abonos' => $abonos,
            ]);
        }
    }

    // Funcion del CRUD para actualzar el abono al apartado
    public static function actualizar(Router $router, $id) {
        session_start(); // Iniciamos la sesión
        \isAuth(); // Protejemos la sesión con la vista
        if($_SERVER['REQUEST_METHOD'] === 'PUT') { 
            // Buscamos el usuario autenticado
            $usuario_id = $_SESSION['id'] ?? null;
            $usuario = Usuario::find($usuario_id); 

            $data = json_decode(file_get_contents("php://input"), true); // Decodificamos el JSON recibido

            // Buscamos el abono a actualizar
            $abono = Abono::find($id);

            // Guardamos el monto anteriro para ajustar el saldo del apartado
            $montoAnterior = $abono->monto;
            
            // Sincornizamos los campos del formulario 
            $abono->sincronizar($data);
            // Guardamos el abono actualizado
            $resultado = $abono->guardar();

            if($resultado) {
                // Buscar el apartado asociado al abono
                $apartado_id = $data['apartado_id'] ?? null;
                $apartado = Apartado::where('uuid', $apartado_id);

                if ($apartado) {
                    // Recalcular el saldo actual
                    $diferencia = $abono->monto - $montoAnterior;
                    $apartado->saldo_actual += $diferencia;
                    $apartado->guardar();
                }

                // Recalcular saldo total del usuario
                if ($usuario) {
                    $usuario->recalcularSaldo();
                }

                // Enviamos la respuesta
                $respuesta = [
                    'tipo' => 'exito',
                    'abono' => $abono,
                    'saldo_actual' => $apartado->saldo_actual
                ];

                echo json_encode($respuesta);
            }
        }
    }

    // Funcion del CRUD para eliminar el abono al apartado
    public static function eliminar(Router $router, $id) {
        session_start(); // Iniciamos la sesión
        \isAuth(); // Protejemos la sesión con la vista
        if($_SERVER['REQUEST_METHOD'] === 'DELETE') {
            // Buscamos el usuario autenticado
            $usuario_id = $_SESSION['id'] ?? null;
            $usuario = Usuario::find($usuario_id); 

            // Buscamos el abono a eliminar
            $abono = Abono::find($id);

            $resultado = $abono->eliminar(); // Eliminamos el abono
            if($resultado) {
                // Buscar el apartado asociado al abono
                $apartado = Apartado::where('uuid', $abono->apartado_id);

                if ($apartado) {
                    // Recalcular el saldo actual
                    $apartado->saldo_actual -= $abono->monto;
                    $apartado->guardar();
                }

                // Recalcular saldo total del usuario
                if ($usuario) {
                    $usuario->recalcularSaldo();
                }

                echo json_encode([
                    'tipo' => 'exito',
                    'abono' => $abono,
                    'saldo_actual' => $apartado->saldo_actual
                ]);
            }
        }
    }
}