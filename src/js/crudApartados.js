document.addEventListener('DOMContentLoaded', iniciarApp);

// Variables globales
let apartados = []; // Arreglo de apartados
let apartadosFiltrados = []; // Arreglo de apartados filtrados
let buscadorFiltro; // Buscador filtro
let paginaActual = 1; // Pagina 1 cuando se active el paginador
const elementosPorPagina = 3; // Apartados que se mostraran por pagina cuando exista la paginacion
let tipo = null; // detectar la pagina actual

let mostrarPaginacion = localStorage.getItem('mostrar-paginacion') === 'true' ? true : false;
const isDark = document.documentElement.classList.contains('dark'); // Funcion para el modal dark / light

// importacion de funciones 
import {toast, limpiarHTML, formatearMonto, formatearFecha, debounce} from '/dist/js/utilidades.js';
import { obtenerSaldoUsuario, obtenerCantidades } from '/dist/js/main.js';

// Funcion padre
function iniciarApp() {
    // Obtenemos los apartados
    obtenerApartado();
    paginacion(); // LLamar paginacion 

    // evento para el boton de agregar apartado
    const btnAgregarApartado = document.getElementById('btn-agregar-apartado');
    if(btnAgregarApartado) {
        btnAgregarApartado.addEventListener('click', () => modalApartado()); // Accion para abrir el modal
    }

    // Evento para la filtracion desde el select
    const selectFiltro = document.getElementById(`filtro-apartados`);
    if(selectFiltro) {
        selectFiltro.addEventListener('change', filtrarApartados);
    }

    // Evento para aplicar filtros según la busqueda del usuario 
    buscadorFiltro = document.getElementById(`busqueda-apartados`);
    if(buscadorFiltro) {
        buscadorFiltro.addEventListener('input', debounce(filtrarApartadosBusqueda, 450));
    }
}

// Función para el modal de apartados
function modalApartado(editar = false, apartado = {}) {
    // Hacemos destructurgin al objeto apartado
    const { id, nombre, descripcion, imagen, monto, fecha, fecha_meta, estado, usuario_id } = apartado;

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
            <h2 class="text-2xl font-semibold text-zinc-900 dark:text-neutral-200">${editar ? 'Editar apartado' : 'Crear nuevo apartado'}</h2>
            <button type="button" id="btn-cerrar-modal" class="text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-200 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <p class="mt-1 text-base text-zinc-500 dark:text-neutral-400">${editar ? 'Edita la información de tu apartado y mantén todo actualizado y en orden' : 'Agrega un nuevo apartado para un mejor control de tus finanzas.'}</p>
    </div>
    <form class="w-full" novalidate id="formulario-apartados" enctype="multipart/form-data">
        <div class="p-6">
            <!-- Campo del nombre -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                <div class="flex-1">
                    <label for="nombre" class="block text-sm/6 font-medium text-gray-900 dark:text-neutral-200">Nombre</label>
                    <div class="mt-2">
                        <input type="text" id="nombre" autocomplete='on' placeholder="Ej: Vacaciones, etc..." name="nombre" value="${editar ? nombre : ''}" class="text-zinc-900 bg-gray-50 border border-gray-200 w-full px-3 py-2 text-base placeholder:text-gray-500 rounded-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 disabled:bg-gray-100 dark:placeholder:text-neutral-500 focus:outline-none focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500">
                    </div>
                </div>
                <div class="flex-1">
                    <label for="monto" class="block text-sm/6 font-medium text-gray-900 dark:text-neutral-200">Monto meta</label>
                    <div class="mt-2">
                        <input type="number" id="monto" autocomplete='on' placeholder="Ej: $ 6000.00" name="monto" value="${editar ? monto : ''}" class="text-zinc-900 bg-gray-50 border border-gray-200 w-full px-3 py-2 text-base placeholder:text-gray-500 rounded-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 disabled:bg-gray-100 dark:placeholder:text-neutral-500 focus:outline-none focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500">
                    </div>
                </div>
            </div>
            <!-- Campo de imagen -->
            <div class="mt-4">
                <label for="imagen" class="block text-sm font-medium text-gray-900 dark:text-neutral-200">
                    Imagen
                </label>
                <div class="mt-2 relative">
                    <input type="file" id="imagen" name="imagen" class="block w-full text-sm text-gray-900 border border-gray-200 rounded-md cursor-pointer bg-gray-50 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-900 file:text-white hover:file:bg-zinc-700 dark:file:bg-indigo-700 dark:file:hover:bg-indigo-600">
                    <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                        Formatos aceptados: JPG, PNG, WEBP.
                    </p>

                    ${editar && imagen ? `
                        <div class="mt-2">
                            <span class="text-sm text-gray-500 dark:text-neutral-400">Imagen actual:</span>
                            <img src="dist/img/apartados/${imagen}" alt="${nombre}" class="mt-1 w-40 h-32 object-cover rounded-md border border-gray-200 dark:border-neutral-700">
                        </div>
                    ` : ''}
                </div>
            </div>
            <!-- Campo de fecha objetivo -->
            <div class="mt-4">
                <label for="fechaMeta" class="block text-sm/6 font-medium text-gray-900 dark:text-neutral-200">Fecha objetivo</label>
                <div class="mt-2">
                    <input type="date" id="fechaMeta" autocomplete='on' name="fechaMeta" value="${editar ? fecha_meta : ''}" class="text-zinc-900 bg-gray-50 border border-gray-200 w-full px-3 py-2 text-base placeholder:text-gray-500 rounded-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 disabled:bg-gray-100 dark:placeholder:text-neutral-500 focus:outline-none focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500">
                </div>
            </div>
            <!-- Campo de descripción -->
            <div class="mt-4">
                <label for="descripcion" class="block text-sm/6 font-medium text-gray-900 dark:text-neutral-200">Descripción</label>
                <div class="mt-2">
                    <textarea id="descripcion" name="descripcion" rows="3" autocomplete="on" placeholder="Agrega una breve descripción a tu apartado..." class="text-zinc-900 bg-gray-50 border border-gray-200 w-full px-3 py-2 text-base placeholder:text-gray-500 rounded-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 disabled:bg-gray-100 dark:placeholder:text-neutral-500 focus:outline-none focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500">${editar ? descripcion : ''}</textarea>
                </div>
            </div>
        </div>
        <!-- Boton agregar -->
        <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-neutral-800">
            <button type="button" id="cancelar-apartado" class="w-auto flex items-center gap-2 justify-center rounded-md bg-transparent border border-gray-200 text-zinc-900 hover:bg-gray-50 px-3 py-2 text-base/6 font-semibold dark:border-zinc-500 dark:text-white dark:hover:text-gray-300 dark:hover:bg-neutral-900">Cancelar</button>
            <input type="submit" id="btn-guardar-apartado" value="${editar ? 'Guardar cambios' : 'Agregar apartado'}" class="w-auto rounded-md bg-zinc-900 dark:bg-indigo-700 text-white py-3 px-6 font-semibold cursor-pointer hover:bg-zinc-700 dark:hover:bg-indigo-600">
        </div>
    </form>
    `;

    // Insertar el modal
    overlay.appendChild(modal);

    // Obtenemos el btn para cerrar el modal manualmente
    const btnCerrar = modal.querySelector('#btn-cerrar-modal');
    btnCerrar.addEventListener('click', cerrarModal); // Activa la función cerrarModal
    const btnCancelar = modal.querySelector('#cancelar-apartado');
    btnCancelar.addEventListener('click', cerrarModal);
    overlay.addEventListener('click', (e) => e.target === overlay && cerrarModal()); // Activa la función cerrarModal

    // Obtener el boton para agregar el apartado
    const form = modal.querySelector('#formulario-apartados');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Extraer valores de los campos
        const nombre = form.querySelector('#nombre').value.trim();
        const monto = form.querySelector('#monto').value.trim();
        const imagen = form.querySelector('#imagen').files[0];
        const fechaMeta = form.querySelector('#fechaMeta').value;
        const descripcion = form.querySelector('#descripcion').value.trim();

        // Validar y mandar alerta si hay campos vacios
        if(nombre === '' || monto === '' || (!editar && !imagen) || fechaMeta === '' || descripcion === '') {
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
        if (imagen && imagen.size > 5 * 1024 * 1024) {
            Swal.fire({
                icon: 'error',
                title: 'Imagen demasiado pesada',
                text: 'Por favor, selecciona una imagen menor a 5MB',
                confirmButtonText: 'OK',
                confirmButtonColor: isDark ? '#ef4444' : '#dc2626',
                background: isDark ? '#262626' : '#ffffff',
                color: isDark ? '#e5e5e5' : '#1f2937',
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
        const datos = {nombre, monto, imagen, fechaMeta, descripcion};
        if(editar) {
            actualizarApartado(id, datos); // Llamada a actualizar apartado
        } else {
            crearApartado(datos); // Llamada a crear apartado
        }
        cerrarModal(); // Cerramos el modal 
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

// Función para crear los apartados
async function crearApartado(datos) {
    // Hacemos el destructuting a los datos
   const { nombre, monto, imagen, fechaMeta, descripcion} = datos;

   const data = new FormData();
   data.append('nombre', nombre);
   data.append('monto', monto);
   data.append('imagen', imagen);
   data.append('fecha_meta', fechaMeta);
   data.append('descripcion', descripcion);

   // Construimos la petición a la API 
   try {
        const url = 'http://localhost:3000/api/apartados';
        const respuesta = await fetch(url, {
            method: 'POST',
            body: data
        });
        const resultado = await respuesta.json();
        if(resultado.tipo === 'exito') {
            toast('Apartado guardado correctamente', 'El nuevo apartado se ha registrado exitosamente.');

            // Agregar el nuevo apartado al array de apartados
            const apartadoObj = {
                id: resultado.apartado.id,
                nombre: resultado.apartado.nombre,
                descripcion: resultado.apartado.descripcion,
                imagen: resultado.apartado.imagen,
                monto: resultado.apartado.monto,
                saldo_actual: resultado.apartado.saldo_actual,
                fecha: resultado.apartado.fecha,
                fecha_meta: resultado.apartado.fecha_meta,
                estado: resultado.apartado.estado,
                uuid: resultado.apartado.uuid,
                propietario_id: resultado.apartado.propietario_id,
            }
            // Agrearmos el apartadoObj al final del aray 
            apartados = [...apartados, apartadoObj];
            // Renderizamos de nuevo
            mostrarApartados();
            obtenerCantidades(); // Obtenemos la cantidades
            console.log(resultado.apartado);
            
        }
        
   } catch (error) {
        console.log(error);
        toast('Algo salió mal', `No se pudo crear el apartado, intenta más tarde`);
   }
}

// Función asíncrona para obtener las transacciones (ingreso o gasto)
async function obtenerApartado() {
    // Construimos la petición a la API
    try {
        const url = `http://localhost:3000/api/apartados`;
        // Enviamos la petición GET para obtener los datos
        const respuesta = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        // Convertimos la respuesta en formato JSON
        const resultado = await respuesta.json();  
        apartados = resultado.apartado
        mostrarApartados();
    } catch (error) {
        console.log(error);
        toast('Algo salió mal', `No se pudieron obtener los apartados, intenta más tarde`);
    }
}

// Funcion para rednerizar los apartados en el DOM
function mostrarApartados() {
    limpiarHTML('contenedor-apartados');
    limpiarHTML('paginacion');
    const arrayApartados = apartadosFiltrados.length ? apartadosFiltrados : [...apartados]; // si no hay filtros aplicados mostramos el arreglo de apartados, si si hay mostrar el filtro de apartados.
    // Ordenar por recientes solo si no hay filtros aplicados
    if(!apartadosFiltrados.length) {
        arrayApartados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // Ordenamos por fecha reciente a antigua
    }

    // Variables para la paginacion 
    let apartadosPorPagina = [...arrayApartados];
    // Si hay mas elementos que el limite y la paginacion esta activa
    if(apartadosPorPagina.length > elementosPorPagina && mostrarPaginacion) {
        // Calculamos el rango de elementos que se deben mostrar por pagina
        const inicio = (paginaActual - 1) * elementosPorPagina;
        const fin = inicio + elementosPorPagina;

        // Cortar el array solo con los elementos de la pagina
        apartadosPorPagina = arrayApartados.slice(inicio, fin);
        // Crear los botones segun el numero total de elementos por pagina
        botonesPaginacion(arrayApartados.length);
        // Mostramos el contenedor de paginacion 
        document.getElementById('paginacion').classList.remove('hidden');
    } else {
        // Oculta el contenedor de paginación
        document.getElementById('paginacion').classList.add('hidden');
    }

    if(arrayApartados.length === 0) {
        // Eliminamos las clases del contenedo r
        document.getElementById(`contenedor-apartados`).classList.remove('grid', 'md:grid-cols-2', 'xl:grid-cols-3', 'gap-5');
        document.getElementById(`contenedor-apartados`).classList.add('flex', 'justify-center', 'items-center');

        // Creamos la alerta
        const alerta = document.createElement('DIV');
        alerta.id = 'alerta';
        // Agregar atributos
        alerta.setAttribute = ('role', 'alerta');
        // Agregar clases
        alerta.className = 'flex items-center justify-center w-full h-96 px-2';
        alerta.innerHTML =
        `
        <div class="flex flex-col items-center gap-6 rounded-md p-8 w-[35rem] dark:border-neutral-700 border-2 border-gray-300 border-dashed">
            <div class="flex flex-col items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" class="size-14 text-gray-500 dark:text-neutral-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                </svg>
                <h3 class="text-md font-bold dark:text-neutral-200">Sin apartados</h3>
                <p class="text-sm text-gray-500 dark:text-neutral-400">Comience registrando un nuevo apartados ahora.</p>
            </div>
            <button type="button" id="btn-agregar-apartado-alerta" class="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border border-zinc-950 bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-indigo-700 dark:hover:bg-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Añadir apartado
            </button>
        </div>
        `;
        // Agregamos el listener al boton de agregar
        const btnAgregarAlerta = alerta.querySelector(`#btn-agregar-apartado-alerta`);
        btnAgregarAlerta.addEventListener('click', () => {
            modalApartado();
        });

        // Agregamos al contenedor 
        document.getElementById(`contenedor-apartados`).appendChild(alerta);
    } else {
        document.getElementById(`contenedor-apartados`).classList.remove('flex', 'justify-center', 'items-center');
        document.getElementById(`contenedor-apartados`).classList.add('grid', 'md:grid-cols-2', 'xl:grid-cols-3', 'gap-5');
    }

    // Iterar sobre los apartados
    apartadosPorPagina.forEach((apartado, index) => {
        // Hacemos destructuring al apartado
        const {id, nombre, monto, saldo_actual, descripcion, imagen, fecha, fecha_meta, estado, uuid, usuario_id} = apartado;

        // Formateamos la fecha 
        const fechaFormateada = formatearFecha(fecha_meta);
        // Formateamos el monto 
        const montoFormateado = formatearMonto(monto);
        // Formateamos el saldo actual
        const saldoActualFormateado = formatearMonto(saldo_actual);
        // Calcular progreso 
        const progreso = Math.min((saldo_actual / monto) * 100, 100).toFixed(0);
        
        // Crear contenedor de apartados
        const contenedorApartado = document.createElement('DIV');
        contenedorApartado.className = 'relative w-full h-72 rounded-lg overflow-hidden hover:shadow-lg dark:shadow-md opacity-0 transition-opacity duration-300 ease';
        contenedorApartado.id = id;
        contenedorApartado.innerHTML =
        `
        
        <!-- Imagen de fondo -->
        <div class="absolute inset-0">
            <img src="/dist/img/apartados/${imagen}" alt="${nombre}" class="w-full h-full object-cover" />
            <!-- Overlay degradado -->
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        </div>
        <!-- Contenido encima -->
        <div class="relative z-10 flex flex-col justify-end h-full p-4">
            <span id="estado-apartado" class="max-w-max capitalize px-2 py-0.5 rounded-full text-xs font-bold">${estado}</span>
            <div class="flex items-center justify-between gap-2 mt-1">
                <div class="flex items-center gap-2">
                    <h2 class="text-base font-bold text-neutral-100">${nombre}</h2>
                    <a href="/apartado?uid=${uuid}" class="px-3 text-neutral-200 bg-gray-100/30 hover:bg-gray-100/50 rounded-md" aria-label="Ver detalles del apartado de ${nombre}" >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                        </svg>
                    </a>
                </div>
                <div class="flex items-center gap-2">
                    <button type="button" id="btn-editar-apartado" class="rounded-full p-2 bg-gray-100/30 hover:bg-gray-100/50" aria-label="boton para editar el apartado">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4 text-neutral-200">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                    </button>
                    <button type="button" id="btn-eliminar-apartado-${id}" class="rounded-full p-2 bg-gray-100/30 hover:bg-gray-100/50" aria-label="boton para eliminar el apartado">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4 text-neutral-200">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </button>
                </div>
            </div>
            <p class="text-sm text-gray-300 dark:text-neutral-400">${saldoActualFormateado} de ${montoFormateado}</p>
            <p id="fecha-meta" class="text-xs mt-1" data-fecha="${fecha_meta}">Meta para el: ${fechaFormateada}</p>
            <!-- Barra de progreso -->
            <div class="mt-3">
                <div class="flex items-center justify-between mb-1">
                    <span class="text-sm font-medium text-neutral-200">Progreso</span>
                    <span class="text-sm font-medium text-neutral-200">${progreso}%</span>
                </div>
                <div class="w-full bg-neutral-500 rounded-full h-1.5">
                    <div class="bg-indigo-600 h-1.5 rounded-full" style="width: ${progreso}%;"></div>
                </div>
            </div>
        </div>   
        `;

        // Obtenemos el elemento de la fecha-meta
        const fechaP = contenedorApartado.querySelector('#fecha-meta');
        const fechaMeta = fechaP.dataset.fecha;

        // Crear fechas en local (sin desfase)
        const [year, mes, dia] = fechaMeta.split('-').map(Number);
        const fechaMetaDate = new Date(year, mes - 1, dia);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        fechaMetaDate.setHours(0, 0, 0, 0);

        // Verificar si venció o no
        if (fechaMetaDate.getTime() < hoy.getTime()) {
            // Ya venció
            fechaP.textContent = '¡Este apartado ya venció!';
            fechaP.classList.add('text-red-500', 'font-medium', 'bg-red-500/10', 'px-3', 'py-1', 'w-max', 'rounded-md');
        } else if (fechaMetaDate.getTime() === hoy.getTime()) {
            // Es hoy
            fechaP.textContent = '¡Tu apartado vence hoy!';
            fechaP.classList.add('text-orange-400', 'font-medium', 'bg-orange-600/10', 'px-3', 'py-1', 'w-max', 'rounded-md');
        } else {
            // Es futura
            fechaP.classList.add('text-gray-300', 'dark:text-neutral-400')
            fechaP.textContent = `Meta para el: ${fechaFormateada}`;
        }
        
        
        // Comprobar el cambio de estados
        const textoEstado = contenedorApartado.querySelector('#estado-apartado');
        if (saldo_actual === monto) {
            textoEstado.textContent = 'Completado';
            textoEstado.classList.remove('text-green-500', 'bg-emerald-600/30');
            textoEstado.classList.add('text-blue-600', 'bg-blue-600/20');
        } else {
            textoEstado.textContent = 'Activo';
            textoEstado.classList.remove('text-blue-600', 'bg-blue-600/20');
            textoEstado.classList.add('text-green-500', 'bg-emerald-600/30');
        }

        // Agregamos acciones a los botones de edicion y eliminar
        const btnEditar = contenedorApartado.querySelector('#btn-editar-apartado');
        const btnEliminar = contenedorApartado.querySelector(`#btn-eliminar-apartado-${id}`);

        // Agregarmos el evento correspondiente
        btnEditar.addEventListener('click', (e) => modalApartado(true, {...apartado}));
        btnEliminar.addEventListener('click', (e) => eliminarApartado(id));

        // Insertar en el DOM
        document.getElementById('contenedor-apartados').appendChild(contenedorApartado);

        // Forzamos reflujo para que la transicion funcione
        void contenedorApartado.offsetWidth;
        // Aplicamos las clases finales
        setTimeout(() => {
            contenedorApartado.classList.remove('opacity-0');
            contenedorApartado.classList.add('opacity-100');
        }, index * 100);
    });
}

// Funcion asincrona para actualizar / editar los apartados
async function actualizarApartado(id, datos) {
    const { nombre, monto, descripcion, imagen, fechaMeta} = datos;

    const data = new FormData();
    data.append('nombre', nombre);
    data.append('monto', monto);
    data.append('imagen', imagen);
    data.append('descripcion', descripcion);
    data.append('fecha_meta', fechaMeta);

    // Contruirmos el try
    try {
        const url = `http://localhost:3000/api/apartados/${id}`;
        const respuesta = await fetch(url, { 
            method: 'POST',
            body: data
        });
        const resultado = await respuesta.json();        
        // Si la respuesta indica éxito, mostramos una notificación positiva
        if(resultado.tipo === 'exito') {
            toast(`Apartado actualizado correctamente`, `El apartado se ha actualizado exitosamente.`);
            // Obtenemos la nueva imagen del servidor
            const nuevaImagen = resultado.apartado.imagen;
            // Actualizar la transacción en el array 
            apartados = apartados.map(apartadoObj => {
                if(apartadoObj.id === id) {
                    return { ...apartadoObj, nombre, monto, descripcion, imagen: nuevaImagen, fecha_meta: fechaMeta};
                }
                return apartadoObj;
            });
            
            // Renderizamos los apartados 
            mostrarApartados();
        }
        
    } catch(error) {
        console.log(error);
        toast('Algo salió mal', `No se pudo actualizar el apartado, intenta más tarde`);
    }
}

// Funcion para eliminar los apartados
async function eliminarApartado(id) {
    // Contruirmos el try
    try {
        const url = `http://localhost:3000/api/apartados/${id}`;
        const respuesta = await fetch(url, { 
            method: 'DELETE'
        });
        const resultado = await respuesta.json();
        // Si la respuesta indica éxito, mostramos una notificación positiva
        if(resultado.tipo === 'exito') {
            toast(`Apartado eliminado correctamente`, `El apartado se ha eliminado exitosamente.`);
            // Eliminar el apartado del array local si lo tienes cargado
            apartados = apartados.filter(apartado => apartado.id !== id);
            obtenerSaldoUsuario(); // Obtenemos el saldo del usuario
            // Renderizamos las transacciones
            mostrarApartados();
            obtenerCantidades(); // Actualizamos la cantidad
        }
    } catch (error) {
        console.log(error);
        toast('Algo salió mal', `No se pudo eliminar el apartado, intenta más tarde`);
    }
}

// Funcion para filtrar apartados por el select
function filtrarApartados(e) {
    // Leemos el valor del change o select
    const valor = e.target.value;
    // Tomamos una copia del arreglo original para filtrarlo
    apartadosFiltrados = [...apartados];

    // Validamos la seleccion y filtramos
    if(valor === 'recientes') {
        apartadosFiltrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // Orden de recientes a antiguos
    } else if(valor === 'antiguos') {
        apartadosFiltrados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)); // Orden de antiguos a recientes
    } else if(valor === 'activos') {
        apartadosFiltrados = apartadosFiltrados.filter(apartado => apartado.estado === 'activo'); // Filtrar por estado activo
    } else if(valor === 'completados') {
        apartadosFiltrados = apartadosFiltrados.filter(apartado => apartado.estado === 'completado'); // Filtrar por estado activo
    } else if(valor === 'cancelados') {
        apartadosFiltrados = apartadosFiltrados.filter(apartado => apartado.estado === 'cancelado'); // Filtrar por estado activo
    } else if(valor === 'todos') {
        apartadosFiltrados = []; // Todos los apartados
    }
    // Renderizamos los apartados
    mostrarApartados();
}

// Funcion para filtrar los apartados mediante la busqueda
function filtrarApartadosBusqueda() {
    // Guardamos lo que el usuario escribe
    const termino = buscadorFiltro.value.trim().toLowerCase();
    if(termino !== '') { // Si es diferente a un string vacio significa que hay algo en el buscador
        // Hcaemos la filtracion de los apartados
        apartadosFiltrados = apartados.filter(apartado => apartado.nombre.toLowerCase().includes(termino));
        // Si hay coinciddencias, filtrar
        if(apartadosFiltrados.length <= 0) {
            // Mostrar mensaje de error de busqueda
            limpiarHTML(`contenedor-apartados`);
            const mensaje = document.createElement('P');
            mensaje.className = `text-center text-gray-500 dark:text-neutral-400 py-4`;
            mensaje.textContent = 'Búsqueda sin resultados...';
            document.getElementById(`contenedor-apartados`).appendChild(mensaje);
        } else {
            // Si hay resultados mostrarlos y filtrarlos
            mostrarApartados();
        }
    } else {
        // Si esta vacio el campo de busqueda limpiar el contenedor
        apartadosFiltrados = [];
        mostrarApartados();
    }
}

// Funcion para mostrar la paginacion en caso que se requiera
function paginacion() {
    const btnSinPaginacion = document.getElementById(`btn-sin-paginacion-apartados`);
    const btnConPaginacion = document.getElementById(`btn-con-paginacion-apartados`);

    // Salir de la paginacion si los botones no existen 
    if(!btnSinPaginacion || !btnConPaginacion) return;

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
        mostrarApartados();
    });

    btnConPaginacion.addEventListener('click', () => {
        mostrarPaginacion = true;
        paginaActual = 1;
        localStorage.setItem('mostrar-paginacion', mostrarPaginacion);
        actualizarBotones();
        mostrarApartados();
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
            mostrarApartados();
        });
        // Insertar en la paginacion
        document.getElementById('paginacion').appendChild(btn);
    }
}