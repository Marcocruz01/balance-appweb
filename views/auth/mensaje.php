<div class="w-full h-screen flex items-center justify-center">
    <!-- Sombra -->
    <div class="fixed inset-0 flex items-center justify-center bg-gray-900 dark:bg-neutral-900 bg-opacity-60">
        <div class="flex flex-col w-full max-w-md md:max-w-xl shadow-lg rounded-md overflow-hidden">
            <!-- Modal -->
            <div class="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 flex gap-4 items-start p-6 text-start">
                <!-- Icono -->
                <div class="flex items-center justify-center mb-4">
                    <div class="bg-green-100 text-green-600 rounded-full p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                        </svg>
                    </div>
                </div>
                <!-- Contenido de información -->
                <div class="flex flex-col gap-2">
                    <!-- Título -->
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-neutral-200">Cuenta creada con éxito</h2>
                    <!-- Mensaje -->
                    <p class="text-gray-500 font-light leading-tight dark:text-neutral-400">
                        Tu cuenta ha sido creada correctamente. 
                        Hemos enviado un correo de confirmación a tu dirección registrada. 
                        <br><br>
                        Por favor revisa tu bandeja de entrada (o la carpeta de spam) para verificar tu cuenta y activar todas las funciones disponibles.
                    </p>
                </div>
            </div>
            <!-- Footer -->
            <div class="bg-gray-50 dark:bg-neutral-700 w-full p-4">
                <div class="flex items-center justify-end gap-3">
                    <a href="/login" class="block w-auto justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300">Cancelar</a>
                    <a href="/login" class="block w-auto justify-center rounded-md bg-zinc-950 dark:bg-indigo-700 dark:hover:bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-zinc-800">Aceptar</a>
                </div>
            </div>
        </div>
    </div>
</div>