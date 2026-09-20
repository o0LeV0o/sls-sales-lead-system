const TELEGRAM_USERNAME = "";

const intro = document.querySelector(".intro");
let introFinished = false;
const finishIntro = () => {
  if (introFinished) return;
  introFinished = true;
  intro?.classList.add("hide");
  document.body.classList.remove("intro-active");
  window.setTimeout(startRevealAnimations, 180);
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
const root = document.documentElement;
const themeColor = document.querySelector('meta[name="theme-color"]');
const savedTheme = window.localStorage.getItem("sls-theme");

const applyTheme = (theme) => {
  const isLight = theme === "light";
  root.toggleAttribute("data-theme", isLight);
  if (isLight) root.setAttribute("data-theme", "light");
  themeButton?.setAttribute("aria-pressed", String(isLight));
  if (themeButton) themeButton.textContent = isLight ? "◑" : "◔";
  themeColor?.setAttribute("content", isLight ? "#f5f5f2" : "#050505");
};

applyTheme(savedTheme === "light" ? "light" : "dark");

themeButton?.addEventListener("click", () => {
  const nextTheme = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  applyTheme(nextTheme);
  window.localStorage.setItem("sls-theme", nextTheme);
});

document.querySelectorAll(".letters").forEach((heading) => {
  const text = heading.getAttribute("aria-label") || heading.textContent.trim();
  heading.textContent = "";
  [...text].forEach((character, index) => {
    const span = document.createElement("span");
    span.className = "split-char";
    span.textContent = character === " " ? "\u00a0" : character;
    span.style.transitionDelay = `${index * 35}ms`;
    heading.append(span);
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -55px" });

function startRevealAnimations() {
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

document.querySelectorAll(".glow-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--glow-x", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--glow-y", `${event.clientY - bounds.top}px`);
  });
});

const disclaimer = document.querySelector(".disclaimer");
const typewriterLines = [...document.querySelectorAll("[data-typewriter]")];
const typewriterSource = typewriterLines.map((line) => line.textContent.trim());
let disclaimerStarted = false;

typewriterLines.forEach((line, index) => {
  line.setAttribute("aria-label", typewriterSource[index]);
  line.textContent = "";
});

const typeLine = (element, text, speed) => new Promise((resolve) => {
  element.textContent = "";
  element.classList.add("typing");
  let index = 0;
  const tick = () => {
    element.textContent += text[index] || "";
    index += 1;
    if (index <= text.length) {
      window.setTimeout(tick, speed);
    } else {
      element.classList.remove("typing");
      resolve();
    }
  };
  tick();
});

const disclaimerObserver = new IntersectionObserver(async (entries) => {
  if (disclaimerStarted || !entries.some((entry) => entry.isIntersecting)) return;
  disclaimerStarted = true;
  disclaimer.classList.add("active");
  await new Promise((resolve) => window.setTimeout(resolve, 350));
  for (let index = 0; index < typewriterLines.length; index += 1) {
    await typeLine(typewriterLines[index], typewriterSource[index], index === 0 ? 17 : 32);
  }
  disclaimerObserver.disconnect();
}, { threshold: .35 });

if (disclaimer) disclaimerObserver.observe(disclaimer);

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
