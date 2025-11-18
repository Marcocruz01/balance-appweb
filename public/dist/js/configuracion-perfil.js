document.addEventListener('DOMContentLoaded', iniciarFunciones);
import { modal } from '/dist/js/crudCategorias.js'
import { toast } from '/dist/js/utilidades.js';;
import { obtenerSaldoUsuario } from '/dist/js/main.js';;

const isDark = document.documentElement.classList.contains('dark'); // Funcion para el modal dark / light

// Función padre
function iniciarFunciones() {
    editarCuenta(); // Función para editar la cuenta
    const btnAbrirModal = document.getElementById('btn-abrir-modal-categoria');
    if (btnAbrirModal) {
        btnAbrirModal.addEventListener('click', () => {
            modal();
        });
    }
    // Funcion para agregar el evento al boton
    // Seleccionamos el boton
    const btnSubirFoto = document.getElementById('btn-subir-foto');
    if(btnSubirFoto) {
        btnSubirFoto.addEventListener('click', () => modalFoto());
    }
   
    // Funcion que actualiza el cambio de moneda
    cambioDeMoneda();
}

// Función para editar la cuenta
function editarCuenta() {
    const btnEditarPerfil = document.getElementById('btn-editar-perfil');
    const btnCancelarEdicion = document.getElementById('btn-cancelar-cambios');
    const inputsPerfil = document.querySelectorAll('#formulario-perfil input');
    const contenedorEditar = document.getElementById('contenedor-editar');
    const contenedorGuardarCambios = document.getElementById('contenedor-guardar-cambios');

    // Restaurar estado si hubo errores en el POST
    if (localStorage.getItem('modoEdicion') === 'true') {
        contenedorEditar.classList.add('hidden');
        contenedorGuardarCambios.classList.remove('hidden');
        contenedorGuardarCambios.classList.add('flex');
        inputsPerfil.forEach(input => input.disabled = false);
    } else {
        inputsPerfil.forEach(input => input.disabled = true);
    }

    if(btnEditarPerfil) {
        // Editar
        btnEditarPerfil.addEventListener('click', () => {
            contenedorEditar.classList.add('hidden');
            contenedorGuardarCambios.classList.remove('hidden');
            contenedorGuardarCambios.classList.add('flex');
            inputsPerfil.forEach(input => input.disabled = false);
            localStorage.setItem('modoEdicion', 'true');
        });
    }

    if(btnCancelarEdicion) {
        // Cancelar
        btnCancelarEdicion.addEventListener('click', () => {
            const nombre = document.getElementById('nombre').value.trim();
            const apellido = document.getElementById('apellido').value.trim();
            const email = document.getElementById('email').value.trim();
            
            // Validar si hay campos vacíos
            if (nombre === '' || apellido === '' || email === '') {
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
                });
                return;
            }
            // Si todo está lleno, permite cancelar
            contenedorEditar.classList.remove('hidden');
            contenedorGuardarCambios.classList.remove('flex');
            contenedorGuardarCambios.classList.add('hidden');
            inputsPerfil.forEach(input => input.disabled = true);
            localStorage.removeItem('modoEdicion');
        });
    }
}

// Función para actualizar el cambio de moneda
function cambioDeMoneda() {
    // Seleccionamos el elemento de moneda
    const monedaSelect = document.getElementById('moneda');

    if (monedaSelect) {
        monedaSelect.addEventListener('change', () => {
            const monedaSeleccionada = monedaSelect.value;
            toast('Actualizada correctamente', `Actualizaste el cambio de moneda por: ${monedaSeleccionada}`);
            localStorage.setItem('moneda-seleccionada', monedaSeleccionada);

            // Actualizamos el saldo del navbar inmediatamente
            obtenerSaldoUsuario();
        });

        const monedaGuardada = localStorage.getItem('moneda-seleccionada');
        if (monedaGuardada) {
            monedaSelect.value = monedaGuardada;
            // Mostramos el saldo en la moneda guardada al cargar la página
            obtenerSaldoUsuario();
        }
    } 
}

// Modal 
function modalFoto() {
    // crear el overlay
    const overlay = document.createElement('DIV');
    overlay.id = 'overlay-modal-foto';
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
            <h2 class="text-2xl font-semibold text-zinc-900 dark:text-neutral-200">Agrega tu nueva foto de perfil</h2>
            <button type="button" id="btn-cerrar-modal" class="text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-200 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <p class="mt-1 text-base text-zinc-500 dark:text-neutral-400">Cambia tu foto de perfil para darle una apariencia buena a tu aplicación.</p>
    </div>
    <form class="w-full" novalidate id="formulario-perfil" enctype="multipart/form-data">
        <div class="p-6">
            <!-- Campo de imagen -->
            <div class="">
                <label for="imagen" class="block text-sm font-medium text-gray-900 dark:text-neutral-200">
                    Imagen
                </label>
                <div class="mt-2 relative">
                    <input type="file" id="imagen" name="imagen" class="block w-full text-sm text-gray-900 border border-gray-200 rounded-md cursor-pointer bg-gray-50 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-900 file:text-white hover:file:bg-zinc-700 dark:file:bg-indigo-700 dark:file:hover:bg-indigo-600">
                    <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                        Formatos aceptados: JPG, PNG, WEBP.
                    </p>
                </div>
            </div>
        </div>
        <!-- Boton agregar -->
        <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-neutral-800">
            <button type="button" id="cancelar-foto-perfil" class="w-auto flex items-center gap-2 justify-center rounded-md bg-transparent border border-gray-200 text-zinc-900 hover:bg-gray-50 px-3 py-2 text-base/6 font-semibold dark:border-zinc-500 dark:text-white dark:hover:text-gray-300 dark:hover:bg-neutral-900">Cancelar</button>
            <input type="submit" id="btn-guardar-foto-perfil" value="Guardar cambios" class="w-auto rounded-md bg-zinc-900 dark:bg-indigo-700 text-white py-3 px-6 font-semibold cursor-pointer hover:bg-zinc-700 dark:hover:bg-indigo-600">
        </div>
    </form>
    `;

    // Insertar el modal
    overlay.appendChild(modal);

    // Obtenemos el btn para cerrar el modal manualmente
    const btnCerrar = modal.querySelector('#btn-cerrar-modal');
    btnCerrar.addEventListener('click', cerrarModal); // Activa la función cerrarModal
    const btnCancelar = modal.querySelector('#cancelar-foto-perfil');
    btnCancelar.addEventListener('click', cerrarModal);
    overlay.addEventListener('click', (e) => e.target === overlay && cerrarModal()); // Activa la función cerrarModal

    // Obtener el boton para agregar el apartado
    const form = modal.querySelector('#formulario-perfil');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Extraemos el campo imagen
        const imagen = form.querySelector('#imagen').files[0];
        // Validamos
        if(!imagen) {
            // Arrojar alerta
            Swal.fire({
                icon: 'error',
                title: 'Algo salió mal...',
                text: 'Asegurate de completar el campo',
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
        // Llamar funcion de actualizar imagen
        actualizarImagen(imagen);
        // Cerrar el modal
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

// Funcion para comunicar servidor con cliente y actualizar la imagen
async function actualizarImagen(imagen) {
    const data = new FormData();
    data.append('imagen', imagen);

    // Construimos la petición a la API 
    try {
        const url = 'http://localhost:3000/api/perfil';
        const respuesta = await fetch(url, {
            method: 'POST',
            body: data
        });
        const resultado = await respuesta.json();
        if(resultado.tipo === 'exito') {
            const img = document.getElementById('foto-perfil');
            if (img) {
                // Agregamos un parámetro temporal para evitar caché del navegador
                const imagenesPerfil = document.querySelectorAll('[id^="foto-perfil"]');
                imagenesPerfil.forEach(img => {
                    img.src = `/dist/img/perfil/${resultado.usuario.imagen}?t=${new Date().getTime()}`;
                });
            }
            toast('Imagen actualizada correctamente', `La foto de perfil se actualizo correctamente.`);
        } else {
            toast('Algo salió mal', `No se pudo actualizar la foto de perfil`);
        }
    } catch (error) {
        console.log(error);
        toast('Algo salió mal', `No se pudo actualizar la foto de perfil, intenta más tarde`);
    }
}