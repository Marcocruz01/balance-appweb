<?php include_once __DIR__ . '/header-dashboard.php'; ?>
    <!-- Contenedor padre -->
    <div class="max-w-7xl mx-auto flex flex-col gap-3 pt-5 md:pt-12 pb-3 px-2 md:px-4 lg:px-6">
        <!-- Navegacion -->
        <nav class="flex items-center space-x-2 text-sm font-medium py-2" aria-label="Breadcrumb">
            <!-- dashboard -->
            <a href="/" aria-label="regresar al dashboard" class="flex items-center text-gray-500 hover:text-indigo-500 dark:text-neutral-400 dark:hover:text-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
            </a>
            <!-- flecha -->
            <span class="text-gray-400 dark:text-neutral-500">›</span>
            <!-- apartados -->
            <a href="/apartados" class="text-gray-500 hover:text-indigo-500 dark:text-neutral-400 dark:hover:text-indigo-500">Apartados</a>
            <!-- flecha -->
            <span class="text-gray-400 dark:text-neutral-500">›</span>
            <!-- actual -->
            <span class="text-indigo-600 dark:text-indigo-500 font-medium">Detalle de ahorros</span>
        </nav>

        <!-- Contenedor de la informacion del apartado -->
        <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4 pb-4 border-b border-gray-200 dark:border-neutral-800">
            <div class="flex flex-col gap-2">
                <h2 class="text-4xl font-bold dark:text-neutral-50"><?php echo $apartado->nombre;?></h2>
                <p class="text-gray-600 dark:text-neutral-400 md:w-[30rem] font-normal"><?php echo $apartado->descripcion;?></p>
            </div>
            <div class="flex">
                <div class="flex flex-col items-start gap-2">
                    <p id="saldoActual" class="font-bold text-indigo-600 dark:text-indigo-500 text-4xl">$<?php echo $apartado->saldo_actual;?></p>
                    <p class="text-gray-500 text-sm dark:text-neutral-400">De tu meta de: <span id="monto" class="text-gray-950 dark:text-neutral-50 font-medium">$<?php echo $apartado->monto;?></span></p>
                </div>
            </div>
        </div>                                                                                                      

        <!-- Contenedor para filtros y boton -->
        <div class="flex flex-col md:flex-row justify-end gap-3">
            <?php
                // Forzamos la misma zona horaria
                date_default_timezone_set('America/Mexico_City');

                // Normalizamos ambas fechas
                $fechaMetaObj = new DateTime(date('Y-m-d', strtotime($apartado->fecha_meta)));
                $hoyObj = new DateTime(date('Y-m-d'));

                // Comparamos fechas puras (solo año-mes-día)
                if ($fechaMetaObj >= $hoyObj):  // Incluimos hoy
            ?>
                <button 
                    type="button" 
                    id="btn-agregar-abono" 
                    value="Registrar"
                    class="w-full md:w-auto flex items-center justify-center gap-1 rounded-md bg-zinc-900 dark:bg-indigo-700 text-white py-3 md:py-2 px-4 font-semibold cursor-pointer hover:bg-zinc-700 dark:hover:bg-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Registrar
                </button>
            <?php endif; ?>
            <!-- Contenedor de filtros -->
            <div class="flex items-center justify-end gap-2">
                <!-- Filtrar por -->
                <div class="flex items-center gap-2">
                    <label for="filtro-abonos" class="dark:text-neutral-50 sr-only">Filtrar:</label>
                    <select id="filtro-abonos" name="filtro-abonos" aria-label="filtro de abonos" class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 border border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder:text-neutral-500 cursor-pointer">
                        <option value="" selected disabled>Selecciona un filtro</option>
                        <option value="todos">Todos</option>
                        <option value="recientes">Más recientes</option>
                        <option value="antiguos">Más antiguos</option>
                    </select>
                </div>
                <!-- Boton de lista sin paginación -->
                <button type="button" id="btn-sin-paginacion-abonos" aria-label="boton para filtrar por lista completa sin paginación" class="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md dark:text-neutral-50 dark:hover:bg-neutral-800">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 lg:size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25" />
                    </svg>
                </button>
                <!-- Boton de lista con paginación -->
                <button type="button" id="btn-con-paginacion-abonos" aria-label="boton para filtrar por lista y con paginación" class="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md dark:text-neutral-50 dark:hover:bg-neutral-800">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 lg:size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                </button>
            </div>
        </div>
        
        <!-- Contenedor grid abonos / lista de abonos -->
        <div class="w-full">
            <h3 class="flex flex-col md:flex-row items-star md:items-center justify-between gap-3 text-xl font-bold dark:text-neutral-50 border-b border-gray-200 dark:border-neutral-800 pb-2">
                Historial de abonos
                <p id="texto-fecha" class="flex items-center w-max gap-2 text-xs font-semibold text-amber-600 bg-amber-600/10 px-3 py-1.5 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    <span id="fecha-meta" data-fecha="<?= date('Y-m-d', strtotime($apartado->fecha_meta)) ?>">
                        <?php
                            setlocale(LC_TIME, 'es_MX.UTF-8', 'es_MX', 'spanish');
                            $fecha = strftime('%e de %B de %Y', strtotime($apartado->fecha_meta));
                            echo ucfirst($fecha);
                        ?>
                    </span>
                </p>
            </h3>
            <div id="contenedor-abonos" class="min-h-96 w-full"></div>
            <!-- Contenedor de la paginación -->
            <div id="paginacion" class="flex justify-center gap-2 py-4"></div>
        </div>
    </div>
<?php include_once __DIR__ . '/footer-dashboard.php'; ?>
<!-- Scripts -->
<?php $script .= '
<script type="module" src="/dist/js/crudApartadoAbonos.js"></script>
' ?>