/* ============================================================================
   1. VARIABLES DE ESTADO GLOBAL (MEMORIA TEMPORAL DEL SCRIPT)
   ============================================================================ */

/**
 * Este interruptor (booleano) actúa como un escudo protector en memoria.
 * Cuando el usuario hace clic en un botón del menú para viajar a una sección,
 * se vuelve 'true' para evitar temporalmente que el detector de scroll automático
 * se confunda y marque otros enlaces mientras la pantalla se está desplazando.
 */
let estaNavegandoPorClick = false;

/* ============================================================================
   2. REFERENCIAS A ELEMENTOS DEL DOM (CAPTURA DE ELEMENTOS HTML)
   ============================================================================ */

// Captura la cortina oscura traslúcida que se dibuja detrás de la navegación móvil
const overlay = document.querySelector(".overlay__nav");

// Captura el botón de tres líneas (hamburguesa) usado para abrir el menú móvil
const navToggle = document.querySelector(".header__hamb");

// Captura el icono del carrito de compras situado en la barra superior
const cartToggle = document.querySelector(".header__cart");

// Captura el contenedor de la lista de navegación o menú principal de la cabecera
const navMenu = document.querySelector(".header__nav");

// Captura el bloque o barra lateral que aloja el contenido del carrito de compras
const cartAside = document.querySelector(".cart__contenedor");

// Captura el botón interactivo que despliega u oculta el submenú de categorías
const btnSubmenu = document.querySelector(".header__btn-submenu");

// Captura la lista desplegable (<ul>) que contiene los enlaces de las categorías
const subMenu = document.querySelector(".header__submenu");

// Captura la pequeña flecha gráfica que rota de dirección al abrir el submenú
const arrow = document.querySelector(".header__arrow-icon");

// Reúne en un listado interno todos los enlaces comunes y los del submenú juntos
const navLinks = document.querySelectorAll(".header__a, .header__a-submenu");

// Captura el enlace contenedor del logotipo principal de la marca Minoe
const logo = document.getElementById("header__logo-a");

// Captura el enlace específico configurado para retornar al inicio de la página
const inicioLink = document.getElementById("header__a");

// Recopila todas las secciones estructurales (<section>) declaradas en el documento
const sections = document.querySelectorAll("section");

// Captura el botón físico en forma de cruz ('X') para cerrar el menú móvil
const btnCloseMenu = document.getElementById("close-menu");

/* ============================================================================
   3. FUNCIONES DE CONTROL, NAVEGACIÓN Y GESTIÓN DE INTERFAZ
   ============================================================================ */

/**
 * Detiene por completo el evento de desplazamiento por defecto que envía el navegador web.
 */
function prevenirScrollMenu(e) {
  e.preventDefault();
}

/**
 * Intercepta las pulsaciones del teclado y bloquea de forma quirúrgica las teclas
 * clásicas de navegación (Espacio, Flechas, Inicio, Fin) para que la página de fondo
 * no se deslice mientras el menú móvil se encuentre desplegado sobre ella.
 */
function prevenirScrollTecladoMenu(e) {
  const teclasBloqueadas = [
    "Space",
    "ArrowUp",
    "ArrowDown",
    "PageUp",
    "PageDown",
    "End",
    "Home",
  ];
  if (teclasBloqueadas.includes(e.code)) {
    e.preventDefault();
  }
}

/**
 * Agrega o remueve de forma coordinada los detectores de eventos en la ventana 'window'
 * para congelar o liberar los movimientos táctiles, el ratón y el teclado del usuario.
 */
function gestionBloqueoScroll(bloquear) {
  if (bloquear) {
    // Si la orden es bloquear, acaparamos los movimientos del mouse y de los dedos
    window.addEventListener("wheel", prevenirScrollMenu, { passive: false });
    window.addEventListener("touchmove", prevenirScrollMenu, {
      passive: false,
    });

    // Acaparamos el control de las pulsaciones del teclado físico
    window.addEventListener("keydown", prevenirScrollTecladoMenu, {
      passive: false,
    });

    // Agregamos una clase de auxilio al body para reforzar el bloqueo con estilos CSS
    document.body.classList.add("no-scroll");
  } else {
    // Si la orden es liberar, desmontamos por completo los tres escuchadores anteriores
    window.removeEventListener("wheel", prevenirScrollMenu);
    window.removeEventListener("touchmove", prevenirScrollMenu);
    window.removeEventListener("keydown", prevenirScrollTecladoMenu);

    // Devolvemos el estado normal removiendo la clase del cuerpo
    document.body.classList.remove("no-scroll");
  }
}

/**
 * Se encarga de pintar de forma elegante cuál es el enlace activo en la cabecera.
 * Limpia los estilos previos de todos los botones y se los transfiere únicamente al seleccionado,
 * cuidando de iluminar también al botón padre si el enlace correspondía al submenú.
 */
function activarLink(target) {
  if (!target) return;

  // 1. Recorremos todos los links de la lista para quitarles la clase activa y su metadata
  navLinks.forEach((l) => {
    l.classList.remove("a--active");
    l.removeAttribute("aria-current");
  });

  // Quitamos la iluminación especial a los disparadores del submenú para empezar limpios
  btnSubmenu.classList.remove("a--active");
  arrow.classList.remove("arrow--active");

  // 2. Le inyectamos la clase de realce estético al enlace que sufrió el impacto del clic
  target.classList.add("a--active");

  // 3. Si descubrimos que este enlace forma parte del submenú interno, iluminamos también a su padre
  if (target.classList.contains("header__a-submenu")) {
    btnSubmenu.classList.add("a--active");
    arrow.classList.add("arrow--active");
  }
}

/**
 * Realiza el cálculo matemático de coordenadas físicas en la pantalla.
 * Convierte destinos de categorías hacia el contenedor general del catálogo y desplaza
 * la página de manera suave y sincronizada restándole el grosor de la cabecera.
 */
function navegarA(idDestino, elementoLink) {
  const categorias = ["#joyeria", "#studio", "#gourmet", "#regalos"];
  let objetivoReal = idDestino;

  // Si el destino es una de las subcategorías, redirigimos el foco hacia el ID raíz '#catalogo'
  if (categorias.includes(idDestino)) {
    objetivoReal = "#catalogo";
  }

  // Localizamos la sección física en la estructura del HTML
  const seccion = document.querySelector(objetivoReal);

  if (seccion) {
    // Marcamos visualmente el enlace seleccionado antes de movernos
    activarLink(elementoLink);

    // Fijamos un margen de desfase para que el menú superior pegado arriba no tape el título de la sección
    const offsetHeader = 60;

    // Si viaja al inicio (Hero), va al punto cero (arriba), en caso contrario calcula la posición exacta restando el desfase
    const posicionFinal =
      idDestino === "#hero" ? 0 : seccion.offsetTop - offsetHeader;

    // Desplazamos la ventana del navegador con una transición fluida (smooth)
    window.scrollTo({
      top: posicionFinal,
      behavior: "smooth",
    });

    // Actualizamos la barra de direcciones URL del navegador disimuladamente sin provocar recargas
    if (idDestino === "#hero") {
      history.pushState(null, null, window.location.pathname);
    } else {
      history.pushState(null, null, idDestino);
    }
  }
}

/* ============================================================================
   4. INICIALIZACIÓN DE CARGA (PROCESOS AL ARRANCAR LA PÁGINA)
   ============================================================================ */

// Le ordenamos al navegador ignorar y anular su comportamiento de recordar la posición del scroll al recargar
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// Escuchador automático que se ejecuta en el instante exacto en que la web ha terminado de cargarse por completo
window.addEventListener("load", () => {
  // Forzamos un viaje inmediato al extremo superior de la pantalla (coordenada 0,0)
  window.scrollTo(0, 0);

  // Si el usuario ingresó con un hash en la URL (ej: miweb.com/#contacto), lo limpiamos limpiamente en el historial
  if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname);
  }

  // Forzamos a que el enlace de 'Inicio' amanezca encendido por defecto
  activarLink(inicioLink);
});

/* ============================================================================
   5. ESCUCHADORES DE EVENTOS DE INTERFAZ (LISTENERS)
   ============================================================================ */

// Detector de clics conectado al botón hamburguesa para gestionar el despliegue del menú y clausurar el carrito si estaba abierto
navToggle.addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  const cartOverlay = document.getElementById("overlay__cart");

  // 1. Si la barra lateral del carrito se encuentra visible, la obligamos a cerrarse inmediatamente
  if (sidebar && sidebar.classList.contains("sidebar--active")) {
    sidebar.classList.remove("sidebar--active");
    cartOverlay?.classList.remove("overlay--active");
  }

  // 2. Intercambiamos de estado (toggle) las clases de visibilidad del menú y de la cortina del fondo
  const esApertura = navMenu.classList.toggle("nav-visible");
  overlay.classList.toggle("overlay--active");

  // 3. Mandamos a congelar o descongelar el scroll de la página basándonos en si el menú se abrió o se cerró
  gestionBloqueoScroll(esApertura);
});

// Detector conectado al botón del submenú para alternar la visibilidad de la lista de categorías y girar la flechita
btnSubmenu.addEventListener("click", () => {
  subMenu.classList.toggle("submenu-open");
  arrow.classList.toggle("arrow-rotate");
});

// Detector para el botón en forma de cruz ('X') encargado de cerrar el menú y devolver el scroll nativo de golpe
if (btnCloseMenu) {
  btnCloseMenu.addEventListener("click", () => {
    navMenu.classList.remove("nav-visible");
    overlay.classList.remove("overlay--active");

    // Devolvemos el control normal de scroll enviándole un valor falso a la función gestora
    if (typeof gestionBloqueoScroll === "function") {
      gestionBloqueoScroll(false);
    }
  });
}

// Detector de clics global sobre todo el documento para cerrar menús colapsables al hacer clic en zonas vacías del fondo
document.addEventListener("click", (event) => {
  const isClickInsideMenu = navMenu.contains(event.target);
  const isClickOnToggle = navToggle.contains(event.target);

  // Verificamos por proximidad si el usuario tocó un enlace ('<a>') válido
  const isLink = event.target.closest("a");

  // Si el menú está desplegado y el usuario hace clic afuera de él, cuidando de que no sea en el botón hamburguesa ni en un link
  if (
    !isClickInsideMenu &&
    !isClickOnToggle &&
    navMenu.classList.contains("nav-visible") &&
    !isLink
  ) {
    // Cerramos de golpe todas las persianas visuales abiertas
    navMenu.classList.remove("nav-visible");
    overlay.classList.remove("overlay--active");
    subMenu.classList.remove("submenu-open");
    arrow.classList.remove("arrow-rotate");

    // Restauramos el scroll normal de navegación
    if (typeof gestionBloqueoScroll === "function") {
      gestionBloqueoScroll(false);
    }
  }

  // Cierre automático preventivo del submenú en pantallas de computadora si se cliquea fuera de la caja de navegación
  if (
    !isClickInsideMenu &&
    !isClickOnToggle &&
    subMenu.classList.contains("submenu-open")
  ) {
    subMenu.classList.remove("submenu-open");
    arrow.classList.remove("arrow-rotate");
  }
});

// Detector de clics conectado al logotipo de la marca para navegar fluidamente al tope del inicio (Hero)

logo.addEventListener("click", (e) => {
  e.preventDefault();
  estaNavegandoPorClick = true;

  // 1. Si la navegación ocurre en pantallas móviles (con el menú desplegado)
  if (navMenu.classList.contains("nav-visible")) {
    // Colapsamos todos los estados de la interfaz móvil
    navMenu.classList.remove("nav-visible");
    overlay.classList.remove("overlay--active");
    subMenu.classList.remove("submenu-open");
    arrow.classList.remove("arrow-rotate");

    // Desactivamos el bloqueo del scroll de fondo para preparar el viaje
    gestionBloqueoScroll(false);

    // PAUSA CRÍTICA DE ESTABILIZACIÓN: Aguardamos a que el navegador asimile el cambio de estado del body
    setTimeout(() => {
      navegarA("#hero", inicioLink);
    }, 350);
  } else {
    // Si el menú móvil ya estaba cerrado (como en ordenadores), ejecutamos el viaje directo sin esperas
    navegarA("#hero", inicioLink);
  }

  // Desactivamos el escudo protector de scroll pasados 2 segundos, cuando el viaje fluido ya concluyó
  setTimeout(() => {
    estaNavegandoPorClick = false;
  }, 2000);
});

// Bucle inteligente que recorre cada enlace de navegación para interceptar los saltos e inyectar retardos de estabilización
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");

    // Validamos que el enlace contenga una ruta de anclaje interna que inicie con '#'
    if (href && href.startsWith("#")) {
      e.preventDefault();
      estaNavegandoPorClick = true;

      // Colapsamos los estados del submenú en cada clic
      subMenu.classList.remove("submenu-open");
      arrow.classList.remove("arrow-rotate");

      // 1. Si la navegación ocurre en pantallas móviles (con el menú desplegado)
      if (navMenu.classList.contains("nav-visible")) {
        navMenu.classList.remove("nav-visible");
        overlay.classList.remove("overlay--active");
        subMenu.classList.remove("submenu-open");
        arrow.classList.remove("arrow-rotate");

        // 2. Desactivamos el bloqueo del scroll de fondo para preparar el viaje
        gestionBloqueoScroll(false, true);

        // 3. PAUSA CRÍTICA DE ESTABILIZACIÓN: Aguardamos 350 milisegundos en secreto
        // para dar tiempo a que el navegador asimile que el body ya no es 'fixed', evitando saltos feos
        setTimeout(() => {
          navegarA(href, link);
        }, 350);
      } else {
        // Si el menú móvil ya estaba cerrado (como en ordenadores), ejecutamos el viaje directo sin esperas
        navegarA(href, link);
      }

      // Desactivamos el escudo protector de scroll pasados 2 segundos, cuando el viaje fluido ya concluyó
      setTimeout(() => {
        estaNavegandoPorClick = false;
      }, 2000);
    }
  });
});

// ============================================================================
// 5.1 RASTREADOR DE SCROLL OPTIMIZADO (BLINDAJE CONTRA TIRONES DE RENDIMIENTO)
// ============================================================================

let scrollTimeoutActivo = false;

window.addEventListener("scroll", () => {
  // Si ya hay un cálculo programado en este frame, ignoramos los eventos duplicados
  if (scrollTimeoutActivo) return;

  scrollTimeoutActivo = true;

  window.requestAnimationFrame(() => {
    // Si nos estamos moviendo por culpa de un clic en el menú o si el menú móvil está abierto, liberamos y salimos
    if (estaNavegandoPorClick || navMenu.classList.contains("nav-visible")) {
      scrollTimeoutActivo = false;
      return;
    }

    let seccionActual = "";
    const pixelesDeMargen = 150;
    const secciones = document.querySelectorAll("section[id]");

    // 1. Escaneo de las secciones físicas del documento
    secciones.forEach((seccion) => {
      const seccionTop = seccion.offsetTop;
      if (window.pageYOffset >= seccionTop - pixelesDeMargen) {
        seccionActual = seccion.getAttribute("id");
      }
    });

    // 2. Rastreador avanzado para el Catálogo
    if (seccionActual === "catalogo") {
      const catalogContainer = document.getElementById("catalogo");
      if (catalogContainer) {
        const claseCategoria = Array.from(catalogContainer.classList).find(
          (cls) => cls.includes("catalog__container--"),
        );

        if (claseCategoria) {
          seccionActual = claseCategoria.split("--")[1];
        }
      }
    }

    // 3. Control de retorno al tope
    if (window.pageYOffset < 100) {
      activarLink(inicioLink);
      scrollTimeoutActivo = false;
      return;
    }

    // 4. Encendido del enlace correspondiente
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${seccionActual}`) {
        activarLink(link);
      }
    });

    // Liberamos el candado para permitir el cálculo en el siguiente frame visual
    scrollTimeoutActivo = false;
  });
});

// ============================================================================
// 5.2 RESET RESPONSIVO INTELIGENTE (EVITA CONGELAMIENTO AL GIRAR LA PANTALLA)
// ============================================================================
let resizeTimeout;

window.addEventListener("resize", () => {
  // Limpiamos el temporizador en cada micro-movimiento del cambio de tamaño
  clearTimeout(resizeTimeout);

  // Ejecutamos la validación solo cuando la pantalla se detenga por 100ms
  resizeTimeout = setTimeout(() => {
    // Si la pantalla pasa a tamaño Desktop (> 1024px) y el menú móvil quedó abierto
    if (window.innerWidth > 1024 && navMenu.classList.contains("nav-visible")) {
      // 1. Cerramos las persianas de navegación móvil
      navMenu.classList.remove("nav-visible");
      overlay.classList.remove("overlay--active");
      subMenu.classList.remove("submenu-open");
      arrow.classList.remove("arrow-rotate");

      // 2. Liberamos quirúrgicamente el scroll de fondo
      if (typeof gestionBloqueoScroll === "function") {
        gestionBloqueoScroll(false);
      }
    }
  }, 100);
});
