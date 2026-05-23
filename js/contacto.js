/* ============================================================================
   1. VARIABLES DE CONFIGURACIÓN Y REFERENCIAS AL DOM (CAPTURA DE ELEMENTOS)
   ============================================================================ */

// Guardamos el número de teléfono celular de destino con su código de país para el mensaje de WhatsApp.
const WHATSAPP_NUMERO = "593994831087";

// Capturamos el elemento del formulario completo usando su ID para controlar cuándo se envía.
const contactForm = document.getElementById("whatsappForm");

// Capturamos la etiqueta de texto que se encarga de mostrar visualmente las alertas de error en la pantalla.
const contactErrorMsg = document.getElementById("contact-error-msg");

// Capturamos el contenedor de texto donde se va mostrando al usuario el conteo de letras escritas.
const charCount = document.getElementById("char-count");

// Capturamos individualmente cada una de las cajas de texto (inputs y textarea) donde el usuario escribe sus datos.
const inNombre = document.getElementById("nombre");
const inApellidos = document.getElementById("apellidos");
const inCiudad = document.getElementById("ciudad");
const inEmail = document.getElementById("email");
const inMotivo = document.getElementById("motivo");

// Agrupamos todas las cajas de texto anteriores en una lista (Array) para poder recorrerlas de forma masiva.
const allInputs = [inNombre, inApellidos, inCiudad, inEmail, inMotivo];

// CONFIGURACIÓN DE EMOJIS EN FORMATO UNICODE
// Guardamos los iconos con códigos especiales para asegurar que se procesen correctamente en cualquier sistema o teléfono.
const iconSpark = "\u2728"; // ✨ (Brillo decorativo)
const iconUser = "\uD83D\uDC64"; // 👤 (Silueta para el nombre del cliente)
const iconMail = "\uD83D\uDCE7"; // 📧 (Sobre para el correo electrónico)
const iconMap = "\uD83D\uDCCD"; // 📍 (Pin de ubicación para la ciudad)
const iconMsg = "\uD83D\uDCAC"; // 💬 (Bocadillo de diálogo para el mensaje)

/* ============================================================================
   2. FUNCIONES DE VALIDACIÓN Y CONTROL VISUAL (HERRAMIENTAS AUXILIARES)
   ============================================================================ */

// Esta función evalúa mediante una "Expresión Regular" si un texto tiene la estructura correcta de un email (ej: letras@letras.com).
function validateEmail(email) {
  // Compara el texto y devuelve verdadero (true) si el formato es correcto o falso (false) si no lo es.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Esta función se activa cuando un campo falla las reglas. Pinta el borde de rojo y muestra el banner de error.
function showError(input, message) {
  input.classList.add("error-field"); // Añade una clase CSS para resaltar visualmente la caja con un borde rojo.
  contactErrorMsg.innerText = message; // Cambia el texto interno del letrero por el mensaje de error correspondiente.
  contactErrorMsg.style.visibility = "visible"; // Cambia el estilo para que el letrero pase de oculto a visible en pantalla.
}

// Esta función configura las restricciones de entrada en tiempo real y el comportamiento al escribir.
function setupContactConstraints() {
  // --- RESTRICCIÓN: SOLO LETRAS ---
  // Recorremos únicamente los campos de Nombre, Apellidos y Ciudad para limitar lo que el usuario puede teclear.
  [inNombre, inApellidos, inCiudad].forEach((input) => {
    // Escuchamos el evento 'input' que se dispara cada vez que se escribe, borra o pega texto en la caja.
    input.addEventListener("input", (e) => {
      // Usamos una expresión regular para detectar y borrar instantáneamente cualquier caracter que NO sea una letra o espacio.
      e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    });
  });

  // --- LIMPIEZA INTERACTIVA AL ESCRIBIR ---
  // Recorremos todos los inputs del formulario para gestionar la limpieza de alertas mientras el usuario edita.
  allInputs.forEach((input) => {
    input.addEventListener("input", () => {
      // Removemos la clase de borde rojo inmediatamente en cuanto el usuario presiona una tecla dentro de la caja con error.
      input.classList.remove("error-field");

      // Si el campo que se está editando es la caja grande de texto "motivo", actualizamos el contador numérico.
      if (input.id === "motivo") {
        charCount.innerText = `${input.value.length} / 1000`;
      }

      // Ocultamos el banner general de advertencia superior solo si ya no queda ninguna caja con la clase de error en la página.
      if (!document.querySelector(".error-field")) {
        contactErrorMsg.style.visibility = "hidden";
      }
    });
  });
}

/* ============================================================================
   3. ESCUCHADORES DE EVENTOS PRINCIPALES (GESTIÓN DEL ENVÍO DEL FORMULARIO)
   ============================================================================ */

// Conectamos un detector de eventos al formulario que se activará en cuanto el usuario haga clic en "Enviar" o pulse "Enter".
contactForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Detiene el comportamiento nativo del navegador para evitar que la página se recargue por completo.

  // 1. OCULTAR VISUALES ANTES DE VALIDAR
  // Reiniciamos el estado visual escondiendo el mensaje de error y quitando los bordes rojos de todos los campos.
  contactErrorMsg.style.visibility = "hidden";
  allInputs.forEach((i) => i.classList.remove("error-field"));

  // --- VALIDACIONES SECUENCIALES (PASO A PASO) ---

  // Paso 1: Validar que el campo Nombre no esté vacío (eliminando los espacios en blanco de los extremos con .trim()).
  if (!inNombre.value.trim()) {
    showError(inNombre, "*Complete la información."); // Muestra la alerta roja específica.
    inNombre.focus(); // Coloca automáticamente el cursor parpadeante dentro de este campo para invitar a escribir.
    return; // Detiene la ejecución del código por completo (evita que pase a los siguientes pasos).
  }

  // Paso 2: Validar si el campo de Correo Electrónico está completamente vacío.
  if (!inEmail.value.trim()) {
    showError(inEmail, "*Complete la información."); // Muestra la alerta de campo incompleto.
    inEmail.focus(); // Sitúa el cursor de escritura dentro de la caja del correo.
    return; // Detiene la ejecución aquí.
  }

  // Paso 3: Validar que el texto ingresado en el Email cumpla con la estructura correcta usando la función validateEmail.
  if (!validateEmail(inEmail.value)) {
    inEmail.value = "";
    showError(inEmail, "Correo electrónico no válido"); // Muestra la advertencia de formato incorrecto.
    inEmail.focus(); // Sitúa el cursor de escritura dentro de la caja del correo.
    return; // Detiene la ejecución aquí.
  }

  // Paso 4: Validar que la caja de texto grande del Mensaje/Motivo no se encuentre vacía.
  if (!inMotivo.value.trim()) {
    showError(inMotivo, "*Complete la información."); // Muestra la alerta de campo incompleto.
    inMotivo.focus(); // Coloca el cursor dentro de la caja del mensaje.
    return; // Detiene la ejecución aquí.
  }

  // --- PROCESO DE ENVÍO (Si todo está OK) ---

  // 2. LIMPIEZA PRE-ENVÍO
  // Procesamos los apellidos: si el usuario escribió algo, lo convierte a mayúsculas agregando un espacio inicial. Si no, guarda texto vacío "".
  const apellidos = inApellidos.value.trim()
    ? ` ${inApellidos.value.toUpperCase()}`
    : "";
  // Procesamos la ciudad: si contiene texto, lo pasa a mayúsculas. Si está vacío, guarda por defecto la frase "NO ESPECIFICADA".
  const ciudad = inCiudad.value.trim()
    ? inCiudad.value.toUpperCase()
    : "NO ESPECIFICADA";

  // CONSTRUCCIÓN ESTREMEDAMENTE EXACTA DEL MENSAJE DE TEXTO
  // Concatenamos y unimos las variables junto con los saltos de línea (\n) y emojis para darle formato estético al mensaje.
  const textoMensaje =
    `${iconSpark} *MINOE - NUEVA CONSULTA*\n` +
    `-------------------------------\n` +
    `${iconUser} *Cliente:* ${inNombre.value.toUpperCase()}${apellidos}\n` +
    `${iconMap} *Ciudad:* ${ciudad}\n` +
    `${iconMail} *Email:* ${inEmail.value}\n` +
    `-------------------------------\n` +
    `${iconMsg} *Mensaje:*\n\n${inMotivo.value}\n\n` +
    `-------------------------------\n` +
    `_Enviado desde el sitio web Minoe oficial_`;

  // La función 'encodeURIComponent' codifica el mensaje completo convirtiendo los espacios y saltos de línea en caracteres válidos para una URL.
  const finalMsgContact = encodeURIComponent(textoMensaje);

  // Ordenamos al navegador abrir una nueva pestaña que conecta con la API oficial de WhatsApp usando el teléfono y el texto codificado.
  window.open(
    `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMERO}&text=${finalMsgContact}`,
    "_blank",
  );

  // Vaciamos inmediatamente todas las cajas de texto del formulario en pantalla tras el envío exitoso.
  contactForm.reset();

  // Reiniciamos manualmente el indicador numérico del contador visual de caracteres a su estado inicial de inicio.
  charCount.innerText = "0/1000";
});

/* ============================================================================
   4. INICIALIZACIÓN DEL ARCHIVO
   ============================================================================ */

// Invocamos la función encargada de activar y sembrar todas las restricciones de entrada de letras y los limpiadores de errores.
setupContactConstraints();
