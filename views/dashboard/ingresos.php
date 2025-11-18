<?php include_once __DIR__ . '/header-dashboard.php'; ?>
    <!-- Contador de ingresos -->
    <div class="flex items-center justify-center gap-1 px-2 py-2 bg-gray-100 border-b border-gray-200 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-50">
        <p class="text-sm" >Saldo en ingresos:</p>
        <span class="text-sm font-bold" id="ingresos-totales"></span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-green-600 dark:text-green-500 animate-pulse">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
        </svg>
    </div>
    <!-- Contenedor padre -->
    <div class="max-w-7xl mx-auto flex flex-col gap-6 pt-10 md:pt-12 pb-3 px-2 md:px-4 lg:px-6">
        <!-- Titulo y boton agregar -->
        <div class="flex flex-col items-start md:flex-row md:items-end justify-between gap-2">
            <div class="flex flex-col items-start gap-1">
                <h2 class="text-4xl font-bold dark:text-neutral-50"><?php echo $titulo; ?></h2>
                <p class="text-base/6 font-normal text-gray-500 dark:text-neutral-400">Administra tus ingresos fácilmente y mantén tus finanzas al día.</p> 
            </div>
            <button type="button" id="btn-agregar-ingreso" class="w-full md:w-auto flex items-center justify-center gap-2 p-3 md:py-2 px-4 rounded-md text-base font-semibold border border-zinc-950 bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Nuevo ingreso
            </button>
        </div>
        <!-- Contenedor de ingresos-->
        <div class="bg-white border border-gray-200 shadow-sm rounded-md dark:bg-neutral-900 dark:border-neutral-800 md:mx-2">
            <!-- Acciones (Barra busqueda, filtros) -->
            <div class="p-4 border-b border-gray-200 dark:border-neutral-800">
                <div class="flex flex-col md:flex-row items-end lg:items-center justify-between gap-4">
                    <!-- Barra busqueda -->
                    <div class="flex items-center gap-2 w-full md:w-72 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-md px-2 py-1.5 focus:outline-none focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5 text-gray-500 dark:text-neutral-500">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
                        </svg>
                        <input type="search" id="busqueda-ingresos" name="busqueda-ingresos" placeholder="Buscar..." class="text-base flex-1 outline-none bg-transparent placeholder-gray-500 dark:placeholder-neutral-500 dark:text-neutral-50" autocomplete="off">
                    </div>
                    <!-- Contenedor de filtros -->
                    <div class="flex items-center gap-2">
                        <!-- Filtrar por -->
                        <div class="flex items-center gap-2">
                            <label for="filtro-ingresos" class="dark:text-neutral-50 sr-only">Filtrar:</label>
                            <select id="filtro-ingresos" name="filtro-ingresos" aria-label="filtro de ingresos" class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-gray-50 py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 border border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder:text-neutral-500 cursor-pointer">
                                <option value="" selected disabled>Selecciona un filtro</option>
                                <option value="todos">Todos</option>
                                <option value="recientes">Más recientes</option>
                                <option value="antiguos">Más antiguos</option>
                                <option value="mayor">Mayor ingreso</option>
                                <option value="menor">Menor ingreso</option>
                            </select>
                        </div>
                        <!-- Boton de lista sin paginación -->
                        <button type="button" id="btn-sin-paginacion-ingresos" aria-label="boton para filtrar por lista completa sin paginación" class="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md dark:text-neutral-50 dark:hover:bg-neutral-800">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 lg:size-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25" />
                            </svg>
                        </button>
                        <!-- Boton de lista con paginación -->
                        <button type="button" id="btn-con-paginacion-ingresos" aria-label="boton para filtrar por lista y con paginación" class="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md dark:text-neutral-50 dark:hover:bg-neutral-800">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 lg:size-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <!-- Contenedor de ingresos -->
            <div id="contenedor-ingresos" data-tipo="ingreso" class="min-h-96 w-full"></div>
            <!-- Contenedor de la paginación -->
            <div id="paginacion" class="flex justify-center gap-2 py-4"></div>
        </div>
    </div>
<?php include_once __DIR__ . '/footer-dashboard.php'; ?>
<!-- Scripts -->
<?php $script .= '
<script type="module" src="/dist/js/crudTransacciones.js"></script>
' ?>