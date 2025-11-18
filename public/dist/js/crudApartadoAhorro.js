document.addEventListener('DOMContentLoaded', iniciarApp);

// Importar funciones de utilidades
import {toast, formatearFecha, formatearMonto, limpiarHTML} from '/dist/js/utilidades.js';
import { obtenerSaldoUsuario } from '/dist/js/main.js';

// Variables globales
let apartado = [];
let ahorros = [];
const isDark = document.documentElement.classList.contains('dark'); // Funcion para el modal dark / light

// Funcion padre
function iniciarApp() {
    obtenerAhorro(); // Llamar la funcion para obtener los ahorros
    obtenerApartado();
    // evento para el boton de agregar el ahorro
    const btnAgregarAhorro = document.getElementById('btn-agregar-ahorro');
    if(btnAgregarAhorro) {
        btnAgregarAhorro.addEventListener('click', () => modalAhorro()); // Accion para abrir el modal
    }
}

// Función para el modal de agregar ahorros
function modalAhorro() {
    // crear el overlay
    const overlay = document.createElement('DIV');
    overlay.id = 'overlay-modal-apartados';
    overlay.className ='w-full h-screen fixed flex items-center justify-center inset-0 z-30 bg-black bg-opacity-50 opacity-0 transition-opacity duration-500 ease-in-out';
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // crear el modal interno
    const modal = document.createElement('DIV');
    modal.className ='max-w-lg max-h-[90vh] md:max-h-full overflow-y-auto bg-white border border-gray-200 shadow-md rounded-md mx-2 -translate-y-10 transition-transform duration-500 ease z-40 dark:bg-neutral-900 dark:border-neutral-800';
    modal.innerHTML =
    `
    <div class="flex flex-col pb-6 border-b border-gray-200 dark:border-neutral-800 p-6">
        <div class="flex items-center justify-between gap-2">
            <h2 class="text-2xl font-semibold text-zinc-900 dark:text-neutral-200">Agregar nuevo ahorro</h2>
            <button type="button" id="btn-cerrar-modal" class="text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-200 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <p class="mt-1 text-base text-zinc-500 dark:text-neutral-400">Agrega tu nuevo ahorro para alcanzar tus metas más pronto.</p>
    </div>
    <form class="w-full" novalidate id="formulario-ahorros">
        <div class="p-6">
            <!-- Campo del monto -->
            <div class="flex-1">
                <label for="monto" class="block text-sm/6 font-medium text-gray-900 dark:text-neutral-200">Monto meta</label>
                <div class="mt-2">
                    <input type="number" id="monto" autocomplete='on' placeholder="Ej: $450.00" name="monto" value="" class="text-zinc-900 bg-gray-50 border border-gray-200 w-full px-3 py-2 text-base placeholder:text-gray-500 rounded-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 disabled:bg-gray-100 dark:placeholder:text-neutral-500 focus:outline-none focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500">
                </div>
            </div>
        </div>
        <!-- Boton agregar -->
        <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-neutral-800">
            <button type="button" id="cancelar-ahorro" class="w-auto flex items-center gap-2 justify-center rounded-md bg-transparent border border-gray-200 text-zinc-900 hover:bg-gray-50 px-3 py-2 text-base/6 font-semibold dark:border-zinc-500 dark:text-white dark:hover:text-gray-300 dark:hover:bg-neutral-900">Cancelar</button>
            <input type="submit" id="btn-guardar-ahorro" value="Agregar ahorro" class="w-auto rounded-md bg-zinc-900 dark:bg-indigo-700 text-white py-3 px-6 font-semibold cursor-pointer hover:bg-zinc-700 dark:hover:bg-indigo-600">
        </div>
    </form>
    `;

    // Insertar el modal
    overlay.appendChild(modal);

    // Obtenemos el btn para cerrar el modal manualmente
    const btnCerrar = modal.querySelector('#btn-cerrar-modal');
    btnCerrar.addEventListener('click', cerrarModal); // Activa la función cerrarModal
    const btnCancelar = modal.querySelector('#cancelar-ahorro');
    btnCancelar.addEventListener('click', cerrarModal);
    overlay.addEventListener('click', (e) => e.target === overlay && cerrarModal()); // Activa la función cerrarModal

    // Obtener el boton para agregar el apartado
    const form = modal.querySelector('#formulario-ahorros');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Extraer valores de los campos
        const monto = form.querySelector('#monto').value.trim();
        // Validar y mandar alerta si hay campos vacios
        if(monto === '') {
            // Arrojar alerta
            Swal.fire({
                icon: 'error',
                title: 'Algo salió mal...',
                text: 'Asegurate de completar todos los campos',
                confirmButtonText: 'OK',
                confirmButtonColor: isDark ? '#ef4444' : '#dc2626', // red-500 / red-600
                background: isDark ? '#262626' : '#ffffff',          // neutral-800 / white
                color: isDark ? '#e5e5e5' : '#1f2937',               // neutral-200 / gray-800
                customClass: {
                    popup: 'rounded-2xl shadow-lg',
                    title: isDark ? 'text-neutral-200 font-semibold' : 'text-gray-800 font-semibold',
                    htmlContainer: isDark ? 'text-neutral-400' : 'text-gray-600',
                    confirmButton: 'px-4 py-2 rounded-md font-medium',
                },
                showCloseButton: true,
            });
            return;
        }

        // Enviar el monto
        crearAhorro(monto);
        // cerrar el modal despues de agregar el ahorro
        cerrarModal();

    });

    // Forzar animación
    requestAnimationFrame(() => {
        overlay.classList.add('opacity-100');
        modal.classList.remove('-translate-y-10');
        modal.classList.add('translate-y-0');
    });

    // Función para cerrar el modal y el overlay
    function cerrarModal() {
        overlay.classList.remove('opacity-100');
        modal.classList.add('translate-y-10');
        setTimeout(() => {
            overlay.remove();
            document.body.style.overflow = '';
        }, 400);
    }
}

// Función para crear el ahorro
async function crearAhorro(monto) {
    const data = new FormData();
    data.append('monto', monto);
    data.append('apartado_id', obtenerUuidApartado());

    // Hacemos la peticion a la API
    try {
        const url = `http://localhost:3000/api/ahorros`;
        const respuesta = await fetch(url, {
            method: 'POST',
            body: data
        });
        const resultado = await respuesta.json();

        if(resultado.tipo === 'error') {
            toast('Algo salió mal', `${resultado.mensaje}`);
        }
        if(resultado.tipo === 'exito') {
            toast('Ahorro guardado correctamente', 'El nuevo ahorro se a registrado exitosamente.');
            obtenerSaldoUsuario(); // Obtenemos el saldo del usuario 
            obtenerAhorro(); // Llamar la funcion para obtener los ahorros
        }
        
    } catch (error) {
        console.log(error);
        toast('Algo salió mal', 'El nuevo ahorro no se ha podido guardar, intenta más tarde.');
    }   
}

// Funcion para leer los ahorros del apartado
async function obtenerAhorro() {
    // Obtenemos el UID del apartado desde la URL actual
    const uid = obtenerUuidApartado();

    // Construimos la petición a la API
    try {
        const url = `http://localhost:3000/api/ahorros?uid=${uid}`;
        const respuesta = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },  
        });
        const resultado = await respuesta.json();
        ahorros = resultado.ahorros;
        // Mandar llamar la funcion que muestra los ahorros
        mostrarAhorros();

    } catch (error) {
        toast('Algo salió mal', `No se pudieron obtener los ahorros, intenta más tarde`);
    }
}

// Funcion que muestra los ahorros en el HTML
function mostrarAhorros() {
    // Limpiar el contenedor
    limpiarHTML('contenedor-ahorros');

    // Mostrar alerta si no hay ahorros
    if(ahorros.length === 0) {
        // Creamos la alerta
        const alerta = document.createElement('DIV');
        alerta.id = 'alerta';
        alerta.setAttribute('role', 'alert');
        alerta.className = 'flex items-center justify-center w-full h-96 px-2';
        alerta.innerHTML =
        `
        <div class="flex flex-col items-center gap-6 rounded-md p-8 w-[35rem] dark:border-neutral-700">
            <div class="flex flex-col items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1" width="52" height="52" color="#000000" class="text-gray-950 dark:text-neutral-400">
                    <defs>
                        <style>.cls-6375f1aeb67f094e4896c9f2-1{fill:none;stroke:currentColor;stroke-linecap:square;stroke-miterlimit:10;}</style>
                    </defs>
                    <g id="coins_1" data-name="coins 1">
                        <path class="cls-6375f1aeb67f094e4896c9f2-1" d="M12,4.84c0,.78-.83,1.48-2.11,1.91a9.55,9.55,0,0,1-3.14.48,9.55,9.55,0,0,1-3.14-.48C2.33,6.32,1.5,5.62,1.5,4.84c0-1.32,2.35-2.39,5.25-2.39S12,3.52,12,4.84Z"></path>
                        <path class="cls-6375f1aeb67f094e4896c9f2-1" d="M12,4.84V8.66c0,.78-.83,1.48-2.11,1.91a9.82,9.82,0,0,1-3.14.48,9.82,9.82,0,0,1-3.14-.48C2.33,10.14,1.5,9.44,1.5,8.66V4.84c0,.78.83,1.48,2.11,1.91a9.55,9.55,0,0,0,3.14.48,9.55,9.55,0,0,0,3.14-.48C11.17,6.32,12,5.62,12,4.84Z"></path>
                        <path class="cls-6375f1aeb67f094e4896c9f2-1" d="M12,8.66v3.82c0,.78-.83,1.48-2.11,1.91a9.84,9.84,0,0,1-3.14.47,9.84,9.84,0,0,1-3.14-.47C2.33,14,1.5,13.26,1.5,12.48V8.66c0,.78.83,1.48,2.11,1.91a9.82,9.82,0,0,0,3.14.48,9.82,9.82,0,0,0,3.14-.48C11.17,10.14,12,9.44,12,8.66Z"></path>
                        <path class="cls-6375f1aeb67f094e4896c9f2-1" d="M12,12.48V16.3c0,1.31-2.35,2.38-5.25,2.38S1.5,17.61,1.5,16.3V12.48c0,.78.83,1.48,2.11,1.91a9.84,9.84,0,0,0,3.14.47,9.84,9.84,0,0,0,3.14-.47C11.17,14,12,13.26,12,12.48Z"></path>
                        <path class="cls-6375f1aeb67f094e4896c9f2-1" d="M22.5,12.48V16.3c0,1.31-2.35,2.38-5.25,2.38S12,17.61,12,16.3V12.48c0,.78.83,1.48,2.11,1.91a9.84,9.84,0,0,0,3.14.47,9.84,9.84,0,0,0,3.14-.47C21.67,14,22.5,13.26,22.5,12.48Z"></path>
                        <path class="cls-6375f1aeb67f094e4896c9f2-1" d="M12,12.48v7.63c0,1.32-2.35,2.39-5.25,2.39S1.5,21.43,1.5,20.11V12.48"></path>
                        <path class="cls-6375f1aeb67f094e4896c9f2-1" d="M22.5,13.48v6.63c0,1.32-2.35,2.39-5.25,2.39S12,21.43,12,20.11V12.48"></path>
                        <path class="cls-6375f1aeb67f094e4896c9f2-1" d="M22.5,6.75A5.25,5.25,0,1,1,17.25,1.5,5.2,5.2,0,0,1,22.5,6.75Z"></path>
                        <path class="cls-6375f1aeb67f094e4896c9f2-1" d="M22.5,12.48c0,.78-.83,1.48-2.11,1.91a9.84,9.84,0,0,1-3.14.47,9.84,9.84,0,0,1-3.14-.47C12.83,14,12,13.26,12,12.48s.69-1.36,1.78-1.8a5.22,5.22,0,0,0,6.94,0C21.81,11.12,22.5,11.76,22.5,12.48Z"></path>
                    </g>
                </svg>
                <h3 class="text-md font-bold dark:text-neutral-200">Sin ahorros</h3>
                <p class="text-sm text-gray-500 dark:text-neutral-400">Comience registrando un nuevo ahorro ahora.</p>
            </div>
            <button type="button" id="btn-agregar-ahorros-alerta" class="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border border-zinc-950 bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-indigo-700 dark:hover:bg-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Añadir ahorro
            </button>
        </div>
        `;
        // Agregamos el listener al boton de agregar
        const btnAgregarAlerta = alerta.querySelector(`#btn-agregar-ahorros-alerta`);
        btnAgregarAlerta.addEventListener('click', () => {
            modalAhorro();
        });
        // Agregamos al contenedor 
        document.getElementById(`contenedor-ahorros`).appendChild(alerta);
        return;
    }

    // Si hay ahorros, los mostramos
    const contenedor = document.getElementById('contenedor-ahorros');

    // Crear una sola lista e insertarla en el contenedor padre
    const lista = document.createElement('UL');
    lista.id = `lista-ahorros`;
    lista.className = 'divide-y divide-gray-200 dark:divide-neutral-800';
    contenedor.appendChild(lista);

    // Iterar sobre los ahorros y agregarlos a la lista
    ahorros.forEach((ahorro, index) => {
        // Hacemos destructuring
        const { id, monto, fecha } = ahorro;

        // Formateamos el monto según la moneda seleccionada
        const montoFormateado = formatearMonto(monto);
        const fechaFormateada = formatearFecha(fecha);

        // Creamos el elemento de la lista
        const itemLista = document.createElement('LI');
        itemLista.id = `${id}`
        itemLista.className = `flex items-center justify-between gap-3 py-3 px-3 md:px-5 cursor-pointer bg-white hover:bg-neutral-50 dark:bg-neutral-950 dark:hover:bg-neutral-900 group transition-all duration-500 ease-out opacity-0 translate-y-3`;
        itemLista.innerHTML = 
        `
        <div title="Abono al apartado" class="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 w-full">
            <div class="flex items-center gap-3">
                <div class="p-3 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>
                <div class="flex flex-col gap-0.5">
                        <h3 class="text-base font-medium dark:text-neutral-200">Abono realizado</h3>
                        <p class="text-xs text-gray-500 dark:text-neutral-400">${fechaFormateada}</p>
                    </div>
                </div>
                <div class="ml-14 md:ml-0">
                    <p class="font-semibold text-green-600 dark:text-green-500">+${montoFormateado}</p>
                </div>
            </div>
        <div>
            <button type="button" id='btn-eliminar-abono' class="block rounded-full p-2 hover:bg-gray-200 dark:hover:bg-neutral-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5 md:size-4 text-gray-600 dark:text-neutral-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </button>
        </div>
        `;
        // Añadir el item al UL
        lista.appendChild(itemLista);
        // Forzamos reflujo para que la transicion funcione
        void itemLista.offsetWidth;
        // Aplicamos las clases finales
        setTimeout(() => {
            itemLista.classList.remove('opacity-0', 'translate-y-3');
            itemLista.classList.add('opacity-100', 'translate-y-0');
        }, index * 100);
    });
}

// Función para actualizar el ahorro
function actualizarAhorro() {
    
}

// Funcion para obtener el uuid del apartado
function obtenerUuidApartado() {
    const apartadoParams = new URLSearchParams(window.location.search);
    const apartado = Object.fromEntries(apartadoParams.entries());
    return apartado.uid;
}

// Función para consultar el apartado al que vamos a ahorrar
async function obtenerApartado() {
    // Construimos la petición a la API
    try {
        // Obtener el uuid de la url 
        const params = new URLSearchParams(window.location.search);
        const uid = params.get('uid'); // Guardamos el uuid
        if(!uid) return;
        
        // Consultamos a la url con el uuid del apartado
        const url = `http://localhost:3000/api/apartado?uid=${uid}`;
        // Enviamos la petición GET para obtener los datos
        const respuesta = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        // Convertimos la respuesta en formato JSON
        const resultado = await respuesta.json();  
        apartado = resultado.apartado;
        // mandar llamar la funcion que obtiene los datos del apartado
        informacionApartado();
    } catch (error) {
        console.log(error);
        toast('Algo salió mal', `No se pudo obtener el apartado, intenta más tarde`);
    }
}

// Funcion para mostrar la informacion del apartado tipo header
function informacionApartado() {

    const { id, nombre, descripcion, imagen, monto, saldo_actual, fecha, fecha_meta, estado } = apartado;

    // Seleccionar el contenedor 
    const contenedorPadre = document.getElementById('contenedor-informacion');

    // Monto formateado
    const montoFormateado = formatearMonto(monto);
    const saldoFormateado = formatearMonto(saldo_actual);

    // Formatear fecha
    const fechaFormateada = formatearFecha(fecha_meta);

    // Crear el contenedor
    const contenedor = document.createElement('DIV');
    contenedor.className = 'flex flex-col';
    contenedor.innerHTML = 
    `
    <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4 pb-4 border-b border-gray-200 dark:border-neutral-800">
        <div class="flex flex-col gap-2">
            <h2 class="text-4xl font-bold dark:text-neutral-50">${nombre}</h2>
            <p class="text-gray-600 dark:text-neutral-400 md:w-96 font-normal">${descripcion}</p>
        </div>
        <div class="flex">
            <div class="flex flex-col items-start gap-2">
                <p id="saldo_actual" class="saldo_actual font-bold text-indigo-600 dark:text-indigo-500 text-4xl">${saldoFormateado}</p>
                <p class="text-gray-500 text-sm dark:text-neutral-400">De tu meta de: <span class="text-gray-950 dark:text-neutral-50 font-medium">${montoFormateado}</span></p>
            </div>
        </div>
    </div>
    `;

    // Insertar en el contenedor padre
    contenedorPadre.append(contenedor);
}