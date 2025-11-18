<?php 

namespace Model;

/**
* Clase Base ActiveRecord
* 
* Implementa un patrón Active Record para CRUD y consultas básicas
* en una tabla de base de datos usando MySQLi.
*/

class ActiveRecord {
    // ---------------------------
    // PROPIEDADES
    // ---------------------------
    public $id;

    // Base de datos
    protected static $db;
    protected static $tabla = '';
    protected static $columnasDB = [];

    // Alertas y mensajes de validación
    protected static $alertas = [];

    // ---------------------------
    // MÉTODOS DE CONFIGURACIÓN
    // ---------------------------

    /**
    * Define la conexión a la base de datos
    */
    public static function setDB($database) {
        self::$db = $database;
    }

    /**
    * Agrega una alerta o mensaje
    */
    public static function setAlerta($tipo, $mensaje) {
        static::$alertas[$tipo][] = $mensaje;
    }

    /**
    * Obtiene todas las alertas
    */
    public static function getAlertas() {
        return static::$alertas;
    }

    /**
    * Validación base
    */
    public function validar() {
        static::$alertas = [];
        return static::$alertas;
    }

    // ---------------------------
    // MÉTODOS CRUD
    // ---------------------------

    /**
    * Guarda el registro: crea o actualiza según exista el ID
    */
    public function guardar() {
        return is_null($this->id) ? $this->crear() : $this->actualizar();
    }

    /**
    * Crea un nuevo registro en la base de datos
    */
    public function crear() {
        $atributos = $this->sanitizarAtributos();

        $query = "INSERT INTO " . static::$tabla . " (" 
               . join(', ', array_keys($atributos)) . ") VALUES ('" 
               . join("', '", array_values($atributos)) . "')";

        $resultado = self::$db->query($query);

        // Asignamos el id generado por la DB al objeto
        $this->id = self::$db->insert_id;

        return [
            'resultado' => $resultado,
            'id' => $this->id
        ];
    }

    /**
    * Actualiza un registro existente
    */
    public function actualizar() {
        $atributos = $this->sanitizarAtributos();

        $valores = [];
        foreach ($atributos as $key => $value) {
            $valores[] = "{$key}='{$value}'";
        }

        $query = "UPDATE " . static::$tabla . " SET "
               . join(', ', $valores)
               . " WHERE id = '" . self::$db->escape_string($this->id) . "' LIMIT 1";

        return self::$db->query($query);
    }

    /**
    * Elimina un registro por ID
    */
    public function eliminar() {
        $query = "DELETE FROM " . static::$tabla . " WHERE id = '" 
               . self::$db->escape_string($this->id) . "' LIMIT 1";
        return self::$db->query($query);
    }

    // ---------------------------
    // MÉTODOS DE CONSULTA
    // ---------------------------

    /**
    * Obtiene todos los registros
    */
    public static function all() {
        return self::consultarSQL("SELECT * FROM " . static::$tabla);
    }

    /**
    * Busca un registro por ID
    */
    public static function find($id) {
        $resultado = self::consultarSQL("SELECT * FROM " . static::$tabla . " WHERE id = {$id}");
        return array_shift($resultado);
    }

    /**
    * Obtiene un número limitado de registros
    */
    public static function get($limite) {
        $resultado = self::consultarSQL("SELECT * FROM " . static::$tabla . " LIMIT {$limite}");
        return $resultado;
    }

    /**
    * Consulta por columna específica y devuelve el primer resultado
    */
    public static function where($columna, $valor) {
        $resultado = self::consultarSQL("SELECT * FROM " . static::$tabla . " WHERE {$columna} = '{$valor}'");
        return array_shift($resultado);
    }

    /**
    * Consulta por columna específica y devuelve todos los resultados
    */
    public static function whereAll($filtros = []) {
        $query = "SELECT * FROM " . static::$tabla . " WHERE 1=1 ";
        foreach ($filtros as $campo => $valor) {
            $query .= "AND {$campo} = '{$valor}' ";
        }
        return self::consultarSQL($query);
    }

    /**
    * Consulta por columna específica y devuelve todos los resultados
    */
    public static function belongsTo($columna, $valor) {
        return self::consultarSQL("SELECT * FROM " . static::$tabla . " WHERE {$columna} = '{$valor}'");
    }

    /**
    * Ejecuta consultas SQL personalizadas
    */
    public static function SQL($consulta) {
        return self::consultarSQL($consulta);
    }

    // ---------------------------
    // MÉTODOS AUXILIARES
    // ---------------------------

    /**
    * Ejecuta la consulta SQL y devuelve objetos
    */
    public static function consultarSQL($query) {
        $resultado = self::$db->query($query);
        $array = [];

        while ($registro = $resultado->fetch_assoc()) {
            $array[] = static::crearObjeto($registro);
        }

        $resultado->free();
        return $array;
    }

    /**
    * Crea un objeto del registro de la base de datos
    */
    protected static function crearObjeto($registro) {
        $objeto = new static;
        foreach ($registro as $key => $value) {
            if (property_exists($objeto, $key)) {
                $objeto->$key = $value;
            }
        }
        return $objeto;
    }

    /**
    * Devuelve los atributos definidos en columnasDB
    */
    public function atributos() {
        $atributos = [];
        foreach (static::$columnasDB as $columna) {
            if ($columna === 'id') continue;
            $atributos[$columna] = $this->$columna;
        }
        return $atributos;
    }

    /**
    * Sanitiza los atributos para evitar inyección SQL
    */
    public function sanitizarAtributos() {
        $atributos = $this->atributos();
        $sanitizado = [];
        foreach ($atributos as $key => $value) {
            $sanitizado[$key] = self::$db->escape_string($value);
        }
        return $sanitizado;
    }
    
    /**
    * Sincroniza atributos del objeto con un array de datos
    */
    public function sincronizar($args = []) {
        foreach ($args as $key => $value) {
            if (property_exists($this, $key) && !is_null($value)) {
                $this->$key = $value;
            }
        }
    }
}
?>