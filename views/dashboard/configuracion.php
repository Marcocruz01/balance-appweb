<?php include_once __DIR__ . '/header-dashboard.php'; ?>
    <div class="max-w-7xl mx-auto flex flex-col gap-6 pt-10 md:pt-12 pb-4 px-2 md:px-4 lg:px-6">     
        <!-- Contenedor de cuenta y contraseña -->
        <div class="bg-white border border-gray-200 shadow-sm rounded-md p-6 dark:bg-neutral-900 dark:border-neutral-800">
            <!-- Título -->
            <div class="flex flex-col gap-1 pb-4 border-b border-gray-200 dark:border-neutral-800">
                <h2 class="flex items-center gap-2 text-2xl/7 font-bold text-gray-800 dark:text-neutral-50">
                    Cuenta y seguridad
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5 text-indigo-500 dark:text-indigo-600">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                </h2>
                <p class="text-gray-600 text-base/6 dark:text-neutral-400">Edite la información de perfil, contraseñas y preferencias de seguridad de su cuenta.</p>
            </div>
            <!-- Datos de la cuenta -->
            <div class="mt-5 lg:px-4">
                <!-- Foto del perfil de usuario -->
                <div class="col-span-full">
                    <p class="block text-lg/6 font-bold text-gray-900 dark:text-neutral-50">Perfil</p>
                    <div class="mt-2">
                        <div id="contenedor-imagen" class="flex gap-2 items-end">
                            <img src="dist/img/perfil/<?php echo !empty($_SESSION['imagen']) ? $_SESSION['imagen'] : 'logotipo.webp'; ?>" alt="foto de perfil" id="foto-perfil" class="w-20 h-20 rounded-full object-cover">
                            <!-- Botón para cambiar la foto de perfil -->
                            <button type="button" id="btn-subir-foto" class="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-neutral-800 dark:hover:bg-neutral-700" title="Cambiar foto de perfil">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-4 h-4 text-gray-700 dark:text-neutral-100">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <!-- Formulario para actualizar datos de la cuenta -->
                <div id="formulario-perfil" class="max-w-sm mt-3">
                    <form method="POST" action="/configuracion" class="w-full space-y-4">
                        <!-- Campos nombre y apellido -->
                        <div class="flex items-center gap-4">
                            <div class="w-full">
                                <label for="nombre" class="block text-sm/6 font-medium text-gray-900 dark:text-neutral-50">Nombre</label>
                                <div class="mt-2">
                                    <input type="text" id="nombre" placeholder="Actualiza tu nombre" name="nombre" value="<?php echo $usuario->nombre; ?>" class="text-zinc-900 bg-gray-50 border border-gray-200 w-full px-3 py-2 text-base placeholder:text-gray-500 rounded-md dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500 dark:text-neutral-50 disabled:bg-gray-100 dark:placeholder:text-neutral-500 disabled:text-gray-400 disabled:cursor-not-allowed dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500">
                                </div>
                            </div>
                            <div class="w-full">
                                <label for="apellido" class="block text-sm/6 font-medium text-gray-900 dark:text-neutral-50">Apellido</label>
                                <div class="mt-2">
                                    <input type="text" id="apellido" placeholder="Actualiza tu apellido" name="apellido" value="<?php echo $usuario->apellido; ?>" class="text-zinc-900 bg-gray-50 border border-gray-200 w-full px-3 py-2 text-base placeholder:text-gray-500 rounded-md dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500 dark:text-neutral-50 disabled:bg-gray-100 dark:placeholder:text-neutral-500 disabled:text-gray-400 disabled:cursor-not-allowed dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500">
                                </div>
                            </div>
                        </div>
                        <!-- Campo de email -->
                        <div>
                            <label for="email" class="block text-sm/6 font-medium text-gray-900 dark:text-neutral-50">Correo eléctronico</label>
                            <div class="mt-2">
                                <input type="email" id="email" placeholder="Actualiza tu correo eléctronico" name="email" value="<?php echo $usuario->email; ?>" class="text-zinc-900 bg-gray-50 border border-gray-200 w-full px-3 py-2 text-base placeholder:text-gray-500 rounded-md dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500 dark:text-neutral-50 disabled:bg-gray-100 dark:placeholder:text-neutral-500 disabled:text-gray-400 disabled:cursor-not-allowed dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500">
                            </div>
                        </div>
                        <!-- Botones de editar, guardar cambios y cancelar -->
                        <div class="flex items-center gap-3">
                            <!-- Contenedor para accionar la edicion -->
                            <div class="w-full" id="contenedor-editar">
                                <button type="button" class="w-full flex items-center justify-center gap-2 text-base font-semibold text-white bg-zinc-950 hover:bg-zinc-800 border border-zinc-950 px-3 py-2 rounded-md dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:border-indigo-600" id="btn-editar-perfil">
                                    Editar
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                    </svg>
                                </button>
                            </div>
                            <!-- Contenedor de modo edicion -->
                            <div id="contenedor-guardar-cambios" class="hidden flex-row gap-2 w-full">
                                <input type="submit" value="Guardar cambios" class="w-full flex items-center justify-center gap-2 text-base font-semibold text-white bg-zinc-950 hover:bg-zinc-800 border border-zinc-950 px-3 py-2 rounded-md cursor-pointer dark:bg-indigo-700 dark:hover:bg-indigo-600 dark:border-indigo-700">
                                <button type="button" id="btn-cancelar-cambios" class="w-full flex items-center justify-center gap-1 text-base font-semibold text-zinc-800 bg-transparent hover:bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-md dark:text-neutral-50 dark:hover:text-neutral-300 dark:hover:bg-transparent">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"stroke="currentColor" class="size-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                    Cancelar
                                </button>
                                <!-- Incluimos el archivo de las alertas -->
                                <?php include_once __DIR__ . '/../templates/alertas.php'; ?>
                                 <?php if (!empty($alertas['error'])) : ?>
                                    <script>
                                        // Si hubo errores, mantenemos el modo edición activo
                                        localStorage.setItem('modoEdicion', 'true');
                                    </script>
                                <?php elseif (!empty($alertas['success'])) : ?>
                                    <script>
                                        // Si hubo éxito, limpiamos el modo edición y cerramos
                                        localStorage.removeItem('modoEdicion');
                                    </script>
                                <?php endif; ?>
                            </div>
                        </div>
                    </form>
                    <div class="mt-5 flex flex-col gap-4 lg:gap-2">
                        <!-- Cambiar la contraseña -->
                        <a href="/configuracion/password" class="max-w-max font-medium text-blue-600 hover:text-blue-500 text-sm underline underline-offset-1">Actualizar mi contraseña →</a>
                        <!-- Cerrar la sesión -->
                        <form action="/logout" method="POST" class="w-full md:w-40">
                            <button type="submit" class="font-medium text-blue-600 hover:text-blue-500 text-sm underline underline-offset-1">Cerrar mi sesión →</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Preferencias del usuario -->
        <div class="bg-white border border-gray-200 shadow-sm rounded-md p-6 dark:bg-neutral-900 dark:border-neutral-800">
            <!-- Título -->
            <div class="flex flex-col gap-1 pb-4 border-b border-gray-200 dark:border-neutral-800">
                <h2 class="flex items-center gap-2 text-2xl/7 font-bold text-gray-800 dark:text-neutral-50">
                    Preferencias de usuario
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-indigo-600">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                    </svg>
                </h2>
                <p class="text-gray-600 dark:text-neutral-400 text-base/6">Ajusta tu experiencia en la app web, cambia de tema o establecelo como predeterminado.</p>
            </div>
            <!-- Personalización -->
            <div class="mt-5 lg:px-4">
                <div>
                    <h3 class="text-base/7 font-semibold text-gray-900 dark:text-neutral-300">Personalización</h3>
                    <p class="text-sm/6 text-gray-600 dark:text-neutral-400">Configura la apariencia de la aplicación y selecciona tus preferencias de visualización.</p>
                </div>
                <div class="mt-5 pb-7 border-b border-gray-200 dark:border-neutral-800">
                    <h3 class="text-sm/6 font-semibold text-gray-900 dark:text-neutral-300">Selecciona el tema</h3>
                    <div class="mt-5 flex flex-col md:flex-row items-start md:items-center justify-between md:justify-start gap-5">
                        <!-- Modo sistema -->
                        <label class="flex items-center gap-2 text-gray-600 cursor-pointer dark:text-neutral-400">
                            <input type="radio" name="tema" value="default" checked class="cursor-pointer">
                            <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 8.25V18a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 18V8.25m-18 0V6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6ZM7.5 6h.008v.008H7.5V6Zm2.25 0h.008v.008H9.75V6Z" />
                                </svg>
                                Sistema
                            </div>
                        </label>
                        <!-- Modo claro -->
                        <label class="flex items-center gap-2 text-gray-600 cursor-pointer dark:text-neutral-400">
                            <input type="radio" name="tema" value="light" class="cursor-pointer">
                            <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                                </svg>
                                Claro
                            </div>
                        </label>
                        <!-- Modo oscuro -->
                        <label class="flex items-center gap-2 text-gray-600 cursor-pointer dark:text-neutral-400">
                            <input type="radio" name="tema" value="dark" class="cursor-pointer">
                            <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                                </svg>
                                Oscuro
                            </div>
                        </label>
                    </div>
                </div>
            </div>
            <!-- Selección de Moneda -->
            <div class="mt-5 lg:px-4">
                <h3 class="text-base/7 font-semibold text-gray-900 dark:text-neutral-300">Moneda de cambio</h3>
                <p class="text-sm/6 text-gray-600 dark:text-neutral-400">Selecciona tu moneda preferida y mantén tus gastos siempre claros y actualizados.</p>
                <div class="mt-5 flex flex-col">
                    <label for="moneda" class="text-sm/6 font-semibold text-gray-900 dark:text-neutral-300 pb-5">Selecciona moneda</label>
                    <select id="moneda" name="moneda" class="px-4 py-2 w-full md:w-72 rounded-md border border-gray-300 shadow-sm font-medium  bg-white text-gray-700 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer">
                        <option value="" selected disabled>-- Seleccionar tipo de moneda</option>
                        <option value="MXN">Pesos Mexicanos (MXN)</option>
                        <option value="USD">Dólar Estadounidense (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Categorias ingreso/gasto -->
        <div class="bg-white border border-gray-200 shadow-sm rounded-md p-6 dark:bg-neutral-900 dark:border-neutral-800">
            <!-- Título -->
            <div class="flex flex-col gap-1">
                <h2 class="flex items-center gap-2 text-2xl/7 font-bold text-gray-800 dark:text-neutral-50">
                    Categorias personalizadas
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-indigo-500 dark:text-indigo-600">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
                    </svg>
                </h2>
                <p class="text-gray-600 text-base/6 dark:text-neutral-400">Agrega nuevas categorías para tus ingresos y gastos y personaliza cómo registras tu dinero.</p>
            </div>
            <!-- Contenedor de las categorias -->
            <div class="mt-5 lg:px-4">
                <!-- boton agregar categoria -->
                 <div class="w-full flex items-center justify-end pb-4 border-b border-gray-200 dark:border-neutral-800">
                    <button type="button" id="btn-abrir-modal-categoria" class="w-full md:w-auto flex items-center gap-1 lg:w-auto justify-center rounded-md bg-zinc-900 dark:bg-indigo-600 dark:hover:bg-indigo-500 p-3 md:py-2 px-4 text-base/6 font-semibold text-white shadow-xs hover:bg-zinc-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Nueva categoría
                    </button>
                </div>
                <div class="mt-4 flex items-center gap-3 flex-wrap" id="contenedor-categorias"></div>
            </div>
        </div>
    </div>
<?php include_once __DIR__ . '/footer-dashboard.php'; ?>
<!-- Scripts -->
<?php $script .= '
<script type="module" src="/dist/js/configuracion-perfil.js"></script>
<script type="module" src="/dist/js/crudCategorias.js"></script>
' ?>