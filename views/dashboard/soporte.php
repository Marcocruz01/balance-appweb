<?php include_once __DIR__ . '/header-dashboard.php'; ?>
    <!-- Contenedor padre -->
    <div class="max-w-7xl mx-auto flex flex-col gap-6 pt-10 md:pt-12 pb-3 px-2 md:px-4 lg:px-6">
        <div class="mx-auto max-w-2xl">
            <h2 class="text-4xl font-semibold tracking-tight text-balance dark:text-white sm:text-5xl text-center">Departamento de soporte</h2>
            <p class="mt-2 text-lg/8 text-gray-600 dark:text-neutral-400 text-center">¿Tienes alguna duda o inconveniente? Completa el siguiente formulario y nuestro equipo de soporte te ayudará lo antes posible.</p>
            <form action="/soporte" method="POST" class="mx-auto mt-12 max-w-xl bg-white border border-gray-200 p-6 rounded-md dark:bg-neutral-900 dark:border-neutral-800">
                <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div>
                        <label for="nombre" class="block text-sm/6 font-semibold text-gray-950 dark:text-neutral-50">Nombre(s)</label>
                        <div class="mt-2.5">
                            <input id="nombre" type="text" name="nombre" autocomplete="given-name" placeholder="Ej: Sebastian" class="block w-full outline-none rounded-md bg-gray-50 border border-gray-200 dark:border-neutral-800 dark:bg-white/5 px-3.5 py-2 dark:placeholder:text-neutral-500 text-base text-gray-800 dark:text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500" />
                        </div>
                    </div>
                    <div>
                        <label for="last-name" class="block text-sm/6 font-semibold text-gray-950 dark:text-neutral-50">Apellido(s)</label>
                        <div class="mt-2.5">
                            <input id="last-name" type="text" name="last-name" autocomplete="family-name" placeholder="Ej: Camarena" class="block outline-none w-full rounded-md bg-gray-50 border border-gray-200 dark:border-neutral-800 dark:bg-white/5 px-3.5 py-2 dark:placeholder:text-neutral-500 text-base text-gray-800 dark:text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500" />
                        </div>
                    </div>
                    <div class="sm:col-span-2">
                        <label for="email" class="block text-sm/6 font-semibold text-gray-950 dark:text-neutral-50">Correo eléctronico</label>
                        <div class="mt-2.5">
                            <input id="email" type="email" name="email" autocomplete="email" placeholder="Ej: correo@correo.com" class="block w-full outline-none rounded-md bg-gray-50 border border-gray-200 dark:border-neutral-800 dark:bg-white/5 px-3.5 py-2 dark:placeholder:text-neutral-500 text-base text-gray-800 dark:text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500" />
                        </div>
                    </div>
                    <div class="sm:col-span-2">
                        <label for="message" class="block text-sm/6 font-semibold text-gray-950 dark:text-neutral-50">Mensaje</label>
                        <div class="mt-2.5">
                            <textarea id="message" name="message" rows="4" placeholder="Describe tu mensaje..." class="block w-full outline-none rounded-md bg-gray-50 border border-gray-200 dark:border-neutral-800 dark:bg-white/5 px-3.5 py-2 text-base dark:placeholder:text-neutral-500 text-gray-800 dark:text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"></textarea>
                        </div>
                    </div>
                </div>
                <div class="mt-10">
                    <button type="submit" class="block w-full rounded-md bg-zinc-950 dark:bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-zinc-800 dark:hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Enviar datos</button>
                </div>
            </form>
        </div>
    </div>
<?php include_once __DIR__ . '/footer-dashboard.php'; ?>