window.addEventListener("load", () => {
  // Bloqueo preventivo redundante (por si acaso)
  document.documentElement.style.overflow = "hidden";

  setTimeout(() => {
    document.body.classList.add("loaded");

    setTimeout(() => {
      // 1. Quitamos la clase de bloqueo
      document.body.classList.remove("no-scroll");

      // 2. Liberamos el scroll explícitamente
      document.documentElement.style.overflow = "auto";

      document.body.classList.add("loaded-complete");

      // ENVIAR SEÑAL AL HERO
      const eventoRevelado = new CustomEvent("paginaRevelada");
      window.dispatchEvent(eventoRevelado);
    }, 1250);
  }, 2500);
});
