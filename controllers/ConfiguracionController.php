<?php 

namespace Controllers;

use MVC\Router;
use Model\Usuario;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager as Image;

class ConfiguracionController {

    // Función principal para la vista de configuración
    public static function configuracion(Router $router) {
        session_start(); // Iniciamos la sesión
        \isAuth(); // Protejemos la sesión con la vista
        $usuario = Usuario::find($_SESSION['id']); // Buscamos el usuario en la base de datos por su id
        // Renderizar la vista
        $router->render('dashboard/configuracion', [
            'titulo' => 'Configuracion',
            'usuario' => $usuario,
        ]);
    }

    // Función principal para la vista de configuración
    public static function perfil(Router $router) {
        session_start(); // Iniciamos la sesión
        \isAuth(); // Protejemos la sesión con la vista
        $alertas = []; // Inicializamos el array de alertas
        $usuario = Usuario::find($_SESSION['id']); // Buscamos el usuario en la base de datos por su id

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuario->sincronizar($_POST); // Sincronizamos los datos del usuario con los datos del formulario
            $alertas = $usuario->validar_perfil(); // Validamos los datos del formulario

            if(empty($alertas)) {
                $existeUsuario = Usuario::where('email', $usuario->email); // Buscamos si el email ya existe en la base de datos
                if($existeUsuario && $existeUsuario->id !== $usuario->id) { // Si el email ya existe y el usuario es diferente al que esta autenticado
                    // Mostrar error si el email ya existe y no es el mismo usuario
                    Usuario::setAlerta('error', 'El email ya está en uso por otro usuario, intenta con otro');
                } else {
                    $usuario->guardar(); // Guardamos los cambios en la base de datos
                    // Asignar el nombre nuevo a la sesión
                    $_SESSION['nombre'] = $usuario->nombre;
                    $_SESSION['apellido'] = $usuario->apellido;
                    $_SESSION['email'] = $usuario->email;
                    Usuario::setAlerta('success', 'Los cambios se han guardado correctamente'); // Si no hay alertas, mostramos un mensaje de éxito
                }
            }
        }

        $alertas = Usuario::getAlertas();

        // Renderizar la vista
        $router->render('dashboard/configuracion', [
            'titulo' => 'Configuracion',
            'usuario' => $usuario,
            'alertas' => $alertas,
        ]);
    }

     // Funcion que le permite al usuario cambiar su foto de perfil
    public static function cambio_foto_perfil(Router $router) {
        session_start(); // Iniciamos la sesión
        \isAuth(); // Protejemos la sesión con la vista
        $alertas = []; // Inicializamos el array de alertas

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Instanciar el modelo del usuario
            $usuario = Usuario::find($_SESSION['id']); // Buscamos al usuario
            $usuario->sincronizar($_POST); // Sincronizamos los datos del usuario
            
            // Generar un nombre unico 
            $nombre_imagen = md5(uniqid(rand(), true)) . '.jpg';

            // Procesar imagen si se subió
            if(!empty($_FILES['imagen']['tmp_name'])) {
                $manager = new Image(Driver::class);
                $imagen = $manager->read($_FILES['imagen']['tmp_name'])->cover(800, 600);

                // Este método ahora elimina la anterior si existe
                $usuario->setImagen($nombre_imagen);

                // Crear carpeta si no existe
                $carpeta_imagen = __DIR__ . '/../public/dist/img/perfil/';
                if(!is_dir($carpeta_imagen)) {
                    mkdir($carpeta_imagen, 0755, true);
                }

                // Guardar imagen nueva
                $imagen->save($carpeta_imagen . $nombre_imagen, quality: 90);
            }
            
            // Guardamos el campo imagen en la referencia del modelo usuario 
            $resultado = $usuario->guardar();
            if($resultado) {
                $_SESSION['imagen'] = $usuario->imagen; // actualiza la imagen de la sesion
                echo json_encode(['tipo' => 'exito', 'usuario' => $usuario]);
            }
        }
    }

    // Función principal para la vista de cambiar password
    public static function cambiar_password(Router $router) {
        session_start(); // Iniciamos la sesión
        \isAuth(); // Protejemos la sesión con la vista
        $alertas = []; // Inicializamos el array de alertas

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuario = Usuario::find($_SESSION['id']); // Buscamos el usuario en la base de datos por su id
            $usuario->sincronizar($_POST); // Sincronizamos los datos del usuario con los datos del formulario
            $alertas = $usuario->validar_credenciales_perfil(); // Validamos los datos del formulario
            if(empty($alertas)) {
                $resultado = $usuario->comprobar_password(); // Comprobamos que la contraseña actual es correcta
                if($resultado) {
                    // Asignar la nueva contraseña
                    unset($usuario->password_current); // Eliminamos la propiedad password_current para que no se guarde en la base de datos
                    $usuario->password = $usuario->new_password; // Asignamos la nueva contraseña
                    unset($usuario->new_password); // Eliminamos la propiedad new_password para que no se guarde en la base de datos
                    unset($usuario->repeat_new_password); // Eliminamos la propiedad repeat_new_password para que no se guarde en la base de datos
                    // Hashear la nueva contraseña
                    $usuario->hashPassword();
                    // Guardar el nuevo password
                    $resultado = $usuario->guardar();
                    if($resultado) {
                        Usuario::setAlerta('success', 'Contraseña actualizada correctamente');
                    }
                } else {
                    Usuario::setAlerta('error', 'La contraseña actual es incorrecta');
                }
            }
        }
        $alertas = Usuario::getAlertas();

        // Renderizar la vista
        $router->render('dashboard/actualizar-password', [
            'titulo' => 'Credenciales',
            'alertas' => $alertas,
        ]);
    }
}
?>