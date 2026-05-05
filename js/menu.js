/*
    selección de elementos del DOM
*/

const overlay = document.querySelector(".overlay__nav"); //overlay
const navToggle = document.querySelector(".header__hamb"); //hamb
const cartToggle = document.querySelector(".header__cart"); //cart
const navMenu = document.querySelector(".header__nav"); //nav principal
const cartAside = document.querySelector(".cart__contenedor"); //nav principal
const btnSubmenu = document.querySelector(".header__btn-submenu"); //btn sub-menú
const subMenu = document.querySelector(".header__submenu"); //ul sub-menú
const arrow = document.querySelector(".header__arrow-icon"); //arrow sub-menú
const navLinks = document.querySelectorAll(".header__a, .header__a-submenu"); //links a y sub a
const logo = document.getElementById("header__logo-a"); //logo
const inicioLink = document.getElementById("header__a"); //id inicio
const sections = document.querySelectorAll("section"); //class sections
let estaNavegandoPorClick = false;

// guardar posición

// let scrollPos = 0;

function gestionBloqueoScroll(bloquear) {
  const html = document.documentElement;
  const body = document.body;

  if (bloquear) {
    // Calculamos el ancho del scroll antes de bloquear para evitar el salto lateral
    const scrollBarWidth = window.innerWidth - html.clientWidth;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.paddingRight = `${scrollBarWidth}px`;
  } else {
    // Restauramos todo de forma limpia
    html.style.overflow = "";
    body.style.overflow = "";
    body.style.paddingRight = "";
  }
}
// Al abrir el menú (click en hamb)
// Modifica el evento del navToggle
// Dentro de menu.js
navToggle.addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  const cartOverlay = document.getElementById("overlay__cart");

  // 1. Si el carrito está abierto, lo cerramos
  if (sidebar && sidebar.classList.contains("sidebar--active")) {
    sidebar.classList.remove("sidebar--active");
    cartOverlay?.classList.remove("overlay--active");
    // No ejecutamos gestionBloqueoScroll(false) aquí para que el menú tome el control
  }

  // 2. Togleamos el menú
  const esApertura = navMenu.classList.toggle("nav-visible");
  overlay.classList.toggle("overlay--active");

  // 3. Gestión de scroll basada en el estado final del menú
  // Usamos 'esApertura' que guarda el resultado del toggle
  gestionBloqueoScroll(esApertura);
});

/*
    abrir sub-menú en móvil y pantalla grande
    click en btn-submenu
*/

btnSubmenu.addEventListener("click", () => {
  //   solo para móvil
  /*
    if (window.innerWidth <= 768) {
        subemenu.classList.toggle("submenu-open");
        arrow.classList.toggle("arrow-rotae");
    }
  */

  subMenu.classList.toggle("submenu-open");
  arrow.classList.toggle("arrow-rotate");
});

// carrar menú con la X

// 1. Referencia al botón de cierre por ID
const btnCloseMenu = document.getElementById("close-menu");

// 2. Lógica de cierre
if (btnCloseMenu) {
  btnCloseMenu.addEventListener("click", () => {
    // Cerramos el menú visualmente
    navMenu.classList.remove("nav-visible");
    overlay.classList.remove("overlay--active");

    // Ejecutamos tu función de bloqueo de scroll pasándole 'false'
    // Esto restaurará la posición original de forma instantánea
    if (typeof gestionBloqueoScroll === "function") {
      gestionBloqueoScroll(false);
    }
  });
}

/*
    cierre del menú al hacer click en cualquier
    lugar fuera del menú principal y del hamb
*/

document.addEventListener("click", (event) => {
  const isClickInsideMenu = navMenu.contains(event.target);
  const isClickOnToggle = navToggle.contains(event.target);

  // NUEVO: Detectar si el clic fue en un link o dentro de uno
  const isLink = event.target.closest("a");

  // Si el menú está abierto y hacemos clic fuera (y no es un link)
  if (
    !isClickInsideMenu &&
    !isClickOnToggle &&
    navMenu.classList.contains("nav-visible") &&
    !isLink // <--- Esta es la clave
  ) {
    navMenu.classList.remove("nav-visible");
    overlay.classList.remove("overlay--active");
    subMenu.classList.remove("submenu-open");
    arrow.classList.remove("arrow-rotate");

    // Desbloqueo normal (sin saltar)
    if (typeof gestionBloqueoScroll === "function") {
      gestionBloqueoScroll(false);
    }
  }

  // Cierre del sub-menú en desktop
  if (
    !isClickInsideMenu &&
    !isClickOnToggle &&
    subMenu.classList.contains("submenu-open")
  ) {
    subMenu.classList.remove("submenu-open");
    arrow.classList.remove("arrow-rotate");
  }
});

// marcar los links activos

function activarLink(target) {
  if (!target) return;

  // 1. Limpiamos absolutamente todos los activos previos
  navLinks.forEach((l) => {
    l.classList.remove("a--active");
    l.removeAttribute("aria-current"); // Opcional: para mejor accesibilidad
  });

  btnSubmenu.classList.remove("a--active");
  arrow.classList.remove("arrow--active");

  // 2. Aplicamos la clase al link actual
  target.classList.add("a--active");

  // 3. Si es parte del submenú, marcamos también el padre
  if (target.classList.contains("header__a-submenu")) {
    btnSubmenu.classList.add("a--active");
    arrow.classList.add("arrow--active");
  }
}

// F5/Carga --------------------------------

// Evitar que el navegador salte a la última posición de scroll conocida

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// Al cargar o recargar, forzar el inicio

window.addEventListener("load", () => {
  window.scrollTo(0, 0);

  // Si la URL tiene un #algo, lo limpiamos para que el próximo click funcione
  if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname);
  }

  activarLink(inicioLink);
});

//------------------------------------------

// links y logo ----------------------------

// Función para navegar suavemente y limpiar rastro de URL

// menu.js
// menu_23.js - Función principal de navegación
// Actualiza esta parte de tu función navegarA[cite: 15]
function navegarA(idDestino, elementoLink) {
  const categorias = ["#joyeria", "#studio", "#gourmet", "#regalos"];
  let objetivoReal = idDestino;

  if (categorias.includes(idDestino)) {
    objetivoReal = "#catalogo";
  }

  const seccion = document.querySelector(objetivoReal);

  if (seccion) {
    activarLink(elementoLink);

    // Usamos offsetTop menos la altura del header (aprox 72px o 4.5rem)
    const offsetHeader = 60;
    const posicionFinal =
      idDestino === "#hero" ? 0 : seccion.offsetTop - offsetHeader;

    window.scrollTo({
      top: posicionFinal,
      behavior: "smooth",
    });

    // Actualizar URL sin recargar
    if (idDestino === "#hero") {
      history.pushState(null, null, window.location.pathname);
    } else {
      history.pushState(null, null, idDestino);
    }
  }
}

// --- EVENTO PARA EL LOGO ---

// menu_23.js - Evento para el logo
logo.addEventListener("click", (e) => {
  e.preventDefault();
  // Simplemente llamamos a nuestra función unificada
  navegarA("#hero", inicioLink);
});

// --- EVENTO PARA LOS LINKS ---

// menu_23.js - Evento para los links
// Busca este bloque en tu menu.js
// Busca este bloque en tu menu.js
// Localiza este bloque en tu archivo menu.js
// Localiza este bloque en tu archivo y reemplázalo
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");

    if (href && href.startsWith("#")) {
      e.preventDefault();
      estaNavegandoPorClick = true;

      // --- CAMBIO AQUÍ: Cierre del submenú siempre que se haga clic ---
      subMenu.classList.remove("submenu-open");
      arrow.classList.remove("arrow-rotate");

      // 1. Si el menú está abierto, lo cerramos primero
      if (navMenu.classList.contains("nav-visible")) {
        navMenu.classList.remove("nav-visible");
        overlay.classList.remove("overlay--active");
        subMenu.classList.remove("submenu-open");
        arrow.classList.remove("arrow-rotate");

        // 2. Desbloqueamos el scroll indicando que es navegación (true)
        gestionBloqueoScroll(false, true);

        // 3. PAUSA CRÍTICA: Esperamos 350ms para que el DOM se estabilice
        // tras quitar el 'position: fixed' del body.
        setTimeout(() => {
          navegarA(href, link);
        }, 350);
      } else {
        // Si el menú ya estaba cerrado (ej. en desktop), navegamos directo
        navegarA(href, link);
      }

      // Escudo para que el scroll automático no marque otros links mientras se mueve
      setTimeout(() => {
        estaNavegandoPorClick = false;
      }, 2000);
    }
  });
});
//------------------------------------------

window.addEventListener("scroll", () => {
  if (estaNavegandoPorClick || navMenu.classList.contains("nav-visible")) {
    return;
  }

  let seccionActual = "";
  const pixelesDeMargen = 150;
  const secciones = document.querySelectorAll("section[id]");

  // 1. Detección de secciones físicas (Inicio, Nosotros, Contacto, Catalogo)
  secciones.forEach((seccion) => {
    const seccionTop = seccion.offsetTop;
    if (window.pageYOffset >= seccionTop - pixelesDeMargen) {
      seccionActual = seccion.getAttribute("id");
    }
  });

  // 2. Traducción de "Catalogo" a "Categoría Específica"
  if (seccionActual === "catalogo") {
    const catalogContainer = document.getElementById("catalogo");

    // Buscamos la clase que termina en el nombre de la categoría (ej. catalog__container--joyeria)
    const claseCategoria = Array.from(catalogContainer.classList).find((cls) =>
      cls.includes("catalog__container--"),
    );

    if (claseCategoria) {
      // Extraemos "joyeria", "studio", etc.
      seccionActual = claseCategoria.split("--")[1];
    }
  }

  // 3. Gestión de Inicio
  if (window.pageYOffset < 100) {
    activarLink(inicioLink);
    return;
  }

  // 4. Activación visual del link
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    // Ahora, si seccionActual es "joyeria", coincidirá con el href="#joyeria" del submenú
    if (href === `#${seccionActual}`) {
      activarLink(link);
    }
  });
});
