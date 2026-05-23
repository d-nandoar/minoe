/* ============================================================================
   1. VARIABLES DE CONFIGURACIÓN Y REFERENCIAS AL DOM (CAPTURA DE ELEMENTOS)
   ============================================================================ */

// Capturamos todos los elementos o diapositivas grandes que forman parte de la lista del slider.
let items = document.querySelectorAll(".hero__item-list");

// Capturamos todas las imágenes pequeñas de vista previa (miniaturas) situadas en la parte inferior.
let thumbnails = document.querySelectorAll(".hero__item-thumbnail");

// Capturamos los bloques de texto informativos para poder aplicarles el efecto de pausa individual.
const cajasDeTexto = document.querySelectorAll(".hero__comtent-list");

// Guardamos la cantidad total de diapositivas disponibles midiendo el tamaño de la lista de items.
let countItem = items.length;

// Indicador numérico que guarda la posición de la diapositiva que se muestra actualmente (0 es la primera).
let itemActive = 0;

// Tiempo de espera en milisegundos (10000ms = 10 segundos) que dura cada diapositiva en pantalla antes de cambiar.
let tiempoLectura = 10000;

// Variable de control temporal que almacenará el temporizador del reloj automático (setInterval).
let refreshInterval;

/* ============================================================================
   2. FUNCIONES DE MOVIMIENTO, CONTROL DE TIEMPO Y ACTUALIZACIÓN VISUAL
   ============================================================================ */

// Función que calcula de manera cíclica la posición de la siguiente diapositiva hacia adelante.
function moverSiguiente() {
  // Sumamos 1 al índice actual. El uso del operador de residuo (%) hace que al pasar del último regrese automáticamente al 0.
  itemActive = (itemActive + 1) % countItem;
  // Llamamos a la función encargada de refrescar los estilos en pantalla.
  showSlider();
}

// Función que calcula de manera cíclica la posición de la diapositiva anterior hacia atrás.
function moverAnterior() {
  // Restamos 1 al índice actual. Sumamos 'countItem' antes de aplicar el residuo (%) para evitar números negativos.
  itemActive = (itemActive - 1 + countItem) % countItem;
  // Llamamos a la función encargada de refrescar los estilos en pantalla.
  showSlider();
}

// Función del motor de tiempo automático encargada de iniciar o reanudar el reloj del slider.
function iniciarAutoRun() {
  // Limpiamos cualquier temporizador previo activo para evitar que el slider se mueva a doble velocidad.
  clearInterval(refreshInterval);

  // Verificamos si el usuario tiene el cursor del ratón posicionado sobre alguna de las cajas de texto en este momento.
  // 'Array.from' convierte la lista de nodos en un arreglo común para poder usar '.some', el cual devuelve verdadero (true) si al menos un elemento cumple la condición.
  const mouseSobreTexto = Array.from(cajasDeTexto).some((caja) =>
    caja.matches(":hover"),
  );

  // Si el ratón NO está encima de los textos, encendemos el temporizador para que cambie de diapositiva cada 10 segundos.
  if (!mouseSobreTexto) {
    refreshInterval = setInterval(() => {
      moverSiguiente();
    }, tiempoLectura);
  }
}

// Función encargada de congelar el reloj automático del slider de forma inmediata.
function detenerAutoRun() {
  // Apaga por completo el intervalo de tiempo registrado en la memoria del navegador.
  clearInterval(refreshInterval);
}

// Función maestra encargada de actualizar las clases de CSS para mostrar la nueva diapositiva activa.
function showSlider() {
  // Buscamos cuál era la diapositiva grande que estaba activa e iluminada anteriormente.
  let itemActiveOld = document.querySelector(".hero__item-list--active");
  // Buscamos cuál era la miniatura pequeña que estaba marcada como activa anteriormente.
  let thumbnailActiveOld = document.querySelector(
    ".hero__item-thumbnail--active",
  );

  // Si encontramos una diapositiva activa vieja, le removemos su clase de activación para ocultarla o apagarla.
  if (itemActiveOld) itemActiveOld.classList.remove("hero__item-list--active");
  // Si encontramos una miniatura activa vieja, le quitamos su clase de resalte visual.
  if (thumbnailActiveOld)
    thumbnailActiveOld.classList.remove("hero__item-thumbnail--active");

  // Añadimos la clase de activación a la nueva diapositiva grande correspondiente al índice actual.
  items[itemActive].classList.add("hero__item-list--active");
  // Añadimos la clase de activación a la nueva miniatura pequeña correspondiente al índice actual.
  thumbnails[itemActive].classList.add("hero__item-thumbnail--active");

  // Al realizar cualquier cambio de diapositiva, intentamos reiniciar el contador de tiempo automático desde cero.
  iniciarAutoRun();
}

/* ============================================================================
   3. ESCUCHADORES DE EVENTOS (LISTENERS DE RATÓN, CLICS Y EVENTOS GLOBALES)
   ============================================================================ */

// Recorremos cada una de las cajas de texto informativas para asignarles de forma individual las pausas por hover.
cajasDeTexto.forEach((caja) => {
  // El evento 'mouseenter' se activa justo en el instante en que el cursor del ratón entra al área física de la caja de texto.
  caja.addEventListener("mouseenter", () => {
    // Detiene el avance automático inmediatamente para permitirle al usuario leer cómodamente.
    detenerAutoRun();
  });

  // El evento 'mouseleave' se activa justo en el instante en que el cursor del ratón sale por completo de la caja de texto.
  caja.addEventListener("mouseleave", () => {
    // Reanuda y enciende de nuevo el temporizador del avance automático del slider.
    iniciarAutoRun();
  });
});

// Recorremos la lista de imágenes miniatura para asignarle a cada una un detector de clics por su posición (index).
thumbnails.forEach((thumbnail, index) => {
  // Cuando el usuario hace clic sobre una miniatura pequeña específica...
  thumbnail.addEventListener("click", () => {
    // Seteamos el índice activo global con el número de posición de la miniatura presionada.
    itemActive = index;
    // Renderizamos los cambios visuales en pantalla para mover el slider a esa imagen.
    showSlider();
  });
});

// Escuchador global conectado a la ventana de navegación en espera del evento personalizado enviado por el preloader.
window.addEventListener("paginaRevelada", () => {
  // 1. Seleccionamos el contenedor principal de la estructura del hero.
  const heroContainer = document.querySelector(".hero");

  // 2. Si el contenedor existe en la página actual, le añadimos la clase CSS encargada de remover la opacidad o invisibilidad.
  if (heroContainer) {
    heroContainer.classList.add("hero-revelado");
  }

  // 3. Iniciamos el movimiento automático mediante un retraso de tiempo (setTimeout) controlado de 2 segundos (2000ms).
  // Esto le da margen a que finalicen por completo las animaciones de entrada visual de la web antes de correr el slider.
  setTimeout(() => {
    iniciarAutoRun();
  }, 2000);
});
