const TELEGRAM_USERNAME = "";

const intro = document.querySelector(".intro");
const finishIntro = () => {
  intro?.classList.add("hide");
  document.body.classList.remove("intro-active");
};

window.setTimeout(finishIntro, 2600);
intro?.addEventListener("click", finishIntro);

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  nav?.classList.toggle("open", !open);
});

nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  menuButton?.setAttribute("aria-expanded", "false");
  nav.classList.remove("open");
}));

const themeButton = document.querySelector(".theme-toggle");
themeButton?.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light-theme");
  themeButton.setAttribute("aria-pressed", String(isLight));
  themeButton.textContent = isLight ? "◑" : "◔";
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: "0px 0px -45px" });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

document.querySelectorAll(".buy-button").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const message = `Хочу купить SLS ${button.dataset.plan}`;
    const username = TELEGRAM_USERNAME.replace(/^@/, "");
    const url = username
      ? `https://t.me/${username}?text=${encodeURIComponent(message)}`
      : `https://t.me/share/url?url=${encodeURIComponent("https://t.me/+MhD23GcUaD42MjZi")}&text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
});
