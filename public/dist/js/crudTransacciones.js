document.addEventListener('DOMContentLoaded', iniciarApp);

// Variables globales
let transacciones = []; // Arreglo de transacciones
let transaccionesFiltradas = []; // Arreglo de transacciones filtradas
let transaccionTotales = 0;
let buscadorFiltro; // Variable de un buscador

let mostrarPaginacion = localStorage.getItem('mostrar-paginacion') === 'true' ? true : false;  // Verifica si en el localStorage está guardado el valor 'mostrar-paginacion' como 'true'.
let paginaActual = 1; // Define el número de página actual en la que se encuentra el usuario al iniciar.
const elementosPorPagina = 6; // Establece cuántos elementos (por ejemplo, transacciones) se mostrarán por cada página.

const isDark = document.documentElement.classList.contains('dark'); // Funcion para el modal dark / light

// importación de funciones
import { toast, limpiarHTML, formatearMonto, debounce} from '/dist/js/utilidades.js';
import { obtenerSaldoUsuario, obtenerCantidades } from '/dist/js/main.js';

// detectar la pagina actual
let tipo = null;

// Función padre
function iniciarApp() {
    // Detectar tipo de página
    if (document.getElementById('contenedor-ingresos')) {
        tipo = 'ingreso';
    } else if (document.getElementById('contenedor-gastos')) {
        tipo = 'gasto';
    }

    // Solo llenar los selects que existan
    if (document.getElementById('filtro-gastos')) {
        selectCategorias('gasto', null, 'filtro-gastos');
    }

    if (document.getElementById('filtro-ingresos')) {
        selectCategorias('ingreso', null, 'filtro-ingresos');
    }
    
    if(tipo) {
        // Obtener las transacciones dependiendo el tipo
        obtenerTransaccion();
        // Mostrar paginación según sea el caso
        paginacion();
        
        // Verificar la existencia del boton correspondiente a la página
        const btnAgregar = document.getElementById(`btn-agregar-${tipo}`);
        if(btnAgregar) {
            btnAgregar.addEventListener('click', () => {
                modalTransaccion();
            });
        }

        // Evento para la filtracion desde el select
        const selectFiltro = document.getElementById(`filtro-${tipo}s`);
        if(selectFiltro) {
            selectFiltro.addEventListener('change', filtrarTransaccion);
        }

        // Evento para aplicar filtros según la busqueda del usuario 
        buscadorFiltro = document.getElementById(`busqueda-${tipo}s`);
        if(buscadorFiltro) {
            buscadorFiltro.addEventListener('input', debounce(filtrarTransaccionBusqueda, 450));
        }
    }
}

// Función para llenar un select con categorías
async function selectCategorias(tipo, categoriaSeleccionada = null, idSelect = 'categoria') {
    try {
        const url = `http://localhost:3000/api/${tipo}s/categorias`;
        const respuesta = await fetch(url, { method: 'GET' });
        const categorias = await respuesta.json();

        const select = document.getElementById(idSelect);
        if (!select) return console.error(`No se encontró el select con id: ${idSelect}`);

        select.innerHTML = '';

        if (idSelect === 'filtro-gastos' || idSelect === 'filtro-ingresos') {
            const opcionesFijas = [
                { value: '', text: 'Selecciona un filtro', disabled: true, selected: true },
                { value: 'todos', text: 'Todos' },
                { value: 'recientes', text: 'Más recientes' },
                { value: 'antiguos', text: 'Más antiguos' },
                { value: 'mayor', text: tipo === 'gasto' ? 'Mayor gasto' : 'Mayor ingreso' },
                { value: 'menor', text: tipo === 'gasto' ? 'Menor gasto' : 'Menor ingreso' }
            ];

            opcionesFijas.forEach(opt => {
                const option = document.createElement('OPTION');
                option.value = opt.value;
                option.textContent = opt.text;
                if (opt.disabled) option.disabled = true;
                if (opt.selected) option.selected = true;
                select.appendChild(option);
            });
        } else {
            const optionDefault = document.createElement('OPTION');
            optionDefault.value = '';
            optionDefault.textContent = 'Seleccionar categoría';
            optionDefault.disabled = true;
            optionDefault.selected = true;
            select.appendChild(optionDefault);
        }

        // Agregar categorías dinámicas
        categorias.forEach((categoria) => {
            const option = document.createElement('OPTION');
            option.value = categoria.id;
            option.textContent = categoria.nombre;

            if (categoriaSeleccionada && categoriaSeleccionada === categoria.id) {
                option.selected = true;
            }

            select.appendChild(option);
        });
    } catch (error) {
        console.log(error);
        toast('Algo salió mal', 'No se pudieron obtener las categorías, intenta más tarde');
    }
}

// Función modal para transacciones (ingreso / gasto)
function modalTransaccion(editar = false, transaccion = {}) {
    // hacemos destructuring de la transaccion
    const {id, monto, descripcion, metodo_pago, categoria_id} = transaccion;

    // crear el overlay
    const overlay = document.createElement('DIV');
    overlay.id = 'overlay-modal-transacciones';
    overlay.className ='w-full h-screen fixed flex items-center justify-center inset-0 z-30 bg-black bg-opacity-50 opacity-0 transition-opacity duration-500 ease-in-out';
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // crear el modal interno
    const modal = document.createElement('DIV');
    modal.className ='max-w-lg bg-white border border-gray-200 shadow-md rounded-md mx-2 -translate-y-10 transition-transform duration-500 ease z-40 dark:bg-neutral-900 dark:border-neutral-800';
    modal.innerHTML =
    `
    <div class="flex flex-col pb-6 border-b border-gray-200 dark:border-neutral-800 p-6">
        <div class="flex items-center justify-between gap-2">
            <h2 class="text-2xl font-semibold text-zinc-900 dark:text-neutral-200"> ${editar ? `Editar ${tipo}` : `Registra un nuevo ${tipo}`}</h2>
            <button type="button" id="btn-cerrar-modal" class="text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-200 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <p class="mt-1 text-base text-zinc-500 dark:text-neutral-400">${editar ? `Actualiza tu ${tipo} con la información correcta.` : `Agrega un nuevo ${tipo} para mantener tus finanzas al día.`}</p>
    </div>
    <form class="w-full" novalidate id="formulario">
        <div class="p-6">
            <!-- Campo de monto -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                <div class="flex-1">
                    <label for="monto" class="block text-sm/6 font-medium text-gray-900 dark:text-neutral-200">Monto</label>
                    <div class="mt-2">
                        <input type="number" id="monto" autocomplete='on' placeholder="$ 0.00" name="monto" value="${editar ? monto : ''}" class="text-zinc-900 bg-gray-50 border border-gray-200 w-full px-3 py-2 text-base placeholder:text-gray-500 rounded-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 disabled:bg-gray-100 dark:placeholder:text-neutral-500 focus:outline-none focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500">
                    </div>
                </div>
                <div class="flex-1">
                    <label for="categoria" class="block text-sm/6 font-medium text-gray-900 dark:text-neutral-200">Categoria</label>
                    <select id="categoria" name="categoria" class="text-zinc-900 bg-gray-50 border border-gray-200 w-full mt-2 px-3 py-2 text-base placeholder:text-gray-500 rounded-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 disabled:bg-gray-100 dark:placeholder:text-neutral-500 focus:outline-none focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500"></select>
                </div>
            </div>
            <!-- Campo de descripción -->
            <div class="mt-4">
                <label for="descripcion" class="block text-sm/6 font-medium text-gray-900 dark:text-neutral-200">Descripcion</label>
                <div class="mt-2">
                    <input type="text" id="descripcion" autocomplete='on' placeholder="${tipo === 'ingreso' ? 'Ej: Salario mensual' : 'Ej: Suscripción de Netflix'}" name="descripcion" value="${editar ? descripcion : ''}" class="text-zinc-900 bg-gray-50 border border-gray-200 w-full px-3 py-2 text-base placeholder:text-gray-500 rounded-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 disabled:bg-gray-100 dark:placeholder:text-neutral-500 focus:outline-none focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500">
                </div>
            </div>
            <!-- Campo metodo de pago -->
            <div class="mt-4">
                <label for="metodo_pago" class="block text-sm/6 font-medium text-gray-900 dark:text-neutral-200">Método de pago</label>
                <select id="metodo_pago" name="metodo_pago" class="text-zinc-900 bg-gray-50 border border-gray-200 w-full mt-2 px-3 py-2 text-base placeholder:text-gray-500 rounded-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 disabled:bg-gray-100 dark:placeholder:text-neutral-500 focus:outline-none focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500">
                    <option value="${editar ? metodo_pago : ''}" disabled selected>${editar ? metodo_pago : 'Selecciona un método de pago'}</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="tarjeta">Tarjeta</option>
                </select>
            </div>
        </div>
        <!-- Boton agregar -->
        <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-neutral-800">
            <button type="button" id="cancelar-transaccion" class="w-auto flex items-center gap-2 justify-center rounded-md bg-transparent border border-gray-200 text-zinc-900 hover:bg-gray-50 px-3 py-2 text-base/6 font-semibold dark:border-zinc-500 dark:text-white dark:hover:text-gray-300 dark:hover:bg-neutral-900">Cancelar</button>
            <input type="submit" id="btn-guardar" value="${editar ? 'Guardar cambios' : `Agregar ${tipo}`}" class="w-auto rounded-md bg-zinc-900 dark:bg-indigo-700 text-white py-3 px-6 font-semibold cursor-pointer hover:bg-zinc-700 dark:hover:bg-indigo-600">
        </div>
    </form>
    `;

    // Insertar el modal
    overlay.appendChild(modal);
    
    // Llenar el select de categorias
    selectCategorias(tipo, editar ? categoria_id : null, 'categoria');

    // Seleccionar el formulario 
    const form = modal.querySelector('#formulario');
    form.addEventListener('submit', async(e) => {
        e.preventDefault();

        // Obtenemos el valor de los campos
        const monto = modal.querySelector('#monto').value.trim();
        const categoria_id = modal.querySelector('#categoria').value.trim();
        const descripcion = modal.querySelector('#descripcion').value.trim();
        const metodo_pago = modal.querySelector('#metodo_pago').value.trim();

        // Validar y mandar alerta si hay campos vacios
        if(monto === '' || categoria_id === '' || descripcion === '' || metodo_pago === '') {
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

        // Creamos un objeto que agrupa los valores capturados de los campos del formulario
        const datos = {monto, categoria_id, descripcion, metodo_pago};

        if(editar) {
            actualizarTransaccion(id, datos); // Llamada a actualizar transacción
        } else {
            crearTransaccion(datos); // Llamada a crear transacción
        }
        // Cerramos el modal una vez enviado los datos
        cerrarModal();
    });

    // Forzar animación
    requestAnimationFrame(() => {
        overlay.classList.add('opacity-100');
        modal.classList.remove('-translate-y-10');
        modal.classList.add('translate-y-0');
    });

    // Obtenemos el btn para cerrar el modal manualmente
    const btnCerrar = modal.querySelector('#btn-cerrar-modal');
    btnCerrar.addEventListener('click', cerrarModal); // Activa la función cerrarModal
    const btnCancelar = modal.querySelector('#cancelar-transaccion');
    btnCancelar.addEventListener('click', cerrarModal);
    overlay.addEventListener('click', (e) => e.target === overlay && cerrarModal()); // Activa la función cerrarModal

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

// Función asíncrona para crear una nueva transacción (ingreso o gasto)
async function crearTransaccion(datos) {
    // Desestructuramos los datos recibidos como parámetro
    const {monto, categoria_id, descripcion, metodo_pago} = datos; 

    // Creamos un objeto FormData para enviar los datos al servidor
    const data = new FormData();
    data.append('monto', monto); 
    data.append('categoria_id', categoria_id); 
    data.append('descripcion', descripcion); 
    data.append('metodo_pago', metodo_pago);
    
    // Construimos la petición a la API dependiendo del tipo de página (ingreso o gasto)
    try {
        const url = `http://localhost:3000/api/${tipo}s`;
        // Enviamos la petición POST con los datos del formulario
        const respuesta = await fetch(url, {
            method: 'POST',
            body: data,
        });
        // Convertimos la respuesta en formato JSON
        const resultado = await respuesta.json();
        obtenerSaldoUsuario();
        // Capitalizamos solo para mostrar en el toast
        const tipoCapitalizado = tipo.charAt(0).toUpperCase() + tipo.slice(1);

        // Si la respuesta indica éxito, mostramos una notificación positiva
        if(resultado.tipo === 'exito') {
            toast(`${tipoCapitalizado} guardado correctamente`, `El nuevo ${tipo} se ha registrado exitosamente.`);
            // Crear un objeto dinamico 
            const transaccionObj = {
                id: resultado.transaccion.id,
                monto: resultado.transaccion.monto,
                fecha: resultado.transaccion.fecha,
                descripcion: resultado.transaccion.descripcion,
                metodo_pago: resultado.transaccion.metodo_pago,
                categoria_id: resultado.transaccion.categoria_id,
                usuario_id: resultado.transaccion.usuario_id,
            }
            // Agregamos transaccionObj al final del array transacciones sin modificar el array original de forma directa, sino creando un nuevo array actualizado.
            transacciones = [...transacciones, transaccionObj];
            // Renderizamos las transacciones
            mostrarTransaccion();
            obtenerCantidades(); // Actualizamos la cantidad
        }
    } catch (error) {
        console.log(error);
        toast('Algo salió mal', `No se pudo registrar el ${tipo}, intenta más tarde`);
    }
}

// Función asíncrona para obtener las transacciones (ingreso o gasto)
async function obtenerTransaccion() {
    // Construimos la petición a la API dependiendo del tipo de página (ingreso o gasto)
    try {
        const url = `http://localhost:3000/api/${tipo}s`;
        // Enviamos la petición GET para obtener los datos
        const respuesta = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        // Convertimos la respuesta en formato JSON
        const resultado = await respuesta.json();  
        // Asignamos el resultado a una variable global
        transacciones = resultado.transacciones;
        // Renderizar las transacciones
        mostrarTransaccion();
    } catch (error) {
        console.log(error);
        toast('Algo salió mal', `No se pudieron obtener los ${tipo}s, intenta más tarde`);
    }
}

// Función para renderizar las transacciones
function mostrarTransaccion() {
    // Limpiar el contenedor
    limpiarHTML(`contenedor-${tipo}s`);
    limpiarHTML('paginacion');
    calcularMontoTransaccion(); // actuaizamos el monto
    // Ordenar siempre por fecha: más reciente primero, mas antiguos despues
    const arrayTransacciones = transaccionesFiltradas.length ? transaccionesFiltradas : [...transacciones]; // Si no hay filtro, arrayTransacciones recibe una copia del arreglo transacciones.
    // Ordenar solo si no hay filtros aplicados
    if(!transaccionesFiltradas.length) {
        arrayTransacciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // Ordenamos por fecha reciente a antigua
    }

    // Variable para la paginación
    let transaccionesPorPagina = [...arrayTransacciones];
    // Si hay más elementos que el límite y la paginación está activada
    if(transaccionesPorPagina.length > elementosPorPagina && mostrarPaginacion) {
        // Calcula el rango de elementos que se deben mostrar en esta página
        const inicio = (paginaActual - 1) * elementosPorPagina;
        const fin = inicio + elementosPorPagina;

        // Corta el array solo con los elementos de la página actual
        transaccionesPorPagina = arrayTransacciones.slice(inicio, fin);
        // Crea los botones según el número total de elementos
        botonesPaginacion(arrayTransacciones.length);
        // Muestra el contenedor de paginación
        document.getElementById('paginacion').classList.remove('hidden');
    } else {
        // Oculta el contenedor de paginación
        document.getElementById('paginacion').classList.add('hidden');
    }
    
    // Crear la alerta principal cuando el arreglo de transacciones este vacia
    if(arrayTransacciones.length === 0) {
        // Creamos la alerta
        const alerta = document.createElement('DIV');
        alerta.id = 'alerta';
        // Agregar atributos
        alerta.setAttribute = ('role', 'alert');
        // Agregar clases
        alerta.className = 'flex items-center justify-center w-full h-96 px-2';
        alerta.innerHTML =
        `
        <div class="flex flex-col items-center gap-6 rounded-md p-8 w-[35rem] dark:border-neutral-700">
            <div class="flex flex-col items-center gap-2">
                ${tipo === 'ingreso' ? 
                    `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="size-14 text-gray-500 dark:text-neutral-400">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>                                                                          
                    ` 
                    : 
                    `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="size-14 text-gray-500 dark:text-neutral-400">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                    </svg>
                    `}
                <h3 class="text-md font-bold dark:text-neutral-200">Sin ${tipo}s</h3>
                <p class="text-sm text-gray-500 dark:text-neutral-400">Comience registrando un nuevo ${tipo} ahora.</p>
            </div>
            <button type="button" id="btn-agregar-${tipo}-alerta" class="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border border-zinc-950 bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-indigo-700 dark:hover:bg-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Añadir ${tipo}
            </button>
        </div>
        `;
        // Agregamos el listener al boton de agregar
        const btnAgregarAlerta = alerta.querySelector(`#btn-agregar-${tipo}-alerta`);
        btnAgregarAlerta.addEventListener('click', () => {
            modalTransaccion();
        });
        // Agregamos al contenedor 
        document.getElementById(`contenedor-${tipo}s`).appendChild(alerta);
        return;
    }

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

    // Obtener el contenedor
    const contenedor = document.getElementById(`contenedor-${tipo}s`);
    
    // Crear una sola lista e insertarla en el contenedor padre
    const lista = document.createElement('UL');
    lista.id = `lista-${tipo}`;
    lista.className = 'divide-y divide-gray-200 dark:divide-neutral-800';
    contenedor.appendChild(lista);

    // iteramos sobre loas transacciones
    transaccionesPorPagina.forEach((transaccion, index) => {
        // hacemos destructuring de la transaccion
        const {id, monto, fecha, descripcion, metodo_pago, categoria_id} = transaccion;
        // Creamos los li 
        const item = document.createElement('LI');
        item.className = `flex items-center justify-between gap-3 py-3 px-3 md:px-5 cursor-pointer bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 group transition-all duration-500 ease-out opacity-0 translate-y-3`;
        item.ondblclick = (e) => modalTransaccion(true, {...transaccion});
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
        item.id = `${tipo}-${id}`;
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
        <div>
            <button type="button" id='btn-eliminar-${tipo}' aria-label="elminiar la transaccion" class="block rounded-full p-2 hover:bg-gray-100 dark:hover:bg-neutral-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5 md:size-4 text-gray-400 dark:text-neutral-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </button>
        </div>
        `;

        // Evento para eliminar transacciones
        const btnEliminarTransaccion = item.querySelector(`#btn-eliminar-${tipo}`);
        btnEliminarTransaccion.addEventListener('click', () =>eliminarTransaccion(id));

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

// Funcion asincrona para actualizar / editar las transacciones
async function actualizarTransaccion(id, datos) {
    // Destructuring de los campos correctos
    const { monto, categoria_id, descripcion, metodo_pago } = datos;

    // Contruirmos el try
    try {
        const url = `http://localhost:3000/api/${tipo}s/${id}`;
        const respuesta = await fetch(url, { 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        const resultado = await respuesta.json();
        obtenerSaldoUsuario();
        // Capitalizamos solo para mostrar en el toast
        const tipoCapitalizado = tipo.charAt(0).toUpperCase() + tipo.slice(1);

        // Si la respuesta indica éxito, mostramos una notificación positiva
        if(resultado.tipo === 'exito') {
            
            toast(`${tipoCapitalizado} actualizado correctamente`, `El ${tipo} se ha actualizado exitosamente.`);
            // Actualizar la transacción en el array principal
            transacciones = transacciones.map(transaccionObj => {
                if(transaccionObj.id === id) {
                    return { ...transaccionObj, monto, categoria_id, descripcion, metodo_pago };
                }
                return transaccionObj;
            });
            transaccionesFiltradas = transaccionesFiltradas.map(transaccionObj => {
                if(transaccionObj.id === id) {
                    return { ...transaccionObj, monto, categoria_id, descripcion, metodo_pago };
                }
                return transaccionObj;
            });
            // Renderizamos las transacciones
            mostrarTransaccion();
        }
    } catch (error) {
        console.log(error);
        toast('Algo salió mal', `No se pudo actualizar el ${tipo}, intenta más tarde`);
    }
}

// Funcion asincrona para eliminar una transacción (gasto / ingreso)
async function eliminarTransaccion(id) {
    // Contruirmos el try
    try {
        const url = `http://localhost:3000/api/${tipo}s/${id}`;
        const respuesta = await fetch(url, { 
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const resultado = await respuesta.json();
        obtenerSaldoUsuario();
        // Capitalizamos solo para mostrar en el toast
        const tipoCapitalizado = tipo.charAt(0).toUpperCase() + tipo.slice(1);
        // Si la respuesta indica éxito, mostramos una notificación positiva
        if(resultado.tipo === 'exito') {
            toast(`${tipoCapitalizado} eliminado correctamente`, `El ${tipo} se ha eliminado exitosamente.`);
            // Eliminar la transaccion del arreglo principal
            transacciones = transacciones.filter( transaccion => transaccion.id !== id);
            // Eliminar la transaccion del arreglo de filtros
            transaccionesFiltradas = transaccionesFiltradas.filter( transaccion => transaccion.id !== id);
            // Renderizamos las transacciones
            mostrarTransaccion();
            obtenerCantidades(); // Actualizamos la cantidad
        }
    } catch (error) {
        console.log(error);
        toast('Algo salió mal', `No se pudo eliminar el ${tipo}, intenta más tarde`);
    }
}

// Calcular el total de las transacciones (gasto / ingreso)
function calcularMontoTransaccion() {
    const nuevoTotal = transacciones.reduce((total, transaccion) => total + Number(transaccion.monto || 0), 0);

    animarContador(transaccionTotales, nuevoTotal, formatearMonto);
    transaccionTotales = nuevoTotal;


    // Animar el contador de transacciones
    function animarContador(valorInicial, valorFinal) {
        const spanTotales = document.getElementById(`${tipo}s-totales`);
        if (!spanTotales) return; // proteger si no existe

        const duracion = 1000; // duración de la animación (1 segundo)
        const inicio = performance.now();

        function actualizarContador(timestamp) {
            const progreso = Math.min((timestamp - inicio) / duracion, 1);
            const valorActual = valorInicial + (valorFinal - valorInicial) * progreso;

            spanTotales.textContent = formatearMonto(valorActual);

            if (progreso < 1) {
                requestAnimationFrame(actualizarContador);
            }
        }
        requestAnimationFrame(actualizarContador);
    }
}

// Función para filtrar transacciones con el select
function filtrarTransaccion(e) {
    // Leer el valor del cambio 
    const valor = e.target.value;
    // Hacemos una copia del arreglo originial 
    transaccionesFiltradas = [...transacciones];
    // Validamos la seleccion
    if(valor === 'recientes') {
        transaccionesFiltradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // Orden de recientes a antiguos
    } else if(valor === 'antiguos') {
        transaccionesFiltradas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)); // Orden de antiguos a recientes
    } else if(valor === 'mayor') {
        transaccionesFiltradas.sort((a, b) => b.monto - a.monto); // Orden de mayor a menor
    } else if(valor === 'menor') {
        transaccionesFiltradas.sort((a, b) => a.monto - b.monto); // Orden de menor a mayor
    } else if(valor === 'todos') {
        transaccionesFiltradas = [...transacciones]; // Recuperamos todas las transacciones
        transaccionesFiltradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // Ordenamos de más recientes a más antiguas
    } else if(valor) {
        // Filtrar por el valor segun sea el caso
        transaccionesFiltradas = transacciones.filter(transaccion => String(transaccion.categoria_id) === String(valor));
    }

    // Selecciona el contenedor donde normalmente renderizas tus transacciones
    const contenedor = document.getElementById(`contenedor-${tipo}s`);
    contenedor.innerHTML = ''; // Limpiamos el contenedor antes de mostrar los resultados
    if(transaccionesFiltradas.length === 0) {
        // Si no hay resultados, mostramos un mensaje amigable
        const mensaje = document.createElement('p');
        mensaje.textContent = 'No hay transacciones para esta categoría, porfavor selecciona otra.';
        mensaje.classList.add('text-center', 'text-gray-500', 'dark:text-neutral-300', 'font-medium', 'pt-7');
        contenedor.appendChild(mensaje);
        return;
    }

    // Renderizar de nuevo las transacciones dependiendo el filtro seleccionado
    mostrarTransaccion();
}

// Funcion para filtrar las transacciones según la busqueda del usuario 
function filtrarTransaccionBusqueda() {
    // Guardar lo que el usuario escriba 
    const termino = buscadorFiltro.value.trim().toLowerCase();
    if(termino !== '') { // Realizar busqueda si hay string y no es vacio
        // Hacemos la filtracion de las transacciones segun lo escrito en el buscador
        transaccionesFiltradas = transacciones.filter(transaccion => transaccion.descripcion.toLowerCase().includes(termino) || transaccion.monto.includes(termino));
        // Si hay coincidencias filtrar 
        if(transaccionesFiltradas.length <= 0) {
            // Mostrar mensaje de error de busqueda
            limpiarHTML(`contenedor-${tipo}s`);
            const mensaje = document.createElement('P');
            mensaje.className = `text-center text-gray-500 dark:text-neutral-400 py-4`;
            mensaje.textContent = 'Búsqueda sin resultados...';
            document.getElementById(`contenedor-${tipo}s`).appendChild(mensaje);
        } else {
            // Si hay resultados mostrarlos y filtrarlos
            mostrarTransaccion();
        }
    } else {
        // Si esta vacio el campo de busqueda limpiar el contenedor
        transaccionesFiltradas = [];
        mostrarTransaccion();
    }
}

// Función para mostrar la paginación
function paginacion() {
    const btnSinPaginacion = document.getElementById(`btn-sin-paginacion-${tipo}s`);
    const btnConPaginacion = document.getElementById(`btn-con-paginacion-${tipo}s`);

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
        mostrarTransaccion();
    });

    btnConPaginacion.addEventListener('click', () => {
        mostrarPaginacion = true;
        paginaActual = 1;
        localStorage.setItem('mostrar-paginacion', mostrarPaginacion);
        actualizarBotones();
        mostrarTransaccion();
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
            mostrarTransaccion();
        });
        // Insertar en la paginacion
        document.getElementById('paginacion').appendChild(btn);
    }
}