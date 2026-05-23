/* ============================================================================
   1. ESCUCHADORES DE EVENTOS GLOBALES (INICIO DE CARGA DE LA PÁGINA)
   ============================================================================ */

/**
 * Este es el escuchador principal del navegador. Se activa de forma automática
 * en el segundo exacto en que la página web ha terminado de descargar todo su
 * contenido (imágenes, estilos, textos y la estructura HTML completa).
 */
window.addEventListener("load", () => {
  /* ==========================================================================
     2. CONFIGURACIÓN INICIAL DE SEGURIDAD (CONGELAMIENTO DE PANTALLA)
     ========================================================================== */

  // Accedemos a la etiqueta raíz del documento (<html>) y le aplicamos un estilo oculto.
  // Esto actúa como un candado redundante para asegurar que el usuario no pueda mover la
  // rueda del ratón ni deslizar los dedos mientras la pantalla de carga sigue activa.
  document.documentElement.style.overflow = "hidden";

  /* ==========================================================================
     3. PRIMER TEMPORIZADOR (FASE DE DESVANECIMIENTO VISUAL - 2.5 SEGUNDOS)
     ========================================================================== */

  // Creamos un temporizador que esperará pacientemente 2500 milisegundos (2.5 segundos)
  // antes de ejecutar las instrucciones que lleva adentro.
  setTimeout(() => {
    // Al cumplirse el tiempo, le añadimos la clase CSS "loaded" al cuerpo (<body>) de la página.
    // Esto generalmente le avisa a las hojas de estilo que empiecen a desvanecer la pantalla oscura del preloader.
    document.body.classList.add("loaded");

    /* ========================================================================
       4. SEGUNDO TEMPORIZADOR (FASE DE LIBERACIÓN Y SEÑALIZACIÓN - 1.25 SEGUNDOS)
       ======================================================================== */

    // Inmediatamente después de iniciar el desvanecimiento, abrimos otro temporizador interno.
    // Este esperará 1250 milisegundos más (1.25 segundos) para dar tiempo a que terminen las animaciones visuales.
    setTimeout(() => {
      // 1. Quitamos la clase de bloqueo: Le removemos al cuerpo la clase "no-scroll" que lo mantenía congelado.
      document.body.classList.remove("no-scroll");

      // 2. Liberamos el scroll explícitamente: Devolvemos el valor "auto" al desbordamiento (overflow) de la etiqueta raíz <html>.
      // Con esto, el candado se rompe y el usuario ya puede navegar y hacer scroll libremente por toda la web.
      document.documentElement.style.overflow = "auto";

      // Le añadimos al cuerpo la clase definitiva "loaded-complete" para marcar que el proceso concluyó al 100%.
      document.body.classList.add("loaded-complete");

      /* ======================================================================
         5. EMISIÓN DE EVENTOS PERSONALIZADOS (ENVIAR SEÑAL AL HERO)
         ====================================================================== */

      // Creamos una señal o "evento personalizado" en la memoria de la página, bautizado como "paginaRevelada".
      // Funciona como un timbre inalámbrico que avisa que la pantalla ya es completamente visible.
      const eventoRevelado = new CustomEvent("paginaRevelada");

      // Despachamos (emitimos) el evento de forma global por toda la ventana del navegador.
      // Esto sirve para que otros archivos independientes (como el slider del Hero) escuchen este timbre
      // y sepan que ya pueden arrancar de forma segura sus propias animaciones.
      window.dispatchEvent(eventoRevelado);
    }, 1250); // Fin de la espera de la fase de liberación (1.25 segundos)
  }, 2500); // Fin de la espera inicial de la pantalla de carga (2.5 segundos)
});
