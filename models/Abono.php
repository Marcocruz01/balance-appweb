<?php

namespace Model;

class Abono extends ActiveRecord {
    protected static $tabla = 'abonos';
    protected static $columnasDB = ['id', 'monto', 'fecha', 'apartado_id', 'propietario_id'];

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->monto = $args['monto'] ?? 0;
        $fecha = new \DateTime('now', new \DateTimeZone('America/Mexico_City'));
        $this->fecha = $args['fecha'] ?? $fecha->format('Y-m-d H:i:s');
        $this->apartado_id = $args['apartado_id'] ?? '';
        $this->propietario_id= $args['propietario_id'] ?? null;
    }

    // Settear el propietario_id antes de guardar la categoría
    public function propietarioId($propietario_id) {
        $this->propietario_id = $propietario_id;
    }
}