<?php

namespace Model;

use Model\Abono;
use Model\Transaccion;

class Usuario extends ActiveRecord {

    protected static $tabla = 'usuarios';
    protected static $columnasDB = ['id', 'nombre', 'apellido', 'email', 'password', 'imagen', 'saldo', 'plan', 'token', 'confirmado'];

     public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->apellido = $args['apellido'] ?? '';
        $this->email = $args['email'] ?? '';
        $this->password = $args['password'] ?? '';
        $this->imagen = $args['imagen'] ?? '';
        $this->password_repeat = $args['password_repeat'] ?? '';
        $this->password_current = $args['password_current'] ?? '';
        $this->new_password = $args['new_password'] ?? '';
        $this->repeat_new_password = $args['repeat_new_password'] ?? '';
        $this->saldo = $args['saldo'] ?? '0.00';
        $this->plan = $args['plan'] ?? 'gratis';
        $this->token = $args['token'] ?? '';
        $this->confirmado = $args['confirmado'] ?? 0;
    }

    public function setImagen($imagen) {
        // Ruta absoluta a la carpeta de imágenes
        $carpeta_imagen = __DIR__ . '/../public/dist/img/perfil/';

        // Si el usuario ya tiene una imagen previa, la eliminamos
        if($this->id && $this->imagen) {
            $rutaImagenAnterior = $carpeta_imagen . $this->imagen;

            if(file_exists($rutaImagenAnterior)) {
                unlink($rutaImagenAnterior);
            }
        }
        // Asignamos la nueva imagen
        if($imagen) {
            $this->imagen = $imagen;
        }
    }

    // Validacion para cuentas nuevas
    public function validar_cuenta_nueva() {
        self::$alertas = []; // reiniciar para evitar que se acumulen
        
        // 1. Validar campos vacíos
        if(!$this->nombre || !$this->apellido || !$this->email || !$this->password || !$this->password_repeat) {
            // Mostramos las alertas
            self::$alertas['error'][] = 'Asegurate de completar todos los campos';

        // 2. Validar email solo si todos los campos están llenos
        } elseif(!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            // Mostramos las alertas
            self::$alertas['error'][] = 'El email no es válido';

        // 3. Validar contraseña solo si email es válido
        } elseif(strlen($this->password) < 6) {
            // Mostramos las alertas
            self::$alertas['error'][] = "La contraseña debe tener al menos 6 caracteres";
        }

        // 4. Validar coincidencia de contraseñas
        if($this->password !== $this->password_repeat) {
            self::$alertas['error'][] = "Las contraseñas no coinciden";
        }

        // 5. Retornamos las alertas
        return self::$alertas;
    }

    // Validación de el campo email / correo eléctronico
    public function validar_email() {
        self::$alertas = []; // reiniciar para evitar que se acumulen

        // 1. Validar el campo de correo eléctronico 
        if(!$this->email) {
            // Mostramos las alertas
            self::$alertas['error'][] = 'Asegurate de completar todos los campos';
        }

        // 2. Retornamos las alertas
        return self::$alertas;
    }

    // Validar formulario de restablecer contraseñas
    public function validar_credenciales() {
        self::$alertas = []; // reiniciar para evitar que se acumulen

        // 1. Validar campos vacíos
        if(!$this->password || !$this->password_repeat) {
            // Mostramos las alertas
            self::$alertas['error'][] = 'Asegurate de completar todos los campos';

        // 2. Validar longitud de la contraseña 
        } elseif(strlen($this->password) < 6) {
            // Mostramos las alertas
            self::$alertas['error'][] = "La contraseña debe tener al menos 6 caracteres";
        }

        // 3. Validar que las credenciales empaten
        if($this->password !== $this->password_repeat) {
            self::$alertas['error'][] = "Las contraseñas no coinciden";
        }

        // 4. Retornamos las alertas
        return self::$alertas;
    }

    // Validar el inicio de sesión
    public function validar_sesion() {
        self::$alertas = []; // reiniciar para evitar que se acumulen

        // 1. Validar campos vacíos
        if(!$this->email || !$this->password) {
            // Mostramos las alertas
            self::$alertas['error'][] = 'Asegurate de completar todos los campos';
        }

        // 2. Retornamos las alertas
        return self::$alertas;
    }

    // Validar campos de perfil
    public function validar_perfil() {
        self::$alertas = []; // reiniciar para evitar que se acumulen

        // 1. Validar campos vacíos
        if(!$this->nombre || !$this->apellido || !$this->email) {
            // Mostramos las alertas
            self::$alertas['error'][] = 'Asegurate de completar todos los campos';

        // 2. Validar email solo si todos los campos están llenos
        } elseif(!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            // Mostramos las alertas
            self::$alertas['error'][] = 'El email no es válido';
        }

        // 3. Retornamos las alertas
        return self::$alertas;
    }

    // Funcion para comprobar si el password es correcto
    public function validar_credenciales_perfil() {
        self::$alertas = []; // reiniciar para evitar que se acumulen

        // 1. Validar campos vacíos
        if(!$this->password_current || !$this->new_password || !$this->repeat_new_password) {
            // Mostramos las alertas
            self::$alertas['error'][] = 'Asegurate de completar todos los campos';

        // 2. Validar longitud de la nueva contraseña 
        } elseif(strlen($this->new_password) < 6) {
            // Mostramos las alertas
            self::$alertas['error'][] = "La nueva contraseña debe tener al menos 6 caracteres";
        }

        // 3. Validar que las nuevas contraseñas empaten
        if($this->new_password !== $this->repeat_new_password) {
            self::$alertas['error'][] = "Las nuevas contraseñas no coinciden";
        }

        // 4. Retornamos las alertas
        return self::$alertas;
    }

    // Función para recalcular el saldo de un usuario cada vez que haga una acción
    public function recalcularSaldo() {
        $ingresos = Transaccion::whereAll([
            'propietario_id' => $this->id,
            'tipo' => 'ingreso'
        ]);

        $gastos = Transaccion::whereAll([
            'propietario_id' => $this->id,
            'tipo' => 'gasto'
        ]);

        $abonos = Abono::whereAll([
            'propietario_id' => $this->id
        ]);

        $totalIngresos = array_sum(array_map(fn($i) => floatval($i->monto), $ingresos));
        $totalGastos   = array_sum(array_map(fn($g) => floatval($g->monto), $gastos));
        $totalAbonos = array_sum(array_map(fn($a) => floatval($a->monto), $abonos));
        
        $this->saldo = $totalIngresos - $totalGastos - $totalAbonos;
        $this->guardar();

        $_SESSION['saldo'] = $this->saldo;
        return $this->saldo;
    }

    // Función para comprobar que el password actual es correcto
    public function comprobar_password() {
        return password_verify($this->password_current, $this->password); // Comprobar que la contraseña actual es correcta
    } 

    // Función para hashear los passwords
    public function hashPassword() {
        $this->password = password_hash($this->password, PASSWORD_BCRYPT); // Hashear la contraseña con el metodo de php PASSWORDBCRYPT
    }

    // Función que genera tokens
    public function token() {
        $this->token = uniqId();
    }
}