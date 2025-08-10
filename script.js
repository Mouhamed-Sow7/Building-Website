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
      alert("Merci ! Votre message a bien été envoyé.");
      form.reset();
    } catch (err) {
      alert("Désolé, une erreur est survenue. Veuillez réessayer.");
    } finally {
      form.querySelector('button[type="submit"]').disabled = false;
    }
  });
}

// Scrollspy for active nav link (single active; includes Contact button)
const navLinks = Array.from(document.querySelectorAll('.nav-list a[href^="#"]'));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const setActiveLink = (hash) => {
  navLinks.forEach((a) => {
    const isActive = a.getAttribute('href') === hash;
    a.classList.toggle('active', isActive);
    if (isActive) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
};

// Close mobile menu on nav click and set active immediately
navLinks.forEach((a) => {
  a.addEventListener('click', () => {
    setActiveLink(a.getAttribute('href'));
    if (navList?.classList.contains('open')) {
      navList.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  });
});

if (sections.length) {
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActiveLink('#' + visible.target.id);
  }, {
    root: null,
    rootMargin: '0px 0px -60% 0px',
    threshold: [0.2, 0.4, 0.6, 0.8]
  });
  sections.forEach((sec) => observer.observe(sec));
}
