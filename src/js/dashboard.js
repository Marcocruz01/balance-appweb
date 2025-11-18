document.addEventListener('DOMContentLoaded', iniciarFunciones);

import { toast, formatearMonto, limpiarHTML } from '/dist/js/utilidades.js';

// delcaracion de estados globales
let ingresos = [];
let gastos = [];
let abonos = [];

// Función principal
function iniciarFunciones() {
    obtenerSaldos(); // Obtener los datos correspondientes
    obtenerFecha(); // Obtener la fecha actual
}

// Obtener la fecha actual 
function obtenerFecha() {
    const fecha = new Date();
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('fecha-actual').innerHTML = 
    `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
    </svg>
    ${fecha.toLocaleDateString('es-MX', opciones)}
    `;
}

// Obtener datos del usuario
async function obtenerSaldos() {
    try {
        const url = 'http://localhost:3000/api/datos';
        const respuesta = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const resultado = await respuesta.json();

        // Asignamos los datos correspondientes
        const transacciones = resultado.transacciones; // Obtenemos todas las transacciones
        ingresos = transacciones.filter(t => t.tipo === 'ingreso'); // Filtro de transaccion por ingreso
        gastos = transacciones.filter(t => t.tipo === 'gasto'); // Filtro por de transaccion por gasto
        abonos = resultado.abonos; // Abonos
        
        obtenerUltimasTransacciones(transacciones); // Traernos las transacciones

        // Seleccionamos todos los botones con clase "filter-btn"
        const filterButtons = document.querySelectorAll('.filter-btn');

        // Función interna para manejar la activación visual de los botones
        function activarBoton(btn) {
            // Primero recorremos todos los botones
            filterButtons.forEach(b => {
                // Quitamos las clases activas
                b.classList.remove('text-gray-50', 'bg-gray-950', 'dark:text-neutral-50', 'dark:bg-indigo-600', 'font-medium');
                // Y volvemos a aplicar las clases base (inactivas)
                b.classList.add('bg-gray-200', 'text-gray-500', 'dark:bg-neutral-900', 'dark:text-neutral-500', 'hover:text-gray-50', 'hover:bg-gray-950', 'dark:hover:text-neutral-50', 'dark:hover:bg-indigo-600');
            });

            // Ahora quitamos las clases inactivas del botón actual
            btn.classList.remove('bg-gray-200', 'text-gray-500', 'dark:bg-neutral-900', 'dark:text-neutral-500');
            // Agregar las clases correspondientes del boton activo
            btn.classList.add('text-gray-50', 'bg-gray-950', 'dark:text-neutral-50', 'dark:bg-indigo-600', 'font-medium');
        }

        // Recorremos cada botón y añadimos el evento click
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const rangoSeleccionado = btn.dataset.range;
                localStorage.setItem('rangoSeleccionado', rangoSeleccionado); // Guardamos en LocalStorage
                activarBoton(btn); // actualiza los estilos activos
                actualizarResumen(rangoSeleccionado); // actualiza los datos
            });
        });

        // Revisar si hay boton seleccionado y guardado y activarlo
        const rangoGuardado = localStorage.getItem('rangoSeleccionado');
        const botonInicial = document.querySelector(`.filter-btn[data-range="${rangoGuardado || 'month'}"]`);

        if (botonInicial) {
            activarBoton(botonInicial);
            actualizarResumen(botonInicial.dataset.range);
        }
    } catch (error) {
        console.log(error);
        toast('Algo salió mal', 'No pudimos obtener los saldos del usuario, intenta más tarde.');
    }
}

// Función principal: calcular y mostrar totales
function actualizarResumen(range) {
    const hoy = new Date();
    let fechaInicio = null;
    let fechaFin = hoy;
    let compararInicio = null;
    let compararFin = null;
    let mostrarMensajeSinDatos = false;

    //  Determinar fechas según el rango seleccionado
    switch (range) {
        case 'month': {
            // ➜ Mes actual
            fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
            fechaFin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
            // ➜ Mes anterior (para comparar)
            compararInicio = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
            compararFin = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
            break;
        }

        case 'last-month': {
            // ➜ Mes anterior (ejemplo: octubre si hoy es noviembre)
            const mesAnterior = hoy.getMonth() - 1;
            const anioAnterior = mesAnterior < 0 ? hoy.getFullYear() - 1 : hoy.getFullYear();
            const mesAjustado = (mesAnterior + 12) % 12;
            fechaInicio = new Date(anioAnterior, mesAjustado, 1);
            fechaFin = new Date(anioAnterior, mesAjustado + 1, 0);
            // ➜ Mes previo al mes anterior (para comparar, ejemplo: septiembre)
            const mesPrevio = mesAjustado - 1;
            const anioPrevio = mesPrevio < 0 ? anioAnterior - 1 : anioAnterior;
            const mesPrevioAjustado = (mesPrevio + 12) % 12;
            compararInicio = new Date(anioPrevio, mesPrevioAjustado, 1);
            compararFin = new Date(anioPrevio, mesPrevioAjustado + 1, 0);
            break;
        }

        case '14-days': {
            // ➜ Últimos 14 días
            fechaInicio = new Date(hoy);
            fechaInicio.setDate(hoy.getDate() - 14);
            fechaFin = hoy;
            // ➜ Periodo anterior de 14 días (para comparar)
            compararInicio = new Date(fechaInicio);
            compararInicio.setDate(fechaInicio.getDate() - 14);
            compararFin = new Date(fechaInicio);
            compararFin.setDate(fechaInicio.getDate() - 1);
            break;
        }

        case 'all': {
            // ➜ Todos los registros sin límite de fecha
            fechaInicio = null;
            fechaFin = hoy;
            compararInicio = null;
            compararFin = null;
            break;
        }

        default:
            return;
    }

    // Función auxiliar para filtrar datos por rango
    function filtrarPorRango(items, inicio, fin) {
        if (!inicio || !fin) return items;
        return items.filter(item => {
            const fecha = new Date(item.fecha);
            return fecha >= inicio && fecha <= fin;
        });
    }

    // Filtramos los registros según el rango seleccionado
    const ingresosFiltrados = filtrarPorRango(ingresos, fechaInicio, fechaFin);
    const gastosFiltrados = filtrarPorRango(gastos, fechaInicio, fechaFin);
    const abonosFiltrados = filtrarPorRango(abonos, fechaInicio, fechaFin);

    // Filtramos los registros del rango anterior (comparación)
    const ingresosComparar = filtrarPorRango(ingresos, compararInicio, compararFin);
    const gastosComparar = filtrarPorRango(gastos, compararInicio, compararFin);
    const abonosComparar = filtrarPorRango(abonos, compararInicio, compararFin);

    // Calculamos totales del rango principal
    const ingresosTotales = ingresosFiltrados.reduce((t, i) => t + Number(i.monto || 0), 0);
    const gastosTotales = gastosFiltrados.reduce((t, g) => t + Number(g.monto || 0), 0);
    const abonosTotales = abonosFiltrados.reduce((t, a) => t + Number(a.monto || 0), 0);
    const balance = ingresosTotales - gastosTotales - abonosTotales;

    //  Calculamos totales del rango anterior (comparativo)
    const ingresosTotalesAnterior = ingresosComparar.reduce((t, i) => t + Number(i.monto || 0), 0);
    const gastosTotalesAnterior = gastosComparar.reduce((t, g) => t + Number(g.monto || 0), 0);
    const abonosTotalesAnterior = abonosComparar.reduce((t, a) => t + Number(a.monto || 0), 0);
    const balanceAnterior = ingresosTotalesAnterior - gastosTotalesAnterior - abonosTotalesAnterior;

    // Si no hay datos del mes previo al anterior
    if (
        range === 'last-month' &&
        ingresosTotalesAnterior === 0 &&
        gastosTotalesAnterior === 0 &&
        abonosTotalesAnterior === 0
    ) {
        mostrarMensajeSinDatos = true; // Ya no mostramos mensaje visual, solo afecta los textos de los porcentajes
    }

    // Calcular variaciones porcentuales
    function calcularVariacion(actual, anterior) {
        if (anterior === 0) return 0;
        return ((actual - anterior) / anterior) * 100;
    }

    const porcentajeIngresos = calcularVariacion(ingresosTotales, ingresosTotalesAnterior);
    const porcentajeGastos = calcularVariacion(gastosTotales, gastosTotalesAnterior);
    const porcentajeAbonos = calcularVariacion(abonosTotales, abonosTotalesAnterior);
    const porcentajeBalance = calcularVariacion(balance, balanceAnterior);

    // Preparar datos para renderizar
    const datos = {
        ingresosTotales,
        gastosTotales,
        abonosTotales,
        balance,
        porcentajeIngresos: mostrarMensajeSinDatos ? 0 : porcentajeIngresos.toFixed(2),
        porcentajeGastos: mostrarMensajeSinDatos ? 0 : porcentajeGastos.toFixed(2),
        porcentajeAbonos: mostrarMensajeSinDatos ? 0 : porcentajeAbonos.toFixed(2),
        porcentajeBalance: mostrarMensajeSinDatos ? 0 : porcentajeBalance.toFixed(2),
        variacionIngresosDisponible: !mostrarMensajeSinDatos && ingresosTotalesAnterior !== 0,
        variacionGastosDisponible: !mostrarMensajeSinDatos && gastosTotalesAnterior !== 0,
        variacionAbonosDisponible: !mostrarMensajeSinDatos && abonosTotalesAnterior !== 0,
        variacionBalanceDisponible: !mostrarMensajeSinDatos && balanceAnterior !== 0
    };

    // ➜ Llamamos a la función que dibuja las tarjetas
    mostrarElementos(datos);
    const agrupados = agruparDatosPorFecha(ingresosFiltrados, gastosFiltrados);
    renderizarGraficoLineas(agrupados);
}

// Función para renderizar los datos en el DOM
function mostrarElementos(datos) {
    limpiarHTML('contenedor-datos');

    // Desestructuramos los valores del objeto datos
    const {
        ingresosTotales,
        gastosTotales,
        abonosTotales,
        balance,
        porcentajeIngresos,
        porcentajeGastos,
        porcentajeAbonos,
        porcentajeBalance,
        variacionIngresosDisponible,
        variacionGastosDisponible,
        variacionAbonosDisponible,
        variacionBalanceDisponible
    } = datos;

    // Contenedor principal
    const contenedor = document.getElementById('contenedor-datos');

    // Definimos las tarjetas a renderizar
    const tarjetas = [
        {
            titulo: 'Ingresos Totales',
            valor: formatearMonto(ingresosTotales),
            porcentaje: porcentajeIngresos,
            tipo: 'ingresos',
            disponible: variacionIngresosDisponible
        },
        {
            titulo: 'Gastos Totales',
            valor: formatearMonto(gastosTotales),
            porcentaje: porcentajeGastos,
            tipo: 'gastos',
            disponible: variacionGastosDisponible
        },
        {
            titulo: 'Abonos Totales',
            valor: formatearMonto(abonosTotales),
            porcentaje: porcentajeAbonos,
            tipo: 'abonos',
            disponible: variacionAbonosDisponible
        },
        {
            titulo: 'Balance General',
            valor: formatearMonto(balance),
            porcentaje: porcentajeBalance,
            tipo: 'balance',
            disponible: variacionBalanceDisponible
        }
    ];
    
    // Generamos dinámicamente las tarjetas
    tarjetas.forEach(tarjeta => {
        const card = document.createElement('div');
        card.className = `
            flex-1 h-auto flex flex-col items-start gap-3 
            rounded-md p-4 border border-gray-200 bg-white 
            dark:border-neutral-800 dark:bg-neutral-900
        `;

        const esPositivo = parseFloat(tarjeta.porcentaje) >= 0;
        const color = esPositivo ? 'text-green-500' : 'text-red-500';
        const icono = esPositivo ? svgUp() : svgDown();

        const textoPorcentaje = tarjeta.disponible
            ? `${esPositivo ? '+' : '-'}${Math.abs(tarjeta.porcentaje)}% vs periodo anterior`
            : 'Sin datos del periodo anterior';

        card.innerHTML = `
            <h4 class="text-base font-semibold text-gray-500 dark:text-neutral-400 whitespace-nowrap">${tarjeta.titulo}</h4>
            <p class="text-4xl font-bold text-gray-950 dark:text-neutral-50 whitespace-nowrap">${tarjeta.valor}</p>
            <span class="flex items-center gap-1 font-medium text-sm ${color}">
                ${icono}
                ${textoPorcentaje}
            </span>
        `;

        contenedor.appendChild(card);
    });
    
    // Iconos SVG
    function svgUp() {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path d="M10 4l6 8H4l6-8z"/>
        </svg>`;
    }

    function svgDown() {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path d="M10 16l-6-8h12l-6 8z"/>
        </svg>`;
    }
}

// Funcion para calcular ingresos vs gastos por dia
function agruparDatosPorFecha() {
    const mapa = [];

    function formatearFecha(fechaISO) {
        const fecha = new Date(fechaISO);
        return new Intl.DateTimeFormat('es-MX', {
            day: 'numeric',
            month: 'long'
        }).format(fecha);
    }

    // Procesamos los ingresos
    ingresos.forEach(i => {
        const fecha = i.fecha.split('T')[0]; // Solo por fecha
        if(!mapa[fecha]) mapa[fecha] = { ingresos: 0, gastos: 0};
        mapa[fecha].ingresos += Number(i.monto || 0);
    });

    // Procesar los gastos
    gastos.forEach(g => {
        const fecha = g.fecha.split('T')[0];
        if (!mapa[fecha]) mapa[fecha] = { ingresos: 0, gastos: 0 };
        mapa[fecha].gastos += Number(g.monto || 0);
    });

    // Ordenar fechas
    const fechasOrdenadas = Object.keys(mapa).sort();
    
    // Preparamos el array para mandar datos a la grafica
    const labels = fechasOrdenadas.map(formatearFecha);
    const datosIngresos = fechasOrdenadas.map(f => mapa[f].ingresos);
    const datosGastos = fechasOrdenadas.map(f => mapa[f].gastos);

    return { labels, datosIngresos, datosGastos };   
}

// Grafica
function renderizarGraficoLineas({ labels, datosIngresos, datosGastos }) {
    const tema = localStorage.getItem('tema-seleccionado') || 'light';

    const sistemaOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const esModoOscuro = tema === 'dark' || (tema === 'default' && sistemaOscuro);

    const colorGrid = esModoOscuro ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
    const colorTicks = esModoOscuro ? '#f3f4f6' : '#374151'; // gray-200 vs gray-700


    const ctx = document.getElementById('grafico-lineas').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Ingresos',
                    data: datosIngresos,
                    borderColor: 'rgb(34 197 94)', // Tailwind green-500
                    backgroundColor: 'rgba(34,197,94,0.1)',
                    tension: 0.3,
                    fill: true,
                },
                {
                    label: 'Gastos',
                    data: datosGastos,
                    borderColor: 'rgb(239 68 68)', // Tailwind red-500
                    backgroundColor: 'rgba(239,68,68,0.1)',
                    tension: 0.3,
                    fill: true,
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Ingresos vs Gastos por Día'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: colorGrid
                    },
                    ticks: {
                        color: colorTicks
                    }
                },
                x: {
                    grid: {
                        color: colorGrid
                    },
                    ticks: {
                        color: colorTicks
                    }
                }
            }
        }
    });
}

// Funcion para traernos las ultimas 4 transacciones registradas
function obtenerUltimasTransacciones(transacciones) {

    // Obtenemos el contenedor donde las insertaremos
    const contenedorUltimas = document.getElementById('contenedor-ultimas-transacciones');

    if(!transacciones || transacciones.length === 0) {
        // Creamos la alerta
        const alerta = document.createElement('DIV');
        alerta.id = 'alerta';
        alerta.className = 'w-full flex items-start gap-2 bg-orange-50 dark:bg-orange-600/10 text-orange-400 border-l-4 border-orange-500 px-2 py-3 rounded-md mt-5';
        // Agregar atributos
        alerta.setAttribute = ('role', 'alerta');
        alerta.innerHTML =
        `
        <!-- Icono de alerta -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-orange-600 flex-shrink-0">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
        <!-- Mensaje de alerta -->
        <p class="text-sm">No cuentas con transacciones registradas aún. <a href="/ingresos" class="underline font-medium hover:text-orange-300 text-start">comienza registrando tus transacciones.</a></p>
        `;
        
        // Insertamos la alerta en el contenedor
        contenedorUltimas.appendChild(alerta);
        return;
    }

    // Aseguramos que esten ordenadas por orden descendente (de mas reciente a mas antigua)
    const transaccionesOrdenadas = [...transacciones].sort((a,b) => new Date(b.fecha) - new Date(a.fecha));
    
    // Ya obtenidas, solo nos traemos las primeras 4
    const ultimasTransacciones = transaccionesOrdenadas.slice(0, 4);
    
    // Función que devuelve el svg según el método de pago 
    function obtenerMetodoPago(metodo) {
        switch(metodo) {
            case 'efectivo':
                return `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                </svg>
                `;
            case 'transferencia':
                return `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
                `;
            case 'tarjeta':
                return `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                </svg>
                `;
            default:
                return '';
        }
    } 

    // Crear una sola lista e insertarla en el contenedor padre
    const lista = document.createElement('UL');
    lista.id = `lista-transacciones`;
    lista.className = 'divide-y divide-gray-200 dark:divide-neutral-800';
    contenedorUltimas.appendChild(lista);

    // Mostramos las transacciones
    ultimasTransacciones.forEach((transaccion, index) => {
        // Hacer destructuring a las transacciones
        const { id, monto, fecha, descripcion, tipo, metodo_pago, categoria_id } = transaccion;
        
        // Creamos los li 
        const item = document.createElement('LI');
        item.className = `flex items-center justify-between gap-3 py-3 px-3 md:px-5 cursor-pointer bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 group transition-all duration-500 ease-out opacity-0 translate-y-3`;
        // Capitalizamos la descripción
        const descripcionCapitalizada  = descripcion.charAt(0).toUpperCase() + descripcion.slice(1);

        // Formateamos la fecha y hora
        const fechaObj = new Date(fecha); // Convertimos el string en objeto date
        const opcionesFecha = {day: 'numeric', month: 'long', year: 'numeric'} // Formatos de fecha
        const fechaFormateada = new Intl.DateTimeFormat('es-MX', opcionesFecha).format(fechaObj); // Fecha formateada
        const horas = fechaObj.getHours().toString().padStart(2, '0'); // Formatos de hora
        const minutos = fechaObj.getMinutes().toString().padStart(2, '0'); // Formatos de hora
        const horaFormateada = `${horas}:${minutos}`; // Hora formateada 

        // Obtener el svg según el método de pago 
        const svgMetodoPago = obtenerMetodoPago(metodo_pago);
        
        // Formateamos el monto según la moneda seleccionada
        const montoFormateado = formatearMonto(monto);

        // Asignamos un id unico al item
        item.id = `transaccion-${id}`;
        item.innerHTML = 
        `
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 w-full">
            <div class="flex items-center gap-3">
            <div class="p-3 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-500">
                ${svgMetodoPago}
            </div>
            <div class="flex flex-col gap-0.5">
                    <h3 class="text-base font-medium dark:text-neutral-200">${descripcionCapitalizada}</h3>
                    <span id="${categoria_id}" class="sr-only"></span>
                    <p class="text-xs text-gray-500 dark:text-neutral-400">${fechaFormateada} a las ${horaFormateada}</p>
                </div>
            </div>
            <div class="ml-14 md:ml-0">
                <p class="font-semibold ${tipo === 'gasto' ? 'text-red-600 dark:text-red-500' : 'text-green-600 dark:text-green-500'}">${tipo === 'gasto' ? '-' : '+'}${montoFormateado}</p>
            </div>
        </div>
        `;

        // Añadir el item al UL
        lista.appendChild(item);

        // Forzamos reflujo para que la transicion funcione
        void item.offsetWidth;
        // Aplicamos las clases finales
        setTimeout(() => {
            item.classList.remove('opacity-0', 'translate-y-3');
            item.classList.add('opacity-100', 'translate-y-0');
        }, index * 100);
    }); 
}