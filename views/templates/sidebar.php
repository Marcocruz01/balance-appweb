<!-- Sidebar -->
<aside id="sidebar" class="absolute -translate-x-72 lg:translate-x-0 lg:static bg-white dark:bg-neutral-950 w-72 h-svh shadow-sm border-r border-gray-200 dark:border-neutral-900 flex-shrink-0 flex flex-col z-30 lg:z-10 transition-transform duration-300 ease">
    <div class="px-4 flex-1 flex flex-col">
        <div class="flex items-center justify-between">
            <!-- Logotipo -->
            <a href="/" class="flex items-center justify-start gap-3 py-4 px-2">
                <img src="/dist/img/logotipo.webp" alt="imagen empresa" class="w-7 h-7">
                <h1 class="m-0 text-3xl font-bold dark:text-neutral-50">Balance<span class="text-sm font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">Pro</span></h1>
            </a>
            <!-- Boton para cerrar menu movil -->
            <button type="button" id="btn-cerrar-menu" class="p-2 rounded-md lg:hidden text-gray-400 hover:text-gray-800 dark:text-neutral-400" aria-label="boton para cerrar menu lateral">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <!-- Menu principal --> 
        <nav class="flex flex-col gap-3 mt-6">
            <p class="text-sm text-gray-400 dark:text-neutral-500 font-normal">Principal</p>
            <a href="/" class="flex relative items-center justify-start gap-3 p-2 rounded-md border border-transparent hover:bg-gray-50 dark:hover:bg-neutral-900 hover:text-gray-900 dark:hover:text-neutral-50 font-normal <?php echo ($titulo === 'Dashboard') ? 'text-gray-900 dark:text-neutral-50 bg-gray-50 dark:bg-neutral-900  font-semibold' : 'text-gray-500 dark:text-neutral-400'; ?>">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 <?php echo ($titulo === 'Dashboard') ? 'text-gray-800 dark:text-neutral-50' : 'text-gray-500 dark:text-neutral-400'; ?>">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <span>Dashboard</span>
                <?php echo ($titulo === 'Dashboard') ? 
                '
                <div class="absolute right-3">
                    <div class="relative flex items-center justify-center">
                        <!-- Círculo exterior animado -->
                        <div class="absolute w-3 h-3 rounded-full bg-indigo-400/40 animate-ping"></div>
                        <!-- Círculo intermedio (halo suave) -->
                        <div class="w-3 h-3 rounded-full bg-indigo-400/30 flex items-center justify-center">
                            <!-- Círculo central fijo -->
                            <div class="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                        </div>
                    </div>
                </div>
                ' 
                : '' ?>
            </a>
            <a href="/ingresos" class="flex relative items-center justify-start gap-3 p-2 rounded-md border border-transparent hover:bg-gray-50 dark:hover:bg-neutral-900 hover:text-gray-900 dark:hover:text-neutral-50 font-normal <?php echo ($titulo === 'Ingresos') ? 'text-gray-900 dark:text-neutral-50 bg-gray-50 dark:bg-neutral-900  font-semibold' : 'text-gray-500 dark:text-neutral-400'; ?>">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 <?php echo ($titulo === 'Ingresos') ? 'text-gray-800 dark:text-neutral-50' : 'text-gray-500 dark:text-neutral-400'; ?>">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span>Ingresos</span>
                <span id="contador-ingresos" class="absolute right-11 font-semibold text-sm px-2 py-0.5 rounded-md bg-indigo-600/10 text-indigo-500 dark:bg-indigo-600/20">0</span>
                <?php echo ($titulo === 'Ingresos') ? 
                '
                <div class="absolute right-3">
                    <div class="relative flex items-center justify-center">
                        <!-- Círculo exterior animado -->
                        <div class="absolute w-3 h-3 rounded-full bg-indigo-400/40 animate-ping"></div>
                        <!-- Círculo intermedio (halo suave) -->
                        <div class="w-3 h-3 rounded-full bg-indigo-400/30 flex items-center justify-center">
                            <!-- Círculo central fijo -->
                            <div class="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                        </div>
                    </div>
                </div>
                ' 
                : '' ?>
            </a>
            <a href="/gastos" class="flex relative items-center justify-start gap-3 p-2 rounded-md border border-transparent hover:bg-gray-50 dark:hover:bg-neutral-900 hover:text-gray-900 dark:hover:text-neutral-50 font-normal <?php echo ($titulo === 'Gastos') ? 'text-gray-900 dark:text-neutral-50 bg-gray-50 dark:bg-neutral-900  font-semibold' : 'text-gray-500 dark:text-neutral-400'; ?>">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 <?php echo ($titulo === 'Gastos') ? 'text-gray-800 dark:text-neutral-50' : 'text-gray-500 dark:text-neutral-400'; ?>">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                </svg>
                <span>Gastos</span>
                <span id="contador-gastos" class="absolute right-11 font-semibold text-sm px-2 py-0.5 rounded-md bg-indigo-600/10 text-indigo-500 dark:bg-indigo-600/20">0</span>
                <?php echo ($titulo === 'Gastos') ? 
                '
                <div class="absolute right-3">
                    <div class="relative flex items-center justify-center">
                        <!-- Círculo exterior animado -->
                        <div class="absolute w-3 h-3 rounded-full bg-indigo-400/40 animate-ping"></div>
                        <!-- Círculo intermedio (halo suave) -->
                        <div class="w-3 h-3 rounded-full bg-indigo-400/30 flex items-center justify-center">
                            <!-- Círculo central fijo -->
                            <div class="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                        </div>
                    </div>
                </div>
                ' 
                : '' ?>
            </a>
            <a href="/apartados" class="flex relative items-center justify-start gap-3 p-2 rounded-md border border-transparent hover:bg-gray-50 dark:hover:bg-neutral-900 hover:text-gray-900 dark:hover:text-neutral-50 font-normal <?php echo ($titulo === 'Mis apartados') ? 'text-gray-900 dark:text-neutral-50 bg-gray-50 dark:bg-neutral-900  font-semibold' : 'text-gray-500 dark:text-neutral-400'; ?>">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 <?php echo ($titulo === 'Mis apartados') ? 'text-gray-800 dark:text-neutral-50' : 'text-gray-500 dark:text-neutral-400'; ?>">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
                </svg>
                <span>Apartados</span>
                <span id="contador-apartados" class="absolute right-11 font-semibold text-sm px-2 py-0.5 rounded-md bg-indigo-600/10 text-indigo-500 dark:bg-indigo-600/20">0</span>
                <?php echo ($titulo === 'Mis apartados') ? 
                '
               <div class="absolute right-3">
                    <div class="relative flex items-center justify-center">
                        <!-- Círculo exterior animado -->
                        <div class="absolute w-3 h-3 rounded-full bg-indigo-400/40 animate-ping"></div>
                        <!-- Círculo intermedio (halo suave) -->
                        <div class="w-3 h-3 rounded-full bg-indigo-400/30 flex items-center justify-center">
                            <!-- Círculo central fijo -->
                            <div class="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                        </div>
                    </div>
                </div>
                ' 
                : '' ?>
            </a>
            <p class="text-sm text-gray-400 dark:text-neutral-500 font-normal">General</p>
            <a href="/configuracion" class="flex relative items-center justify-start gap-3 p-2 rounded-md border border-transparent hover:bg-gray-50 dark:hover:bg-neutral-900 hover:text-gray-900 dark:hover:text-neutral-50 font-normal <?php echo ($titulo === 'Configuracion') ? 'text-gray-900 dark:text-neutral-50 bg-gray-50 dark:bg-neutral-900  font-semibold' : 'text-gray-500 dark:text-neutral-400'; ?>">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 <?php echo ($titulo === 'Configuracion') ? 'text-gray-800 dark:text-neutral-50' : 'text-gray-500 dark:text-neutral-400'; ?>">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <span>Configuracion</span>
                <?php echo ($titulo === 'Configuracion') ? 
                '
                <div class="absolute right-3">
                    <div class="relative flex items-center justify-center">
                        <!-- Círculo exterior animado -->
                        <div class="absolute w-3 h-3 rounded-full bg-indigo-400/40 animate-ping"></div>
                        <!-- Círculo intermedio (halo suave) -->
                        <div class="w-3 h-3 rounded-full bg-indigo-400/30 flex items-center justify-center">
                            <!-- Círculo central fijo -->
                            <div class="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                        </div>
                    </div>
                </div>
                ' 
                : '' ?>
            </a>
            <a href="/soporte" class="flex relative items-center justify-start gap-3 p-2 rounded-md border border-transparent hover:bg-gray-50 dark:hover:bg-neutral-900 hover:text-gray-900 dark:hover:text-neutral-50 font-normal <?php echo ($titulo === 'Soporte') ? 'text-gray-900 dark:text-neutral-50 bg-gray-50 dark:bg-neutral-900  font-semibold' : 'text-gray-500 dark:text-neutral-400'; ?>">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 <?php echo ($titulo === 'Soporte') ? 'text-gray-800 dark:text-neutral-50' : 'text-gray-500 dark:text-neutral-400'; ?>">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
                <span>Soporte y ayuda</span>
                <?php echo ($titulo === 'Soporte') ? 
                '
                <div class="absolute right-3">
                    <div class="relative flex items-center justify-center">
                        <!-- Círculo exterior animado -->
                        <div class="absolute w-3 h-3 rounded-full bg-indigo-400/40 animate-ping"></div>
                        <!-- Círculo intermedio (halo suave) -->
                        <div class="w-3 h-3 rounded-full bg-indigo-400/30 flex items-center justify-center">
                            <!-- Círculo central fijo -->
                            <div class="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                        </div>
                    </div>
                </div>
                ' 
                : '' ?>
            </a>
        </nav>

        <!-- Actualizar plan mensaje -->
        <div class="mt-auto mb-4">
            <form action="/logout" method="POST" class="w-full">
                <button type="submit" class="flex w-full relative items-center justify-start gap-3 px-3 py-2 rounded-md border dark:border-indigo-600 bg-zinc-950 hover:bg-zinc-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 font-normal text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                    </svg>
                    <span>Cerrar sesión</span>
                </button>
            </form>
        </div>
        <!-- Creado por -->
        <div class="text-center text-xs text-gray-400 dark:text-neutral-500 mb-2">
            <p class="m-0">Creado por <a href="https://www.linkedin.com/in/marco-cruz-908492205/" target="_blank" class="text-indigo-600 hover:underline">Marco Cruz</a></p>
            <p class="m-0">&copy; <?php echo date('Y'); ?> BalancePro</p>
        </div>
    </div>   
</aside>