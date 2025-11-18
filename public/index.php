<?php 

// Carga el archivo de configuración principal de la aplicación
require_once __DIR__ . '/../includes/app.php';

use MVC\Router; 
use Controllers\AuthController; 
use Controllers\AbonosController;
use Controllers\ApartadoController;
use Controllers\ApartadosController;
use Controllers\DashboardController;
use Controllers\CategoriasController;
use Controllers\ConfiguracionController;
use Controllers\TransaccionesController;

// Crea una nueva instancia del Router
$router = new Router();

/**
 * ======================
 * RUTAS DE AUTENTICACIÓN
 * ======================
*/

// INICIAR SESIÓN
$router->get('/login', [AuthController::class, 'login']);
$router->post('/login', [AuthController::class, 'login']);
// CERRAR SESIÓN
$router->get('/logout', [AuthController::class, 'logout']);
$router->post('/logout', [AuthController::class, 'logout']);
// CREAR CUENTA
$router->get('/crear-cuenta', [AuthController::class, 'crear']);
$router->post('/crear-cuenta', [AuthController::class, 'crear']);
// OLVIDÉ PASSWORD
$router->get('/olvide-password', [AuthController::class, 'olvide']);
$router->post('/olvide-password', [AuthController::class, 'olvide']);
// RESTABLECER PASSWORD
$router->get('/restablecer-password', [AuthController::class, 'restablecer']);
$router->post('/restablecer-password', [AuthController::class, 'restablecer']);
// CONFIRMAR CUENTA
$router->get('/confirmar-cuenta', [AuthController::class, 'confirmar']);
// MENSAJE DESPUÉS DE REGISTRO
$router->get('/mensaje', [AuthController::class, 'mensaje']);
// PÁGINA 404
$router->get('/404', [AuthController::class, 'paginaNoEncontrada']);

/**
 * ======================
 * RUTAS DEL DASHBOARD
 * ======================
*/

$router->get('/', [DashboardController::class, 'index']); // Página del ashboard  (GET))
$router->get('/api/datos', [DashboardController::class, 'datos']); // Obtener los datos (GET)

$router->get('/ingresos', [TransaccionesController::class, 'ingresos']); // Página de ingresos (GET)
$router->get('/gastos', [TransaccionesController::class, 'gastos']); // Página de gastos (GET)

$router->get('/apartados', [ApartadosController::class, 'apartados']); // Página de apartados (GET)

$router->get('/configuracion', [ConfiguracionController::class, 'configuracion']); // Página de configuracion (GET)
$router->post('/configuracion', [ConfiguracionController::class, 'perfil']); // Enviar datos del formulario de configuracion (POST)
$router->post('/api/perfil', [ConfiguracionController::class, 'cambio_foto_perfil']); // Cambiar la foto del perfil del usuario (POST)
$router->get('/configuracion/password', [ConfiguracionController::class, 'cambiar_password']); // Página de cambiar contraseña (GET)
$router->post('/configuracion/password', [ConfiguracionController::class, 'cambiar_password']); // Formulario para cambiar contraseña (POST)

$router->get('/soporte', [DashboardController::class, 'soporte']); // Página para ver soporte técnico
$router->post('/soporte', [DashboardController::class, 'soporte']); // Página para ver soporte técnico


/**
 * ======================
 * API: Categorías
 * ======================
*/

$router->post('/api/categorias', [CategoriasController::class, 'crear']); // Crear las categorias (POST)
$router->get('/api/categorias', [CategoriasController::class, 'listar']); // Mostrar las caterogias (GET)
$router->put('/api/categorias/:id', [CategoriasController::class, 'actualizar']); // Actualizar las categorias (PUT)
$router->delete('/api/categorias/:id', [CategoriasController::class, 'eliminar']); // Eliminar las categorias (DELETE)

/**
 * ======================
 * API: Transacciones (Unificado)
 * ======================
*/

// INGRESOS
$router->post('/api/ingresos', fn($r) => TransaccionesController::crear($r, 'ingreso')); // Crear los ingresos (POST)
$router->get('/api/ingresos/categorias', fn() => TransaccionesController::obtenerCategorias('ingreso')); // Obtener los ingresos del usuaraio (GET)
$router->get('/api/ingresos', fn() => TransaccionesController::listar('ingreso')); // Mostrar los ingresos (GET)
$router->put('/api/ingresos/:id', [TransaccionesController::class, 'actualizar']); // Actualizar los ingresos (PUT)
$router->delete('/api/ingresos/:id', [TransaccionesController::class, 'eliminar']); // Eliminar los ingresos (DELETE)

// GASTOS
$router->post('/api/gastos', fn($r) => TransaccionesController::crear($r, 'gasto')); // Crear los gastos (POST)
$router->get('/api/gastos/categorias', fn() => TransaccionesController::obtenerCategorias('gasto')); // Obtener los gastos del usuaraio (GET)
$router->get('/api/gastos', fn() => TransaccionesController::listar('gasto')); //  Mostrar los gastos (GET)
$router->put('/api/gastos/:id', [TransaccionesController::class, 'actualizar']); //  Actualizar los gastos (PUT)
$router->delete('/api/gastos/:id', [TransaccionesController::class, 'eliminar']); // Eliminar los gastos (DELETE)

/**
 * ======================
 * API: Apartados
 * ======================
*/

$router->post('/api/apartados', [ApartadosController::class, 'crear']);
$router->get('/api/apartados', [ApartadosController::class, 'listar']);
$router->post('/api/apartados/:id', [ApartadosController::class, 'actualizar']);
$router->delete('/api/apartados/:id', [ApartadosController::class, 'eliminar']);


/** 
 * ======================
 * Api: Apartado al que se ahorrará
 * =====================
*/

$router->get('/apartado', [ApartadoController::class, 'vista']);  // Para ver la vista individual del apartado
// =====================================================================================================================
$router->post('/api/abonos', [AbonosController::class, 'crear']); // Para obtener los datos de un apartado por API
$router->get('/api/abonos', [AbonosController::class, 'listar']); // Para obtener los datos de un apartado por API
$router->put('/api/abonos/:id', [AbonosController::class, 'actualizar']); // Para obtener los datos de un apartado por API
$router->delete('/api/abonos/:id', [AbonosController::class, 'eliminar']); // Para obtener los datos de un apartado por API

/**
 * ======================
 * EJECUTAR EL ROUTER
 * ======================
*/

// Comprueba la URL solicitada y el método HTTP,
// luego ejecuta el controlador correspondiente
$router->comprobarRutas();