/* ═══════════════════════════════════════════════════════════════
   ENTREPRISE SOW ET FRÈRES — script.js (cleaned)
   Unified script: notifications, header, nav, gallery, lightbox,
   contact form and video modal.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  // ── Notifications ─────────────────────────────────────────────
  const showNotification = (type, title, message, duration = 4000) => {
    const container = document.getElementById("notifications");
    if (!container) return;
    const n = document.createElement("div");
    n.className = `notification ${type}`;
    n.innerHTML = `
      <div class="notification-content">
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
      </div>
    `;
    container.appendChild(n);
    requestAnimationFrame(() => n.classList.add("show"));
    setTimeout(() => {
      n.classList.remove("show");
      setTimeout(() => n.remove(), 300);
    }, duration);
  };

  // ── Header scroll ─────────────────────────────────────────────
  const header = document.querySelector(".site-header");
  window.addEventListener(
    "scroll",
    () => header?.classList.toggle("scrolled", window.scrollY > 4),
    { passive: true },
  );

  // ── Mobile nav ────────────────────────────────────────────────
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");
  navToggle?.addEventListener("click", () => {
    const open = navList.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll(".nav-list a").forEach((a) => {
    a.addEventListener("click", () => {
      navList.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // ── Footer year ───────────────────────────────────────────────
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Scrollspy ─────────────────────────────────────────────────
  const navLinks = Array.from(
    document.querySelectorAll('.nav-list a[href^="#"]'),
  );
  if (navLinks.length) {
    const sections = navLinks
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);
    const setActive = (hash) =>
      navLinks.forEach((a) => {
        const isActive = a.getAttribute("href") === hash;
        a.classList.toggle("active", isActive);
        isActive
          ? a.setAttribute("aria-current", "page")
          : a.removeAttribute("aria-current");
      });
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive("#" + visible.target.id);
      },
      { rootMargin: "0px 0px -45% 0px", threshold: [0.1, 0.4, 0.7] },
    );
    sections.forEach((s) => obs.observe(s));
  }

  // ── Galerie — filtres ─────────────────────────────────────────
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      const filter = btn.dataset.filter;
      galleryItems.forEach((item) => {
        const match = filter === "all" || item.dataset.cat === filter;
        item.classList.toggle("hidden", !match);
      });
    });
  });

  // ── Lightbox ──────────────────────────────────────────────────
  const lightbox = document.getElementById("lightbox");
  const lbImg = lightbox?.querySelector("img");
  const lbCaption = lightbox?.querySelector(".lightbox-caption");
  const lbClose = lightbox?.querySelector(".lightbox-close");

  const openLightbox = (src, caption) => {
    if (!lightbox || !lbImg) return;
    lbImg.src = src;
    lbImg.alt = caption || "";
    lbCaption.textContent = caption || "";
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lightbox.focus();
  };
  const closeLightbox = () => {
    if (!lightbox || !lbImg) return;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lbImg.removeAttribute("src");
  };

  document.querySelectorAll(".gallery-item").forEach((item) => {
    const img = item.querySelector("img");
    const caption = item.querySelector("figcaption")?.textContent?.trim();
    if (!img) return;
    img.style.cursor = "pointer";
    img.addEventListener("click", () => openLightbox(img.src, caption));
  });
  lbClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // ── Formulaire contact ────────────────────────────────────────
  // ⚙️  CONFIGURATION — Remplace par ton endpoint Render/Node.js
  const BACKEND_URL = "https://portfolio-2nd-x3kv.onrender.com/send";

  const form = document.getElementById("contact-form");
  if (form) {
    const validators = {
      name: (v) =>
        v.trim().length >= 2 ||
        "Veuillez entrer votre nom (min. 2 caractères).",
      email: (v) => /.+@.+\..+/.test(v) || "Veuillez entrer un email valide.",
      subject: (v) =>
        v.trim().length >= 2 || "Veuillez sélectionner un domaine.",
      message: (v) =>
        v.trim().length >= 10 ||
        "Votre message est trop court (min. 10 caractères).",
    };

    const attachValidation = (id) => {
      const input = form.querySelector(`#${id}`);
      const error = input?.parentElement?.querySelector(".error");
      if (!input || !error) return null;
      const validate = () => {
        const result = validators[id]?.(input.value);
        error.textContent =
          result === true || result === undefined ? "" : result;
        return result === true || result === undefined;
      };
      input.addEventListener("input", validate);
      input.addEventListener("blur", validate);
      return validate;
    };

    const fieldValidators = ["name", "email", "subject", "message"]
      .map(attachValidation)
      .filter(Boolean);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const allValid = fieldValidators.every((fn) => fn());
      if (!allValid) return;

      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours...';

      const data = {
        name: form.querySelector("#name").value,
        email: form.querySelector("#email").value,
        message: `[Domaine: ${form.querySelector("#subject").value}]\n\n${form.querySelector("#message").value}`,
      };

      try {
        const res = await fetch(BACKEND_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          showNotification(
            "success",
            "Message envoyé !",
            "Nous vous répondrons dans les 24–48h.",
          );
          form.reset();
        } else throw new Error("Server error");
      } catch (err) {
        showNotification(
          "error",
          "Erreur d'envoi",
          "Veuillez nous contacter directement par téléphone.",
        );
      } finally {
        btn.disabled = false;
        btn.innerHTML =
          '<i class="fa-solid fa-paper-plane"></i> Envoyer la demande';
      }
    });
  }

  // ── Modal vidéo ───────────────────────────────────────────────
  const videoModal = document.getElementById("video-modal");
  const modalVideo = document.getElementById("modal-video");
  const videoModalClose = document.querySelector(".video-modal-close");

  const openVideoModal = (src) => {
    if (!videoModal || !modalVideo) return;
    modalVideo.src = src;
    modalVideo.load();
    modalVideo.play().catch(() => {});
    videoModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeVideoModal = () => {
    if (!videoModal || !modalVideo) return;
    modalVideo.pause();
    modalVideo.src = "";
    videoModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".video-item").forEach((item) => {
    item.addEventListener("click", () => {
      const src = item.dataset.video;
      if (src) openVideoModal(src);
    });
  });

  videoModalClose?.addEventListener("click", closeVideoModal);
  videoModal?.addEventListener("click", (e) => {
    if (e.target === videoModal) closeVideoModal();
  });

  // Global key handling for Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (lightbox && lightbox.getAttribute("aria-hidden") === "false")
        closeLightbox();
      if (videoModal && videoModal.getAttribute("aria-hidden") === "false")
        closeVideoModal();
    }
  });
})();
