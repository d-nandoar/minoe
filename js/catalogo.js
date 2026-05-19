/**
 * MINOE LUXURY CATALOG 2026
 * Módulo: Carrito de Compras Completo
 * Ajustes: Corrección de validación con focus automático y catálogo expandido.
 */

// 1. BASE DE DATOS DE PRODUCTOS (10 por categoría)
// Creamos un objeto llamado 'inventory' que actúa como un almacén de datos.
// Cada "llave" (joyeria, studio, etc.) contiene un "arreglo" (lista) de objetos.

// 2. VARIABLES DE ESTADO
// 'cart' almacena los productos que el usuario elige.
// Intentamos cargar lo que hay en localStorage (memoria del navegador); si está vacío, usamos una lista vacía [].
let cart = JSON.parse(localStorage.getItem("MINOE_CART")) || [];

// 3. REFERENCIAS AL DOM
// Usamos 'document.getElementById' para "atrapar" los elementos del HTML y poder controlarlos con JS.
const productContainer = document.getElementById("product-container"); // Donde se muestran los productos

// --- LÓGICA DEL CARRITO ---
// Definimos la función que recibe 'cat' (la categoría, ej: "joyeria")

/**
 * FUNCIÓN: renderProducts (Versión con fondo dinámico en el contenedor)
 */
function renderProducts(cat) {
  const catalogContainer = document.getElementById("catalogo");
  const productContainer = document.getElementById("product-container");

  if (!catalogContainer) return;
  if (!productContainer) return;

  // 1. LIMPIEZA DE CLASES DE COLOR:
  // Eliminamos cualquier clase de categoría anterior para que no se mezclen los colores.
  // Esto quita "product-container--joyeria", "product-container--studio", etc.
  catalogContainer.className = "catalog__container";
  productContainer.className = "catalog__grid";

  // 2. AÑADIR NUEVA CLASE:
  // Agregamos la clase modificadora al contenedor padre.
  catalogContainer.classList.add(`catalog__container--${cat}`);

  // 3. RENDERIZADO NORMAL:
  productContainer.innerHTML = "";
  const titleElem = document.getElementById("category-display");

  if (titleElem) {
    // 1. Definimos las equivalencias (mapeo)
    const nombresCategorias = {
      joyeria: "Joyería",
      regalos: "Sets de regalo",
      gourmet: "Gourmet",
      studio: "Studio",
    };

    // 2. Buscamos el nombre formateado.
    // Si no existe en el objeto, usamos el valor original (por seguridad)
    const nombreFormateado = nombresCategorias[cat.toLowerCase()] || cat;

    // 3. Lo inyectamos en el título
    titleElem.innerText = `${nombreFormateado}`;
  }

  if (!inventory[cat]) return;

  inventory[cat].forEach((p) => {
    // Aquí las cards ya no necesitan el modificador individual
    productContainer.innerHTML += `
      <article class="product-card">
        <div class="product-card__img-container">
          <img src="${p.img}" class="product-card__img" alt="${p.name}">

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


      </article>`;
  });
}

// 3. EVENTOS
// Delegación para filtros del Hero

document.getElementById("category-filters")?.addEventListener("click", (e) => {
  // 1. Buscamos si el click fue en un filtro
  const link = e.target.closest("[id^='filter-']");

  if (link) {
    e.preventDefault(); // Detenemos el salto brusco

    // 2. Cambiamos los productos
    const categoria = link.id.split("-")[1];
    renderProducts(categoria);

    // 3. EFECTO DE DESPLAZAMIENTO:
    // Buscamos la sección catálogo y le decimos al navegador que viaje hasta allá
    const seccionCatalogo = document.getElementById("catalogo");
    if (seccionCatalogo) {
      seccionCatalogo.scrollIntoView({
        behavior: "smooth", // Movimiento fluido
        block: "start", // Alinea al inicio de la sección
      });
    }
  }
});

// Delegación para filtros del nav

document
  .getElementById("nav-category-filters")
  ?.addEventListener("click", (e) => {
    // 1. Buscamos si el click fue en un filtro
    const link = e.target.closest("[id^='nav__filter-']");

    if (link) {
      e.preventDefault(); // Detenemos el salto brusco

      // 2. Cambiamos los productos
      const categoria = link.id.split("-")[1];
      renderProducts(categoria);

      // 3. EFECTO DE DESPLAZAMIENTO:
      // Buscamos la sección catálogo y le decimos al navegador que viaje hasta allá
      const seccionCatalogo = document.getElementById("catalogo");
      if (seccionCatalogo) {
        seccionCatalogo.scrollIntoView({
          behavior: "smooth", // Movimiento fluido
          block: "start", // Alinea al inicio de la sección
        });
      }
    }
  });

// Inicialización
window.onload = () => {
  console.log("Página cargada. Iniciando catálogo...");
  // Esto fuerza la carga inicial
  renderProducts("studio");

  // Si tienes la función updateUI, llámala también
  if (typeof updateUI === "function") updateUI();
};
