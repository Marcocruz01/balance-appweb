<?php if(!empty($alertas['error'])): ?>
    <script>
        const isDark = document.documentElement.classList.contains('dark');
        Swal.fire({
            icon: 'error',
            title: 'Algo salió mal...',
            text: '<?php echo reset($alertas['error']); ?>',
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
    </script>

<?php elseif(!empty($alertas['success'])): ?>
    <script>
        const isDark = document.documentElement.classList.contains('dark');
        Swal.fire({
            icon: 'success',
            title: '¡Operación exitosa!',
            text: '<?php echo reset($alertas['success']); ?>',
            background: isDark ? '#262626' : '#ffffff',          // neutral-800 / white
            color: isDark ? '#e5e5e5' : '#1f2937',               // neutral-200 / gray-800
            <?php if (!empty($redirigir) && $redirigir): ?>
                timer: 3500,
                timerProgressBar: true,
                showConfirmButton: false,
            <?php else : ?>
                confirmButtonText: 'OK',
                confirmButtonColor: isDark ? '#3b82f6' : '#2563eb', // blue-500 / blue-600
                showCloseButton: true,
            <?php endif; ?>
            customClass: {
                popup: 'rounded-2xl shadow-lg',
                title: isDark ? 'text-neutral-200 font-semibold' : 'text-gray-800 font-semibold',
                htmlContainer: isDark ? 'text-neutral-400' : 'text-gray-600',
                confirmButton: 'px-4 py-2 rounded-md font-medium',
            },
        })
        <?php if (!empty($redirigir) && $redirigir): ?>
        .then(() => {
            window.location.href = "/login";
        });
        <?php endif; ?>
    </script>
<?php endif; ?>
