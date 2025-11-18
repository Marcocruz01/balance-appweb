document.addEventListener('DOMContentLoaded', iniciarFunciones);

// Importar funciones de utilidades
import {formatearMonto, abrirMenuMovil, abrirMenuBar, cambiarTema, aplicarTema, animarNumero} from '/dist/js/utilidades.js';

// Funcion padre
function iniciarFunciones() {
    abrirMenuMovil();
    abrirMenuBar();
    cambiarTema();
    // Validamos si en la página actual existe un radio de tema seleccionado
    const temaSeleccionado = document.querySelector('input[name="tema"]:checked');
    if (temaSeleccionado) {
        aplicarTema(temaSeleccionado.value);
    }
    obtenerSaldoUsuario();
    obtenerCantidades();
}

// Obtener el saldo del usuario y mostrarlo en consola
export async function obtenerSaldoUsuario() {
    try {
        const url = `http://localhost:3000/api/datos`;
        const respuesta = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const resultado = await respuesta.json();   
        // Convertirlo a numero 
        const saldo = parseFloat(resultado.saldo) || 0;
        // Seleccionamos el span y mostramos el saldo formateado
        const spansSaldo = document.querySelectorAll('.saldo');
        // Animar el contador desde 0 hasta el saldo
        const duracion = 1000; // duración en ms
        const inicio = performance.now();

        function animarSaldo(timestamp) {
            const progreso = Math.min((timestamp - inicio) / duracion, 1);
            const valorActual = saldo * progreso;
            spansSaldo.forEach(span => {
                span.textContent = formatearMonto(valorActual);
            });

            if (progreso < 1) {
                requestAnimationFrame(animarSaldo);
            }
        }
        requestAnimationFrame(animarSaldo);
    } catch (error) {
        console.error('Error al obtener saldo:', error);
    }
}

// Funcion para obtener las cantidades de: ingresos, gastos, apartados
export async function obtenerCantidades() {
    try {
        const url = `http://localhost:3000/api/datos`;
        const respuesta = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const resultado = await respuesta.json();

        const apartados = resultado.apartados;
        const transacciones = resultado.transacciones;

        // Filtrar ingresos y gastos
        const ingresos = transacciones.filter(t => t.tipo === 'ingreso');
        const gastos = transacciones.filter(t => t.tipo === 'gasto');

        // Obtener elementos del DOM
        const elemIngresos = document.getElementById('contador-ingresos');
        const elemGastos = document.getElementById('contador-gastos');
        const elemApartados = document.getElementById('contador-apartados');

        // Obtener valores actuales (si ya existen en el DOM)
        const valorActualIngresos = parseInt(elemIngresos.textContent.replace(/\D/g, '')) || 0;
        const valorActualGastos = parseInt(elemGastos.textContent.replace(/\D/g, '')) || 0;
        const valorActualApartados = parseInt(elemApartados.textContent.replace(/\D/g, '')) || 0;

        // Animar el cambio de número
        animarNumero(elemIngresos, valorActualIngresos, ingresos.length);
        animarNumero(elemGastos, valorActualGastos, gastos.length);
        animarNumero(elemApartados, valorActualApartados, apartados.length);
        
    } catch (error) {
        console.error('Error al obtener cantidades:', error);
    }
}
