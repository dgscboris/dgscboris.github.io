document.addEventListener('DOMContentLoaded', function() {
  
    // 1. Animaciones al Desplazarse (Scroll Animations)
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Añadir la clase para activar la animación
                entry.target.classList.add('in-view'); 
                
                // Si es la sección de estadísticas, inicia el contador
                if (entry.target.id === 'estadisticas') {
                    startCounters();
                }

                // Dejar de observar el elemento una vez animado
                observer.unobserve(entry.target); 
            }
        });
    }, {
        // El observador se activa cuando el 10% del elemento es visible
        threshold: 0.1 
    });

    // Observar todos los elementos con la clase 'animate-on-scroll'
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
    
    // Observar la sección de estadísticas para iniciar el contador
    const statsSection = document.getElementById('estadisticas');
    if (statsSection) {
        observer.observe(statsSection);
    }


    // 2. Funcionalidad de Card Flip (Rotar al hacer clic)
    document.querySelectorAll('.card-flip').forEach(card => {
        card.addEventListener('click', function() {
            // Alternar la clase 'flipped'
            this.classList.toggle('flipped');
        });
    });

    // Función para iniciar los contadores de las estadísticas
    function startCounters() {
        document.querySelectorAll('.counter').forEach(span => {
            const target = +span.getAttribute('data-target');
            let count = 0;
            const duration = 2000; // Duración en milisegundos
            const step = (target / (duration / 16)); // Aproximadamente 60 FPS

            const updateCount = () => {
                count += step;
                if (count < target) {
                    span.innerText = Math.ceil(count).toLocaleString();
                    requestAnimationFrame(updateCount);
                } else {
                    span.innerText = target.toLocaleString();
                }
            };

            updateCount();
        });
    }


    // 3. Funcionalidad de Despliegue de Submenús al Pasar el Mouse (Hover Dropdown)
    const desktopBreakpoint = 992; // md breakpoint for Bootstrap
    const dropdowns = document.querySelectorAll('.dropdown');

    if (dropdowns) {
        dropdowns.forEach(dropdown => {
            
            // Abrir el submenú al pasar el mouse
            dropdown.addEventListener('mouseenter', function() {
                // [SOLUCIÓN CLAVE] CANCELAR CUALQUIER CIERRE PENDIENTE
                // Si el ratón vuelve a entrar antes de que el temporizador termine, se cancela el cierre.
                clearTimeout(this.closeTimer); 

                if (window.innerWidth >= desktopBreakpoint) {
                    const button = this.querySelector('.dropdown-toggle');
                    const menu = this.querySelector('.dropdown-menu');
                    if(button && menu) {
                        // Forzar la apertura
                        menu.classList.add('show');
                        button.classList.add('show'); // Añadido para consistencia con Bootstrap
                        button.setAttribute('aria-expanded', 'true');
                    }
                }
            });

            // Cerrar el submenú al sacar el mouse
            dropdown.addEventListener('mouseleave', function() {
                if (window.innerWidth >= desktopBreakpoint) {
                    // [SOLUCIÓN CLAVE] Establecer un temporizador para cerrar después de 300ms.
                    // Esto permite al ratón cruzar el pequeño espacio (si existe) y llegar al submenú.
                    this.closeTimer = setTimeout(() => {
                        const button = this.querySelector('.dropdown-toggle');
                        const menu = this.querySelector('.dropdown-menu');
                        if(button && menu) {
                             // Cerrar el menú
                            menu.classList.remove('show');
                            button.classList.remove('show'); // Añadido para consistencia con Bootstrap
                            button.setAttribute('aria-expanded', 'false');
                        }
                    }, 300); // Retraso de 300 milisegundos
                }
            });
        });
    }
});