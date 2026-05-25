/* ============================================================================
   1. VARIABLES DE ESTADO GLOBAL (MEMORIA TEMPORAL DEL NAVEGADOR)
   ============================================================================ */

// [NUEVO - BLINDADO] Intentamos leer el almacenamiento de manera segura
let cart = [];

try {
  const localData = localStorage.getItem("MINOE_CART");
  // Si existe información, intentamos procesarla
  if (localData) {
    cart = JSON.parse(localData);

    // Verificación de seguridad extra: Nos aseguramos de que realmente sea un Arreglo []
    if (!Array.isArray(cart)) {
      cart = [];
    }
  }
} catch (error) {
  // Si los datos estaban corruptos o alterados, evitamos el crash, limpiamos y reseteamos
  console.warn(
    "Minoe Cart: Se detectaron datos corruptos en el localStorage. Reseteando carrito por seguridad.",
  );
  localStorage.removeItem("MINOE_CART");
  cart = [];
}

// [SE MANTIENEN] Lista interna que guardará las direcciones (URLs) de las imágenes del producto que el usuario está mirando en el modal.
let activeImagesList = [];

// [SE MANTIENEN] Indicador numérico que guarda la posición de la imagen que se está mostrando actualmente en la galería (0 es la primera).
let currentImageIndex = 0;

/* ============================================================================
   2. REFERENCIAS A ELEMENTOS DEL DOM (CAPTURA DE ELEMENTOS DE LA PÁGINA HTML)
   ============================================================================ */

// El casillero principal de la página web donde se inyectarán dinámicamente las tarjetas de los productos.
const productContainer = document.getElementById("product-container");

// La ventana flotante (Modal) completa que contiene la visualización de la galería de imágenes secundarias.
const galleryModal = document.getElementById("product-gallery-modal");

// La "pista" o riel móvil de CSS que sostiene las imágenes lado a lado y se mueve para simular el deslizamiento (slider).
const sliderTrack = document.getElementById("gallery-slider-track");

// El contenedor donde se dibujan los pequeños círculos o botones indicadores inferiores del slider de la galería.
const sliderDotsContainer = document.getElementById("gallery-slider-dots");

/* ============================================================================
   3. FUNCIONES DE RENDERS Y DIBUJADO DE LA INTERFAZ DE PRODUCTOS
   ============================================================================ */

// Función principal que limpia el contenedor y dibuja las tarjetas de los productos según la categoría seleccionada (ej: "joyeria").
function renderProducts(cat) {
  // Buscamos los dos contenedores principales en el árbol del documento HTML.
  const catalogContainer = document.getElementById("catalogo");
  const productContainer = document.getElementById("product-container");

  // Validación de seguridad: si alguno de estos contenedores no existe en la página actual, la función se detiene para evitar errores.
  if (!catalogContainer) return;
  if (!productContainer) return;

  // 1. LIMPIEZA DE CLASES DE COLORAnteriores:
  // Quitamos cualquier clase modificadora de estilo previa para que los colores de las categorías no se mezclen visualmente.
  catalogContainer.classList.remove(
    "product-container--joyeria",
    "product-container--studio",
    "product-container--gourmet",
    "product-container--regalos",
    "catalog__container--joyeria",
    "catalog__container--studio",
    "catalog__container--gourmet",
    "catalog__container--regalos",
  );

  // 2. AÑADIR NUEVA CLASE ORIGINAL:
  // Añadimos una clase dinámica al contenedor padre usando plantillas de texto (Backticks) para cambiar el color de fondo o tema.
  catalogContainer.classList.add(`catalog__container--${cat}`);

  // 3. RENDERIZADO NORMAL Y VACIAR CONTENEDOR:
  // Borramos todo el contenido HTML que estaba dentro del contenedor de productos para dejarlo completamente en blanco.
  productContainer.innerHTML = "";

  // Capturamos el elemento del título principal de la sección de categorías en pantalla.
  const titleElem = document.getElementById("category-display");

  if (titleElem) {
    // 1. Definimos las equivalencias (mapeo) originales: asociamos la clave técnica con el nombre comercial bonito.
    const nombresCategorias = {
      joyeria: "Joyería",
      regalos: "Sets de regalo",
      gourmet: "Gourmet",
      studio: "Studio",
    };

    // 2. Buscamos el nombre comercial en nuestro diccionario. Si no existe, usa la palabra técnica por defecto.
    const nombreFormateado = nombresCategorias[cat.toLowerCase()] || cat;

    // 3. Lo inyectamos en el nodo de texto del título en la pantalla.
    titleElem.innerText = `${nombreFormateado}`;
  }

  // 4. OBTENER LOS PRODUCTOS CORRECTOS:
  // Accedemos a la base de datos externa llamada 'inventory' y extraemos la lista correspondiente a la categoría elegida.
  const products = inventory[cat] || [];

  // 5. VALIDACIÓN DE CATEGORÍA VACÍA:
  // Si la lista no contiene ningún producto, escribimos un mensaje de aviso estilizado y salimos de la función inmediatamente.
  if (products.length === 0) {
    productContainer.innerHTML = `<p class="catalog__empty">No hay productos disponibles en esta categoría en este momento.</p>`;
    return;
  }

  // 6. CREACIÓN DINÁMICA DE TARJETAS (CARDS):
  // Recorremos la lista de productos uno por uno empleando el método '.forEach' para construir e incrustar su estructura HTML.
  products.forEach((p) => {
    // Creamos una nueva etiqueta semántica <article> en la memoria del navegador.
    const card = document.createElement("article");
    // Le asignamos la clase de estilos CSS que le dará forma de tarjeta física.
    card.classList.add("product-card");

    // EVALUACIÓN DE IMAGEN PRINCIPAL: si el dato de la imagen es una lista (Array), toma la primera foto [0], si es texto directo, lo usa tal cual.
    const imagenPrincipal = Array.isArray(p.img) ? p.img[0] : p.img;

    // EVALUACIÓN PARA EL BOTÓN DE GALERÍA (+): si el producto tiene más de una imagen registrada, creamos el HTML del botón de lupa.
    const tieneMultiplesImagenes = Array.isArray(p.img) && p.img.length > 1;
    const botonGaleriaHTML = tieneMultiplesImagenes
      ? `<button class="product-card__gallery-btn" data-product-id="${p.id}" data-category="${cat}" title="Ver galería">+</button>`
      : "";

    // Tu estructura original exacta e intacta devuelta a su sitio con toda la metadata en los atributos personalizados "data-"
    card.innerHTML = `
        <div class="product-card__img-container">
          <img src="${imagenPrincipal}" class="product-card__img" alt="${p.name}">

          ${botonGaleriaHTML}

          <button class="catalog__btn-add"
              data-id="${p.id}"
              data-name="${p.name}"
              data-price="${p.price}"
              aria-label="Añadir al carrito">
            <span class="catalog__btn-icon"></span>
          </button>
        </div>
        <div class="product-card__content">
          <p class="product-card__sku u-text-xs">SKU: ${p.id}</p>
          <h4 class="product-card__name u-text-sm">${p.name}</h4>
          <p class="product-card__price u-text-xs">$${p.price}</p>
        </div>
    `;

    // Introducemos la tarjeta HTML recién creada y estructurada al final del contenedor gráfico en pantalla.
    productContainer.appendChild(card);
  });
}

/* ============================================================================
   4. LÓGICA INTERNA Y MÉTODOS MECÁNICOS DEL SLIDER MODAL DE IMÁGENES
   ============================================================================ */

// Carga la información de imágenes secundarias de un producto y despliega la ventana modal de la galería.
function openGalleryModal(productId, category) {
  // Buscamos el producto específico inspeccionando la categoría dentro de nuestra base de datos 'inventory'.
  const product = inventory[category].find((p) => p.id === productId);
  // Validación de seguridad: si no encuentra el producto o este no posee múltiples fotos, cancela la ejecución.
  if (!product || !Array.isArray(product.img)) return;

  // Llenamos las variables globales de control con las imágenes del producto y regresamos el índice a la primera posición (0).
  activeImagesList = product.img;
  currentImageIndex = 0;

  // Agregamos reglas de CSS al cuerpo y al documento general para congelar el scroll de la página de fondo.
  document.body.classList.add("no-scroll");
  document.documentElement.style.overflow = "hidden";

  // Mapeamos el arreglo de fotos transformando cada texto de URL en una caja contenedora de imagen, uniéndolas en un solo bloque de texto HTML.
  sliderTrack.innerHTML = activeImagesList
    .map(
      (src, index) => `
      <div class="gallery-slider__slide">
        <img src="${src}" alt="Vista ${index + 1} de ${product.name}" class="gallery-slider__img">
      </div>
    `,
    )
    .join("");

  // Mapeamos el arreglo de fotos para fabricar los botones redondos inferiores, guardando su posición en el atributo "data-index".
  sliderDotsContainer.innerHTML = activeImagesList
    .map(
      (_, index) => `
      <div class="gallery-slider__dot" data-index="${index}"></div>
    `,
    )
    .join("");

  // Refrescamos las posiciones visuales y los estados de activación de los componentes del slider.
  updateGallerySliderVisuals();

  // Activamos el modal agregando la clase CSS de visibilidad y modificando los atributos de accesibilidad para lectores de pantalla.
  galleryModal.classList.add("gallery-modal--active");
  galleryModal.setAttribute("aria-hidden", "false");
}

// Cierra la ventana flotante de la galería, libera los movimientos de la web y limpia los residuos de HTML de la memoria.
function closeGalleryModal() {
  // Ocultamos visualmente el modal removiendo su clase de activación y alterando su accesibilidad.
  galleryModal.classList.remove("gallery-modal--active");
  galleryModal.setAttribute("aria-hidden", "true");

  // Quitamos las clases de restriction para reactivar el scroll del ratón y el deslizamiento táctil nativo en la web de fondo.
  document.body.classList.remove("no-scroll");
  document.documentElement.style.overflow = "auto";

  // Limpiamos los códigos HTML internos inyectados para liberar memoria en el navegador.
  sliderTrack.innerHTML = "";
  sliderDotsContainer.innerHTML = "";
  activeImagesList = []; // Vaciamos por completo el listado temporal de imágenes activas
}

// Desplaza físicamente la pista de las imágenes y enciende el punto indicador que corresponda.
function updateGallerySliderVisuals() {
  // Desplazamos horizontalmente el riel contenedor usando transformaciones de CSS. Multiplicamos el índice por -100% para deslizar.
  sliderTrack.style.transform = `translateX(-${currentImageIndex * 100}%)`;

  // Capturamos todos los pequeños círculos indicadores generados dentro de la caja de dots.
  const dots = sliderDotsContainer.querySelectorAll(".gallery-slider__dot");

  // Recorremos los círculos uno a uno; si su posición coincide con el índice actual, lo pintamos como activo, si no, le quitamos el color.
  dots.forEach((dot, index) => {
    if (index === currentImageIndex) {
      dot.classList.add("gallery-slider__dot--active");
    } else {
      dot.classList.remove("gallery-slider__dot--active");
    }
  });
}

// Realiza los cálculos matemáticos para avanzar o retroceder de diapositiva de forma cíclica infinita.
function navigateGallery(direction) {
  // Calculamos cuántas imágenes totales contiene la galería actual.
  const count = activeImagesList.length;
  if (count === 0) return; // Validación de seguridad: si no hay imágenes, no opera.

  if (direction === "next") {
    // Avanzamos sumando 1 al índice. El uso del operador de residuo aritmético (%) nos permite saltar al 0 si pasamos del final.
    currentImageIndex = (currentImageIndex + 1) % count;
  } else if (direction === "prev") {
    // Retrocedemos restando 1. Sumamos el conteo total antes de aplicar el residuo para evitar que salgan números negativos.
    currentImageIndex = (currentImageIndex - 1 + count) % count;
  }

  // Redibujamos los componentes visuales del slider con la nueva posición calculada.
  updateGallerySliderVisuals();
}

/* ============================================================================
   5. ESCUCHADORES DE EVENTOS DE INTERFAZ Y CLICS DEL USUARIO (LISTENERS)
   ============================================================================ */

// Delegación de clics en el contenedor de productos para reaccionar ante el botón '+' e iniciar el modal de la galería.
document.getElementById("product-container")?.addEventListener("click", (e) => {
  // Buscamos si el clic del usuario ocurrió directamente sobre el botón de galería o uno de sus hijos internos.
  const galleryBtn = e.target.closest(".product-card__gallery-btn");

  if (galleryBtn) {
    // Extraemos la información del ID y de la categoría que dejamos sembrados en los atributos "data-".
    const productId = galleryBtn.getAttribute("data-product-id");
    const category = galleryBtn.getAttribute("data-category");

    // Desplegamos la galería modal pasando estos datos identificadores únicos.
    openGalleryModal(productId, category);
  }
});

// Detectores de eventos dedicados para reaccionar al presionar los botones físicos de flecha derecha e izquierda.
document
  .getElementById("gallery-slider-next")
  ?.addEventListener("click", () => navigateGallery("next"));

document
  .getElementById("gallery-slider-prev")
  ?.addEventListener("click", () => navigateGallery("prev"));

// Detector de eventos por delegación dentro del área de los indicadores circulares (dots).
sliderDotsContainer?.addEventListener("click", (e) => {
  // Si hizo clic en un circulito indicador, extrae su número de índice guardado y mueve el slider a esa foto.
  const dot = e.target.closest(".gallery-slider__dot");
  if (dot) {
    currentImageIndex = parseInt(dot.getAttribute("data-index"), 10);
    updateGallerySliderVisuals();
  }
});

// Detector asignado al botón de cierre en forma de 'X' integrado en la parte superior del modal.
document
  .getElementById("gallery-modal-close")
  ?.addEventListener("click", closeGalleryModal);

// Detector asignado a la zona trasera oscura (Backdrop) del modal para cerrarlo si el usuario pulsa fuera de las imágenes.
document
  .getElementById("gallery-modal-backdrop")
  ?.addEventListener("click", closeGalleryModal);

// Escuchador global conectado al teclado del usuario para interceptar la pulsación de teclas físicas táctiles de navegación.
window.addEventListener("keydown", (e) => {
  // Si la ventana modal de la galería no está activa en pantalla, ignoramos por completo cualquier botón del teclado.
  if (!galleryModal.classList.contains("gallery-modal--active")) return;

  // Mapeamos los botones de control de accesibilidad clásicos por teclado.
  if (e.key === "Escape") closeGalleryModal(); // Tecla 'Esc' cierra la ventana flotante por completo
  if (e.key === "ArrowRight") navigateGallery("next"); // Flecha derecha avanza a la siguiente foto
  if (e.key === "ArrowLeft") navigateGallery("prev"); // Flecha izquierda regresa a la foto anterior
});

/* ============================================================================
   6. DELEGACIONES E INTERCEPTACIONES DE CLICS PARA LOS BOTONES DE FILTROS
   ============================================================================ */

// NUEVO RESTABLECIDO: Delegación para los enlaces del Hero (Banner Principal)
document.getElementById("category-filters")?.addEventListener("click", (e) => {
  // 1. Buscamos mediante proximidad (.closest) si el elemento cliqueado es, o está dentro de, un enlace con ID que empiece por 'filter-'
  const link = e.target.closest("[id^='filter-']");

  if (link) {
    // 2. Frenamos el comportamiento nativo del ancla HTML para evitar un brinco instantáneo incómodo en pantalla
    e.preventDefault();

    // 3. Obtenemos el ID del enlace (ej: 'filter-joyeria') y lo picamos por la mitad usando el guion. Tomamos la posición [1] que es la categoría pura ('joyeria')
    const categoria = link.id.split("-")[1];

    // 4. Invocamos el renderizador del catálogo para sustituir las tarjetas vigentes por las de la nueva categoría elegida
    renderProducts(categoria);

    // 5. DESPLAZAMIENTO SUAVE: Buscamos la sección destino de la tienda por su ID
    const seccionCatalogo = document.getElementById("catalogo");
    if (seccionCatalogo) {
      // Ejecutamos la transición nativa para desplazar la visualización de forma fluida y milimétrica hasta la cabecera del catálogo
      seccionCatalogo.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }
});

// Delegación asignada al contenedor de botones de filtros del cuerpo de la página del catálogo.
document
  .getElementById("catalog-category-filters")
  ?.addEventListener("click", (e) => {
    // Buscamos si el clic se dio en un botón cuyo ID comience con el texto corporativo 'catalog__filter-'
    const button = e.target.closest("[id^='catalog__filter-']");
    if (button) {
      // Extraemos la palabra de la categoría cortando el texto del ID a partir del guion (ej: 'catalog__filter-studio' -> 'studio').
      const categoria = button.id.split("-")[1];
      renderProducts(categoria);

      // Buscamos la caja de anclaje de la sección del catálogo en el DOM.
      const seccionCatalogo = document.getElementById("catalogo");
      if (seccionCatalogo) {
        // Le ordenamos de forma nativa al navegador viajar de manera fluida y suave hasta el inicio de dicha sección.
        seccionCatalogo.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });

// Delegación asignada a los enlaces interactivos integrados en la barra de navegación del menú superior (nav).
document
  .getElementById("nav-category-filters")
  ?.addEventListener("click", (e) => {
    // Buscamos si el clic se realizó sobre un enlace del menú superior cuyo ID empiece con 'nav__filter-'
    const link = e.target.closest("[id^='nav__filter-']");
    if (link) {
      e.preventDefault(); // Cancelamos la acción por defecto del enlace para evitar saltos bruscos o recargas de página

      // Extraemos el nombre de la categoría del identificador ID dividiendo el texto por el guion
      const categoria = link.id.split("-")[1];
      renderProducts(categoria);

      // Desplazamos la vista de la pantalla suavemente hasta situar al usuario en la cabecera de la tienda
      const seccionCatalogo = document.getElementById("catalogo");
      if (seccionCatalogo) {
        seccionCatalogo.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });
