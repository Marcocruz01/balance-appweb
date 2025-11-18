<?php include_once __DIR__ . '/header-dashboard.php'; ?>
    <!-- Contenedor padre -->
    <div class="max-w-7xl mx-auto flex flex-col gap-6 pt-10 md:pt-12 pb-3 px-2 md:px-4 lg:px-6">
        <!-- Titulo y boton agregar -->
        <div class="flex flex-col items-start md:flex-row md:items-end justify-between gap-2">
            <div class="flex flex-col items-start gap-1">
                <h2 class="text-5xl font-bold dark:text-neutral-50">Hola de vuelta <?php echo $_SESSION['nombre'];?></h2>
                <p class="text-base/6 font-normal text-gray-500 dark:text-neutral-400">Visualiza el estado de tus finanzas y obten un mejor control de ellas.</p> 
            </div>
            <p id="fecha-actual" class="w-full text-nowrap md:w-auto flex items-center justify-center gap-2 p-3 md:py-2 px-4 rounded-md text-base font-semibold border bg-gray-950 text-white dark:border-indigo-800/30 dark:text-indigo-500 dark:bg-indigo-600/10"></p>
        </div>

        <!-- Contenedor de botones para filtrar ingresos, gastos y apartados en dinero -->
        <div>
            <h3 class="text-2xl font-bold dark:text-neutral-200">Tu resumen general</h3>
            <div class="flex items-center gap-4 overflow-x-auto md:overflow-x-visible py-2 md:pb-0">
                <button class="filter-btn px-3 py-2 rounded-md bg-gray-200 text-gray-500 dark:bg-neutral-900 dark:text-neutral-500 flex-shrink-0" data-range="month">
                    Mes actual
                </button>
                <button class="filter-btn px-3 py-2 rounded-md bg-gray-200 text-gray-500 dark:bg-neutral-900 dark:text-neutral-500 flex-shrink-0" data-range="last-month">
                    Mes anterior
                </button>
                <button class="filter-btn px-3 py-2 rounded-md bg-gray-200 text-gray-500 dark:bg-neutral-900 dark:text-neutral-500 flex-shrink-0" data-range="14-days">
                    Últimos 14 días
                </button>
                <button class="filter-btn px-3 py-2 rounded-md bg-gray-200 text-gray-500 dark:bg-neutral-900 dark:text-neutral-500 flex-shrink-0" data-range="all">
                    Todo el tiempo
                </button>
            </div>
        </div>

        <!-- Contenedor de cards con los valores de datos -->
        <div class="w-full overflow-x-auto pb-2">
            <div id="contenedor-datos" class="flex min-w-full gap-4"></div>
        </div>

        <!-- Ultimas transacciones del usuario -->
        <div class="w-full max-h-max">
            <h3 class="font-bold text-xl border-b border-gray-200 text-gray-950 dark:text-neutral-50 dark:border-neutral-800 pb-2">Ultimas transacciones registradas</h3>
            <div id="contenedor-ultimas-transacciones" class="w-full min-h-64"></div>
        </div>

        <!-- Grafico de ingresos vs gastos diarios -->
        <div class="w-full">
            <h3 class="font-bold text-xl text-gray-950 dark:text-neutral-50">Grafica de ingresos vs gastos</h3>
            <canvas id="grafico-lineas" class="w-full h-64"></canvas>
        </div>
    </div>
<?php include_once __DIR__ . '/footer-dashboard.php'; ?>
<!-- Scripts -->
<?php $script .= '
<script type="module" src="/dist/js/dashboard.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
' ?>