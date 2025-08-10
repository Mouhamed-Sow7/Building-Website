// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const navList = document.querySelector(".nav-list");
if (navToggle && navList) {
  navToggle.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

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

    // Demo submit: you can replace this with a real endpoint or EmailJS/Netlify Forms
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
