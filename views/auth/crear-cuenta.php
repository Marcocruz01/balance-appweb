<div class="w-full h-screen flex items-center justify-center">
    <!-- Forma 1 -->
    <div class="absolute inset-0 -z-10 overflow-hidden blur-2xl hidden md:flex justify-center items-start">
        <div 
        class="w-[1000px] h-[600px] bg-gradient-to-tr from-[#4d2bac] to-[#1680d6] opacity-20"
        style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)">
        </div>
    </div>
    <!-- Forma 2 -->
    <div class="absolute inset-0 -z-30 overflow-hidden blur-2xl hidden md:flex justify-center items-center">
        <div 
        class="w-[600px] h-[250px] bg-gradient-to-l from-[#4d2bac] to-[#469397] opacity-20"
        style="clip-path: polygon(0% 0%, 100% 10%, 90% 100%, 10% 90%)">
        </div>
    </div>

    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div class="md:bg-gray-50 dark:md:bg-neutral-900 md:border md:border-gray-200 dark:md:border-neutral-800 md:rounded-xl md:shadow-sm md:p-8">
            <!-- Encabezado del formulario -->
            <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <img src="/dist/img/logotipo.webp" alt="imagen de la empresa" class="mx-auto h-10 w-auto">
                <h1 class="mt-8 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-neutral-200">Registra tu cuenta ahora</h1>
                <p class="text-center text-gray-600 font-normal dark:text-neutral-400">Accede de forma segura, controla tus gastos y recibe <span class="font-semibold text-blue-600">estadísticas en tiempo real</span> sobre tu dinero.</p>
            </div>
            <!-- Formulario -->
            <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                <form action="/crear-cuenta" method="POST" class="space-y-6">  
                    <!-- Campos -->
                    <div class="flex items-center gap-3">
                        <div class="w-full">
                            <label for="nombre" class="block text-sm/6 font-medium text-gray-900 dark:text-neutral-200">Nombre(s)</label>
                            <div class="mt-2">
                                <input type="text" id="nombre" placeholder="Tu nombre" name="nombre" value="<?php echo $usuario->nombre; ?>" class="block w-full rounded-md border border-gray-200 bg-white dark:bg-neutral-700 dark:border-neutral-800 px-3 py-1.5 text-base text-gray-900 dark:text-neutral-200 placeholder:text-gray-400 dark:placeholder:text-neutral-400 focus:outline-none focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500">
                            </div>
                        </div>

                        <div class="w-full">
                            <label for="apellido" class="block text-sm/6 font-medium text-gray-900 dark:text-neutral-200">Apellido(s)</label>
                            <div class="mt-2">
                                <input type="text" id="apellido" placeholder="Tu apellido" name="apellido" value="<?php echo $usuario->apellido; ?>" class="block w-full rounded-md border border-gray-200 bg-white dark:bg-neutral-700 dark:border-neutral-800 px-3 py-1.5 text-base text-gray-900 dark:text-neutral-200 placeholder:text-gray-400 dark:placeholder:text-neutral-400 focus:outline-none focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500">
                            </div>
                        </div>
                    </div>
                    <!-- Campos -->
                    <div>
                        <label for="email" class="block text-sm/6 font-medium text-gray-900 dark:text-neutral-200">Correo eléctronico</label>
                        <div class="mt-2">
                            <input type="email" id="email" placeholder="Tu correo eléctronico" name="email" value="<?php echo $usuario->email; ?>" class="block w-full rounded-md border border-gray-200 bg-white dark:bg-neutral-700 dark:border-neutral-800 px-3 py-1.5 text-base text-gray-900 dark:text-neutral-200 placeholder:text-gray-400 dark:placeholder:text-neutral-400 focus:outline-none focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500">
                        </div>
                    </div>
                    <!-- Campos -->
                    <div>
                        <label for="password" class="block text-sm/6 font-medium text-gray-900 dark:text-neutral-200">Contraseña</label>
                        <div class="mt-2">
                            <input type="password" id="password" placeholder="Tu password" name="password" class="block w-full rounded-md border border-gray-200 bg-white dark:bg-neutral-700 dark:border-neutral-800 px-3 py-1.5 text-base text-gray-900 dark:text-neutral-200 placeholder:text-gray-400 dark:placeholder:text-neutral-400 focus:outline-none focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500">
                        </div>
                    </div>
                    <!-- Campos -->
                    <div>
                        <label for="password_repeat" class="block text-sm/6 font-medium text-gray-900 dark:text-neutral-200">Repite tu contraseña</label>
                        <div class="mt-2">
                            <input type="password" id="password_repeat" placeholder="Repite tu contraseña" name="password_repeat" class="block w-full rounded-md border border-gray-200 bg-white dark:bg-neutral-700 dark:border-neutral-800 px-3 py-1.5 text-base text-gray-900 dark:text-neutral-200 placeholder:text-gray-400 dark:placeholder:text-neutral-400 focus:outline-none focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500">
                        </div>
                    </div>
                    <!-- Campos -->
                    <div>
                        <button type="submit" class="flex w-full justify-center rounded-md bg-zinc-900 dark:bg-indigo-700 dark:hover:bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-zinc-700">Registrarme</button>
                    </div>
                </form>
                <p class="mt-10 text-center text-sm/6 text-gray-500 dark:text-neutral-400">
                    ¿Ya tengo una cuenta?
                    <a href="/login" class="font-semibold text-blue-600 hover:text-blue-500">Iniciar sesión</a>
                </p>
            </div>
        </div>
    </div>
</div>
<!-- Incluimos el archivo de las alertas -->
<?php include_once __DIR__ . '/../templates/alertas.php'; ?>