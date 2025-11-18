<?php

namespace Model;

class Apartado extends ActiveRecord {
    protected static $tabla = 'apartados';
    protected static $columnasDB = ['id', 'nombre', 'descripcion', 'imagen', 'monto', 'saldo_actual', 'fecha', 'fecha_meta', 'estado', 'uuid', 'propietario_id'];

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? null;
        $this->descripcion = $args['descripcion'] ?? null;
        $this->imagen = $args['imagen'] ?? '';
        $this->monto = $args['monto'] ?? 0;
        $this->saldo_actual = $args['saldo_actual'] ?? 0;
        $fecha = new \DateTime('now', new \DateTimeZone('America/Mexico_City'));
        $this->fecha = $args['fecha'] ?? $fecha->format('Y-m-d H:i:s');
        $this->fecha_meta = $args['fecha_meta'] ?? null;
        $this->estado = $args['estado'] ?? 'activo';
        $this->uuid = $args['uuid'] ?? '';
        $this->propietario_id= $args['propietario_id'] ?? null;
    }

    // Settear el usuario_id antes de guardar la categoría
    public function propietarioId($propietario_id) {
        $this->propietario_id = $propietario_id;
    }

    // Asignar el uuid
    public function setUUID($uuid) {
        $this->uuid = $uuid;
    }

    public function setImagen($imagen) {
        // Elimina la imagen previa a su edición
        if($this->id) {
            // Comprobar si existe el archivo 
            $existeArchivo = file_exists($carpeta_imagen = __DIR__ . '/../public/dist/img/apartados/' . $this->imagen);
            if($existeArchivo) {
                unlink($carpeta_imagen = __DIR__ . '/../public/dist/img/apartados/' . $this->imagen);
            }
        }
        if($imagen) {
            $this->imagen = $imagen;
        }
    }
}