<!-- Header -->
<header class="sticky left-0 top-0 right-0 w-full bg-white dark:bg-neutral-950 border-b z-10 lg:z-20 border-gray-200 dark:border-neutral-900">
    <!-- Contenedor de la barra -->
    <div class="flex items-center justify-between gap-3 px-2 py-3 lg:px-6">
        <!-- Titulo y menu mobil -->
        <div class="flex items-center gap-2">
            <!-- Boton para abrir menu lateral -->
            <button type="button" id="btn-abrir-menu" class="block lg:hidden p-2 rounded-md text-gray-700 dark:text-neutral-500" aria-label="boton para abrir menu lateral">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-7">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
            <!-- Titulo -->
            <h2 class="text-xl font-bold w-auto dark:text-neutral-50"><?php echo $titulo; ?></h2>
        </div>

        <!-- Barra busqueda mobile-->
        <div class="hidden xl:flex items-center gap-2 w-96 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-md px-2 py-1 focus:outline-none focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5 text-gray-500 dark:text-neutral-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
            </svg>
            <input type="search" name="busqueda" placeholder="Busca cualquier cosa..." class="text-base flex-1 outline-none bg-transparent placeholder-gray-500 dark:placeholder-neutral-500 dark:text-neutral-50" autocomplete="off">
        </div>

        <!-- Acciones del usuario -->
        <div class="flex items-center gap-3">
            <!-- Perfil de usuario + notificaiones + saldo -->
            <div class="flex items-center gap-2">
                <!-- Saldo de usuario -->
                <div class="hidden md:flex flex-col items-center w-36 focus:outline-none">
                    <p class="text-xs text-gray-500 dark:text-neutral-400 font-medium">Saldo disponible:</p>
                    <span id="saldo" class="saldo text-sm font-semibold text-gray-800 dark:text-neutral-50"></span>
                </div>
                <!-- boton de barra busqueda -->
                <button type="button" class="block xl:hidden p-2 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-900 text-gray-400 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-50 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 md:size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
                    </svg>
                    <span class="sr-only">barra de busqueda</span>
                </button>
                <!-- Boton de notificaciones -->
                <button type="button" class="relative p-2 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-900 text-gray-400 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-50 focus:outline-none" aria-label="boton para ver notificaciones">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 md:size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                    </svg>
                    <span class="sr-only">notificacion</span>
                    <div class="absolute top-0 right-0">
                        <div class="relative flex items-center justify-center">
                            <!-- Círculo exterior animado -->
                            <div class="absolute w-3 h-3 rounded-full bg-red-400/40 animate-ping"></div>
                            <!-- Círculo intermedio (halo suave) -->
                            <div class="w-3 h-3 rounded-full bg-red-400/30 flex items-center justify-center">
                                <!-- Círculo central fijo -->
                                <div class="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                            </div>
                        </div>
                    </div>
                </button>
                <!-- Boton de menu usuario -->
                <button type="button" id="toggle-menu-perfil" class="relative hover:bg-gray-50 dark:hover:bg-neutral-900 px-2 py-1 z-40 rounded-md group focus:outline-none" aria-label="boton para abrir el menu del usuario">
                    <div class="flex items-center gap-2">
                        <img src="dist/img/perfil/<?php echo !empty($_SESSION['imagen']) ? $_SESSION['imagen'] : 'logotipo.webp'; ?>" id="foto-perfil" alt="foto de perfil por defecto" class="w-8 h-8 rounded-full object-cover">
                        <p class="hidden md:block font-semibold text-sm dark:text-neutral-50"><?php echo $_SESSION['nombre']; ?></p>
                        <svg xmlns="http://www.w3.org/2000/svg" id="svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-3 text-gray-400 dark:text-neutral-500 group-hover:text-gray-900 dark:group-hover:text-neutral-50 transition-all duration-500 ease">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                </button>
                <!-- Menu perfil de usuario -->
                <div id="menu-perfil" class="fixed opacity-0 invisible top-14 right-2 md:right-6 border z-40 border-gray-200 dark:border-neutral-800 rounded-md w-64 h-auto  bg-white dark:bg-neutral-900 shadow-md transition-all duration-200 ease">
                    <div class="border-b border-gray-100 dark:border-neutral-800 flex flex-col gap-1 p-2">
                        <!-- Saldo de usuario -->
                        <div class="flex md:hidden flex-col items-center py-2 px-3 w-full focus:outline-none bg-gray-100 dark:bg-neutral-800 rounded-md mb-3">
                            <p class="text-xs text-gray-700 dark:text-neutral-400 font-medium">Saldo:</p>
                            <span class="saldo text-sm font-semibold text-gray-800 dark:text-neutral-50"></span>
                        </div>
                        <a href="/configuracion" class="w-full flex items-center gap-3 py-2 px-3 text-sm text-gray-900 dark:text-neutral-50 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                            <span class="text-base">Perfil</span>
                        </a>
                        <a href="/configuracion" class="w-full flex items-center gap-3 py-2 px-3 text-sm text-gray-900 dark:text-neutral-50 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                            </svg>
                            <span class="text-base">Comunidad</span>
                        </a>
                        <button type="button" class="w-full flex items-center justify-between py-2 px-3 text-sm text-gray-900 dark:text-neutral-50 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md focus:outline-none">
                            <div class="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                </svg>
                                <span class="text-base">Plan <?php echo $_SESSION['plan'];?></span>
                            </div>
                            <div class="flex items-center">
                                <p class="font-bold capitalize text-blue-600 hover:text-blue-500 text-xs focus:outline-none">Actualizar</p>
                            </div>
                        </button>
                        <a href="/configuracion" class="w-full flex items-center gap-3 py-2 px-3 text-sm text-gray-900 dark:text-neutral-50 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            <span class="text-base">Configuración</span>
                        </a>
                    </div>
                    <div class="flex flex-col gap-1 p-2">
                        <a href="/soporte" class="w-full flex items-center gap-3 py-2 px-3 text-sm text-gray-900 dark:text-neutral-50 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                            </svg>
                            <span class="text-base">Ayuda y soporte</span>
                        </a>
                        <form action="/logout" method="POST" class="w-full">
                            <button type="submit" class="w-full flex items-center gap-3 py-2 px-3 text-sm text-gray-900 dark:text-neutral-50 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                                </svg>
                                <span class="text-base">Cerrar sesión</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>