document.addEventListener('DOMContentLoaded', iniciarApp);

// Importar funciones de utilidades
import {toast, formatearFecha, formatearMonto, limpiarHTML} from '/dist/js/utilidades.js';
import { obtenerSaldoUsuario } from '/dist/js/main.js';

// Variables globales
let abonos = [];
let abonosFiltrados = [];
let paginaActual = 1;
const elementosPorPagina = 6;
let mostrarPaginacion = localStorage.getItem('mostrar-paginacion') === 'true' ? true : false;  // Verifica si en el localStorage está guardado el valor 'mostrar-paginacion' como 'true'.
const isDark = document.documentElement.classList.contains('dark'); // Funcion para el modal dark / light

// Funcion padre
function iniciarApp() {
    esFechaMeta(); // Verificar si la fecha meta ya pasó
    obtenerAbono(); // Llamar la funcion para obtener los abonos
    formatearMontoAbono(); // Formatear el monto y el saldo_actual
    paginacion(); // Mostrar u ocultar la paginacion segun preferencia del usuario
    // evento para el boton de agregar el abono
    const btnAgregarAbono = document.getElementById('btn-agregar-abono');
    if(btnAgregarAbono) {
        btnAgregarAbono.addEventListener('click', () => modalAbono()); // Accion para abrir el modal
    }

    // Evento para aplicar los filtros del select
    const btnFiltrarAbonos = document.getElementById('filtro-abonos');
    if(btnFiltrarAbonos) {
        btnFiltrarAbonos.addEventListener('change', filtroAbonos);
    }
}

// Función para el modal de agregar abonos
function modalAbono(editar = false, abono = {}) {
    // Hacemos destructuring si es editar
    const {id, monto, apartado_id} = abono;

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
            <h2 class="text-2xl font-semibold text-zinc-900 dark:text-neutral-200">${editar ? 'Edita tu abono' : 'Agregar nuevo abono'}</h2>
            <button type="button" id="btn-cerrar-modal" class="text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-200 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <p class="mt-1 text-base text-zinc-500 dark:text-neutral-400">${editar ? 'Edita la información de tu abono y manten actualizados tus movimientos.' : 'Agrega tu nuevo abono para alcanzar tus metas más pronto.'}</p>
    </div>
    <form class="w-full" novalidate id="formulario-abonos">
        <div class="p-6">
            <!-- Campo del monto -->
            <div class="flex-1">
                <label for="monto" class="block text-sm/6 font-medium text-gray-900 dark:text-neutral-200">Monto meta</label>
                <div class="mt-2">
                    <input type="number" id="monto" autocomplete='on' placeholder="Ej: $450.00" name="monto" value="${editar ? monto : ''}" class="text-zinc-900 bg-gray-50 border border-gray-200 w-full px-3 py-2 text-base placeholder:text-gray-500 rounded-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 disabled:bg-gray-100 dark:placeholder:text-neutral-500 focus:outline-none focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500">
                </div>
            </div>
        </div>
        <!-- Boton agregar -->
        <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-neutral-800">
            <button type="button" id="cancelar-abono" class="w-auto flex items-center gap-2 justify-center rounded-md bg-transparent border border-gray-200 text-zinc-900 hover:bg-gray-50 px-3 py-2 text-base/6 font-semibold dark:border-zinc-500 dark:text-white dark:hover:text-gray-300 dark:hover:bg-neutral-900">Cancelar</button>
            <input type="submit" id="btn-guardar-abono" value="${editar ? 'Guardar cambios' : 'Agregar abono'}" class="w-auto rounded-md bg-zinc-900 dark:bg-indigo-700 text-white py-3 px-6 font-semibold cursor-pointer hover:bg-zinc-700 dark:hover:bg-indigo-600">
        </div>
    </form>
    `;

    // Insertar el modal
    overlay.appendChild(modal);

    // Obtenemos el btn para cerrar el modal manualmente
    const btnCerrar = modal.querySelector('#btn-cerrar-modal');
    btnCerrar.addEventListener('click', cerrarModal); // Activa la función cerrarModal
    const btnCancelar = modal.querySelector('#cancelar-abono');
    btnCancelar.addEventListener('click', cerrarModal);
    overlay.addEventListener('click', (e) => e.target === overlay && cerrarModal()); // Activa la función cerrarModal

    // Obtener el boton para agregar el apartado
    const form = modal.querySelector('#formulario-abonos');
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
        } else if (monto <= 0) {
            // Arrojar alerta
            Swal.fire({
                icon: 'error',
                title: 'Algo salió mal...',
                text: 'El monto no puede ser cero o negativo',
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

        if(editar) {
            // Actualizar el abono
            actualizarAbono(id, monto, apartado_id);
        } else {
            // Enviar el monto
            crearAbono(monto);
        }
        // cerrar el modal despues de agregar el abono
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

// Función para crear el abono
async function crearAbono(monto) {
    const data = new FormData();
    data.append('monto', monto);
    data.append('apartado_id', obtenerUuidApartado());

    // Hacemos la peticion a la API
    try {
        const url = `http://localhost:3000/api/abonos`;
        const respuesta = await fetch(url, {
            method: 'POST',
            body: data
        });
        const resultado = await respuesta.json();

        if(resultado.tipo === 'error') {
            toast('Algo salió mal', `${resultado.mensaje}`);
        }
        if(resultado.tipo === 'exito') {
            toast('Abono guardado correctamente', 'El nuevo abono se a registrado exitosamente.');
            // Crear un objeto dinamico de aportado
            const abonoObj = {
                id: resultado.abono.id,
                monto: resultado.abono.monto,
                apartado_id: resultado.abono.apartado_id,
                propietario_id: resultado.abono.propietario_id
            }
            // Agregamos categoriasObj al final del array categorias sin modificar el array original de forma directa, sino creando un nuevo array actualizado.
            abonos = [...abonos, abonoObj];
            obtenerSaldoUsuario(); // Obtenemos el saldo del usuario 
            obtenerAbono(); // Llamar la funcion para obtener los abonos
            actualizarSaldo(resultado.saldo_actual);
        }
        
    } catch (error) {
        console.log(error);
        toast('Algo salió mal', 'El nuevo abono no se ha podido guardar, intenta más tarde.');
    }   
}

// Funcion para leer los abonos del apartado
async function obtenerAbono() {
    // Obtenemos el UID del apartado desde la URL actual
    const uid = obtenerUuidApartado();

    // Construimos la petición a la API
    try {
        const url = `http://localhost:3000/api/abonos?uid=${uid}`;
        const respuesta = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },  
        });
        const resultado = await respuesta.json();
        abonos = resultado.abonos;
        // Mandar llamar la funcion que muestra los abonos
        mostrarAbonos();

    } catch (error) {
        toast('Algo salió mal', `No se pudieron obtener los abonos, intenta más tarde`);
        console.log(error);
        
    }
}

// Funcion que muestra los abonos en el HTML
function mostrarAbonos() {
    // Limpiar el contenedor
    limpiarHTML('contenedor-abonos');
    limpiarHTML('paginacion');
    // Ordenar siempre por fecha: del mas reciente al mas antiguo
    const arrayAbonos = abonosFiltrados.length ? abonosFiltrados : [...abonos]; // Si no hay filtro, arrayAbonos recibe una copia del arreglo abonos.
    // Ordenar solo si no hay filtros aplicados
    if(!abonosFiltrados.length) {
        arrayAbonos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // Ordenamos por fecha reciente a antigua
    }

    // Obtener el <p> de la fecha
    const fechaP = document.getElementById('fecha-meta');
    const fechaMeta = fechaP.dataset.fecha;

    // Crear fechas en local (sin desfase)
    const [year, mes, dia] = fechaMeta.split('-').map(Number);
    const fechaMetaDate = new Date(year, mes - 1, dia);
    const hoy = new Date();
    fechaMetaDate.setHours(0, 0, 0, 0); // Establecer la hora a medianoche
    hoy.setHours(0, 0, 0, 0); // Establecer la hora a medianoche

    if(arrayAbonos.length === 0) {
        // Creamos la alerta
        const alerta = document.createElement('DIV');
        alerta.id = 'alerta';
        alerta.setAttribute('role', 'alert');
        // Verificar si la fecha ya venció
        const vencido = fechaMetaDate < hoy;
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
                <h3 class="text-md font-bold dark:text-neutral-200">${vencido ? 'Fecha ya vencida' : 'Sin abonos'}</h3>
                <p class="text-sm text-gray-500 dark:text-neutral-400 text-center">${vencido ? 'La fecha limite para realizar abonos ha expirado; si desea seguir agregando abonos cambie la fecha o cree otro apartado.' : 'Comience registrando un nuevo abono ahora.'}</p>
            </div>
            ${vencido ? 
                `
                <div class="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-red-500/10 text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>

                    No se pueden registrar nuevos abonos
                </div>`
                :
                `
                <button type="button" id="btn-agregar-abonos-alerta" class="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border border-zinc-950 bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-indigo-700 dark:hover:bg-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Añadir abono
                </button>
                `
            }
        </div>
        `;
        // Agregamos el listener al boton de agregar
        const btnAgregarAlerta = alerta.querySelector(`#btn-agregar-abonos-alerta`);
        if(btnAgregarAlerta) {
            btnAgregarAlerta.addEventListener('click', () => {
                modalAbono();
            });
        }
        // Agregamos al contenedor 
        document.getElementById(`contenedor-abonos`).appendChild(alerta);
        return;
    }
 
    // Variable para la paginación
    let abonosPorPagina = [...arrayAbonos];

    // Si hay mas elementos que el limite, aplicamos la paginacion 
    if(arrayAbonos.length > elementosPorPagina && mostrarPaginacion) {
        // Calcular los indices de inicio y fin
        const indiceInicio = (paginaActual - 1) * elementosPorPagina;
        const indiceFin = indiceInicio + elementosPorPagina;

        // Cortar el array de abonos para obtener solo los elementos de la página actual
        abonosPorPagina = arrayAbonos.slice(indiceInicio, indiceFin);
        // Llamar a la función de paginación
        botonesPaginacion(arrayAbonos.length);
        // Activamos la clase que muestra la paginacion
        document.getElementById('paginacion').classList.remove('hidden');
    } else {
        // Ocultar la paginación si no es necesaria
        document.getElementById('paginacion').classList.add('hidden');
    }

    // Si hay abonos, los mostramos
    const contenedor = document.getElementById('contenedor-abonos');

    // Crear una sola lista e insertarla en el contenedor padre
    const lista = document.createElement('UL');
    lista.id = `lista-abonos`;
    lista.className = 'divide-y divide-gray-200 dark:divide-neutral-800';
    contenedor.appendChild(lista);

    // Iterar sobre los abonos y agregarlos a la lista
    abonosPorPagina.forEach((abono, index) => {
        // Hacemos destructuring
        const { id, monto, fecha } = abono;

        // Formateamos el monto según la moneda seleccionada
        const montoFormateado = formatearMonto(monto);

        // Formateamos la fecha y hora
        const fechaObj = new Date(fecha); // Convertimos el string en objeto date
        const opcionesFecha = {day: 'numeric', month: 'long', year: 'numeric'} // Formatos de fecha
        const fechaFormateada = new Intl.DateTimeFormat('es-MX', opcionesFecha).format(fechaObj); // Fecha formateada
        const horas = fechaObj.getHours().toString().padStart(2, '0'); // Formatos de hora
        const minutos = fechaObj.getMinutes().toString().padStart(2, '0'); // Formatos de hora
        const horaFormateada = `${horas}:${minutos}`; // Hora formateada 


        // Creamos el elemento de la lista
        const itemLista = document.createElement('LI');
        itemLista.id = `${id}`
        itemLista.ondblclick = (e) => modalAbono(true, {...abono});
        itemLista.className = `flex items-center justify-between gap-3 py-3 px-3 md:px-5 cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-neutral-950 dark:hover:bg-neutral-900 group transition-all duration-500 ease-out opacity-0 translate-y-3`;
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
                        <p class="text-xs text-gray-500 dark:text-neutral-400">${fechaFormateada} a las ${horaFormateada}</p>
                    </div>
                </div>
                <div class="ml-14 md:ml-0">
                    <p class="font-semibold text-green-600 dark:text-green-500">+${montoFormateado}</p>
                </div>
            </div>
        <div>
            <button type="button" id='btn-eliminar-abono-${id}' aria-label="elminiar el abono" class="block rounded-full p-2 hover:bg-gray-200 dark:hover:bg-neutral-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5 md:size-4 text-gray-400 dark:text-neutral-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </button>
        </div>
        `;
        // Agregamos acciones a los botones de edicion y eliminar
        const btnEliminar = itemLista.querySelector(`#btn-eliminar-abono-${id}`);
        btnEliminar.addEventListener('click', (e) => eliminarAbono(id));

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

// Función para actualizar el abono
async function actualizarAbono(id, monto, apartado_id) {
    // Hacemos la peticion a la API
    try {
        const url = `http://localhost:3000/api/abonos/${id}`;
        const respuesta = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({monto, apartado_id}),
        });
        const resultado = await respuesta.json();
        // Si la respuesta indica éxito, mostramos una notificación positiva
        if(resultado.tipo === 'exito') {
            toast('Abono actualizado correctamente', 'El abono se ha actualizado exitosamente.');
            // Actualizar el abono en el array principal
            abonos = abonos.map(abonoObj => {
                if(abonoObj.id === id) {
                    return { ...abonoObj, monto};
                }
                return abonoObj;
            });
            // Actualizar el saldo en el HTML
            obtenerSaldoUsuario(); // Obtenemos el saldo del usuario 
            actualizarSaldo(resultado.saldo_actual);
            // Renderizamos las transacciones
            mostrarAbonos();
        }
    } catch (error) {
        console.log(error);
        toast('Algo salió mal', 'El abono no se ha podido actualizar, intenta más tarde.');
    }
}

// Función para eliminar el abono
async function eliminarAbono(id) {
    // Contruirmos el try
    try {
        const url = `http://localhost:3000/api/abonos/${id}`;
        const respuesta = await fetch(url, { 
            method: 'DELETE'
        });
        const resultado = await respuesta.json();
        // Si la respuesta indica éxito, mostramos una notificación positiva
        if(resultado.tipo === 'exito') {
            toast(`Abono eliminado correctamente`, `El abono se ha eliminado exitosamente.`);
            obtenerSaldoUsuario(); // Obtenemos el saldo del usuario
            actualizarSaldo(resultado.saldo_actual);
            // Eliminar el abono del array local si lo tienes cargado
            abonos = abonos.filter(abono => abono.id !== id);
            // Eliminar el abono de los abonos filtrados si hay un filtro activo
            abonosFiltrados = abonosFiltrados.filter(abono => abono.id !== id);
            // Renderizamos los abonos
            mostrarAbonos();
        }
    } catch (error) {
        console.log(error);
        toast('Algo salió mal', `No se pudo eliminar el abono, intenta más tarde`);
    }
}

// Funcion para obtener el uuid del apartado
function obtenerUuidApartado() {
    const apartadoParams = new URLSearchParams(window.location.search);
    const apartado = Object.fromEntries(apartadoParams.entries());
    return apartado.uid;
}

// Función para formatear el monto y el saldo_actual
function formatearMontoAbono() {
    // Seleccionar los elementos del DOM
    const saldoActualElem = document.getElementById('saldoActual');
    const montoElem = document.getElementById('monto');

    const saldoActual = parseFloat(saldoActualElem.textContent.replace(/[^0-9.]/g, ''));
    const monto = parseFloat(montoElem.textContent.replace(/[^0-9.]/g, ''));

    saldoActualElem.textContent = formatearMonto(saldoActual);
    montoElem.textContent = formatearMonto(monto);
}

// Funcion para actualizar el saldo actual en el DOM
function actualizarSaldo(nuevoSaldo) {
    const saldoActualElemento = document.getElementById('saldoActual');

    // Obtener el valor numérico actual mostrado
    const saldoActualTexto = saldoActualElemento.textContent.trim();
    const saldoActual = parseFloat(saldoActualTexto.replace(/[^0-9.]/g, '')) || 0;

    // Animar del saldo actual al nuevo
    animarNumero(saldoActualElemento, saldoActual, nuevoSaldo, 800);
}

// Función para animar el cambio de número
function animarNumero(elemento, inicio, fin, duracion = 1300) {
    const diferencia = fin - inicio;
    const paso = 2000 / 120; // ~60 FPS
    const totalPasos = duracion / paso;
    let pasoActual = 0;

    const animacion = setInterval(() => {
        pasoActual++;
        const progreso = pasoActual / totalPasos;
        const valorActual = inicio + diferencia * easeOutCubic(progreso);

        elemento.textContent = formatearMonto(valorActual);

        if (pasoActual >= totalPasos) {
            clearInterval(animacion);
            elemento.textContent = formatearMonto(fin);
        }
    }, paso);
}

// Función de easing para una animación más suave
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// Funció para filtrar los abonos por fecha
function filtroAbonos(e) {
    const filtro = e.target.value;
    // Hacemos una copia del arreglo originial 
    abonosFiltrados = [...abonos];

    // Validamos el filtro seleccionado
    if(filtro === 'recientes') {
        abonosFiltrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // Orden de recientes a antiguos
    } else if(filtro === 'antiguos') {
        abonosFiltrados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)); // Orden de antiguos a recientes
    } else if(valor === 'todos') {
        abonosFiltrados = []; // Todas las transacciones
    }
    // Renderizamos los abonos filtrados
    mostrarAbonos();
}

// Función para mostrar la páginación (si es necesario)
function paginacion() {
    const btnConPaginacion = document.getElementById('btn-con-paginacion-abonos');
    const btnSinPaginacion = document.getElementById('btn-sin-paginacion-abonos');

    // Salir de la función si los botones no existen
    if (!btnSinPaginacion || !btnConPaginacion) return;

    // Si mostrar paginacion es false resaltar el boton sin paginar
    if (mostrarPaginacion === false) {
        btnSinPaginacion.classList.add('text-gray-900', 'bg-gray-100', 'dark:text-neutral-200', 'dark:bg-neutral-800');
    } else {
        btnConPaginacion.classList.add('text-gray-900', 'bg-gray-100', 'dark:text-neutral-200', 'dark:bg-neutral-800');
    }

    // Event listeners para los botones
    btnSinPaginacion.addEventListener('click', () => {
        mostrarPaginacion = false;
        paginaActual = 1;
        localStorage.setItem('mostrar-paginacion', mostrarPaginacion);
        actualizarBotones();
        mostrarAbonos();
    });

    btnConPaginacion.addEventListener('click', () => {
        mostrarPaginacion = true;
        paginaActual = 1;
        localStorage.setItem('mostrar-paginacion', mostrarPaginacion);
        actualizarBotones();
        mostrarAbonos();
    });

    // Función interna para actualizar los estilos de los botones
    function actualizarBotones() {
        if (mostrarPaginacion) {
            btnConPaginacion.classList.add('bg-gray-100', 'text-gray-900', 'dark:bg-neutral-800', 'dark:text-neutral-200');
            btnSinPaginacion.classList.remove('bg-gray-100', 'text-gray-900', 'dark:bg-neutral-800');
        } else {
            btnSinPaginacion.classList.add('bg-gray-100', 'text-gray-900', 'dark:bg-neutral-800', 'dark:text-neutral-200');
            btnConPaginacion.classList.remove('bg-gray-100', 'text-gray-900', 'dark:bg-neutral-800');
        }
    }
}

// Función donde se crean los botones de la paginación
function botonesPaginacion(totalElementos) {
    const totalPaginas = Math.ceil(totalElementos / elementosPorPagina);
    for(let i = 1; i <= totalPaginas; i++) {
        // Construimos boton de paginacion
        const btn = document.createElement('BUTTON');
        // Asignar numero de pagina
        btn.textContent = i;
        // Añadir clases
        btn.className = `px-2 py-1 rounded-md border font-medium ${i === paginaActual ? 'bg-gray-950 text-white border-gray-900 dark:bg-indigo-600 dark:border-indigo-600' : 'bg-white text-gray-900 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400'}`;
        // Añadir event
        btn.addEventListener('click', () => {
            paginaActual = i;
            mostrarAbonos();
        });
        // Insertar en la paginacion
        document.getElementById('paginacion').appendChild(btn);
    }
}

// Función para cambiar texto de alerta fechaMeta
function esFechaMeta() {
    // Obtener el <p> de la fecha
    const fechaP = document.getElementById('fecha-meta');
    const fechaMeta = fechaP.dataset.fecha;

    // Crear fechas en local (sin desfase)
    const [year, mes, dia] = fechaMeta.split('-').map(Number);
    const fechaMetaDate = new Date(year, mes - 1, dia);
    const hoy = new Date();
    fechaMetaDate.setHours(0, 0, 0, 0); // Establecer la hora a medianoche
    hoy.setHours(0, 0, 0, 0); // Establecer la hora a medianoche

   // Verificar si venció o no
    if (fechaMetaDate.getTime() < hoy.getTime()) {
        // Ya venció
        fechaP.textContent = `El apartado venció el: ${fechaMetaDate.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    } else if (fechaMetaDate.getTime() === hoy.getTime()) {
        // Es hoy
        fechaP.textContent = 'El apartado vence hoy';
        
    } else {
        // Es futura
        fechaP.textContent = `El apartado vence el: ${fechaMetaDate.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    }
}
