(() => {
  const header = document.querySelector(".site-header");
  const nav = header?.querySelector(".nav-links");

  if (header && nav) {
    const navItems = [
      ["Field Trips", "strength-resilience-book-now.html#field-trips"],
      ["Drop-off Services", "strength-resilience-services.html#drop-off"]
    ];
    navItems.forEach(([label, href]) => {
      if ([...nav.querySelectorAll("a")].some((link) => link.textContent.trim() === label)) return;
      const link = document.createElement("a");
      link.href = href;
      link.textContent = label;
      nav.appendChild(link);
    });

    const toggle = document.createElement("button");
    toggle.className = "nav-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "primary-navigation");
    toggle.setAttribute("aria-label", "Open menu");
    toggle.innerHTML = '<span class="nav-toggle-icon" aria-hidden="true"><span></span><span></span><span></span></span><span class="sr-only">Menu</span>';
    nav.id = "primary-navigation";
    header.insertBefore(toggle, nav);

    const closeMenu = () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    };

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
      nav.classList.toggle("is-open", !isOpen);
    });

    document.addEventListener("click", (event) => {
      if (!header.contains(event.target)) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  const mobileShopQuery = window.matchMedia("(max-width: 760px)");
  const shopDetails = document.querySelector(".nav-shop");
  const shopSummary = shopDetails?.querySelector("summary");
  const shopLinks = [...(shopDetails?.querySelectorAll(".nav-shop-menu a") || [])];

  if (shopDetails && shopSummary && shopLinks.length) {
    const shopOverlay = document.createElement("div");
    shopOverlay.className = "nav-shop-overlay";
    shopOverlay.setAttribute("aria-hidden", "true");
    shopOverlay.innerHTML = shopLinks.map((shopLink) => (
      `<a href="${shopLink.href}" target="_blank" rel="noopener noreferrer">${shopLink.textContent.trim()}</a>`
    )).join("");
    document.body.appendChild(shopOverlay);

    const closeShop = () => {
      shopDetails.removeAttribute("open");
      shopOverlay.classList.remove("is-open");
      shopOverlay.setAttribute("aria-hidden", "true");
    };

    const positionShop = () => {
      const summaryRect = shopSummary.getBoundingClientRect();
      const overlayTop = Math.min(summaryRect.bottom + 8, window.innerHeight - 76);
      shopOverlay.style.setProperty("--shop-overlay-top", `${Math.max(12, overlayTop)}px`);
    };

    shopDetails.addEventListener("toggle", () => {
      if (!mobileShopQuery.matches) {
        shopOverlay.classList.remove("is-open");
        shopOverlay.setAttribute("aria-hidden", "true");
        return;
      }

      if (shopDetails.open) {
        positionShop();
        shopOverlay.classList.add("is-open");
        shopOverlay.setAttribute("aria-hidden", "false");
      } else {
        shopOverlay.classList.remove("is-open");
        shopOverlay.setAttribute("aria-hidden", "true");
      }
    });

    document.addEventListener("click", (event) => {
      if (!shopDetails.open || !mobileShopQuery.matches) return;
      if (shopDetails.contains(event.target) || shopOverlay.contains(event.target)) return;
      closeShop();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeShop();
    });

    window.addEventListener("resize", () => {
      if (!mobileShopQuery.matches) {
        closeShop();
      } else if (shopDetails.open) {
        positionShop();
      }
    });

    window.addEventListener("scroll", () => {
      if (shopDetails.open && mobileShopQuery.matches) positionShop();
    }, { passive: true });
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealSelector = [
    "main > section",
    ".panel",
    ".quick-point",
    ".highlight-card",
    ".photo-card",
    ".story-card",
    ".visit-card",
    ".package-card",
    ".service-card",
    ".plan-card",
    ".event-card",
    ".note-band",
    ".donor-band"
  ].join(",");

  const floatSelector = [
    ".hero-photo",
    ".quick-point",
    ".highlight-card",
    ".photo-card",
    ".package-card",
    ".service-card",
    ".plan-card",
    ".event-card"
  ].join(",");

  const revealItems = [...document.querySelectorAll(revealSelector)];
  const floatItems = [...document.querySelectorAll(floatSelector)];

  if (reduceMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  document.documentElement.classList.add("sr-flow-ready");
  revealItems.forEach((item) => item.classList.add("sr-reveal"));
  floatItems.forEach((item) => item.classList.add("sr-float"));

  const revealVisibleItems = () => {
    revealItems.forEach((item) => {
      if (item.classList.contains("is-visible")) return;
      const rect = item.getBoundingClientRect();
      const nearViewport = rect.top < window.innerHeight * 0.94 && rect.bottom > window.innerHeight * -0.18;
      if (nearViewport) item.classList.add("is-visible");
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.01,
    rootMargin: "0px 0px 10% 0px"
  });

  revealItems.forEach((item) => observer.observe(item));

  let ticking = false;
  const requestRevealCheck = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      revealVisibleItems();
      ticking = false;
    });
  };

  revealVisibleItems();
  window.addEventListener("scroll", requestRevealCheck, { passive: true });
  window.addEventListener("resize", requestRevealCheck);
  window.addEventListener("load", revealVisibleItems);
  setTimeout(revealVisibleItems, 450);
})();
