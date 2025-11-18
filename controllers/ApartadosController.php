<?php 

namespace Controllers;

use MVC\Router;
use Model\Abono;
use Model\Usuario;
use Model\Apartado;
use Ramsey\Uuid\Uuid;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager as Image;


class ApartadosController {
    
    // Función principal para la vista de presupuestos 
    public static function apartados(Router $router) {
        session_start(); // Iniciamos la sesión
        \isAuth(); // Protejemos la sesión con la vista
        // Renderizar la vista
        $router->render('dashboard/apartados', [
            'titulo' => 'Mis apartados',
        ]);
    }

    // Funcion para agregar los apartados a la base de datos
    public static function crear(Router $router) {
        session_start(); // Iniciamos la sesión
        \isAuth(); // Protejemos la sesión con la vista

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Instanciamos el modelo de apartado
            $apartado = new Apartado();
            // Procesar los datos enviados.
            $apartado->sincronizar($_POST); // Sincronizamos los datos del formulario

            // Generar UUID
            $uuid = Uuid::uuid4()->toString();
            
            // Asignar al modelo
            $apartado->setUUID($uuid);

            // Seteamos al usuario quien creo el apartado
            $apartado->propietarioId($_SESSION['id']);

            // Generar un nombre unico 
            $nombre_imagen = md5(uniqid(rand(), true)) . '.jpg';

            // Leemos la imagen si existe
            if(!empty($_FILES['imagen']['tmp_name'])) {
                // Procesamos la nueva imagen 
                $manager = new Image(Driver::class);
                $imagen = $manager->read($_FILES['imagen']['tmp_name'])->cover(800, 600);
                // setearle el nombre
                $apartado->setImagen($nombre_imagen);

                // Directorio o ruta 
                $carpeta_imagenes = __DIR__ . '/../public/dist/img/apartados/';  
                if(!is_dir($carpeta_imagenes)) {
                    mkdir($carpeta_imagenes, 0755, true); // SI no existe la creamos
                }

                // Almacenamos / guardamos la imagen en la carpeta
                $imagen->save($carpeta_imagenes . $nombre_imagen, quality: 90);
            }
        
            // Guardamos el apartado en la BD
            $resultado = $apartado->guardar();
            
            if($resultado) {
                // Enviamos la respuesta
                $respuesta = [
                    'tipo' => 'exito',
                    'apartado' => $apartado
                ];
            }
            echo json_encode($respuesta);
        }
    }

    // Funcion para listar los apartados en la vista
    public static function listar() {
        if($_SERVER['REQUEST_METHOD'] === 'GET') {
            session_start(); // Iniciamos la sesión
            \isAuth(); // Protejemos la sesión con la vista
            $usuario_id = $_SESSION['id']; // Obtenemos el id de la session 
            $apartado = Apartado::belongsTo('propietario_id', $usuario_id);
            echo json_encode(['apartado' => $apartado]);
        }
    }

    // Funcion para actualizar los apartados 
    public static function actualizar(Router $router, $id) {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            session_start(); // Iniciamos la sesión
            \isAuth(); // Protejemos la sesión con la vista    
            // Buscar el apartado existente a editar
            $apartado = Apartado::find($id);
            $imagenAnterior = $apartado->imagen; // Guardamos la imagen anterior

            // Sincornizamos los campos del formulario 
            $apartado->sincronizar($_POST);

            // Verificar si se subio una nueva imagen 
            if(!empty($_FILES['imagen']['tmp_name'])) {
                // Generamos un nombre unico 
                $nombre_imagen = md5(uniqid(rand(), true)) . '.jpg';

                // Procesamos la nueva imagen 
                $manager = new Image(Driver::class);
                $imagen = $manager->read($_FILES['imagen']['tmp_name'])->cover(800, 600);

                // Creamos la carpeta si no existe
                $carpeta_imagen = __DIR__ . '/../public/dist/img/apartados/';
                if(!is_dir($carpeta_imagen)) {
                    mkdir($carpeta_imagen, 0755, true);
                }

                // Si el apartado ya tenia una imagen eliminarla 
                if ($apartado->imagen && file_exists($carpeta_imagen . $apartado->imagen)) {
                    unlink($carpeta_imagen . $apartado->imagen);
                }

                // Asignamos un nuevo nombre y guardamos la nueva imagen
                $apartado->setImagen($nombre_imagen);
                $imagen->save($carpeta_imagen . $nombre_imagen, quality: 90);
            } else {
                // Si no se subió nueva imagen, mantener la anterior
                $apartado->setImagen($imagenAnterior);
            }

            // Guardamos cambios en la base de datos
            $resultado = $apartado->actualizar();

            if($resultado) {
                // Enviamos la respuesta
                echo json_encode([
                    'tipo' => 'exito',
                    'apartado' => $apartado
                ]);
            }
        }
    }

    // Funcion para elimnar los apartados de la base de datos
    public static function eliminar(Router $router, $id) {
        if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
            session_start();
            \isAuth();
            // Buscamos el usuario autenticado
            $usuario_id = $_SESSION['id'] ?? null;
            $usuario = Usuario::find($usuario_id); 

            // Buscar el apartado a eliminar
            $apartado = Apartado::find($id);   

            // Ruta donde están guardadas las imágenes
            $carpeta_imagen = __DIR__ . '/../public/dist/img/apartados/';
            // Verificar si tiene imagen asociada
            if(!empty($apartado->imagen)) {
                $ruta_imagen = $carpeta_imagen . $apartado->imagen;

                // Si el archivo existe, se elimina
                if(file_exists($ruta_imagen)) {
                    unlink($ruta_imagen);
                }
            }
            // Eliminar el apartado
            $resultado = $apartado->eliminar();
            if($resultado) {
                // Recalcular saldo actual
                if ($usuario) {
                    $saldo = $usuario->recalcularSaldo();
                }
                // Enviar ambas cosas al cliente
                echo json_encode(['tipo' => 'exito']);
            }
        }
    }
}                                                                                                                                                                                   