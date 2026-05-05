// Constante con el número de teléfono para el mensaje de WhatsApp.
const WHATSAPP_NUMERO = "593994831087";

const contactForm = document.getElementById("whatsappForm");
const contactErrorMsg = document.getElementById("contact-error-msg");
const charCount = document.getElementById("char-count");

const inNombre = document.getElementById("nombre");
const inApellidos = document.getElementById("apellidos");
const inCiudad = document.getElementById("ciudad");
const inEmail = document.getElementById("email");
const inMotivo = document.getElementById("motivo");

const allInputs = [inNombre, inApellidos, inCiudad, inEmail, inMotivo];

// Emojis y configuración
const iconSpark = "\u2728"; // ✨
const iconUser = "\uD83D\uDC64"; // 👤
const iconMail = "\uD83D\uDCE7"; // 📧
const iconMap = "\uD83D\uDCCD"; // 📍
const iconMsg = "\uD83D\uDCAC"; // 💬

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Función para mostrar errores con texto dinámico
function showError(input, message) {
  input.classList.add("error-field");
  contactErrorMsg.innerText = message;
  contactErrorMsg.style.visibility = "visible";
}

function setupContactConstraints() {
  // --- RESTRICCIÓN: SOLO LETRAS ---
  // Se aplica a Nombre, Apellidos y Ciudad
  [inNombre, inApellidos, inCiudad].forEach((input) => {
    input.addEventListener("input", (e) => {
      // Reemplaza cualquier cosa que NO sea letra o espacio
      e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
      input.classList.remove("error-field");
    });
  });

  allInputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("error-field");
      if (input.id === "motivo") {
        charCount.innerText = `${input.value.length} / 1000`;
      }
      if (!document.querySelector(".error-field")) {
        contactErrorMsg.style.visibility = "hidden";
      }
    });
  });
  // --- DENTRO DE setupContactConstraints() ---

  // 1. Limpiar al entrar (Focus) solo si es error de formato
  inEmail.addEventListener("focus", () => {
    if (inEmail.classList.contains("error-field")) {
      // Si el valor NO es vacío (o sea, es un correo inválido), lo borramos
      if (inEmail.value.trim() !== "") {
        inEmail.value = "";
      }
      // Quitamos el estado de error visual
      inEmail.classList.remove("error-field");
      // IMPORTANTE: No ocultamos el contactErrorMsg aquí para que el usuario
      // termine de leer qué estaba mal, se ocultará al escribir.
    }
  });

  // 2. Ocultar el mensaje solo cuando el usuario empiece a escribir (Input)
  inEmail.addEventListener("input", () => {
    inEmail.classList.remove("error-field");
    if (!document.querySelector(".error-field")) {
      contactErrorMsg.style.visibility = "hidden";
    }
  });
}

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // 1. OCULTAR TODO ANTES DE VALIDAR
  // Esto evita que cualquier mensaje (nativo o tuyo) parpadee
  contactErrorMsg.style.visibility = "hidden";
  allInputs.forEach((i) => i.classList.remove("error-field"));

  let firstError = null;
  let hasError = false;

  // --- VALIDACIONES ---

  // Validar Nombre (Obligatorio)
  if (!inNombre.value.trim()) {
    showError(inNombre, "* Campo obligatorio.");
    hasError = true;
    firstError = inNombre;
  }

  // Validar Email (Obligatorio + Formato)
  if (!hasError) {
    if (!inEmail.value.trim()) {
      showError(inEmail, "* Campo obligatorio.");
      hasError = true;
      firstError = inEmail;
    } else if (!validateEmail(inEmail.value)) {
      showError(inEmail, "Correo inválido (ej. nombre@correo.com)");
      hasError = true;
      firstError = inEmail;
    }
  }

  // Validar Mensaje (Obligatorio)
  if (!hasError && !inMotivo.value.trim()) {
    showError(inMotivo, "* Campo obligatorio.");
    hasError = true;
    firstError = inMotivo;
  }

  if (hasError) {
    // Si realmente hay un error, lo mostramos nosotros
    contactErrorMsg.style.visibility = "visible";
    if (firstError) firstError.focus();
    return;
  }

  // --- PROCESO DE ENVÍO (Si todo está OK) ---

  // 2. LIMPIEZA PRE-ENVÍO
  const apellidos = inApellidos.value.trim()
    ? ` ${inApellidos.value.toUpperCase()}`
    : "";
  const ciudad = inCiudad.value.trim()
    ? inCiudad.value.toUpperCase()
    : "NO ESPECIFICADA";

  // Construcción del mensaje
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

  // 'encodeURIComponent' transforma el mensaje en un formato que el navegador entiende como dirección web.
  const finalMsgContact = encodeURIComponent(textoMensaje);
  // Abre una nueva pestaña con el chat de WhatsApp listo para enviar el mensaje.
  window.open(
    `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMERO}&text=${finalMsgContact}`,
    "_blank",
  );

  // Borramos los datos del formulario inmediatamente
  contactForm.reset();

  // Reiniciamos el contador visual de caracteres
  charCount.innerText = "0 / 1000";
});

setupContactConstraints();
