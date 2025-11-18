document.addEventListener('DOMContentLoaded', iniciarFunciones);
// Variables globales
let categorias = [];

const isDark = document.documentElement.classList.contains('dark');

// Exportamos funciones de utilidades
import { toast, limpiarHTML } from '/dist/js/utilidades.js';

// Funcion padre
function iniciarFunciones() {
    obtenerCategorias(); // Obtiene todas las categorias del usuario 
}

// Funcion modal 
export function modal(editar = false, categoria = {}) {
    // Hacermos el destructuring del objeto de categoria
    const {id, nombre, tipo, usuario_id} = categoria;
    // Construir el modal 
    const overlayModal = document.createElement('DIV');
    overlayModal.id = 'overlay-modal';
    overlayModal.className = 'w-full h-screen fixed flex items-center justify-center inset-0 z-30 bg-black bg-opacity-50 opacity-0 transition-opacity duration-500 ease-in-out';   
    document.body.appendChild(overlayModal);
    document.body.style.overflow = 'hidden'; 

    const modalCategoria = document.createElement('DIV');
    modalCategoria.id = 'modal-categorias';
    modalCategoria.className = 'max-w-lg bg-white border border-gray-200 shadow-md rounded-md mx-2 -translate-y-10 transition-transform duration-500 ease z-40 dark:bg-neutral-900 dark:border-neutral-800';
    modalCategoria.innerHTML =
    `
    <div class="flex flex-col pb-6 border-b border-gray-200 dark:border-neutral-800 p-6">
        <div class="flex items-center justify-between gap-2">
            <h2 class="text-2xl font-semibold text-zinc-900 dark:text-neutral-200">${editar ? 'Edita la información' : 'Agregar tu nueva categoría'}</h2>
            <button type="button" id="btn-cerrar-modal" class="text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-200 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <p class="mt-1 text-base text-zinc-500 dark:text-neutral-400">${editar ? 'Modifica los datos de la categoría seleccionada. Asegúrate de guardar los cambios antes de salir.' : 'Crea una categoría para organizar tus ingresos y gastos de forma más clara.'}</p>
    </div>
    <form class="w-full" novalidate id="formulario-categorias">
        <div class="p-6">
            <!-- Campo de nombre -->
            <div>
                <label for="nombre" class="block text-sm/6 font-medium text-gray-900 dark:text-neutral-200">Nombre categoria</label>
                <div class="mt-2">
                    <input type="text" id="nombre" autocomplete='on' placeholder="Agrega un nombre a la categoria" name="nombre" value="${nombre ? nombre : ''}" class="text-zinc-900 bg-gray-50 border border-gray-200 w-full px-3 py-2 text-base placeholder:text-gray-500 rounded-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 disabled:bg-gray-100 dark:placeholder:text-neutral-500 focus:outline-none focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500">
                </div>
            </div>
            <!-- Campo de tipo categoria -->
            <div class="flex flex-col gap-2 mt-4">
                <label for="tipo" class="block text-sm/6 font-medium text-gray-900 dark:text-neutral-200">Tipo de categoria</label>
                <select id="tipo" name="tipo" class="text-zinc-900 bg-gray-50 border border-gray-200 w-full px-3 py-2 text-base placeholder:text-gray-500 rounded-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 disabled:bg-gray-100 dark:placeholder:text-neutral-500 focus:outline-none focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500">
                    <option value="${tipo ? tipo : ''}" disabled selected>${tipo ? tipo : 'Selecciona un tipo'}</option>
                    <option value="gasto">Gasto</option>
                    <option value="ingreso">Ingreso</option>
                </select>
            </div>
        </div>
        <!-- Boton agregar -->
        <div class="w-full flex items-end justify-end gap-3 p-6 border-t border-gray-200 dark:border-neutral-800">
            <button type="button" id="cancelar-categoria" class="w-full flex items-center gap-2 lg:w-auto justify-center rounded-md bg-transparent border border-gray-200 text-zinc-900 px-3 py-2 text-base/6 font-semibold dark:border-zinc-500 dark:text-white dark:hover:text-gray-300">Cancelar</button>
            <input type="submit" id="agregar-categoria" value="${editar ? 'Guardar cambios' : 'Agregar categoria'}" class="w-full flex items-center gap-2 lg:w-auto justify-center rounded-md bg-zinc-900 border border-zinc-900 dark:bg-indigo-700 dark:hover:bg-indigo-600 dark:border-indigo-700 px-3 py-2 text-base/6 font-semibold text-white shadow-xs hover:bg-zinc-700 cursor-pointer"></input>
        </div>
    </form>
    `;

    // Obtener los botones del formulario 
    const btnCancelarCategoria = modalCategoria.querySelector('#cancelar-categoria');
    const form = modalCategoria.querySelector('#formulario-categorias');
    
    // Agregar evento al boton de agregarCategoria
    form.addEventListener('submit', async(e) => {
        e.preventDefault();
        // Obtener los valores
        const nombreCategoria = modalCategoria.querySelector('#nombre').value.trim().toLowerCase();
        const tipoCategoria =  modalCategoria.querySelector('#tipo').value.trim().toLowerCase();

        if(nombreCategoria === '' || tipoCategoria === '') {
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
        if(editar) {
            // Sobreescribimos los datos por los nuevos
            categoria.nombre = nombreCategoria;
            categoria.tipo = tipoCategoria;
            // Enviar datos al servidor PUT
            actualizarCategoria(categoria);
        } else {
            // Enviar los datos al servidor POST
            crearCategoria(nombreCategoria, tipoCategoria);
        }
        // Cerramos el menú
        cerrarModal();
    });

    // Insertar el modal 
    overlayModal.appendChild(modalCategoria);

    // Forzar reflow y animar apertura
    requestAnimationFrame(() => {
        overlayModal.classList.add('opacity-100');
        modalCategoria.classList.remove('-translate-y-10');
        modalCategoria.classList.add('translate-y-0');
    });

    // Cerrar al hacer clic fuera del menú
    overlayModal.addEventListener('click', (e) => {
        if (e.target === overlayModal) {
            cerrarModal();
        }
    });
    btnCancelarCategoria.addEventListener('click', (e) => {
        if(e.target === btnCancelarCategoria) {
            cerrarModal();
        }
    });
    const btnCerrar = modalCategoria.querySelector('#btn-cerrar-modal');
    btnCerrar.addEventListener('click', cerrarModal); // Activa la función cerraModal

    // Función para cerrar con animación
    function cerrarModal() {
        if (!overlayModal) return;
        overlayModal.classList.remove('opacity-100');
        modalCategoria.classList.add('translate-y-10');
        modalCategoria.classList.remove('translate-y-0');

        // Eliminar overlay tras la animación
        setTimeout(() => {
            if (overlayModal && overlayModal.parentNode) {
                document.body.removeChild(overlayModal);
            }
            document.body.style.overflow = '';
        }, 500);
    }
}

// Funcion asincrona para crear categorias
async function crearCategoria(nombreCategoria, tipoCategoria) {
    // Construir peticion
    const data = new FormData();
    data.append('nombre', nombreCategoria);
    data.append('tipo', tipoCategoria);

    try {
        const url = 'http://localhost:3000/api/categorias';
        const respuesta = await fetch(url, { 
            method: 'POST',
            body: data, 
        });
        const resultado = await respuesta.json();
        if(resultado.tipo === 'exito') {
            toast('Categoría guardada correctamente', 'La nueva categoría se ha registrado exitosamente.');
            // Crear un objeto dinamico de categoria
            const categoriaObj = {
                id: resultado.categoria.id,
                nombre: resultado.categoria.nombre,
                tipo: resultado.categoria.tipo,
                usuario_id: resultado.categoria.usuario_id
            }
            // Agregamos categoriasObj al final del array categorias sin modificar el array original de forma directa, sino creando un nuevo array actualizado.
            categorias = [...categorias, categoriaObj];
            // Mostramos las categorias dinamicamente sin recargar página
            mostrarCategorias();
        }
    } catch (error) {
        console.log(error);
        toast('Algo salió mal', 'No se pudo registrar la categoria, intenta más tarde');
    }
}

// Funcion asincrona que obtiene las categorias del usuario que inicio sesión
export async function obtenerCategorias() {
    // Hacemos la peticion
    try {
        const url = 'http://localhost:3000/api/categorias';
        const respuesta = await fetch(url, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const resultado = await respuesta.json();

        if (resultado) {
            // Asignamos el resultado a la variable global
            categorias = resultado.categorias;
            // Solo mostrar categorías si el contenedor existe
            if (document.getElementById('contenedor-categorias')) {
                mostrarCategorias();
            } 
        }
    } catch (error) {
        console.log(error);
        toast('Algo salió mal', 'No se pudieron obtener las categorias, intenta más tarde');
    }
}

// Funcion para mostrar y listar las categorias
function mostrarCategorias() {
    limpiarHTML('contenedor-categorias');
    // Mostrar alerta si no hay categorias agregadas
    if(categorias.length === 0) {
        // Creamos la alerta
        const alerta = document.createElement('DIV');
        alerta.id = 'alerta';
        alerta.className = 'w-full flex items-start gap-2 bg-orange-50 dark:bg-orange-600/10 text-orange-400 border-l-4 border-orange-500 px-2 py-3 rounded-md';
        // Agregar atributos
        alerta.setAttribute = ('role', 'alerta');
        alerta.innerHTML =
        `
        <!-- Icono de alerta -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-orange-600 flex-shrink-0">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
        <!-- Mensaje de alerta -->
        <p class="text-sm">No cuentas con categorias registrada aún. <button type="button" class="underline font-medium hover:text-orange-300 text-start">comienza registrando gratis tus categorias aquí.</button></p>
        `;
        // Agregamos al contenedor 
        document.getElementById('contenedor-categorias').appendChild(alerta);
        return;
    }

    // Iterar sobre las categorias
    categorias.forEach(categoria => {
        // Destructuramos el objeto de categorias
        const {id, nombre, tipo} = categoria;

        // Crear contenedor 
        const contenedorCategoria = document.createElement('DIV');
        contenedorCategoria.className = 'flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 dark:bg-neutral-800 dark:border-neutral-700 cursor-pointer';
        contenedorCategoria.ondblclick = function() {modal(true, {...categoria})};
        contenedorCategoria.innerHTML =
        `
        <div id="badge" class="w-1.5 h-1.5 rounded-full"></div>
        <p class="text-sm text-zinc-900 font-semibold capitalize dark:text-neutral-200">${nombre}</p>
        <button id="categoria-${id}" type="button" class="text-zinc-900 p-[2px] hover:text-zinc-700 rounded-full dark:text-zinc-200 dark:hover:text-zinc-300" aria-label="categoria personalizada">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </button>
        `;

        // Cambiamos el color del circulo del badge dependiendo el tipo
        const badge = contenedorCategoria.querySelector('#badge');
        if(tipo === 'ingreso') {
            badge.classList.add('bg-green-600', 'dark:bg-green-500');
        } else if (tipo === 'gasto') {
            badge.classList.add('bg-red-600', 'dark:bg-red-500');
        }

        // Event para la eliminacion de categorias
        const btnEliminarCategoria = contenedorCategoria.querySelector(`#categoria-${id}`);
        btnEliminarCategoria.addEventListener('click', () => eliminarCategoria(id));
        
        // Insertamos en el contenedor 
        document.getElementById('contenedor-categorias').appendChild(contenedorCategoria);
    });
}

// Funcion para actualizar la categoria
async function actualizarCategoria(categoria) {
    // Hacermos el destructuring del objeto de categoria
    const {id, nombre, tipo, usuario_id} = categoria;
    // Contruir el try catch
    try {
        const url = `http://localhost:3000/api/categorias/${id}`;
        const respuesta = await fetch(url, { 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, tipo, usuario_id}),
        });
        const resultado = await respuesta.json();
        if(resultado.tipo === 'exito') {
            toast('Categoría actualizada correctamente', 'La categoría se ha actualizado exitosamente.');
            // Sobrescribimos la copia del arreglo original por los nuevos valores
            categorias = categorias.map(categoriaObj => {
                if(categoriaObj.id === id) {
                    categoriaObj.nombre = nombre;
                    categoriaObj.tipo = tipo;
                } 
                return categoriaObj;
            });
            mostrarCategorias();
        }
    } catch (error) {
        console.log(error);
        toast('Algo salió mal', 'No se pudo actualizar la categoria, intenta más tarde');
    }
}

// Funcion para eliminar la categoria 
async function eliminarCategoria(id) {
    try {
        const url = `http://localhost:3000/api/categorias/${id}`;
        const respuesta = await fetch(url, { 
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const resultado = await respuesta.json();
        if(resultado.tipo === 'exito') {
            toast('Categoría eliminada correctamente', 'La categoría se ha eliminado exitosamente.');
            // Filtrar el arreglo de las categorias 
            categorias = categorias.filter( categoria => categoria.id !== id);
            // Refrezcar el contenedor
            mostrarCategorias();
        }
    } catch (error) {
        console.log(error);
        toast('Algo salió mal', 'No se pudo eliminar la categoria, intenta más tarde');
    }
}