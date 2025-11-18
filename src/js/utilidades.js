// Toast de mensajeria
export function toast(titulo, mensaje) {
    let container = document.getElementById('toast-container');
    const isSuccess = titulo.includes('correctamente');

    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed w-full md:w-auto h-auto px-2 md:right-4 top-[70px] flex flex-col gap-3 z-30';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'w-full toast-visible px-5 py-4 rounded-md bg-white border border-gray-200 shadow-md flex items-start gap-3 transform transition-all duration-400 ease-out translate-x-full opacity-0 dark:bg-neutral-900 dark:border-neutral-800';

    const icono = isSuccess
        ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6 text-emerald-400 rounded-full p-1 border-2 border-emerald-400"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7 text-red-600 rounded-full p-1 border-2 border-red-600"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>`
    ;

    toast.innerHTML = 
    `
        ${icono}
        <div class="flex-1">
            <p class="font-semibold text-base dark:text-zinc-200">${titulo}</p>
            <p class="font-normal text-sm text-zinc-500 dark:text-zinc-400">${mensaje}</p>
        </div>
        <button type="button" id="cerrar-toast" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
            </svg>
        </button>
    `;

    container.appendChild(toast);

    // Entrada suave
    setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
    }, 100);

    // Cierre manual
    toast.querySelector('#cerrar-toast').addEventListener('click', () => {
        toast.classList.remove('translate-x-0', 'opacity-100');
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 500);
    });

    // Cierre automático con animación
    setTimeout(() => {
        toast.classList.remove('translate-x-0', 'opacity-100');
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Limpiara el contenido previo de un contenedor HTML
export function limpiarHTML(idContenedor) {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return; // Si no existe el contenedor, termina la función

    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild); // Elimina todos los hijos uno por uno
    }
}

// Funcion para convertir o hacer el cambio de moneda 
export function formatearMonto(monto, moneda = null) {
    // Obtener la moneda seleccionada
    const monedaSeleccionada = localStorage.getItem('moneda-seleccionada') || 'MXN';

    const opciones = { style: 'currency', currency: monedaSeleccionada };
    let formato;

    switch ( monedaSeleccionada ) {
        case 'MXN': 
            formato = new Intl.NumberFormat('es-MX', opciones).format(monto) + ' MXN';
            break;
        case 'USD':
            formato = new Intl.NumberFormat('en-US', opciones).format(monto) + ' USD';
            break;
        case 'EUR':
            formato = new Intl.NumberFormat('de-DE', opciones).format(monto);
            break;
        default:
            formato = monto.toFixed(2);
    }
    return formato;
}

// Función debounce: recibe una función y un tiempo de espera
export function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// Función para formatear fechas
export function formatearFecha(fechaBD) {
    // Extraer manualmente el año, mes y día del string de la BD
    const [año, mes, dia] = fechaBD.split('T')[0].split('-');

    const opcionesMes = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const nombreMes = opcionesMes[parseInt(mes, 10) - 1];
    return `${parseInt(dia)} de ${nombreMes} del ${año}`;
}

// Función para cambiar el tema de la interfaz
export function cambiarTema() {
    const temaRadioButton = document.querySelectorAll('input[name="tema"]');
    const temaGuardado = localStorage.getItem('tema-seleccionado');

    if (temaGuardado) {
        aplicarTema(temaGuardado, temaRadioButton);
        marcarRadioBtn(temaGuardado, temaRadioButton);
    } else {
        aplicarTema('default', temaRadioButton);
        marcarRadioBtn('default', temaRadioButton);
    }

    temaRadioButton.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                aplicarTema(radio.value, temaRadioButton);
                localStorage.setItem('tema-seleccionado', radio.value);
            }
        });
    });
}

// Función que aplica el tema según el valor
export function aplicarTema(tema, radios = null) {
    if (tema === "dark") {
        document.documentElement.classList.add("dark");
    } else if (tema === "light") {
        document.documentElement.classList.remove("dark");
    } else if (tema === "default") {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        // Aplicamos el estado actual
        if (mediaQuery.matches) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        // Escuchamos cambios del SO
        mediaQuery.addEventListener("change", (e) => {
            if (e.matches) {
                document.documentElement.classList.add("dark");
                if (radios) marcarRadioBtn("default", radios); // sincroniza radios
            } else {
                document.documentElement.classList.remove("dark");
                if (radios) marcarRadioBtn("default", radios); // sincroniza radios
            }
        });
    }
}

// Funcion para marcar el radio correspondiente
function marcarRadioBtn(valor, radios) {
    radios.forEach(radio => {
        radio.checked = (radio.value === valor);
    });
}

// Funcion para abrir el menu lateral con overlay
export function abrirMenuMovil() {
    const btnAbrirMenu = document.getElementById('btn-abrir-menu');
    const btnCerrarMenu = document.getElementById('btn-cerrar-menu');
    const sidebar = document.getElementById('sidebar');

    btnAbrirMenu.addEventListener('click', () => {
        // Hacemos el overlay con animacion
        const overlay = document.createElement('div');
        overlay.id = 'overlay-menu';
        overlay.className = 'w-full h-screen lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10 opacity-0 transition-opacity duration-500 ease-in-out cursor-pointer';
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        // Forzamos reflow antes de animar
        requestAnimationFrame(() => {
            overlay.classList.add('opacity-100');
            sidebar.classList.add('translate-x-0');
        });

        btnCerrarMenu.addEventListener('click', cerrarMenu);
        overlay.addEventListener('click', cerrarMenu);

        // Evento para cerrar el menu al hacer click fuera
        function cerrarMenu() {
            overlay.classList.remove('opacity-100');
            sidebar.classList.remove('translate-x-0');
            // Esperamos a que termine la animacion para remover el overlay
            setTimeout(() => {
                if(overlay.parentNode) {
                    document.body.removeChild(overlay);
                }
                document.body.style.overflow = '';
            }, 200);
        }
    });
}

// Funcion para abrir o cerrar el modal del menu bar
export function abrirMenuBar() {
    const btnAbrirPerfil = document.getElementById('toggle-menu-perfil');
    const menuPerfil = document.getElementById('menu-perfil');
    const svgIcon = document.getElementById('svg');
    let overlayPerfil = null;

    if (!btnAbrirPerfil || !menuPerfil || !svgIcon) return;

    // Evento para abrir / cerrar menú
    btnAbrirPerfil.addEventListener('click', (e) => {
        e.stopPropagation(); // evita que el click se propague al document

        // Si ya existe el overlay, cerrar
        if (overlayPerfil) {
            cerrarMenu();
            return;
        }

        // Crear overlay (para detectar clic fuera)
        overlayPerfil = document.createElement('div');
        overlayPerfil.id = 'overlay-perfil';
        overlayPerfil.className =
            'w-full h-screen fixed inset-0 bg-black md:bg-transparent bg-opacity-50 md:bg-opacity-0 z-0 lg:z-10 opacity-0 transition-opacity duration-500 ease-in-out cursor-pointer';
        document.body.appendChild(overlayPerfil);
        document.body.style.overflow = 'hidden';

        // Forzar reflow y animar apertura
        requestAnimationFrame(() => {
            overlayPerfil.classList.add('opacity-100');
            menuPerfil.classList.remove('opacity-0', 'invisible', 'pointer-events-none');
            svgIcon.classList.add('rotate-180');
        });

        // Cerrar al hacer clic fuera del menú o del botón
        document.addEventListener('click', clickFueraHandler);
    });

    // Detectar clic fuera
    function clickFueraHandler(e) {
        const clicFueraMenu = !menuPerfil.contains(e.target);
        const clicFueraBoton = !btnAbrirPerfil.contains(e.target);

        if (clicFueraMenu && clicFueraBoton) {
            cerrarMenu();
        }
    }

    // Función para cerrar con animación
    function cerrarMenu() {
        if (!overlayPerfil) return;

        overlayPerfil.classList.remove('opacity-100');
        menuPerfil.classList.add('opacity-0', 'invisible', 'pointer-events-none');
        svgIcon.classList.remove('rotate-180');

        // Eliminar overlay y listener tras la animación
        setTimeout(() => {
            if (overlayPerfil && overlayPerfil.parentNode) {
                document.body.removeChild(overlayPerfil);
            }
            overlayPerfil = null;
            document.body.style.overflow = '';
            document.removeEventListener('click', clickFueraHandler);
        }, 200);
    }
}

// Función para animar el cambio de número
export function animarNumero(elemento, inicio, fin, duracion = 800) {
    const diferencia = fin - inicio;
    const inicioTiempo = performance.now();

    function animar(tiempoActual) {
        const progreso = Math.min((tiempoActual - inicioTiempo) / duracion, 1);
        const valorActual = inicio + diferencia * easeOutCubic(progreso);
        elemento.textContent = Math.floor(valorActual);

        if (progreso < 1) {
            requestAnimationFrame(animar);
        } else {
            elemento.textContent = fin;
        }
    }

    requestAnimationFrame(animar);
}

// Función de easing para una animación más suave
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}