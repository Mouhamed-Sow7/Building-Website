// Custom notification system
const showNotification = (type, title, message, duration = 4000) => {
  const container = document.getElementById("notifications");
  if (!container) return;

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;

  const icon = type === "success" ? "✅" : "❌";

  notification.innerHTML = `
    <span class="notification-icon">${icon}</span>
    <div class="notification-content">
      <div class="notification-title">${title}</div>
      <div class="notification-message">${message}</div>
    </div>
  `;

  container.appendChild(notification);

  // Trigger animation
  requestAnimationFrame(() => {
    notification.classList.add("show");
  });

  // Auto remove
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, duration);
};

// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const navList = document.querySelector(".nav-list");
if (navToggle && navList) {
  navToggle.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Header shadow on scroll
const siteHeader = document.querySelector(".site-header");
const onScrollHeader = () => {
  if (!siteHeader) return;
  if (window.scrollY > 4) siteHeader.classList.add("scrolled");
  else siteHeader.classList.remove("scrolled");
};
window.addEventListener("scroll", onScrollHeader, { passive: true });
onScrollHeader();

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

// Contact form validation + demo submit
const form = document.getElementById("contact-form");
if (form) {
  const validators = {
    name: (v) =>
      v.trim().length >= 2 || "Veuillez entrer votre nom (min. 2 caractères).",
    email: (v) => /.+@.+\..+/.test(v) || "Veuillez entrer un email valide.",
    subject: (v) => v.trim().length >= 3 || "Veuillez préciser le sujet.",
    message: (v) =>
      v.trim().length >= 10 ||
      "Votre message est trop court (min. 10 caractères).",
  };

  const attachFieldValidation = (field) => {
    const input = form.querySelector(`#${field}`);
    const error = input?.parentElement?.querySelector(".error");
    if (!input || !error) return;
    const validate = () => {
      const rule = validators[field];
      const result = rule(input.value);
      error.textContent = result === true ? "" : result;
      return result === true;
    };
    input.addEventListener("input", validate);
    input.addEventListener("blur", validate);
    return validate;
  };

  const fieldIds = ["name", "email", "subject", "message"];
  const fieldValidators = fieldIds.map(attachFieldValidation);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let allValid = true;
    fieldValidators.forEach((fn) => {
      if (fn && !fn()) allValid = false;
    });
    if (!allValid) return;

    const formData = Object.fromEntries(new FormData(form));

    try {
      form.querySelector('button[type="submit"]').disabled = true;
      await new Promise((res) => setTimeout(res, 800));
      showNotification(
        "success",
        "Message envoyé",
        "Votre message a bien été envoyé."
      );
      form.reset();
    } catch (err) {
      showNotification(
        "error",
        "Erreur",
        "Désolé, une erreur est survenue. Veuillez réessayer."
      );
    } finally {
      form.querySelector('button[type="submit"]').disabled = false;
    }
  });
}

// Scrollspy for active nav link (single active; includes Contact button)
const navLinks = Array.from(
  document.querySelectorAll('.nav-list a[href^="#"]')
);
const sections = navLinks
  .map((link) => ({
    link,
    section: document.querySelector(link.getAttribute("href")),
  }))
  .filter(({ section }) => Boolean(section));

const setActiveLink = (hash) => {
  navLinks.forEach((a) => {
    const isActive = a.getAttribute("href") === hash;
    a.classList.toggle("active", isActive);
    if (isActive) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
};

navLinks.forEach((a) => {
  a.addEventListener("click", (e) => {
    setActiveLink(a.getAttribute("href"));
    if (navList?.classList.contains("open")) {
      navList.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
    }
  });
});

if (sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveLink("#" + visible.target.id);
    },
    {
      root: null,
      rootMargin: "0px 0px -50% 0px",
      threshold: [0.15, 0.3, 0.6, 0.85],
    }
  );
  sections.forEach(({ section }) => observer.observe(section));
}

// Simple carousel for "Réalisations"
const projetsCarousel = document.querySelector("#projets .carousel");
if (projetsCarousel) {
  const track = projetsCarousel.querySelector(".carousel-track");
  const slides = Array.from(track.children);
  let currentIndex = 0;
  let timerId;
  const AUTOPLAY_MS = 3000; // autoplay speed (ms)

  const update = () => {
    const width = projetsCarousel.clientWidth;
    track.style.transform = `translateX(${-currentIndex * width}px)`;
  };

  const next = () => {
    currentIndex = (currentIndex + 1) % slides.length;
    update();
  };
  const prev = () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    update();
  };

  const startAuto = () => {
    stopAuto();
    if (slides.length > 1) timerId = setInterval(next, AUTOPLAY_MS);
  };
  const stopAuto = () => {
    if (timerId) clearInterval(timerId);
  };

  projetsCarousel
    .querySelector(".carousel-btn.next")
    ?.addEventListener("click", () => {
      stopAuto();
      next();
      startAuto();
    });
  projetsCarousel
    .querySelector(".carousel-btn.prev")
    ?.addEventListener("click", () => {
      stopAuto();
      prev();
      startAuto();
    });

  // Keep layout in sync with container size
  window.addEventListener("resize", update);
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => update());
    ro.observe(projetsCarousel);
  }

  // Pause when tab is hidden, resume when visible
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAuto();
    else startAuto();
  });

  // Ensure first layout after images and videos load
  const imgs = track.querySelectorAll("img");
  const videos = track.querySelectorAll("video");
  let loaded = 0;
  const totalMedia = imgs.length + videos.length;

  const onMediaLoad = () => {
    loaded += 1;
    if (loaded >= totalMedia) requestAnimationFrame(update);
  };

  imgs.forEach((img) => {
    if (img.complete) onMediaLoad();
    else img.addEventListener("load", onMediaLoad, { once: true });
  });

  videos.forEach((video) => {
    video.addEventListener("loadeddata", onMediaLoad, { once: true });
    // Set videos to autoplay in carousel
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
  });

  update();
  startAuto();
}

// Lightbox for project images and videos
(() => {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  const imgEl = lightbox.querySelector("img");
  const videoEl = lightbox.querySelector("video");
  const captionEl = lightbox.querySelector(".lightbox-caption");
  const closeBtn = lightbox.querySelector(".lightbox-close");

  const open = (src, caption, isVideo = false) => {
    // Hide both elements first
    imgEl.style.display = "none";
    videoEl.style.display = "none";
    
    if (isVideo) {
      videoEl.src = src;
      videoEl.style.display = "block";
      videoEl.play(); // Autoplay video in lightbox
    } else {
      imgEl.src = src;
      imgEl.alt = caption || "";
      imgEl.style.display = "block";
    }
    
    captionEl.textContent = caption || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lightbox.focus();
  };

  const close = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    
    // Hide both elements and clear sources
    imgEl.style.display = "none";
    videoEl.style.display = "none";
    
    // Pause video and clear sources
    if (videoEl.src) {
      videoEl.pause();
      videoEl.removeAttribute("src");
    }
    if (imgEl.src) {
      imgEl.removeAttribute("src");
    }
  };

  // Click handlers on project images and videos
  document.querySelectorAll("#projets .project-card").forEach((card) => {
    const image = card.querySelector("img");
    const video = card.querySelector("video");
    const caption = card.querySelector("figcaption")?.textContent?.trim();

    if (image) {
      image.style.cursor = "pointer";
      image.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        open(image.src, caption, false);
      });
    }

    if (video) {
      video.style.cursor = "pointer";
      video.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        open(video.src, caption, true);
      });
    }
  });

  // Close interactions
  closeBtn?.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();
