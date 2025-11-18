<?php 

namespace Model;

class Transaccion extends ActiveRecord {
    protected static $tabla = 'transacciones';
    protected static $columnasDB = ['id', 'monto', 'fecha', 'descripcion', 'tipo', 'metodo_pago', 'categoria_id', 'propietario_id'];

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->monto = $args['monto'] ?? '';
        $fecha = new \DateTime('now', new \DateTimeZone('America/Mexico_City'));
        $this->fecha = $args['fecha'] ?? $fecha->format('Y-m-d H:i:s');
        $this->descripcion = $args['descripcion'] ?? '';
        $this->tipo = $args['tipo'] ?? null;
        $this->metodo_pago = $args['metodo_pago'] ?? '';
        $this->categoria_id = $args['categoria_id'] ?? '';
        $this->propietario_id= $args['propietario_id'] ?? null;
    }

    // Settear el propietario_id antes de guardar la categoría
    public function propietarioId($propietario_id) {
        $this->propietario_id = $propietario_id;
    }
}