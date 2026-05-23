/* ============================================================================
   1. CONFIGURACIONES Y CONSTANTES GLOBALES
   ============================================================================ */

// Número de teléfono celular con su código de país (Ecuador) para enviar los mensajes de WhatsApp
const WHATSAPP_NUM = "593994831087";

/* ============================================================================
   2. REFERENCIAS A ELEMENTOS DEL DOM (CAPTURA DE ELEMENTOS HTML)
   ============================================================================ */

// Elementos de la interfaz gráfica del carrito de compras
const cartList = document.getElementById("cart-list"); // El contenedor donde se enlistan los productos agregados
const cartTotal = document.getElementById("cart-total"); // El texto que muestra el precio total acumulado en dólares
const cartCount = document.getElementById("cart-count"); // El círculo indicador flotante con la cantidad de artículos
const sidebar = document.getElementById("sidebar"); // El panel lateral deslizable del carrito
const sidebarContent = document.getElementById("sidebarContent"); // La zona interna que envuelve el contenido del carrito
const cartOverlay = document.getElementById("overlay__cart"); // El fondo oscuro semitransparente que se activa detrás del panel
const btnCloseCart = document.getElementById("close-cart"); // El botón con forma de 'X' para cerrar el carrito lateral

// Elementos de notificaciones y alertas
const toastContainer = document.getElementById("toast-container"); // Contenedor flotante para mostrar mensajes rápidos

// Elementos del formulario de facturación y datos del cliente
const inId = document.getElementById("cust-id"); // Campo de texto para ingresar la Cédula o el RUC
const inNm = document.getElementById("cust-name"); // Campo de texto para ingresar el Nombre
const inLn = document.getElementById("cust-lastname"); // Campo de texto para ingresar el Apellido
const errorMsg = document.getElementById("form-error-msg"); // Bloque de texto oculto para alertar si faltan datos obligatorios

/* ============================================================================
   3. FUNCIONES DE UTILIDAD Y FORMATO (HERRAMIENTAS AUXILIARES)
   ============================================================================ */

// Convierte cualquier número en un formato de moneda legible (Ejemplo: 1250 -> $1,250.00)
function formatCurrency(num) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

/* ============================================================================
   4. FUNCIONES DE GESTIÓN DE ERRORES Y FORMULARIOS
   ============================================================================ */

// Restablece los textos por defecto y quita las alertas visuales rojas de los campos de texto
function resetFormErrors() {
  // Devolvemos las etiquetas guía originales a las cajas de texto
  inId.placeholder = "*Cédula(10)/RUC(13)";
  inNm.placeholder = "*Nombre";
  inLn.placeholder = "*Apellido";

  // Recorremos los tres campos para quitarles la clase CSS que los pinta de rojo
  [inId, inNm, inLn].forEach((input) => {
    input.classList.remove("error-field");
  });

  // Si el letrero de error general está visible, lo ocultamos por completo
  if (errorMsg) errorMsg.style.display = "none";
}

// Vacía por completo la información escrita en el formulario y limpia las alertas
function clearFormValues() {
  // Asignamos un texto vacío a cada campo del formulario
  [inId, inNm, inLn].forEach((input) => (input.value = ""));
  // Ejecutamos la función anterior para limpiar los bordes rojos y placeholders
  resetFormErrors();
}

/* ============================================================================
   5. FUNCIONES DE CONTROL DE INTERFAZ Y RESTRICCIONES DE NAVEGACIÓN
   ============================================================================ */

// Controla el comportamiento inteligente del scroll táctil en dispositivos móviles
const preventDefault = (e) => {
  // Revisamos si el dedo del usuario está tocando la zona con scroll de los productos
  const isInsideScrollable = e.target.closest(".sidebar__content");

  if (isInsideScrollable) {
    // Si es así, no hacemos nada y dejamos que la pantalla se desplace normalmente
    return;
  }

  // Si toca zonas fijas como el total, el botón de cierre o el fondo oscuro, bloqueamos el movimiento
  e.preventDefault();
};

// Evita que la rueda del ratón o el deslizamiento táctil muevan la página web de fondo
function prevenirScrollCart(e) {
  // Detectamos si el usuario está interactuando sobre la lista amarilla de productos
  const zonaProductos = e.target.closest(".sidebar__content");

  if (zonaProductos) {
    // Si está ahí dentro, detenemos esta función y permitimos el scroll local nativo
    return;
  }

  // Si está scrolleando sobre el fondo negro o el encabezado, congelamos el movimiento de la web
  e.preventDefault();
}

// Bloquea las teclas de dirección del teclado para que la página de fondo no se mueva
function prevenirScrollTecladoCart(e) {
  // Si el usuario tiene seleccionada o enfocada alguna opción dentro del carrito de compras, no bloqueamos nada
  if (document.activeElement.closest("#sidebar")) {
    return;
  }

  // Lista de teclas que se encargan de mover la página hacia arriba o hacia abajo
  const teclasBloqueadas = [
    "Space",
    "ArrowUp",
    "ArrowDown",
    "PageUp",
    "PageDown",
    "End",
    "Home",
  ];

  // Si presiona una de estas teclas mientras el carrito está activo, cancelamos su efecto por completo
  if (teclasBloqueadas.includes(e.code)) {
    e.preventDefault();
  }
}

// Activa o desactiva las restricciones de movimiento de la pantalla según el estado del carrito
function gestionBloqueoScrollCart(bloquear) {
  if (bloquear) {
    // Escuchamos el scroll de la rueda del ratón y el arrastre de los dedos en celulares bloqueando el scroll de fondo
    window.addEventListener("wheel", prevenirScrollCart, { passive: false });
    window.addEventListener("touchmove", prevenirScrollCart, {
      passive: false,
    });

    // Escuchamos las pulsaciones del teclado para interceptar las flechas de navegación
    window.addEventListener("keydown", prevenirScrollTecladoCart, {
      passive: false,
    });

    // Añadimos una clase identificadora al cuerpo de la página
    document.body.classList.add("cart-open");
  } else {
    // Al cerrar el carrito, removemos todos los escuchadores para que la web vuelva a la normalidad
    window.removeEventListener("wheel", prevenirScrollCart);
    window.removeEventListener("touchmove", prevenirScrollCart);
    window.removeEventListener("keydown", prevenirScrollTecladoCart);

    document.body.classList.remove("cart-open");
  }
}

// Muestra u oculta el panel lateral del carrito de compras alternando sus clases CSS
function toggleCart() {
  // Limpiamos cualquier rastro de alertas rojas en el formulario antes de operar
  if (typeof resetFormErrors === "function") {
    resetFormErrors();
  }

  // Evaluamos si el carrito se va a abrir (revisando si NO tiene la clase activa todavía)
  const isOpening = !sidebar.classList.contains("sidebar--active");
  const html = document.documentElement; // Guardamos el acceso a la etiqueta raíz <html> de la página

  // Ponemos o quitamos las clases que controlan la visibilidad del panel y del fondo oscuro
  sidebar.classList.toggle("sidebar--active");
  cartOverlay.classList.toggle("overlay--active");

  // Activamos o desactivamos el bloqueo del scroll general de la página web de fondo
  gestionBloqueoScrollCart(isOpening);

  if (isOpening) {
    // Medimos cuántos píxeles mide la barra de scroll vertical del navegador para evitar saltos de pantalla
    const scrollBarWidth = window.innerWidth - html.clientWidth;

    // Guardamos ese tamaño en una variable de CSS para compensar el espacio dinámicamente
    html.style.setProperty("--scrollbar-width", `${scrollBarWidth}px`);

    // Añadimos la clase que oculta el scroll del navegador de forma controlada
    html.classList.add("cart-open-scroll");

    // Conectamos el detector de dedos en móviles para controlar el scroll local inteligente
    window.addEventListener("touchmove", preventDefault, { passive: false });

    // Si la función que dibuja la interfaz existe, la ejecutamos para actualizar los datos
    if (typeof updateUI === "function") updateUI();
  } else {
    // Si estamos cerrando el carrito, limpiamos las clases del HTML y borramos la propiedad CSS de compensación
    html.classList.remove("cart-open-scroll");
    html.style.removeProperty("--scrollbar-width");

    // Desconectamos el detector de dedos móvil para liberar la pantalla
    window.removeEventListener("touchmove", preventDefault);
  }
}

/* ============================================================================
   6. LÓGICA DE CONTROL DE DATOS Y OPERACIONES DEL CARRITO (CORE)
   ============================================================================ */

// Modifica la cantidad elegida de un artículo específico sumando o restando unidades
function updateQty(id, delta) {
  // Buscamos dentro de la lista del carrito si el producto ya se encuentra registrado
  const item = cart.find((i) => i.id === id);

  if (item) {
    // Calculamos el valor resultante de la operación matemática
    const nuevaCantidad = item.qty + delta;

    // Controlamos que el número resultante esté siempre dentro del límite comercial permitido (1 a 99)
    if (nuevaCantidad >= 1 && nuevaCantidad <= 99) {
      item.qty = nuevaCantidad;
    } else if (nuevaCantidad <= 0) {
      // Si la cantidad llega a cero, removemos el producto por completo de la lista
      cart = cart.filter((i) => i.id !== id);
    } else if (nuevaCantidad > 99) {
      // Si el usuario intenta sobrepasar el límite de 99, cancelamos la operación
      return;
    }
  }

  // Si después de la modificación el carrito se quedó completamente vacío, cerramos la interfaz
  if (cart.length === 0) {
    clearFormValues();
    if (sidebar.classList.contains("sidebar--active")) {
      toggleCart();
    }
  }

  // Limpiamos los errores del formulario y redibujamos la interfaz con los nuevos valores numéricos
  resetFormErrors();
  updateUI();
}

// Saca de la lista un producto determinado sin importar cuántas unidades tenga añadidas
function removeFromCart(id) {
  // Filtramos la lista del carrito guardando todos los elementos MENOS el que coincide con este ID
  cart = cart.filter((i) => i.id !== id);

  // Verificamos si al sacar este elemento la lista quedó vacía para limpiar datos y cerrar el panel
  if (cart.length === 0) {
    clearFormValues();
    if (sidebar.classList.contains("sidebar--active")) {
      toggleCart();
    }
  }

  // Refrescamos los errores y actualizamos la interfaz gráfica
  resetFormErrors();
  updateUI();
}

// Introduce un nuevo artículo a la lista del carrito de compras o incrementa su cantidad
function addToCart(id, name, price) {
  // Revisamos si el producto en cuestión ya existía previamente en la lista
  const exist = cart.find((i) => i.id === id);

  // Si ya existía, aumentamos su contador en 1. Si no, creamos e insertamos el nuevo objeto
  exist ? exist.qty++ : cart.push({ id, name, price, qty: 1 });

  // Actualizamos visualmente el carrito y disparamos el efecto visual de destellos en el botón
  updateUI();
  triggerCartAnimation();
}

/* ============================================================================
   7. RENDERIZADO VISUAL Y DIBUJADO DE LA INTERFAZ DE USUARIO (UI)
   ============================================================================ */

// Se encarga de procesar la información del arreglo 'cart' y escribir el HTML dinámicamente en pantalla
function updateUI() {
  // Reseteamos el contenedor HTML de la lista para limpiarlo antes de reescribirlo
  cartList.innerHTML = "";
  let total = 0; // Acumulador para la suma total de dinero
  let count = 0; // Acumulador para el total de unidades de productos

  // Capturamos el pie de página del carrito (donde están el total y el formulario de compra)
  const cartFooter = document.querySelector(".sidebar__footer");

  // CASO A: SI EL CARRITO NO TIENE NINGÚN PRODUCTO
  if (cart.length === 0) {
    clearFormValues();
    sidebarContent.classList.add("cart-empty--margin");
    if (typeof resetFormErrors === "function") resetFormErrors();

    // Escribimos en pantalla un diseño elegante avisando que no hay productos
    cartList.innerHTML = `
  <div class="cart-empty">
    <p class="cart-empty__message">Tu carrito está vacío</p>
    <a href="#catalogo" class="cart-empty__link" id="js-close-empty">Explorar catálogo</a>
  </div>
`;

    // Apagamos la visibilidad del contador de la bolsa y del bloque del formulario inferior
    cartCount.style.display = "none";
    if (cartFooter) cartFooter.style.display = "none";

    // Guardamos la lista vacía actual en la memoria del navegador de forma segura
    localStorage.setItem("MINOE_CART", JSON.stringify(cart));
    return;
  }

  // CASO B: SI EL CARRITO TIENE ELEMENTOS REGISTRADOS
  if (cartFooter) cartFooter.style.display = "block"; // Aseguramos que el formulario inferior se muestre

  sidebarContent.classList.remove("cart-empty--margin");

  // Recorremos los productos guardados uno por uno para calcular las sumas y armar el diseño de cada fila
  cart.forEach((i) => {
    total += i.price * i.qty; // Multiplicamos el costo del artículo por las piezas llevadas
    count += i.qty; // Sumamos la cantidad al totalizador de artículos

    // Deshabilitamos los botones si el usuario llega a los extremos permitidos de cantidad
    const btnMinusDisabled = i.qty <= 1 ? "disabled" : "";
    const btnPlusDisabled = i.qty >= 99 ? "disabled" : "";

    // Agregamos el fragmento de código HTML correspondiente a este producto en la lista en pantalla
    cartList.innerHTML += `
      <div class="cart-item">
        <div class="cart-item__info">
          <p class="cart-item__name">${i.name}</p>
          <p class="cart-item__price">${formatCurrency(i.price)}</p>
        </div>
        <div class="cart-item__controls">
          <div class="qty-selector">
            <button class="qty-selector__btn js-minus" data-id="${i.id}" ${btnMinusDisabled}>−</button>
            <span class="qty-selector__value">${i.qty}</span>
            <button class="qty-selector__btn js-plus" data-id="${i.id}" ${btnPlusDisabled}>+</button>
          </div>
          <button class="cart-item__remove js-remove" data-id="${i.id}">
            <span class="cart__trash-item cart__trash-item--url"></span>
          </button>
        </div>
      </div>`;
  });

  // CONTROL VISUAL DEL CONTADOR FLOTANTE: Ubicado sobre el icono del bolso de compras en la cabecera
  if (count > 0) {
    cartCount.style.display = "flex"; // Forzamos a que aparezca en pantalla como una caja flexible

    // Si las piezas totales superan las 99, aplicamos formato reducido de texto para que no se desborde
    if (count > 99) {
      cartCount.innerText = "99+";
      cartCount.style.fontSize = "0.75em";
      cartCount.style.top = "-0.6875rem";
      cartCount.style.right = "-0.4063rem";
    } else {
      // Si está en el rango normal de unidades, inyectamos el número y centramos el círculo
      cartCount.innerText = count;
      cartCount.style.fontSize = "0.75em";
      cartCount.style.top = "-0.5625rem";
      cartCount.style.right = "-0.125rem";
    }
  } else {
    cartCount.style.display = "none"; // Protección extra en caso de que la suma llegue a cero
  }

  // Seteamos el costo total final calculado con el formato de dinero adecuado
  cartTotal.innerText = formatCurrency(total);
  // Guardamos la lista actualizada de objetos en la memoria local (LocalStorage) bajo formato de texto JSON
  localStorage.setItem("MINOE_CART", JSON.stringify(cart));
}

/* ============================================================================
   8. COMPORTAMIENTOS DINÁMICOS Y ANIMACIONES INTERACTIVAS
   ============================================================================ */

// Dispara un efecto de destellos y micro-vibración visual en el botón de la bolsa al agregar piezas
function triggerCartAnimation() {
  const wrapper = document.getElementById("open-cart");
  if (!wrapper) return; // Validación de seguridad para prevenir fallos catastróficos si no existe

  // Removemos la clase de animación si es que ya existía previamente
  wrapper.classList.remove("animate-sparkles");
  // Provocamos un redibujado forzado en el navegador (reflow) para reiniciar los hilos de la animación CSS
  void wrapper.offsetWidth;
  // Insertamos la clase CSS que activa los keyframes de la animación de destello
  wrapper.classList.add("animate-sparkles");

  // Esperamos a que finalicen los 600ms de la animación para limpiar la clase limpiamente
  setTimeout(() => {
    wrapper.classList.remove("animate-sparkles");
  }, 600);
}

/* ============================================================================
   9. INTERFAZ DE COMUNICACIÓN EXTERNA: VALIDACIÓN Y ENVÍO A WHATSAPP
   ============================================================================ */

// Valida secuencialmente los datos del cliente y arma el enlace con el formato estructurado para WhatsApp
function sendWhatsApp() {
  // Limpiamos los rastros y estilos visuales de errores previos en el formulario
  resetFormErrors();
  resetFormErrors();

  // Obtenemos los valores de los textos escritos, removiendo espacios en blanco innecesarios a los lados
  const idVal = inId.value.trim();
  const nameVal = inNm.value.trim();
  const lastVal = inLn.value.trim();

  // VALIDACIÓN DE PASOS SECUENCIALES (BLOQUEANTES)

  // Paso 1: Validar que el documento de identidad de Ecuador tenga exactamente 10 dígitos (Cédula) o 13 (RUC)
  if (idVal.length !== 10 && idVal.length !== 13) {
    inId.value = "";
    inId.placeholder = "*Cédula(10)/RUC(13)";
    inId.classList.add("error-field"); // Agrega el efecto visual de vibración física
    inId.focus(); // Mueve el foco de escritura automáticamente aquí
    return; // Corta el flujo de la función inmediatamente
  }

  // Paso 2: Validar que el nombre tenga una extensión real (mínimo 2 letras)
  if (nameVal.length < 2) {
    inNm.value = "";
    inNm.placeholder = "*Nombre";
    inNm.classList.add("error-field");
    inNm.focus();
    return;
  }

  // Paso 3: Validar que el apellido tenga una extensión real (mínimo 2 letras)
  if (lastVal.length < 2) {
    inLn.value = "";
    inLn.placeholder = "*Apellido";
    inLn.classList.add("error-field");
    inLn.focus();
    return;
  }

  // Definición de variables con Emojis en código Unicode para asegurar alta compatibilidad telefónica
  const iconSpark = "\u2728"; // ✨ (Efecto brillo luxury)
  const iconUser = "\uD83D\uDC64"; // 👤 (Usuario cliente)
  const iconId = "\u{1FAAA}"; // 🪪 (Tarjeta física)
  const iconBag = "\uD83D\uDECD"; // 🛍️ (Bolsa de compra)
  const iconMoney = "\uD83D\uDCB0"; // 💰 (Dinero/Total)
  const iconPray = "\u{1F478}\u{1F3FB}"; // 👸🏻 (Representación de la marca de alta costura)

  // Armado del cuerpo del mensaje de texto estructurado y espaciado
  let msg = "-------------------------------\n";
  msg += `${iconSpark} *NUEVO PEDIDO MINOE* ${iconSpark}\n`;
  msg += "-------------------------------\n\n";
  msg += `${iconUser} *CLIENTE:* ${nameVal.toUpperCase()} ${lastVal.toUpperCase()}\n`;
  msg += `${iconId} *ID/RUC:* ${idVal}\n\n`;
  msg += "-------------------------------\n";
  msg += `${iconBag} *DETALLE DEL PEDIDO:*\n`;
  msg += "-------------------------------\n\n";

  // Iteramos sobre los artículos del carrito para listarlos uno por uno con sus SKUs y desgloses
  cart.forEach((i) => {
    msg += `• *${i.name}*\n`;
    msg += `  ${i.id} | x${i.qty} | ${formatCurrency(i.price)} | ${formatCurrency(i.price * i.qty)}\n\n`;
  });

  msg += "\n-------------------------------\n";
  msg += `${iconMoney} *TOTAL A PAGAR: ${cartTotal.innerText}*\n`;
  msg += "-------------------------------\n\n";
  msg += `*_Gracias por su preferencia._* ${iconPray}${iconSpark}`;

  // Codificamos el string del mensaje para transformarlo en una URL segura y válida para navegadores web
  const finalMsg = encodeURIComponent(msg);

  // Abrimos una pestaña externa del navegador web apuntando a la API oficial de mensajes de WhatsApp
  window.open(
    `https://api.whatsapp.com/send?phone=${WHATSAPP_NUM}&text=${finalMsg}`,
    "_blank",
  );

  // Vaciamos el estado de memoria del carrito una vez que el pedido se ha enviado de forma exitosa
  cart = [];
  clearFormValues(); // Limpiamos las cajas del formulario de facturación
  updateUI(); // Reconfiguramos la vista a su estado vacío
  toggleCart(); // Ocultamos el panel deslizable lateral suavemente
}

// Vincula los eventos de control y filtros en tiempo real sobre los inputs de texto del cliente
function setupInputConstraints() {
  // Configuración restrictiva para el campo de Cédula/RUC
  inId.addEventListener("input", (e) => {
    // Escaneamos el texto ingresado y reemplazamos de forma inmediata todo lo que NO sea un número por vacío
    e.target.value = e.target.value.replace(/[^0-9]/g, "");

    // Si la cadena escrita supera el límite de caracteres de un RUC (13), podamos el excedente
    if (e.target.value.length > 13)
      e.target.value = e.target.value.slice(0, 13);
  });

  // Filtro restrictivo para admitir exclusivamente letras en Nombres y Apellidos
  const lettersOnly = (e) => {
    // Reemplazamos cualquier carácter extraño (números, símbolos, puntuaciones) dejando solo letras y espacios
    e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
  };

  // Enganchamos el limitador a las cajas de Nombre y Apellido respectivamente
  inNm.addEventListener("input", lettersOnly);
  inLn.addEventListener("input", lettersOnly);
}

/* ============================================================================
   10. ESCUCHADORES DE EVENTOS GLOBALES Y DELEGACIONES DE CLICS (LISTENERS)
   ============================================================================ */

// Delegación de eventos de clics sobre la lista interna del carrito para detectar sumas, restas o eliminaciones
cartList.addEventListener("click", (e) => {
  // Buscamos cuál fue el elemento más cercano que recibió el clic del usuario usando sus selectores de clase
  const btnMinus = e.target.closest(".js-minus");
  const btnPlus = e.target.closest(".js-plus");
  const btnRemove = e.target.closest(".js-remove");

  // Si hizo clic en el botón de restar unidades, extraemos su ID único y actualizamos la cantidad en -1
  if (btnMinus) {
    const id = btnMinus.dataset.id;
    updateQty(id, -1);
  }

  // Si hizo clic en el botón de sumar unidades, extraemos su ID único y actualizamos la cantidad en +1
  if (btnPlus) {
    const id = btnPlus.dataset.id;
    updateQty(id, 1);
  }

  // Si presionó el icono del tacho de basura, extraemos su ID y removemos el producto por completo
  if (btnRemove) {
    const id = btnRemove.dataset.id;
    removeFromCart(id);
  }
});

// Escuchador asignado al contenedor general de productos para interceptar las compras
productContainer.addEventListener("click", (e) => {
  // Validamos si el clic ocurrió sobre el botón circular flotante con el icono de añadir
  const btnAdd = e.target.closest(".catalog__btn-add");

  if (btnAdd) {
    e.preventDefault(); // Cancelamos comportamientos de salto o recarga por defecto
    const d = btnAdd.dataset; // Extraemos el dataset con toda la metadata del producto

    // Ejecutamos la inserción en el carrito convirtiendo el texto del costo a número flotante
    addToCart(d.id, d.name, parseFloat(d.price));

    // Si el botón no se encuentra mostrando la animación de éxito, disparamos su ciclo visual
    if (!btnAdd.classList.contains("catalog__btn-add--success")) {
      btnAdd.classList.add("catalog__btn-add--success");

      // Capturamos la caja del icono interno de ese botón específico
      const icon = btnAdd.querySelector(".catalog__btn-icon");

      // Transcurridos 1.3 segundos (1300ms) aplicamos un desvanecimiento suave por CSS al visto de éxito
      setTimeout(() => {
        if (icon) icon.classList.add("u-fade-out");
      }, 1300);

      // A los 1.5 segundos (1500ms) removemos los estados temporales devolviendo el icono original a su sitio
      setTimeout(() => {
        btnAdd.classList.remove("catalog__btn-add--success");
        if (icon) icon.classList.remove("u-fade-out");
      }, 1500);
    }
  }
});

// Escuchador global de clics para atrapar el enlace interactivo de "Explorar Catálogo" cuando la bolsa está vacía
document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "js-close-empty") {
    toggleCart(); // Cierra el panel lateral del carrito suavemente
  }
});

// Escuchador asignado para cerrar el panel si el cliente hace clic en un espacio libre de la web fuera del carrito
document.addEventListener("click", (event) => {
  // Revisamos si el panel del carrito se encuentra visible en pantalla
  const isCartActive = sidebar.classList.contains("sidebar--active");
  if (!isCartActive) return; // Si está oculto, ignoramos el clic por completo

  // Validación de seguridad para confirmar que el elemento clickeado sigue conectado al árbol del DOM
  if (!event.target.isConnected) return;

  // Evaluamos las coordenadas lógicas del clic del usuario
  const clickInsideCart = sidebar.contains(event.target); // ¿Fue adentro del panel del carrito?
  const clickOnCartBtn = document
    .getElementById("open-cart")
    .contains(event.target); // ¿Fue sobre el botón del header?
  const isActionButton =
    event.target.closest(".qty-selector__btn") ||
    event.target.closest(".cart-item__remove"); // ¿Fue sobre algún botón de control de cantidad?

  // Si el clic ocurrió afuera de todas estas zonas seguras, cerramos el panel de forma automatizada
  if (!clickInsideCart && !clickOnCartBtn && !isActionButton) {
    toggleCart();
  }
});

// Vincula los comportamientos dinámicos de limpieza sobre el formulario de facturación
[inId, inNm, inLn].forEach((input) => {
  input.addEventListener("input", () => {
    // Si el usuario empieza a escribir sobre un campo con borde rojo, se lo quitamos inmediatamente
    if (input.classList.contains("error-field")) {
      input.classList.remove("error-field");
    }

    // Comprobamos en tiempo real si todavía quedan otros campos con alertas rojas activas en la pantalla
    const hayErroresActivos =
      document.querySelectorAll(".error-field").length > 0;

    // Si ya no queda ningún campo en estado de error, apagamos el banner ruidoso de error general
    if (!hayErroresActivos) {
      errorMsg.style.display = "none";
    }
  });
});

// Escuchador asignado al botón flotante de la cabecera para desplegar el carrito de compras
document.getElementById("open-cart").addEventListener("click", (e) => {
  e.preventDefault(); // Detiene cualquier comportamiento de enlace nativo
  toggleCart(); // Llama a la función de apertura
});

// Escuchador asignado al botón con forma de 'X' dentro del carrito para ordenar su cierre
if (btnCloseCart) {
  btnCloseCart.addEventListener("click", () => {
    toggleCart();
  });
}

// Vincula el clic sobre el fondo oscuro semitransparente para cerrar el panel lateral deslizable
cartOverlay.addEventListener("click", toggleCart);

// Vincula el clic sobre el icono del tacho de basura grande para resetear y vaciar la bolsa por completo
document.getElementById("clear-cart").addEventListener("click", () => {
  cart = []; // Vaciamos el arreglo de memoria principal
  updateUI(); // Redibujamos los componentes visuales a su estado original
  toggleCart(); // Ocultamos el panel lateral suavemente
});

// Vincula el clic sobre el botón de confirmación final para procesar y despachar el pedido
document.getElementById("whatsapp-btn").addEventListener("click", sendWhatsApp);

/* ============================================================================
   11. INICIALIZACIÓN GLOBAL DE CARGA DEL NAVEGADOR
   ============================================================================ */

// Evento maestro que se ejecuta de forma automática en el instante en que toda la página web termina de cargarse
window.onload = () => {
  updateUI(); // Recupera la sesión previa guardada en caché y dibuja los contadores correspondientes
  renderProducts("joyeria"); // Ejecuta el renderizado de la categoría "joyería" por defecto al inicio
  setupInputConstraints(); // Enciende los escuchadores de validación estricta y filtros sobre los campos de texto
};
