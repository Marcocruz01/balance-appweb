<?php

namespace Controllers;

use MVC\Router;
use Classes\Email;
use Model\Usuario;

class AuthController {

    
    // Función que valida credenciales, autentica al usuario y crea la sesión.
    public static function login(Router $router) {
        // Instanciar el modelo de usuario 
        $usuario = new Usuario;

        if( $_SERVER['REQUEST_METHOD'] === 'POST') {
            // Procesar los datos enviados.
            $usuario->sincronizar($_POST); // Sincronizamos los datos del formulario
            $alertas = $usuario->validar_sesion(); // Validacion de la sesión en el formulario
            if(empty($alertas)) {
                $usuario = Usuario::where('email', $usuario->email); // Buscamos al usuario con las credenciales ingresadas
                if(!$usuario || !$usuario->confirmado) {
                    Usuario::setAlerta('error', 'La cuenta no ha sido confirmada o no existe en el sistema.'); // Mostrar alerta al usuario 
                } else {
                    if(password_verify($_POST['password'], $usuario->password)) { // Validar la credencial del usuario 
                        session_start(); // Arrancamos la sesión del usuario
                        $_SESSION['id'] = $usuario->id;
                        $_SESSION['nombre'] = $usuario->nombre;
                        $_SESSION['apellido'] = $usuario->apellido;
                        $_SESSION['email'] = $usuario->email;
                        $_SESSION['saldo'] = $usuario->saldo;
                        $_SESSION['plan'] = $usuario->plan;
                        $_SESSION['imagen'] = $usuario->imagen;
                        $_SESSION['login'] = true;
                        // \debuguear($_SESSION);
                        header('Location: /'); // Redirigir al usuario a la página inicial de la app
                        
                    } else {
                        Usuario::setAlerta('error', 'No se pudo iniciar sesión; verifica tus datos.'); // Mostrar la alerta al usuario
                    }
                }
            } 
        }

        $alertas = Usuario::getAlertas();

        // Renderizar la vista
        $router->render('auth/login', [
            'titulo' => 'Iniciar sesión',
            'usuario' => $usuario,
            'alertas' => $alertas
        ]);
    }

    // Función que redirige al usuario de vuelta al formulario de login.
    public static function logout() {
        // Cerrar sesión y redirigir.
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Procesar los datos enviados.
            session_start(); 
            $_SESSION = []; // // Vaciar variables de sesión
            if (ini_get("session.use_cookies")) { // Destruir la cookie de sesión
                $params = session_get_cookie_params();
                setcookie(session_name(), '', time() - 42000,
                    $params["path"], $params["domain"],
                    $params["secure"], $params["httponly"]
                );
            }
            session_destroy(); // Destruir la sesión
            header('Location: /login'); // Redirigir
            exit;
        }
    }

    // Función que valida los datos, crea la cuenta y registra al usuario en la BD.
    public static function crear(Router $router) {
        // Instanciar el modelo de usuario 
        $usuario = new Usuario;

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Procesar los datos enviados.
            $usuario->sincronizar($_POST); // Sincronizamos los datos del formulario
            $alertas = $usuario->validar_cuenta_nueva(); // Validacion de los campos del formulario
            if(empty($alertas)) { // Si ya no hay alertas y todos los campos llenos hacer otra comprobación
                $existeUsuario = Usuario::where('email', $usuario->email); // Validar que no exista el usuario para poder registrarlo
                if($existeUsuario) {
                    Usuario::setAlerta('error', 'El usuario ya está registrado en el sistema.');
                } else { 
                    // Registramos al nuevo usuario si no esta registrado y todo este bien 
                    $usuario->hashPassword(); // Hasheamos el password del usuario
                    unset($usuario->password_repeat); // Eliminamos el campo de repetir contraseña
                    $usuario->token(); // Generamos un token unico para la creación de la cuenta
                    $resultado = $usuario->guardar(); // Creamos el nuevo usuario y lo registramos en la DB
                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token); // Creamos una nueva instancia de Email y pasarle parametros
                    $email->enviar_confirmacion(); // Enviamos el correo eléctronico para confirmar la cuenta
                    if($resultado) {
                        header('Location: /mensaje'); // Redirijimos a la vista mensaje
                    }
                }
            } 
        }

        $alertas = Usuario::getAlertas();

        // Renderizar la vista
        $router->render('auth/crear-cuenta', [
            'titulo' => 'Crear cuenta',
            'usuario' => $usuario,
            'alertas' => $alertas,
        ]);
    }

    // Función que genera un token único para el restablecimiento de la contraseña.
    public static function olvide(Router $router) {
        // Instanciar el modelo de usuario 
        $usuario = new Usuario;

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Procesar los datos enviados.
            $usuario->sincronizar($_POST); // Sincronizamos los datos del formulario
            $alertas = $usuario->validar_email(); // Validacion del email / correo eléctronico
            if(empty($alertas)) { // Si ya no hay alertas y todos los campos llenos hacer otra comprobación 
                $usuario = Usuario::where('email', $usuario->email); // Buscar al usuario con el email introducido en el formulario 
                if($usuario && $usuario->confirmado) {
                    $usuario->token(); // Generamos un token dinamico
                    unset($usuario->password_repeat); // Eliminamos el password repeat
                    $resultado = $usuario->guardar(); // Creamos el nuevo usuario y lo registramos en la DB
                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token); // Creamos una nueva instancia de Email y pasarle parametros
                    $email->enviar_instrucciones(); // Enviamos el correo eléctronico para confirmar la cuenta
                    if($resultado) {
                        Usuario::setAlerta('success', 'Se ha enviado la petición; revisa tu bandeja de entrada para seguir las instrucciones y restablecer tu contraseña.');
                    }
                } else {
                    Usuario::setAlerta('error', 'El usuario no está confirmado o no existe en el sistema.'); // Mostrar mensaje de error si no existe el usuario
                }
            }
        }
        
        $alertas = Usuario::getAlertas();

        // Renderizar la vista
        $router->render('auth/olvide-password', [
            'titulo' => 'Olvide mi contraseña',
            'alertas' => $alertas
        ]);
    }

    // Función que guarda la nueva contraseña en la BD.
    public static function restablecer(Router $router) {
        $token = s($_GET['token']); // Escapamos el token de la url
        $token_valido = true;
        if (!$token) header('Location: /404'); // Si no hay token redireccionar al usuario
        $usuario = Usuario::where('token', $token); // Buscamos al usuario por medio del token recibido en la url
        if(empty($usuario)) {
            Usuario::setAlerta('error', 'El usuario no existe en el sistema o el token es inválido.'); // Mostrar mensaje de error si no existe el usuario
            $token_valido = false;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Procesar los datos enviados.
            $usuario->sincronizar($_POST); // Sincronizamos los datos del formulario
            $usuario->validar_credenciales(); // Hacemos la validación de las credenciales del usuario 
            $alertas = Usuario::getAlertas();
            if(empty($alertas)) {
                $usuario->hashPassword(); // Hasheamos el password del usuario
                unset($usuario->password_repeat); // Eliminamos el campo de repetir contraseña
                $usuario->token = ''; // Dejamos en blanco el token
                $resultado = $usuario->guardar(); // Creamos el nuevo usuario y lo registramos en la DB
                if($resultado) {
                    Usuario::setAlerta('success', 'Se actualizó correctamente su nueva contraseña; disfrute de nuevo de los beneficios de nuestra app.'); // Mostramos la alerta
                    $redirigir = true;
                }
            }
        }

        $alertas = Usuario::getAlertas();

        // Renderizar la vista
        $router->render('auth/restablecer-password', [
            'titulo' => 'Restablece tu contraseña',
            'alertas' => $alertas,
            'token_valido' => $token_valido,
            'redirigir' =>  $redirigir ?? false,
        ]);
    }

    // Función que valida los datos recibidos para confirmar la cuenta del usuario.
    public static function confirmar(Router $router) {
        // Procesar los datos enviados.
        $token = s($_GET['token']); // Escapamos el token de la url
        if (!$token) header('Location: /404'); // Si no hay token redireccionar al usuario
        $usuario = Usuario::where('token', $token); // Buscamos al usuario por medio del token recibido en la url
        if(empty($usuario)) { // Si no se encontro hacer la validación
            if (!$token || !$usuario) header('Location: /404'); // Si no hay token redireccionar al usuario
        } else {
            // Si se encontro al usuario 
            $usuario->confirmado = 1; // Confirmamos la cuenta
            $usuario->token = null; // Hacemos null el token temporal
            unset($usuario->password_repeat); // Eliminamos el password_repeat
            $usuario->guardar(); // Guardamos la nueva cuenta en la base de datos confirmada

            // Renderizar la vista de confirmación con tu HTML
            $router->render('auth/confirmar-cuenta', [
                'titulo' => 'Cuenta confirmada',
                'alertas' => $alertas
            ]);
        }
    }

    // Función para procesar y personalizar los mensajes 
    public static function mensaje(Router $router) {
        // Renderizar la vista
        $router->render('auth/mensaje', [
            'titulo' => 'Mensaje'
        ]);
    }

    // Función para mostrar la página 404 not found
    public static function paginaNoEncontrada(Router $router) {
        // Renderizar la vista
        $router->render('auth/404', [
            'titulo' => 'Página no encontrada'
        ]);
    }
}