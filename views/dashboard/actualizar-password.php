<?php include_once __DIR__ . '/header-dashboard.php'; ?>
    <div class="max-w-7xl mx-auto flex flex-col gap-3 py-6 px-2 md:px-4 lg:px-6">
        <!-- Breadcrum -->
        <nav class="flex items-center space-x-2 text-sm font-medium py-2" aria-label="Breadcrumb">
            <!-- dashboard -->
            <a href="/" class="flex items-center text-gray-500 hover:text-blue-500 dark:text-neutral-500 dark:hover:text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
            </a>
            <!-- flecha -->
            <span class="text-gray-400 dark:text-gray-500">›</span>
            <!-- configuracion -->
            <a href="/configuracion" class="text-gray-500 hover:text-blue-500 dark:text-neutral-500 dark:hover:text-blue-500">Configuración</a>
            <!-- flecha -->
            <span class="text-gray-400 dark:text-gray-500">›</span>
            <!-- actual -->
            <span class="text-blue-600 dark:text-blue-500 font-medium">Actualizar contraseña</span>
        </nav>

        <div class="max-w-xl mx-auto flex flex-col gap-8 py-10 px-2 md:px-4 lg:px-6"> 
            <!-- Contenedor -->
            <div class="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-sm rounded-lg px-4 py-6 lg:p-8">
                <h3 class="text-xl/7 font-semibold text-gray-900 dark:text-neutral-300">Actualiza tu contraseña</h3>
                <p class="text-sm/6 text-gray-600 dark:text-neutral-400">Mantén tu cuenta segura cambiando tu contraseña regularmente. Usa una combinación de letras, números y símbolos, y evita utilizar contraseñas que ya emplees en otros sitios.</p>
                <!-- Formulario -->
                <form action="/configuracion/password" method="POST" class="space-y-6 mt-5">  
                    <!-- Campos -->
                    <div>
                        <label for="password_current" class="block text-sm/6 font-medium text-gray-900 dark:text-neutral-50">Contraseña actual</label>
                        <div class="mt-2">
                            <input type="password" id="password_current" placeholder="Contraseña actual" name="password_current" class="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-zinc-900 text-base placeholder:text-gray-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-50 dark:placeholder:text-neutral-500 focus:outline-none focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500">
                        </div>
                    </div>
                    <div>
                        <label for="new_password" class="block text-sm/6 font-medium text-gray-900 dark:text-neutral-50">Nueva contraseña</label>
                        <div class="mt-2">
                            <input type="password" id="new_password" placeholder="Tu password" name="new_password" class="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-zinc-900 text-base placeholder:text-gray-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-50 dark:placeholder:text-neutral-500 focus:outline-none focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500">
                        </div>
                    </div>
                    <!-- Campos -->
                    <div>
                        <label for="repeat_new_password" class="block text-sm/6 font-medium text-gray-900 dark:text-neutral-50">Repite tu nueva contraseña</label>
                        <div class="mt-2">
                            <input type="password" id="repeat_new_password" placeholder="Repite tu contraseña" name="repeat_new_password" class="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-zinc-900 text-base placeholder:text-gray-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-50 dark:placeholder:text-neutral-500 focus:outline-none focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500">
                        </div>
                    </div>
                    <!-- Campos -->
                    <div>
                        <button type="submit" class="flex w-full justify-center rounded-md bg-zinc-900 dark:bg-indigo-700 dark:hover:bg-indigo-600 px-3 py-2 text-sm/6 font-semibold text-white shadow-xs hover:bg-zinc-700">Guardar cambios</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!-- Incluimos el archivo de las alertas -->
    <?php include_once __DIR__ . '/../templates/alertas.php'; ?>
<?php include_once __DIR__ . '/footer-dashboard.php'; ?>