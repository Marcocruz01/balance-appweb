<?php

namespace Model;

class Categoria extends ActiveRecord {

    protected static $tabla = 'categorias';
    protected static $columnasDB = ['id', 'nombre', 'tipo', 'propietario_id'];

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->tipo = $args['tipo'] ?? '';
        $this->propietario_id = $args['propietario_id'] ?? null;
    }

    // Settear el propietario_id antes de guardar la categoría
    public function propietarioId($propietario_id) {
        $this->propietario_id = $propietario_id;
    }
}