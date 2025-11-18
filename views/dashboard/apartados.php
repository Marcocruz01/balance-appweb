<?php include_once __DIR__ . '/header-dashboard.php'; ?>
    <!-- Contenedor padre -->
    <div class="max-w-7xl mx-auto flex flex-col gap-6 pt-10 md:pt-12 pb-3 px-2 md:px-4 lg:px-6">
        <!-- Titulo y boton agregar -->
        <div class="flex flex-col items-start md:flex-row md:items-end justify-between gap-2">
            <div class="flex flex-col items-start gap-1">
                <h2 class="text-4xl font-bold dark:text-neutral-50"><?php echo $titulo;?></h2>
                <p class="text-base/6 font-normal text-gray-500 dark:text-neutral-400">Gestiona y visualiza tus apartados de manera fácil y sencilla.</p>
            </div>
            <button type="button" id="btn-agregar-apartado" class="w-full md:w-auto flex items-center justify-center gap-2 p-3 md:py-2 px-4 rounded-md shadow-sm text-sm font-medium border border-zinc-950 bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Nuevo apartado
            </button>
        </div>
        <!-- Contenedor de apartados -->
        <div class="flex items-center justify-between gap-3 pb-4 border-b border-gray-200 dark:border-neutral-800">
            <div class="w-full flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <!-- Barra busqueda -->
                <div class="flex items-center gap-2 w-full md:w-72 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-md px-2 py-1.5 focus:outline-none focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5 text-gray-500 dark:text-neutral-500">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
                    </svg>
                    <input type="search" id="busqueda-apartados" name="busqueda-apartados" placeholder="Buscar..." class="text-base flex-1 outline-none bg-transparent placeholder-gray-500 dark:placeholder-neutral-500 dark:text-neutral-50" autocomplete="off">
                </div>
                <div class="flex items-center gap-2">
                    <!-- Filtrar por -->
                    <div class="flex items-center gap-2">
                        <label for="filtro-apartados" class="dark:text-neutral-50 sr-only">Filtrar:</label>
                        <select id="filtro-apartados" name="filtro-apartados" aria-label="filtro de apartados" class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 md:py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 border border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder:text-neutral-500">
                            <option value="" selected disabled>Selecciona un filtro</option>
                            <option value="todos">Todos</option>
                            <option value="recientes">Más recientes</option>
                            <option value="antiguos">Más antiguos</option>
                            <option value="activos">Activos</option>
                            <option value="completados">Completados</option>
                        </select>
                    </div>
                    <!-- Boton de lista sin paginación -->
                    <button type="button" id="btn-sin-paginacion-apartados" aria-label="boton para filtrar por lista completa sin paginación" class="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md dark:text-neutral-50 dark:hover:bg-neutral-800">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 lg:size-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25" />
                        </svg>
                    </button>
                    <!-- Boton de lista con paginación -->
                    <button type="button" id="btn-con-paginacion-apartados" aria-label="boton para filtrar por lista y con paginación" class="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md dark:text-neutral-50 dark:hover:bg-neutral-800">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 lg:size-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        <!-- Contenedor de apartados -->
        <div id="contenedor-apartados" data-tipo="apartados" class="min-h-96 w-full grid md:grid-cols-2 xl:grid-cols-3 gap-5 dark:divide-neutral-800 px-0 md:px-4"></div>
        <!-- Contenedor de la paginación -->
        <div id="paginacion" class="flex justify-center gap-2 py-4"></div>
    </div>
<?php include_once __DIR__ . '/footer-dashboard.php'; ?>
<!-- Scripts -->
<?php $script .= '
<script type="module" src="/dist/js/crudApartados.js"></script>
' ?>