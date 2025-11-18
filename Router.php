<?php

namespace MVC;

/**
 * Clase Router
 * 
 * Esta clase se encarga de gestionar el enrutamiento de la aplicación.
 * Permite registrar rutas GET y POST, comprobar la ruta actual y renderizar vistas.
*/
class Router {
    // Arreglos para almacenar las rutas registradas por método
    public array $getRoutes = [];
    public array $postRoutes = [];
    public array $putRoutes = [];
    public array $deleteRoutes = [];

    /**
     * Registra una ruta GET en el router
     * 
     * @param string $url URL de la ruta (ej. '/login')
     * @param callable $fn Función o método controlador asociado
    */
    public function get($url, $fn) {
        $this->getRoutes[$url] = $fn;
    }

    /**
     * Registra una ruta POST en el router
     * 
     * @param string $url URL de la ruta (ej. '/login')
     * @param callable $fn Función o método controlador asociado
    */
    public function post($url, $fn) {
        $this->postRoutes[$url] = $fn;
    }

    // Rutas PUT
    public function put($url, $fn) {
        $this->putRoutes[$url] = $fn;
    }

    // Rutas DELETE
    public function delete($url, $fn) {
        $this->deleteRoutes[$url] = $fn;
    }

    /**
     * Comprueba la ruta actual y ejecuta la función asociada
     * 
     * Determina la URL solicitada y el método HTTP usado (GET o POST).
     * Busca si la ruta está registrada y, si existe, llama a la función asociada.
    */
    // Comprobación de rutas
    public function comprobarRutas() {
        $currentUrl = strtok($_SERVER['REQUEST_URI'], '?') ?? '/';
        $method = $_SERVER['REQUEST_METHOD'];

        // Selecciona el arreglo de rutas según el método
        $routes = match ($method) {
            'GET' => $this->getRoutes,
            'POST' => $this->postRoutes,
            'PUT' => $this->putRoutes,
            'DELETE' => $this->deleteRoutes,
            default => []
        };

        foreach ($routes as $route => $handler) {
            // Convierte la ruta con parámetros (:id) en expresión regular
            $pattern = preg_replace('/:\w+/', '([^\/]+)', str_replace('/', '\/', $route));
            $regex = "/^$pattern$/";

            if (preg_match($regex, $currentUrl, $matches)) {
                array_shift($matches); // Elimina el match completo
                call_user_func($handler, $this, ...$matches);
                return;
            }
        }

        // Si no se encontró ninguna coincidencia
        echo "Página No Encontrada o Ruta no válida";
    }

    /**
     * Renderiza una vista dentro del layout principal
     * 
     * @param string $view Nombre del archivo de vista (ej. 'login')
     * @param array $datos Datos a pasar a la vista en forma de variables
    */
    // Renderizado de vistas
    public function render($view, $datos = []) {
        foreach ($datos as $key => $value) {
            $$key = $value;  
        }

        ob_start();
        include_once __DIR__ . "/views/$view.php";
        $contenido = ob_get_clean();
        include_once __DIR__ . '/views/layout.php';
    }
}
