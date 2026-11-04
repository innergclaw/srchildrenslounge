(() => {
  const header = document.querySelector(".site-header");
  const nav = header && header.querySelector(".nav-links");
  const toggle = header && header.querySelector(".nav-toggle");
  if (!header || !nav || !toggle) return;

  const root = document.documentElement;

  const setOpen = (open) => {
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  const updateHeight = () => {
    root.style.setProperty("--sr-header-h", `${Math.ceil(header.getBoundingClientRect().height)}px`);
  };

  // Use one row of links only when every link fits beside the brand; otherwise collapse to the menu button.
  const fit = () => {
    const wasOpen = header.classList.contains("nav-open");
    header.classList.remove("nav-collapsed", "nav-open");
    header.classList.add("nav-measuring");
    const fits = window.innerWidth >= 1024 && nav.scrollWidth <= nav.clientWidth + 1;
    header.classList.remove("nav-measuring");
    header.classList.toggle("nav-collapsed", !fits);
    setOpen(!fits && wasOpen);
    updateHeight();
  };

  toggle.addEventListener("click", () => {
    setOpen(!header.classList.contains("nav-open"));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header.classList.contains("nav-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (header.classList.contains("nav-open") && !header.contains(event.target)) setOpen(false);
  });

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(fit, 80);
  });

  fit();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  window.addEventListener("load", fit);
})();
